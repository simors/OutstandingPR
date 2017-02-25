/**
 * Created by yangyang on 2017/1/11.
 */
import React, {Component} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Keyboard,
  Platform,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Animated,
  findNodeHandle
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput'
import * as ImageUtil from '../../util/ImageUtil'
import {initInputForm, inputFormUpdate} from '../../action/inputFormActions'
import {getInputData} from '../../selector/inputFormSelector'
import ActionSheet from 'react-native-actionsheet'
import * as Toast from './Toast'

const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

const COMP_TEXT = 'COMP_TEXT'
const COMP_IMG = 'COMP_IMG'


/****************************************************************
 *
 * 数据格式：将所有组件中的数据组织为一个数组，每一个数组中数据结构如下：
 * {
 *    type: [COMP_TEXT | COMP_IMG],
 *    text: 当type为COMP_TEXT时有效，为<Text>元素中的文本内容
 *    url: 当type为COMP_IMG时有效，为<Image>元素的图片地址
 *    width: 当type为COMP_IMG时有效，表示图片的宽度
 *    height: 当type为COMP_IMG时有效，表示图片的高度
 * }
 *
 **/

class ArticleEditor extends Component {
  constructor(props) {
    super(props)
    this.state = {
      keyboardPadding: 0,
      subComp: [this.renderTextInput("", 0, true)],
      imgWidth: 200,
      imgHeight: 200,
      cursor: 0,        // 光标所在组件的索引
      start: 0,         // 光标所在文字的起始位置
      editorHeight: new Animated.Value(0),
      scrollViewHeight: 0,
      contentHeight: 0,
    }
    this.comp = [this.renderTextInput("", 0, true)]
    this.compHeight = 0
    this.keyboardHeight = 0
  }

  componentDidMount() {
    if (Platform.OS == 'ios') {
      Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    } else {
      Keyboard.addListener('keyboardDidShow', this.keyboardWillShow)
      Keyboard.addListener('keyboardDidHide', this.keyboardWillHide)
    }

    this.compHeight = PAGE_HEIGHT - this.props.wrapHeight - (Platform.OS === 'ios' ? 0 : 20)
    this.setState({editorHeight: new Animated.Value(this.compHeight)})

    let initText = []
    if (this.props.initValue) {
      initText = this.props.initValue
    } else {
      initText = [
        {
          type: COMP_TEXT,
          text: ""
        }
      ]
    }

    let formInfo = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      type: this.props.type,
      initValue: {text: initText},
      checkValid: this.validInput
    }
    this.props.initInputForm(formInfo)
  }

  componentWillReceiveProps(newProps) {
    if (this.props.data != newProps.data) {
      this.comp = []
      if (!newProps.data) {
        this.comp.push(this.renderTextInput("", 0, true))
      } else {
        newProps.data.map((comp, index) => {
          if (comp.type === COMP_TEXT) {
            this.comp.push(this.renderTextInput(comp.text, index, true))
          } else if (comp.type === COMP_IMG) {
            this.comp.push(this.renderImageInput(comp.url, comp.width, comp.height, index))
          }
        })
      }
      this.setState({subComp: this.comp})

      if (this.props.getImages) {
        this.props.getImages(this.getImageCollection(newProps.data))
      }
    }
    // console.log('componentWillReceiveProps=======', newProps.shouldUploadImgComponent)
    // console.log('componentWillReceiveProps=======', this.isUploadedImgComponent)
    if(newProps.shouldUploadImgComponent && !this.isUploadedImgComponent) {
      this.uploadImgComponent(newProps.data)
    }
    if (newProps.onInsertImage) {
      this.insertImage()
    }
  }

  componentWillUnmount() {
    if (Platform.OS == 'ios') {
      Keyboard.removeListener('keyboardWillShow', this.keyboardWillShow)
      Keyboard.removeListener('keyboardWillHide', this.keyboardWillHide)
    } else {
      Keyboard.removeListener('keyboardDidShow', this.keyboardWillShow)
      Keyboard.removeListener('keyboardDidHide', this.keyboardWillHide)
    }
  }

  keyboardWillShow = (e) => {
    let newEditorHeight = this.compHeight - e.endCoordinates.height
    Animated.timing(this.state.editorHeight, {
      toValue: newEditorHeight,
      duration: 210,
    }).start();

    this.setState({
      keyboardPadding: e.endCoordinates.height,
    })

    this.keyboardHeight = e.endCoordinates.height
  }

  keyboardWillHide = (e) => {
    Animated.timing(this.state.editorHeight, {
      toValue: this.compHeight,
      duration: 210,
    }).start();

    this.setState({
      keyboardPadding: 0,
    })
  }

  getImageCollection(data) {
    let images = []
    data.forEach((item) => {
      if (item.type === COMP_IMG) {
        images.push(item.url)
      }
    })
    return images
  }

  updateImageCollection(data, leanImgUrls) {
    let index = 0
    data.forEach((item) => {
      if (item.type === COMP_IMG) {
        item.url = leanImgUrls[index++]
      }
    })
    this.inputChange(data)
  }

  validInput(data) {
    return {isVal: true, errMsg: '验证通过'}
  }

  getAbstract(n) {
    let data = this.props.data
    let text = ""
    data.forEach((item) => {
      if (item.type === COMP_TEXT) {
        text += item.text
      }
    })
    if (text.replace(/[\u4e00-\u9fa5]/g, "**").length <= n) {
      return text;
    } else {
      let len = 0;
      let tmpStr = "";
      for (var i = 0; i < text.length; i++) {//遍历字符串
        if (/[\u4e00-\u9fa5]/.test(text[i])) {//中文 长度为两字节
          len += 2;
        } else {
          len += 1;
        }
        if (len > n) {
          break;
        } else {
          tmpStr += text[i];
        }
      }
      return tmpStr + "...";
    }
  }

  inputChange(text) {
    let abstract = this.getAbstract(100)
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text, abstract}
    }
    this.props.inputFormUpdate(inputForm)
  }

  insertImage() {
    this.ActionSheet.show()
    this.props.onInsertImageCallback()
  }

  uploadImgComponent(data) {
    let localImgs = this.getImageCollection(data)
    if(localImgs && localImgs.length) {
      let localUris = []
      let leanUris = []
      localImgs.forEach((item)=>{
        if(/^https?:\/\//i.test(item)){
          leanUris.push(item)
        }else {
          localUris.push(item)
        }
      })
      if(localUris.length) {
        ImageUtil.uploadImgs({
          uris: localUris,
          success: (leanImgUrls) => {
            this.isUploadedImgComponent = true
            leanUris = leanUris.concat(leanImgUrls)
            this.updateImageCollection(data, leanUris)
            if(this.props.uploadImgComponentCallback) {
              this.props.uploadImgComponentCallback(leanUris)
            }
          }
        })
      }else {
        if(this.props.uploadImgComponentCallback) {
          this.props.uploadImgComponentCallback(leanUris)
        }
      }
    }else {
      if(this.props.uploadImgComponentCallback) {
        this.props.uploadImgComponentCallback([])
      }
    }
  }

  deleteImageComponent(index) {
    let data = this.props.data
    let len = data.length
    if (index + 1 < len && index - 1 >= 0) {
      if (data[index+1].type === COMP_TEXT && data[index-1].type === COMP_TEXT) {
        data[index-1].text += '\n' + data[index+1].text
        data.splice(index, 2)
      } else {
        data.splice(index, 1)
      }
    } else {
      data.splice(index, 1)
    }

    this.inputChange(data)
  }

  insertImageComponent(src) {
    ImageUtil.getImageSize({
      uri: src,
      success: (imgWidth, imgHeight) => {
        this.setState({imgWidth, imgHeight}, ()=> {
          let data = this.props.data
          let imgData = {
            type: COMP_IMG,
            url: src,
            width: this.state.imgWidth,
            height: this.state.imgHeight,
          }
          let textData = {
            type: COMP_TEXT,
            text: ""
          }
          let content = data[this.state.cursor].text
          let begin = content.substring(0, this.state.start)
          let end = content.substring(this.state.start)
          data[this.state.cursor].text = begin
          textData.text = end
          data.splice(this.state.cursor + 1, 0, imgData, textData)
          this.inputChange(data)
        })
      }
    })
  }

  updateTextInput(index, content) {
    let data = this.props.data
    data[index].text = content
    this.inputChange(data)
    let len = data.length
    if (Platform.OS === 'android' && len - 1 == index) {
      this.refs.scrollView.scrollTo({y: this.state.contentHeight - this.state.scrollViewHeight})
    }
  }

  selectChange(event) {
    let start = event.nativeEvent.selection.start
    this.setState({start: start})
  }

  inputFocused(refName) {
    setTimeout(() => {
      let scrollResponder = this.refs.scrollView.getScrollResponder();
      scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
        findNodeHandle(this.refs[refName]),
        this.keyboardHeight, //additionalOffset
        true
      );
    }, 50);
  }

  renderTextInput(content, index, autoFocus = false) {
    return (
      <AutoGrowingTextInput
        style={styles.InputStyle}
        placeholder={this.props.placeholder}
        editable={this.props.editable}
        underlineColorAndroid="transparent"
        autoFocus={autoFocus}
        value={content}
        onChangeText={(text) => this.updateTextInput(index, text)}
        onFocus={() => {
          this.props.onFocus()
          this.setState({cursor: index})
          if (Platform.OS != 'ios') {
            this.inputFocused("content_" + index)
          }
        }}
        onSelectionChange={(event) => this.selectChange(event)}
      />
    )
  }

  renderImageInput(src, width, height, index) {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Image style={[styles.imgInputStyle, {width, height}]}
               source={{uri: src}}>
        </Image>
        <View style={{position: 'absolute', top: 0, right: 0}}>
          <TouchableOpacity onPress={() => this.deleteImageComponent(index)}>
            <Image style={{width: 30, height: 30, borderRadius: 15, overflow: 'hidden'}}
                   source={require('../../assets/images/delete_input.png')} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderComponents() {
    return (
      this.state.subComp.map((component, index) => {
        return (
          <View key={index}>
            <View ref={"content_" + index}>
              {component}
            </View>
          </View>
        )
      })
    )
  }



  _handleActionSheetPress(index) {
    if(0 == index) { //拍照
      ImageUtil.openPicker({
        openType: 'camera',
        success: (response) => {
          this.insertImageComponent(response.path)
          // this.uploadImg({
          //   uri: response.path
          // })
          // console.log('openPicker==response==', response.path)
          // console.log('openPicker==response==', response.size)
        },
        fail: (response) => {
          Toast.show(response.message)
        }
      })
    }else if(1 == index) { //从相册选择
      ImageUtil.openPicker({
        openType: 'gallery',
        success: (response) => {
          this.insertImageComponent(response.path)
          // this.uploadImg({
          //   uri: response.path
          // })
          // console.log('openPicker==response==', response.path)
          // console.log('openPicker==response==', response.size)
        },
        fail: (response) => {
          Toast.show(response.message)
        }
      })
    }
  }

  renderActionSheet() {
    return (
      <ActionSheet
        ref={(o) => this.ActionSheet = o}
        title=""
        options={['拍照', '从相册选择', '取消']}
        cancelButtonIndex={2}
        onPress={this._handleActionSheetPress.bind(this)}
      />
    )
  }

  render() {
    if (Platform.OS === 'ios') {
      return (
        <View style={{width: PAGE_WIDTH, height: this.compHeight}}>
          <KeyboardAwareScrollView
            ref="scrollView"
            style={{flex: 1}}
            keyboardDismissMode="on-drag"
            automaticallyAdjustContentInsets={false}
            keyboardShouldPersistTaps={"always"}
            extraHeight={this.props.wrapHeight + 50}
          >
            {this.renderComponents()}
          </KeyboardAwareScrollView>
          {this.renderActionSheet()}
        </View>
      )
    } else {
      return (
        <View style={{width: PAGE_WIDTH, height: this.compHeight}}>
          <Animated.View style={{height: this.state.editorHeight}}>
            <ScrollView
              ref="scrollView"
              style={{flex: 1}}
              automaticallyAdjustContentInsets={false}
              keyboardShouldPersistTaps={"always"}
              onContentSizeChange={ (contentWidth, contentHeight) => {
                this.setState({contentHeight: contentHeight })
              }}
              onLayout={ (e) => {
                const height = e.nativeEvent.layout.height
                this.setState({scrollViewHeight: height })
              }}
            >
              {this.renderComponents()}
            </ScrollView>
          </Animated.View>
          {this.renderActionSheet()}
        </View>
      )
    }
  }
}

ArticleEditor.defaultProps = {
  editable: true,
  placeholder: '输入文字...',
  wrapHeight: 0,
}

const mapStateToProps = (state, ownProps) => {
  let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  return {
    data: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  initInputForm,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ArticleEditor)

const styles = StyleSheet.create({
  container: {
    width: PAGE_WIDTH,
    height: PAGE_HEIGHT,
  },
  InputStyle: {
    width: PAGE_WIDTH,
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#E6E6E6',
    textAlign: "left",
    textAlignVertical: "top"
  },
  editToolView: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 25,
    overflow: 'hidden'
  },
  imgInputStyle: {
    maxWidth: PAGE_WIDTH,
    marginTop: 10,
    marginBottom: 10,
  },
  toolBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eeeeee',
    overflow: 'hidden'
  }
})