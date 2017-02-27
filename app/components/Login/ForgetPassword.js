/**
 * Created by wanpeng on 2017/2/14.
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
import SmsAuthCodeInput from '../common/Input/SmsAuthCodeInput'
import PasswordInput from '../common/Input/PasswordInput'
import CommonButton from '../common/CommonButton'
import {normalizeH, normalizeW} from '../../util/Responsive'
import {submitInputData, submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import THEME from '../../constants/theme'
import {isInputValid} from '../../selector/inputFormSelector'
import {inputFormOnDestroy} from '../../action/inputFormActions'
import * as Toast from '../common/Toast'


const PAGE_WIDTH=Dimensions.get('window').width

let forgetPwdForm = Symbol('forgetPwdForm')

const phoneInput = {
  formKey: forgetPwdForm,
  stateKey: Symbol('phoneInput'),
  type: "phoneInput"
}

const smsAuthCodeInput = {
  formKey: forgetPwdForm,
  stateKey: Symbol('smsAuthCodeInput'),
  type: "smsAuthCodeInput",
}

const passwordInput = {
  formKey: forgetPwdForm,
  stateKey: Symbol('passwordInput'),
  type: "passwordInput"
}

class ForgetPassword extends Component {
  constructor(props) {
    super(props)
  }

  componentWillUnmount() {
    this.props.inputFormOnDestroy({formKey: forgetPwdForm})
  }

  onButtonPress = () => {
    this.props.submitFormData({
      formKey: forgetPwdForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.MODIFY_PASSWORD,
      success:() => {
        Actions.LOGIN()
      },
      error: (error) => {Toast.show(error.message)}
    })
  }

  smsCode = () => {
    this.props.submitInputData({
      formKey: forgetPwdForm,
      stateKey:phoneInput.stateKey,
      submitType: INPUT_FORM_SUBMIT_TYPE.RESET_PWD_SMS_CODE,
      success:() => {},
      error: (error) => {
        Toast.show(error.message)
      }
    })
  }

  render() {
    return (
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="忘记密码"
        />
        <View style={styles.body}>
          <View style={styles.hint}>
            <Text style={styles.hintText}>填写注册时的手机号并验证</Text>
          </View>
          <View style={styles.phone}>
            <PhoneInput {...phoneInput}/>
          </View>
          <View style={styles.smsAuthCode}>
            <SmsAuthCodeInput {...smsAuthCodeInput}
                              getSmsAuCode={this.smsCode}
                              reset={this.props.phoneValid}
            />
          </View>
          <View style={styles.password}>
            <PasswordInput {...passwordInput}
                           placeholder="新密码(6-16位数字或字母)"/>
          </View>

          <View style={styles.next}>
            <CommonButton
              title="下一步"
              onPress={() => this.onButtonPress()}
            />
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let isValid = isInputValid(state, forgetPwdForm, phoneInput.stateKey)
  if (!isValid.isValid) {
    newProps.phoneValid = false
  } else {
    newProps.phoneValid = true
  }
  return newProps}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitInputData,
  submitFormData,
  inputFormOnDestroy,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword)

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
  hint: {
    marginTop: normalizeH(27),
    paddingLeft: normalizeW(17),
  },
  hintText: {
    fontSize: 18,
    color: THEME.colors.yellow,
  },
  phone: {
    marginTop: normalizeH(26),
    width: PAGE_WIDTH,
  },
  smsAuthCode: {
    marginTop: normalizeH(25)
  },
  password: {
    marginTop: normalizeH(25),
    width: PAGE_WIDTH,
  },
  next: {
    marginTop: normalizeH(45)
  },
})