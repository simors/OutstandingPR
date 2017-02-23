/**
 * Created by wanpeng on 2017/2/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import PhoneInput from '../common/Input/PhoneInput'
import PasswordInput from '../common/Input/PasswordInput'
import CommonButton from '../common/CommonButton'
import * as Toast from '../common/Toast'
import {normalizeH, normalizeW} from '../../util/Responsive'
import {submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import THEME from '../../constants/theme'

const PAGE_WIDTH=Dimensions.get('window').width

let loginForm = Symbol('loginForm')

const phoneInput = {
  formKey: loginForm,
  stateKey: Symbol('phoneInput'),
  type: "phoneInput"
}

const passwordInput = {
  formKey: loginForm,
  stateKey: Symbol('passwordInput'),
  type: "passwordInput"
}

class Login extends Component {
  constructor(props) {
    super(props)
  }
  submitSuccessCallback(userInfos) {
    Toast.show('登录成功!')
    Actions.HOME()
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }
  onButtonPress = () => {
    this.props.submitFormData({
      formKey: loginForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.LOGIN_WITH_PWD,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback,
    })
  }

  render() {
    return (
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="登 录"
          rightType="text"
          rightText="快速注册"
          rightPress={() => Actions.REGIST()}
        />
        <View style={styles.body}>
          <View style={styles.logo}>
            <Image source={require('../../assets/images/logo.png')}/>
          </View>
          <View style={styles.phone}>
            <PhoneInput {...phoneInput}/>
          </View>
          <View style={styles.password}>
            <PasswordInput {...passwordInput}/>
          </View>
          <View style={styles.loginIn}>
            <CommonButton
              title="登 录"
              onPress={() => this.onButtonPress()}
            />
          </View>
          <Text style={styles.forgetPwd} onPress={() => Actions.FORGETPWD()}>忘记密码？</Text>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Login)

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
  logo: {
    marginTop: normalizeH(45),
    alignSelf: 'center',
  },
  phone: {
    marginTop: normalizeH(40),
    width: PAGE_WIDTH,
  },
  password: {
    marginTop: normalizeH(25)
  },
  loginIn: {
    marginTop: normalizeH(45)
  },
  forgetPwd: {
    marginTop: normalizeH(17),
    fontSize: 15,
    color: THEME.colors.yellow,
    alignSelf: 'center',
  }
})