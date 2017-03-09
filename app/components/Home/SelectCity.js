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
  InteractionManager,
  TouchableOpacity,
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import {normalizeH, normalizeW} from '../../util/Responsive'
import {submitInputData, submitFormData, INPUT_FORM_SUBMIT_TYPE, switchUserCity} from '../../action/authActions'
import {activeUserId} from '../../selector/authSelector'
import AV from 'leancloud-storage'
import Icon from 'react-native-vector-icons/Ionicons'
import {Geolocation} from '../common/BaiduMap'
import * as Toast from '../common/Toast'

const PAGE_WIDTH=Dimensions.get('window').width


class SelectCity extends Component {
  constructor(props) {
    super(props)
    this.state = {
      city: '长沙',
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.getLocatedCity()
    })
  }

  componentWillUnmount() {
  }

  getLocatedCity() {
    return AV.GeoPoint.current().then((geoPoint) =>{
      if(geoPoint) {
        return Geolocation.reverseGeoCode(geoPoint.latitude, geoPoint.longitude).then((position) => {
          if(position){
            this.setState({
              city: position.city,
            })
          }
        }, function (error) {
          err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
          throw err
        })
      }
    })
  }

  submitSuccessCallback() {
    Toast.show('切换城市!')
    Actions.pop()
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  onSwitchCity(city) {
    this.props.switchUserCity({
      userId: this.props.currentUser,
      city: city,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback,
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
            <Text style={{fontSize: 15}}>定位城市</Text>
            <TouchableOpacity style={styles.locatedCity} onPress={() => {this.onSwitchCity(this.state.city)}}>
              <Icon
                name={'ios-locate'}
                style={{fontSize: 24, color: '#FF9D4E'}}/>
              <Text style={{fontSize: 15, marginLeft: normalizeW(15)}}>{this.state.city}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUser = activeUserId(state)

  return {
    currentUser: currentUser,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  switchUserCity,
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
  locatedCity: {
    borderRadius: 3,
    marginTop: normalizeH(5),
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: normalizeW(120),
    height: normalizeH(40)
  }

})