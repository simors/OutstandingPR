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
import SmsAuthCodeInput from '../common/Input/SmsAuthCodeInput'
import {normalizeH} from '../../util/Responsive'
import THEME from '../../constants/theme'
import {submitInputData, submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../action/authActions'
import * as Toast from '../common/Toast'
import {isInputValid} from '../selector/inputFormSelector'




const PAGE_WIDTH=Dimensions.get('window').width

let registForm = Symbol('registForm')

const phoneInput = {
  formKey: registForm,
  stateKey: Symbol('phoneInput'),
  type: "phoneInput"
}

const smsAuthCodeInput = {
  formKey: registForm,
  stateKey: Symbol('smsAuthCodeInput'),
  type: "smsAuthCodeInput",

}

const passwordInput = {
  formKey: registForm,
  stateKey: Symbol('passwordInput'),
  type: "passwordInput"
}

class Regist extends Component {
  constructor(props) {
    super(props)
  }

  onButtonPress = () => {
    this.props.submitFormData({
      formKey: registForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.REGISTER,
      success:this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  submitSuccessCallback() {
    Toast.show('注册成功, 请登录')
    Actions.LOGIN()
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  smsCode = () => {
    this.props.submitInputData({
      formKey: registForm,
      stateKey: phoneInput.stateKey,
      submitType: INPUT_FORM_SUBMIT_TYPE.GET_SMS_CODE,
      success: () => {},
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
          title="注 册"
        />
        <View style={styles.body}>
          <View style={styles.logo}>
            <Image source={require('../../assets/images/logo.png')}/>
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
            <PasswordInput {...passwordInput}/>
          </View>
          <View style={styles.loginIn}>
            <CommonButton
              title="注 册"
              onPress={this.onButtonPress}
            />
          </View>
          <View style={styles.agreementView}>
            <Image
              style={{marginRight: 6}}
              source={require('../../assets/images/select.png')}
            />
            <Text style={styles.agreement} onPress={() => {}}>服务条款及协议</Text>
          </View>
        </View>

      </View>
    )
  }

}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let isValid = isInputValid(state, registForm, phoneInput.stateKey)
  if (!isValid.isValid) {
    newProps.phoneValid = false
  } else {
    newProps.phoneValid = true
  }
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitInputData,
  submitFormData
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Regist)

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
  smsAuthCode: {
    marginTop: normalizeH(25)
  },
  password: {
    marginTop: normalizeH(25)
  },
  loginIn: {
    marginTop: normalizeH(45)
  },
  agreementView: {
    flexDirection: 'row',
    marginTop: normalizeH(17),
    alignSelf: 'center',
    alignItems: 'flex-end'

  },
  agreement: {
    fontSize: 15,
    color: THEME.colors.yellow,
  }
})