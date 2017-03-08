/**
 * Created by wanpeng on 2017/3/8.
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
import AV from 'leancloud-storage'
import Icon from 'react-native-vector-icons/Ionicons'
import {Geolocation} from '../common/BaiduMap'




const PAGE_WIDTH=Dimensions.get('window').width

let forgetPwdForm = Symbol('forgetPwdForm')


class SelectCity extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.getCity()
  }

  componentWillUnmount() {
  }

  getCity() {
    AV.GeoPoint.current().then((geoPoint) =>{
      Geolocation.reverseGeoCode(geoPoint.latitude, geoPoint.longitude).then(function (position) {
        console.log("position", position)
      })
    })
  }

  render() {
    return (
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-close"
          leftPress={() => Actions.pop()}
          title="国内"
        />
        <View style={styles.body}>
          <View style={{marginTop: normalizeH(15)}}>
            <Text style={{fontSize: normalizeH(17)}}>定位城市</Text>
            <View style={{marginTop: normalizeH(15), justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: '#FFFFFF', width: normalizeW(100), height: normalizeH(50)}}>
              <Icon
                name={'ios-locate'}
                style={{fontSize: 24, color: '#FF9D4E'}}/>
              <Text>长沙</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SelectCity)

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
    backgroundColor: '#F5F5F5',
    paddingLeft: normalizeW(15)
  },

})