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
  TouchableOpacity,
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
          <View style={styles.services}>
            <TouchableOpacity style={styles.item} onPress={() => Actions.PR_SERVICE()}>
              <Image
                source={require('../../assets/images/add_service.png')}
              />
              <Text style={styles.serviceText}>提供公关服务</Text>
            </TouchableOpacity >
            <TouchableOpacity style={styles.item}>
              <Image
                source={require('../../assets/images/add_need.png')}
              />
              <Text style={styles.serviceText}>发布公关需求</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.close} onPress={() => Actions.pop()}>
            <Image
              source={require('../../assets/images/add_close.png')}
            />
          </TouchableOpacity>
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
        marginTop: normalizeH(20),
      },
      android: {
        marginTop: normalizeH(0)
      }
    }),
  },
  logo: {
    marginTop: normalizeH(98),
    alignSelf: 'center',
    marginBottom: normalizeH(91),
  },
  services: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: 'rgba(170,170,170,0.2)',
    borderBottomColor: 'rgba(250,250,250,1)',
    width: PAGE_WIDTH,
    height: normalizeH(192),
  },
  serviceText: {
    marginTop: normalizeH(15),
    marginBottom: normalizeH(66),
    fontSize: 17,
    color: '#5A5A5A'
  },
  item: {
    flex: 1,
    alignItems: 'center',
    paddingTop: normalizeH(34)
  },
  close: {
    alignSelf: 'center',
    marginTop: normalizeH(12),
  }


})