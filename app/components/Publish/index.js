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
import CommonButton from '../common/CommonButton'
import {normalizeH, normalizeW} from '../../util/Responsive'
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

class Publish extends Component {
  constructor(props) {
    super(props)
  }

  onButtonPress = () => {

  }

  render() {
    return (
      <View style={styles.container} >
        <View style={styles.body}>
          <View style={styles.logo}>
            <Image source={require('../../assets/images/logo&slogan.png')}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Publish)

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

})