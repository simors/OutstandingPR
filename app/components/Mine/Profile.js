/**
 * Created by wanpeng on 2017/2/16.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {normalizeH, normalizeW} from '../../util/Responsive'
import {activeUserInfo} from '../../selector/authSelector'


class Profile extends Component {
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
          title="个人信息"
          rightType="image"
          rightContainerStyle={{paddingRight: 15}}
          rightImageSource={require('../../assets/images/edite.png')}
          rightPress={() => Actions.EDIT_PROFILE()}
        />
        <View style={styles.body}>
          <View style={{alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(170,170,170,0.2)',}}>
            <Image
              style={styles.avatar}
              source={this.props.userInfo.avatar? {uri: this.props.userInfo.avatar} : require('../../assets/images/defualt_user.png')}
            />
            <Text style={styles.name}>{this.props.userInfo.nickname? this.props.userInfo.nickname: '非凡的昵称'}</Text>
          </View>
          <View style={styles.item}>
            <View style={styles.subItem}>
              <Text style={styles.itemText}>所在城市</Text>
              <Text style={[styles.itemText, {marginLeft: normalizeW(20)}]}>{this.props.userInfo.city}</Text>
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.subItem}>
              <Text style={styles.itemText}>出身年月</Text>
              <Text style={[styles.itemText, {marginLeft: normalizeW(20)}]}>{this.props.userInfo.birthday}</Text>
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.subItem}>
              <Text style={styles.itemText}>任职机构</Text>
              <Text style={[styles.itemText, {marginLeft: normalizeW(20)}]}>{this.props.userInfo.organization}</Text>
            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.subItem}>
              <Text style={styles.itemText}>职       位</Text>
              <Text style={[styles.itemText, {marginLeft: normalizeW(20)}]}>{this.props.userInfo.profession}</Text>

            </View>
          </View>
          <View style={styles.item}>
            <View style={styles.subItem}>
              <Text style={styles.itemText}>所在行业</Text>
              <Text style={[styles.itemText, {marginLeft: normalizeW(20)}]}>{this.props.userInfo.industry}</Text>
            </View>
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
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

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
  subItem: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: normalizeW(20)
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop: normalizeH(20),
    marginBottom: normalizeH(15),
  },
  name: {
    fontSize: 17,
    color: '#5A5A5A',
    marginBottom: normalizeH(24)
  }

})
