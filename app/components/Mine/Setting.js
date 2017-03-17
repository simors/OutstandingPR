/**
 * Created by wanpeng on 2017/2/15.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Platform,
  TouchableOpacity
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import CommonButton from '../common/CommonButton'
import {normalizeW, normalizeH} from '../../util/Responsive'
import {persistor} from '../../store/persistStore'
import * as Toast from '../../components/common/Toast'
import {activeUserInfo} from '../../selector/authSelector'
import Popup from '@zzzkk2009/react-native-popup'
import RNRestart from 'react-native-restart'
import {userLogOut} from '../../action/authActions'





class Setting extends Component {
  constructor(props) {
    super(props)
  }

  clearApplication() {
    Popup.confirm({
      title: '提示',
      content: '确认清除缓存？',
      ok: {
        text: '确定',
        style: {color: THEME.colors.yellow},
        callback: ()=>{
          Actions.pop()
          persistor.purge()
          Toast.show('清除成功，应用重启！')
          setTimeout(() => {
            RNRestart.Restart()
          }, 1000)
        }
      },
      cancel: {
        text: '取消',
        callback: ()=>{
          // console.log('cancel')
        }
      }
    })
  }

  clearUserInfo() {
    Popup.confirm({
      title: '提示',
      content: '确认退出登录吗？',
      ok: {
        text: '确定',
        style: {color: THEME.colors.yellow},
        callback: ()=>{
          this.props.userLogOut({
            success: () => {
              Toast.show('登出成功')
              Actions.HOME({type: 'reset'})
            }
          })
        }
      },
      cancel: {
        text: '取消',
        callback: ()=>{
          // console.log('cancel')
        }
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="系统设置"
        />
        <View style={styles.body}>
          <TouchableOpacity style={styles.item} onPress={() => Actions.RESET_PHONE()}>
            <View style={{flex: 1, marginLeft: normalizeW(20)}}>
              <Text style={styles.itemText}>手机号码</Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end',marginRight: normalizeW(12)}}>
              <Text style={styles.itemText}>{this.props.userInfo.phone}</Text>
            </View>
            <Image
              style={{marginRight: normalizeW(20)}}
              source={require('../../assets/images/PinLeft_gray.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={{flex: 1, marginLeft: normalizeW(20)}}>
              <Text style={styles.itemText}>用户指南</Text>
            </View>
            <Image
              style={{marginRight: normalizeW(20)}}
              source={require('../../assets/images/PinLeft_gray.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={{flex: 1, marginLeft: normalizeW(20)}}>
              <Text style={styles.itemText}>版本更新</Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end',marginRight: normalizeW(12)}}>
              <Text style={styles.itemText}>V1.0_214</Text>
            </View>
            <Image
              style={{marginRight: normalizeW(20)}}
              source={require('../../assets/images/PinLeft_gray.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={{flex: 1, marginLeft: normalizeW(20)}}>
              <Text style={styles.itemText}>关于非凡公关</Text>
            </View>
            <Image
              style={{marginRight: normalizeW(20)}}
              source={require('../../assets/images/PinLeft_gray.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => this.clearApplication()}>
            <View style={{flex: 1, marginLeft: normalizeW(20)}}>
              <Text style={styles.itemText}>清除缓存</Text>
            </View>
            <View style={{flex: 1, alignItems: 'flex-end',marginRight: normalizeW(20)}}>
              <Text style={styles.itemText}>36M</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.exit}>
            <CommonButton
              title="退出登录"
              onPress={() => this.clearUserInfo()}
            />
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let userInfo = activeUserInfo(state)

  return {
    userInfo: userInfo,
  }
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
  userLogOut,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Setting)

const styles = StyleSheet.create({
  container: {
    flex: 1
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
  item: {
    flexDirection: 'row',
    marginLeft: normalizeW(10),
    marginRight: normalizeW(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(170,170,170,0.2)',
    height: normalizeH(68),
    alignItems: 'center',

  },
  itemText: {
    fontSize: 17,
    color: '#5A5A5A',
  },
  exit: {
    marginTop: normalizeH(40),

  }

})