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
import PasswordInput from '../common/Input/PasswordInput'
import CommonButton from '../common/CommonButton'
import {normalizeH} from '../../util/Responsive'

const PAGE_WIDTH=Dimensions.get('window').width

let resetPwdForm = Symbol('resetPwdForm')

const passwordInput = {
  formKey: resetPwdForm,
  stateKey: Symbol('passwordInput'),
  type: "passwordInput"
}

class ResetPassword extends Component {
  constructor(props) {
    super(props)
  }

  onButtonPress = () => {

  }

  render() {
    return (
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="找回密码"
        />
        <View style={styles.body}>
          <View style={styles.password}>
            <PasswordInput {...passwordInput}/>
          </View>
          <View style={styles.start}>
            <CommonButton
              title="开始使用"
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

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)

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
  password: {
    marginTop: normalizeH(20),
    width: PAGE_WIDTH,
  },
  start: {
    marginTop: normalizeH(45)
  },
})