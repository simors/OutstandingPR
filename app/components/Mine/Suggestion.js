/**
 * Created by wanpeng on 2017/2/16.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import CommonTextInput from '../common/CommonTextInput'
import Header from '../common/Header'
import ArticleEditor from '../common/ArticleEditor'
import {normalizeH, normalizeW} from '../../util/Responsive'
import Symbol from 'es6-symbol'
import {inputFormOnDestroy} from '../../action/inputFormActions'
import {publishFormData, PUBLISH_FORM_SUBMIT_TYPE} from '../../action/publishAction'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import * as Toast from '../common/Toast'



const PAGE_WIDTH=Dimensions.get('window').width


let suggestionForm = Symbol('suggestionForm')

const suggestionType = {
  formKey: suggestionForm,
  stateKey: Symbol('suggestionType'),
  type: "suggestionType",
}

const contactInput = {
  formKey: suggestionForm,
  stateKey: Symbol('contactInput'),
  type: "contactInput",
}

const suggestionContent = {
  formKey: suggestionForm,
  stateKey: Symbol('suggestionContent'),
  type: "suggestionContent",
}

const rteHeight = {
  ...Platform.select({
    ios: {
      height: normalizeH(64),
    },
    android: {
      height: normalizeH(44)
    }
  })
}

const wrapHeight = normalizeH(87)

class Suggestion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shouldUploadImgComponent: false,
      onInsertImage: false,
      extraHeight: rteHeight.height,
      headerHeight: wrapHeight,
    }
    this.isPublishing = false
    this.insertImages = []
    this.leanImgUrls = []
  }

  componentWillUnmount() {
    this.props.inputFormOnDestroy({formKey: suggestionForm})
  }

  submitSuccessCallback =() => {
    this.isPublishing = false
    Toast.show('反馈成功')
    Actions.pop()
  }

  submitErrorCallback =(error) => {
    Toast.show(error.message)
  }

  uploadImgComponentCallback(leanImgUrls) {
    this.leanImgUrls = leanImgUrls
    this.onPublish()
  }

  onPublish() {
    this.props.publishFormData({
      formKey: suggestionForm,
      submitType: PUBLISH_FORM_SUBMIT_TYPE.PUBLISH_SUGGESTION,
      userId: this.props.userInfo.id,
      images: this.leanImgUrls,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  getRichTextImages(images) {
    this.insertImages = images
  }

  onButtonPress() {
    if(this.props.isLogin) {
      if (this.insertImages && this.insertImages.length) {
        if (this.isPublishing) {
          return
        }
        this.isPublishing = true
        Toast.show('开始发布...', {
          duration: 1000,
          onHidden: ()=> {
            this.setState({
              shouldUploadImgComponent: true
            })
          }
        })
      } else {
        if (this.isPublishing) {
          return
        }
        this.isPublishing = true
        Toast.show('开始发布...', {
          duration: 1000,
          onHidden: ()=> {
            this.onPublish()
          }
        })
      }
    } else {
      Actions.LOGIN()
    }
  }

  renderArticleEditorToolbar() {
    return (
      <View style={this.isPublishing?{width: normalizeW(64), backgroundColor: '#AAAAAA'} : {width: normalizeW(64), backgroundColor: THEME.colors.yellow}}>
        <TouchableOpacity onPress={() => {this.onButtonPress()}}
                          style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 15, color: 'white', lineHeight: 15}}>发布</Text>
        </TouchableOpacity>
      </View>
    )
  }

  renderRichText() {
    return (
      <ArticleEditor
        {...suggestionContent}
        wrapHeight={this.state.extraHeight}
        renderCustomToolbar={() => {return this.renderArticleEditorToolbar()}}
        getImages={(images) => this.getRichTextImages(images)}
        shouldUploadImgComponent={this.state.shouldUploadImgComponent}
        uploadImgComponentCallback={(leanImgUrls)=> {
          this.uploadImgComponentCallback(leanImgUrls)
        }}
        onFocusEditor={() => {this.setState({headerHeight: 0})}}
        onBlurEditor={() => {this.setState({headerHeight: wrapHeight})}}
        placeholder="请详细描述使用中遇到的问题，并附上问题截图。诚挚邀请您加入用户体验俱乐部QQ群:312458688"
      />
    )
  }

  render() {
    return (
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="意见反馈"
          rightType="text"
          rightText="发送"
          rightButtonDisabled= {this.isPublishing}
          rightPress={() => this.onButtonPress()}
          rightStyle= {this.isPublishing? {color: '#AAAAAA'}: {}}
        />
        <View style={styles.body}>
          <View style={{height: this.state.headerHeight, overflow: 'hidden'}}
                onLayout={(event) => {this.setState({extraHeight: rteHeight.height + event.nativeEvent.layout.height})}}>
            <View style={{borderBottomWidth: 1, borderBottomColor: '#E9E9E9', borderStyle: 'solid'}}>
              <CommonTextInput maxLength={36}
                               {...suggestionType}
                               containerStyle={styles.titleContainerStyle}
                               inputStyle={styles.titleInputStyle}
                               placeholder="问题类型"
                               clearBtnStyle={{top: normalizeH(10)}}/>
            </View>
            <View style={styles.itemView}>
              <Text style={styles.itemText}>联系方式</Text>
              <CommonTextInput {...contactInput}
                               maxLength={30}
                               containerStyle={styles.inputContainerStyle}
                               inputStyle={styles.inputStyle}
                               placeholder="手机号或邮箱（选填）"/>
            </View>
          </View>
          {this.renderRichText()}
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isLogin = isUserLogined(state)
  const userInfo = activeUserInfo(state)
  return {
    isLogin: isLogin,
    userInfo: userInfo
  }}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  publishFormData,
  inputFormOnDestroy,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Suggestion)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
  },
  avatar: {
    marginTop: normalizeH(20),
    marginBottom: normalizeH(15),
  },
  name: {
    fontSize: 17,
    color: '#5A5A5A',
    marginBottom: normalizeH(24)
  },
  titleContainerStyle: {
    flex: 1,
    height: normalizeH(42),
    paddingLeft: 0,
    paddingRight: 0,
  },
  titleInputStyle: {
    flex: 1,
    fontSize: 17,
    paddingLeft: normalizeW(20),
    backgroundColor: '#FFFFFF',
    color: '#5A5A5A',
    borderWidth: 0,
  },
  item: {
    flexDirection: 'row',
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(170,170,170,0.2)',
    width: PAGE_WIDTH,
    height: normalizeH(60),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  itemView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: normalizeW(20),
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    borderStyle: 'solid',
  },
  itemText: {
    fontSize: 17,
    color: '#AAAAAA',
    width:normalizeW(87),
  },
  inputContainerStyle: {
    flex: 1,
    height: normalizeH(42),
    paddingLeft: 0,
    paddingRight: 0,

  },
  inputStyle: {
    flex: 1,
    fontSize: 17,
    paddingLeft: 0,
    backgroundColor: '#FFFFFF',
    color: '#5A5A5A',
    borderWidth: 0,
  }

})
