/**
 * Created by wanpeng on 2017/2/28.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Platform,
  ScrollView,
  InteractionManager,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {normalizeH, normalizeW} from '../../util/Responsive'
import Icon from 'react-native-vector-icons/Ionicons'
import THEME from '../../constants/theme'
import * as authSelector from '../../selector/authSelector'
import {getUserInfoById, followUser, unFollowUser}from '../../action/authActions'
import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'

const PAGE_WIDTH=Dimensions.get('window').width


class PersonalHomePage extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      if(this.props.isLogin) {
        this.props.getUserInfoById({userId: this.props.userId})
      }else {
        Actions.LOGIN()
      }
    })
  }

  renderPublish() {
    return(
      <TouchableOpacity style={{paddingLeft: normalizeW(20), borderBottomWidth: 1, borderBottomColor: '#F5F5F5'}}>
        <Text style={{marginTop: normalizeH(10), fontSize: 17, color: '#5A5A5A'}}>企业如何制定校园营销策略</Text>
        <View style={{marginTop: normalizeH(10),flexDirection: 'row', marginBottom: normalizeH(15)}}>
          <Text style={{flex: 1, fontSize: 15, color: THEME.colors.yellow}}>¥ 500元</Text>
          <Text style={{fontSize: 12, color: '#AAAAAA', marginRight: normalizeW(20)}}>999+刷新</Text>
          <Text style={{fontSize: 12, color: '#AAAAAA', marginRight: normalizeW(20)}}>999+围观</Text>
        </View>
      </TouchableOpacity>
    )
  }

  enterChatroom() {
    let members = []
    members.push(this.props.userId)
    members.push(this.props.currentUser)
    if (!this.props.isLogin) {
      Actions.LOGIN()
    } else  {
      let payload = {
        name: this.props.userInfo.nickname,
        members: members,
        conversationType: PERSONAL_CONVERSATION,
        title: this.props.userInfo.nickname,
      }
      Actions.CHATROOM(payload)
    }
  }

  onFollow() {
    if(this.props.isFollow) {
      this.props.unFollowUser({
        userId: this.props.userId,
      })
    } else {
      this.props.followUser({
        userId: this.props.userId,
      })
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.body}>
          <View style={styles.header}>
            <TouchableOpacity style={{ width: normalizeW(50), height: normalizeH(50), alignItems: 'center', paddingRight: normalizeW(13)}} onPress={() => Actions.pop()}>
              <Icon
                name="ios-arrow-back"
                style={{marginTop: normalizeH(10), marginLeft: 0, fontSize: 32, color: '#FFFFFF'}}/>
            </TouchableOpacity>

          </View>
          <View style={{position: 'absolute', top: normalizeH(45), right: normalizeW(33), zIndex: 100}}>
            <Image
              style={{width: 60, height: 60, borderRadius: 30, overflow: 'hidden', borderWidth: 2, borderColor: '#FFFFFF'}}
              source={this.props.userInfo.avatar? {uri: this.props.userInfo.avatar}: require('../../assets/images/defualt_user.png')}
            />
          </View>
          <ScrollView>
          <View style={styles.info}>
            <Text style={{fontSize: 17, marginTop: normalizeH(20)}}>{this.props.userInfo.nickname}</Text>
            <Text style={{fontSize: 12, marginTop: normalizeH(10), color: '#AAAAAA'}}>三小时前来过非凡</Text>
            <View style={{flex: 1, flexDirection: 'row', marginBottom: normalizeH(10), alignItems: 'flex-end'}}>
              <View style={{alignItems: 'center', marginRight: normalizeW(40)}}>
                <Text style={{fontSize: 17}}>5</Text>
                <Text style={styles.tripText}>发布</Text>
              </View>
              <View style={{alignItems: 'center', marginRight: normalizeW(40)}}>
                <Text style={{fontSize: 17}}>5</Text>
                <Text style={styles.tripText}>关注</Text>
              </View>
              <View style={{alignItems: 'center', marginRight: normalizeW(40)}}>
                <Text style={{fontSize: 17}}>5</Text>
                <Text style={styles.tripText}>粉丝</Text>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <TouchableOpacity style={{marginRight: normalizeW(40)}} onPress={() =>{this.onFollow()}}>
                  <Image
                    source={this.props.isFollow?require('../../assets/images/followed.png'): require('../../assets/images/add_follow.png')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.publush}>
            <View style={styles.itemHeader}>
              <View style={{width: normalizeW(5), height: normalizeH(15), backgroundColor: THEME.colors.yellow, marginLeft: normalizeW(15)}}/>
              <Text style={{fontSize: 17, color: '#5A5A5A', marginLeft: normalizeW(10)}}>发布 (5)</Text>
            </View>
            {this.renderPublish()}
            {this.renderPublish()}
            <TouchableOpacity style={styles.showAll}>
              <Text style={{fontSize: 15, color: '#AAAAAA'}}>查看全部发布（5）</Text>
            </TouchableOpacity>

          </View>
          </ScrollView>
        </View>
        <View style={styles.action}>
          <TouchableOpacity style={{marginLeft: normalizeW(30), alignItems: 'center', paddingLeft: normalizeW(10), paddingRight: normalizeW(10)}}>
            <Image
              source={require('../../assets/images/report.png')}
            />
            <Text>举报</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contacted} onPress={() => {this.enterChatroom()}}>
            <Image
              source={require('../../assets/images/contacted.png')}
            />
            <Text style={{marginLeft: normalizeW(9), fontSize: 15, color: '#FFFFFF'}}>私信</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUser = authSelector.activeUserId(state)
  const isLogin = authSelector.isUserLogined(state)
  const userInfo = authSelector.userInfoById(state, ownProps.userId)

  let isFollow = authSelector.isUserFollowed(state, ownProps.userId)
  return {
    currentUser: currentUser,
    isLogin: isLogin,
    isFollow: isFollow,
    userInfo: userInfo,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getUserInfoById,
  followUser,
  unFollowUser,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PersonalHomePage)

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
    backgroundColor: '#F5F5F5',
  },
  header: {
    width: PAGE_WIDTH,
    backgroundColor: 'rgba(245,106,35,1)',
    height: normalizeH(90),
  },
  info: {
    width: PAGE_WIDTH,
    backgroundColor: '#FFFFFF',
    // height: normalizeH(127),
    paddingLeft: normalizeW(20),
    marginBottom: normalizeH(10),
  },
  tripText: {
    fontSize: 12,
    marginTop: normalizeH(6),
    color: '#AAAAAA',
  },
  publush: {
    width: PAGE_WIDTH,
    backgroundColor: '#FFFFFF',
    marginBottom: normalizeH(10),
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: normalizeH(40),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  showAll: {
    height: normalizeH(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  action: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: PAGE_WIDTH,
    height: normalizeH(49),
    backgroundColor: 'rgba(250, 250, 250, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#AAAAAA'
  },
  contacted: {
    height: normalizeH(49),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#FF9D4E',
    width: normalizeW(135),

  }

})