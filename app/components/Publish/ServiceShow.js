/**
 * Created by wanpeng on 2017/2/24.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  InteractionManager,
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import Symbol from 'es6-symbol'
import {normalizeH, normalizeW} from '../../util/Responsive'
import THEME from '../../constants/theme'
import ArticleViewer from '../../components/common/ArticleViewer'
import * as Toast from '../common/Toast'
import {activeUserId, isUserLogined, userInfoById, activeUserInfo, isUserFollowed} from '../../selector/authSelector'
import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'
import {getUserInfoById, followUser, unFollowUser} from '../../action/authActions'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import ToolBarContent from '../common/ToolBarContent'
import dismissKeyboard from 'react-native-dismiss-keyboard'
import {publishFormData, PUBLISH_FORM_SUBMIT_TYPE, fetchPublishCommentByPublishId, favoritePublish, unFavoritePublish} from '../../action/publishAction'
import {getPublishComments, getPublishById, getIsFavorite} from '../../selector/publishSelector'



const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

class ServiceShow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentCommentId: undefined,
      currentCommentNickname: undefined,
    }
  }


  componentWillMount() {
    InteractionManager.runAfterInteractions(()=>{
      if(this.props.isLogin) {
        this.props.getUserInfoById({userId: this.props.userId})
        this.props.fetchPublishCommentByPublishId({publishId: this.props.publishId})
      }else {
        Actions.LOGIN()
      }
    })
  }

  renderEdit() {
    if((this.props.userId == this.props.currentUser) && (this.props.serviceInfo.status == 1)) {
      return(
        <TouchableOpacity style={styles.edit} onPress={() => Actions.EDIT_SERVICE({service: this.props.serviceInfo})}>
          <Image source={require('../../assets/images/edite.png')}/>
        </TouchableOpacity>
      )
    } else {
      return (
        <View style={{flex: 1}} />
      )
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

  renderPersonalInfo() {
    if(this.props.userId != this.props.currentUser) {
      return(
        <View style={{flexDirection: 'row',alignItems: 'center' , backgroundColor: '#F5F5F5'}}>
          <TouchableOpacity style={{marginTop: normalizeH(15), marginLeft: normalizeW(10), marginRight: normalizeW(15), marginBottom: normalizeH(15)}}
                            onPress={() => Actions.PERSONAL_HOMEPAGE({userId: this.props.userId})}>
            <Image
              style={{ width: 60, height: 60, borderRadius: 30, overflow: 'hidden', borderWidth: 2, borderColor: '#FFFFFF'}}
              source={this.props.userInfo.avatar? {uri: this.props.userInfo.avatar}: require('../../assets/images/defualt_user.png')}
            />
          </TouchableOpacity>
          <View style={{flex: 1, marginTop: normalizeH(15)}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 15}}>{this.props.userInfo.nickname}</Text>
              <Text style={{fontSize: 15, color: '#AAAAAA', marginLeft: normalizeW(20)}}>{this.props.userInfo.profession}</Text>
            </View>
            <Text style={{marginTop: normalizeH(10), fontSize: 12, color: '#AAAAAA'}}>30分钟前来过</Text>
          </View>
          <TouchableOpacity style={{marginRight: normalizeW(20)}} onPress={() =>{this.onFollow()}}>
            <Image
              source={this.props.isFollow?require('../../assets/images/followed.png'): require('../../assets/images/add_follow.png')}
            />
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
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

  renderAction() {
    if(this.props.userId != this.props.currentUser) {
      return(
        <View style={styles.action}>
          <TouchableOpacity style={{marginLeft: normalizeW(30), paddingLeft: normalizeW(10)}} onPress={() => {this.onFavorite()}}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={this.props.isFavorite? require('../../assets/images/favorited.png'): require('../../assets/images/favorite.png')}
              />
              <Text>收藏</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={{flex: 1, marginLeft: normalizeW(54), alignItems: 'flex-start'}} onPress={() => this.onReply()}>
            <View style={{alignItems: 'center'}}>
              <Image
                source={require('../../assets/images/message.png')}
              />
              <Text>留言</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contacted} onPress={() => {this.enterChatroom()}}>
            <Image
              source={require('../../assets/images/contacted.png')}
            />
            <Text style={{marginLeft: normalizeW(9), fontSize: 15, color: '#FFFFFF'}}>私信</Text>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  onReply = (comment) => {
    if(comment.commentUserId != this.props.currentUser) {
      if(comment) {
        this.setState({
          currentCommentId: comment.commentId,
          currentCommentNickname: comment.commentUser,
        })
      }
      this.contentBar.setFocus()
    }
  }
  onFavorite() {
    if(this.props.isFavorite) {
      this.props.unFavoritePublish({
        publishId: this.props.publishId,
      })
    } else {
      this.props.favoritePublish({
        publishId: this.props.publishId,

      })
    }
  }

  submitSuccessCallback() {
    dismissKeyboard()
    Toast.show('评论成功', {duration: 1000})
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  sendReply(content) {
    if (!this.props.isLogin) {
      Actions.LOGIN()
    }
    else {
      this.props.publishFormData({
        content: content,
        publishId: this.props.serviceInfo.objectId,
        userId: this.props.currentUserInfo.id,
        replyTo: this.props.userId,
        commentId: this.state.currentCommentId,
        submitType: PUBLISH_FORM_SUBMIT_TYPE.PUBLISH_COMMENT,
        success: this.submitSuccessCallback.bind(this),
        error: this.submitErrorCallback
      })
    }
  }

  renderKeyboardAwareToolBar() {
    return (
      <KeyboardAwareToolBar
        initKeyboardHeight={-100}
      >
        <ToolBarContent
          label={"发送"}
          ref={(contentBar) => this.contentBar = contentBar}
          onSend={(content) => {
            this.sendReply(content)
          }}
          placeholder={this.state.currentCommentNickname? "回复：" + this.state.currentCommentNickname : "回复"}
        />
      </KeyboardAwareToolBar>
    )
  }

  onAvatarClick(userId) {
    if(this.props.currentUser == userId) {
      Actions.PROFILE()
    } else {
      Actions.PERSONAL_HOMEPAGE({userId: userId})
    }
  }

  renderComments() {
    if (this.props.publishComments) {
      return (
        this.props.publishComments.map((value, key)=> {
          return (
            <View key={key} style={{flexDirection: 'row', width: PAGE_WIDTH, height: normalizeH(83)}} >
              <TouchableOpacity onPress={() => this.onAvatarClick(value.userId)}>
                <Image
                  source={{uri: value.avatar}}
                  style={{width: 40, height: 40, borderRadius: 20, marginTop: normalizeH(10), marginRight: normalizeW(10), marginLeft: normalizeW(15)}}
                />
              </TouchableOpacity>
              <TouchableOpacity style={{flex: 1, borderBottomColor: '#F5F5F5', borderBottomWidth: 1}}
                                onPress={() => this.onReply({commentId: value.objectId, commentUser: value.nickname, commentUserId: value.userId})}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between',marginTop: normalizeH(23)}}>
                  <Text style={{fontSize: 15, color: 'rgba(86, 103, 143, 1)'}}>{value.nickname}</Text>
                  <Text style={{fontSize: 12, color: '#AAAAAA', marginRight: normalizeW(15)}}>{"30分钟以前"}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: normalizeH(15)}}>
                  <Text style={{fontSize: 15, color: '#5A5A5A'}}>回复</Text>
                  <Text style={{fontSize: 15, color: 'rgba(86, 103, 143, 1)'}}>{value.parentCommentUserName}</Text>
                  <Text style={{fontSize: 15, color: '#5A5A5A'}}>：{value.content}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )
        })
      )
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={{ alignItems: 'center', paddingRight: normalizeW(13)}} onPress={() => Actions.pop()}>
            <Icon
              name="ios-arrow-back"
              style={{marginLeft: normalizeW(11), fontSize: 32, color: THEME.colors.yellow}}/>
          </TouchableOpacity>
          {this.renderEdit()}
          <TouchableOpacity style={styles.share} onPress={() => {Toast.show("嘿嘿！暂时无法分享")}}>
            <Image
              source={require('../../assets/images/share.png')}
            />
          </TouchableOpacity>
        </View>
        <View style={this.props.userId == this.props.currentUser? {height: PAGE_HEIGHT - normalizeH(65)} : {height: PAGE_HEIGHT - normalizeH(49) - normalizeH(65)}}>
          <ScrollView>
            <View style={styles.titleView}>
              <Text style={styles.title}>{this.props.serviceInfo.title}</Text>
              <Text style={styles.price}>¥ {this.props.serviceInfo.price}元</Text>
            </View>
            {this.renderPersonalInfo()}
            <View style={styles.serviceView}>
              <ArticleViewer artlcleContent={JSON.parse(this.props.serviceInfo.content)}/>
            </View>
            <View style={styles.comments}>
              <View style={styles.commentHeader}>
                <View style={{width: normalizeW(5), height: normalizeH(15), backgroundColor: THEME.colors.yellow, marginLeft: normalizeW(15)}}/>
                <Text style={{fontSize: 17, color: '#5A5A5A', marginLeft: normalizeW(10)}}>留言 ({this.props.serviceInfo.commentCnt})</Text>
              </View>
            </View>
            {this.renderComments()}
          </ScrollView>
        </View>
        {this.renderAction()}
        {this.renderKeyboardAwareToolBar()}
      </View>
    )
  }
}

ServiceShow.defaultProps = {
  service: {
    title: undefined,
    content: undefined,
    price: undefined,
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUser = activeUserId(state)
  let currentUserInfo = activeUserInfo(state)
  const isLogin = isUserLogined(state)
  let userInfo = userInfoById(state, ownProps.userId)
  let publishComments = getPublishComments(state, ownProps.publishId)
  let serviceInfo = getPublishById(state, ownProps.publishId)
  let isFavorite = getIsFavorite(state, ownProps.publishId)
  let isFollow = isUserFollowed(state, ownProps.userId)


  return {
    isLogin: isLogin,
    isFavorite: isFavorite,
    isFollow: isFollow,
    currentUser: currentUser,
    currentUserInfo: currentUserInfo,
    userInfo: userInfo,
    serviceInfo: serviceInfo,
    publishComments: publishComments,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getUserInfoById,
  publishFormData,
  fetchPublishCommentByPublishId,
  favoritePublish,
  unFavoritePublish,
  followUser,
  unFollowUser
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ServiceShow)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: PAGE_HEIGHT,
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
  header: {
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(20),
        height: normalizeH(64)
      },
      android: {
        height: normalizeH(44)
      }
    }),
    flexDirection: 'row',
    width: PAGE_WIDTH,
    alignItems: 'center',
    backgroundColor: '#F5F5F5'
  },
  edit: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: normalizeH(30),
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: normalizeW(28),
  },
  share: {
    paddingRight: normalizeW(20),
  },
  titleView: {
    flexDirection: 'row',
    width: PAGE_WIDTH,
    height: normalizeH(50),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F5F5F5'
  },
  title: {
    flex: 1,
    marginLeft: normalizeW(15),
    fontSize: 17,
    color: '#5A5A5A',

  },
  price: {
    fontSize: 15,
    color: THEME.colors.yellow,
    marginRight: normalizeW(20),
  },
  serviceView: {
    marginBottom: normalizeW(20),
  },
  comments: {
    justifyContent: 'center',
    height: normalizeH(40),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  commentHeader: {
    flexDirection: 'row',
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
    borderTopColor: '#AAAAAA',
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