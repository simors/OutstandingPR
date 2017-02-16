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
import CommonButton from '../common/CommonButton'
import {normalizeH, normalizeW} from '../../util/Responsive'
import THEME from '../../constants/theme'

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

class ResetPhone extends Component {
  constructor(props) {
    super(props)
  }

  onButtonPress = () => {
    Actions.RESETPWD()
  }

  render() {
    return (
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="修改手机号码"
        />
        <View style={styles.body}>
          <View style={styles.hint}>
            <Text style={styles.hintText}>填写新的手机号码</Text>
          </View>
          <View style={styles.phone}>
            <PhoneInput {...phoneInput}/>
          </View>
          <View style={styles.smsAuthCode}>
            <SmsAuthCodeInput {...smsAuthCodeInput}/>
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
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ResetPhone)

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
  next: {
    marginTop: normalizeH(45)
  },
})