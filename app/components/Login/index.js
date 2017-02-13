/**
 * Created by wanpeng on 2017/2/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import PhoneInput from '../common/Input/PhoneInput'
import {normalizeH, normalizeW} from '../../util/Responsive'

let loginForm = Symbol('loginForm')

const phoneInpt = {
  formKey: loginForm,
  stateKey: Symbol('phoneInput'),
  type: "phoneInput"
}

class Login extends Component {
  constructor(props) {
    super(props)
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
            <PhoneInput {...phoneInpt}/>
          </View>
          <View style={styles.password}>

          </View>
          <View style={styles.loginIn}>

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

export default connect(mapStateToProps, mapDispatchToProps)(Login)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
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
  },
  phone: {
    marginTop: normalizeH(40),
  },
  password: {
    marginTop: normalizeH(25)
  },
  loginIn: {
    marginTop: normalizeH(45)
  }
})