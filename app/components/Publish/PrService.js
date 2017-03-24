/**
 * Created by wanpeng on 2017/2/15.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import * as Toast from '../common/Toast'
import CommonTextInput from '../common/CommonTextInput'
import {normalizeH, normalizeW} from '../../util/Responsive'
import {publishFormData, PUBLISH_FORM_SUBMIT_TYPE} from '../../action/publishAction'
import THEME from '../../constants/theme'
import ArticleEditor from '../common/ArticleEditor'
import {isUserLogined, activeUserInfo} from '../../selector/authSelector'
import {inputFormOnDestroy} from '../../action/inputFormActions'
import dismissKeyboard from 'react-native-dismiss-keyboard'



const PAGE_WIDTH=Dimensions.get('window').width

let serviceForm = Symbol('serviceForm')
const serviceName = {
  formKey: serviceForm,
  stateKey: Symbol('serviceName'),
  type: "serviceName",
}
const servicePrice = {
  formKey: serviceForm,
  stateKey: Symbol('servicePrice'),
  type: "servicePrice"
}
const serviceContent = {
  formKey: serviceForm,
  stateKey: Symbol('serviceContent'),
  type: "serviceContent"
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

class PrService extends Component {
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
    this.props.inputFormOnDestroy({formKey: serviceForm})
  }

  submitSuccessCallback =() => {
    this.isPublishing = false
    Toast.show('发布成功')
    Actions.pop(2)
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
      formKey: serviceForm,
      submitType: PUBLISH_FORM_SUBMIT_TYPE.PUBLISH_SERVICE,
      userId: this.props.userInfo.id,
      images: this.leanImgUrls,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
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

  getRichTextImages(images) {
    this.insertImages = images
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
        {...serviceContent}
        wrapHeight={this.state.extraHeight}
        renderCustomToolbar={() => {return this.renderArticleEditorToolbar()}}
        getImages={(images) => this.getRichTextImages(images)}
        shouldUploadImgComponent={this.state.shouldUploadImgComponent}
        uploadImgComponentCallback={(leanImgUrls)=> {
          this.uploadImgComponentCallback(leanImgUrls)
        }}
        onFocusEditor={() => {this.setState({headerHeight: 0})}}
        onBlurEditor={() => {this.setState({headerHeight: wrapHeight})}}
        placeholder="扩展人脉，从这里开始…………"
      />
    )
  }

  render() {
    return(
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => {dismissKeyboard(); Actions.pop()}}
          title="发布公关服务"
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
                               {...serviceName}
                               containerStyle={styles.titleContainerStyle}
                               inputStyle={styles.titleInputStyle}
                               placeholder="输入标题"
                               clearBtnStyle={{top: normalizeH(10)}}/>
            </View>
            <View style={styles.price}>
              <Text style={{fontSize: 17, color: '#AAAAAA', paddingLeft: normalizeW(20)}}>价格</Text>
              <Text style={{marginLeft: normalizeW(38), fontSize: 20, color: THEME.colors.yellow}}>¥</Text>
              <CommonTextInput maxLength={7}
                               {...servicePrice}
                               containerStyle={styles.priceContainerStyle}
                               inputStyle={styles.priceInputStyle}
                               placeholder="10000"
                               keyboardType='numeric'/>
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
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  publishFormData,
  inputFormOnDestroy
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PrService)

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
    fontFamily: 'PingFangSC-Semibold',
    borderWidth: 0,
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    borderStyle: 'solid',
  },
  priceContainerStyle: {
    flex: 1,
    height: normalizeH(42),
    paddingLeft: 0,
    paddingRight: 0,
  },
  priceInputStyle: {
    flex: 1,
    fontSize: 20,
    paddingLeft: normalizeW(5),
    backgroundColor: '#FFFFFF',
    color: THEME.colors.yellow,
    fontFamily: 'PingFangSC-Semibold',
    borderWidth: 0,
  },

})