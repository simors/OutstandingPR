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
import {submitInputData, submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import {activeUserId} from '../../selector/authSelector'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Toast from '../common/Toast'
import {getCurrentLocation} from '../../action/locAction'
import {getCity} from '../../selector/locSelector'

const PAGE_WIDTH=Dimensions.get('window').width


class SelectCity extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.getCurrentLocation()
    })
  }

  onSwitchCity(city) {

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
            <TouchableOpacity style={styles.locatedCity} onPress={() => {this.onSwitchCity()}}>
              <Icon
                name={'ios-locate'}
                style={{fontSize: 24, color: '#FF9D4E'}}/>
              <Text style={{fontSize: 15, marginLeft: normalizeW(15)}}>{this.props.locatedCity}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUser = activeUserId(state)
  let locatedCity = getCity(state)
  return {
    currentUser: currentUser,
    locatedCity: locatedCity,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getCurrentLocation
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
    height: normalizeH(40),
    paddingLeft: normalizeW(5)
  }

})