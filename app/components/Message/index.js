/**
 * Created by yangyang on 2016/12/22.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  ListView,
  ScrollView,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import * as msgTypes from '../../constants/messageActionTypes'
import {hasNewMessageByType, getNewestMessageByType, getOrderedConvsByType} from '../../selector/messageSelector'
import {hasNewNoticeByType, getNewestNoticeByType} from '../../selector/notifySelector'
import PrivateMessageCell from './PrivateMessageCell'
import {PERSONAL_CONVERSATION} from '../../constants/messageActionTypes'


const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height
const SYSTEM = 'SYSTEM'
const PUBLISH = 'PUBLISH'

class MessageBox extends Component {
  constructor(props) {
    super(props)
  }

  renderNoticeTip(type) {
    switch (type) {
      case SYSTEM:
        if (this.props.newSystemMsg) {
          return (
            <View style={styles.noticeTip}></View>
          )
        }
        break
      case PUBLISH:
        if (this.props.newPublishMsg) {
          return (
            <View style={styles.noticeTip}></View>
          )
        }
        break
      default:
        return <View/>
    }
  }



  renderPersonalMessage() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.PRIVATE_MESSAGE_BOX()}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              <Image style={styles.noticeIcon} source={require('../../assets/images/message_circle.png')}></Image>
              {this.renderNoticeTip(PERSONAL)}
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>私信</Text>
                <View style={{flex: 1}}></View>
                <Text style={styles.timeTip}>{this.props.lastPersonalMsg.lastMessageAt}</Text>
              </View>
              <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>{this.props.lastPersonalMsg.lastMessage}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  // renderTopicMessage() {
  //   return (
  //     <View style={styles.itemView}>
  //       <TouchableOpacity style={styles.selectItem} onPress={() => Actions.TOPIC_NOTIFY()}>
  //         <View style={{flex: 1, flexDirection: 'row'}}>
  //           <View style={styles.noticeIconView}>
  //             <Image style={styles.noticeIcon} source={require('../../assets/images/notice_topic.png')}></Image>
  //             {this.renderNoticeTip(TOPIC)}
  //           </View>
  //           <View style={{flex: 1}}>
  //             <View style={{flexDirection: 'row'}}>
  //               <Text style={styles.titleStyle}>话题互动</Text>
  //               <View style={{flex: 1}}></View>
  //               <Text style={styles.timeTip}>{this.props.lastLastNoticeMsg.lastMessageAt}</Text>
  //             </View>
  //             <View style={{marginTop: normalizeH(4), marginRight: normalizeW(15)}}>
  //               <Text numberOfLines={1} style={styles.msgTip}>{this.props.lastLastNoticeMsg.lastMessage}</Text>
  //             </View>
  //           </View>
  //         </View>
  //       </TouchableOpacity>
  //     </View>
  //   )
  // }


  renderSystemMessage() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.SYSTEM_MESSAGE_BOX()}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              <Image style={styles.noticeIcon} source={require('../../assets/images/system_message.png')}></Image>
              {this.renderNoticeTip(SYSTEM)}
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>系统消息</Text>
                <View style={{flex: 1}}></View>
              </View>
              <View style={{marginTop: normalizeH(12), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>推荐关注【新产品发布】</Text>
              </View>
            </View>
            <View style={{justifyContent: 'center', paddingRight: normalizeW(30)}}>
              <Image source={require('../../assets/images/PinLeft_gray.png')} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderPublishMessage() {
    return (
      <View style={styles.itemView}>
        <TouchableOpacity style={styles.selectItem} onPress={() => Actions.PUBLISH_NOTIFY()}>
          <View style={{flex: 1, flexDirection: 'row'}}>
            <View style={styles.noticeIconView}>
              <Image style={styles.noticeIcon} source={require('../../assets/images/message_circle.png')}></Image>
              {this.renderNoticeTip(PUBLISH)}
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.titleStyle}>留言</Text>
                <View style={{flex: 1}}></View>
              </View>
              <View style={{marginTop: normalizeH(12), marginRight: normalizeW(15)}}>
                <Text numberOfLines={1} style={styles.msgTip}>杨阳：什么时候方便见面 [1天前]</Text>
              </View>
            </View>
            <View style={{justifyContent: 'center', paddingRight: normalizeW(30)}}>
              <Image source={require('../../assets/images/PinLeft_gray.png')} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderPrivateMsgBox(rowData) {
    return (
      <PrivateMessageCell members={rowData.members} conversation={rowData.id} />
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="消息"
        />
        <View style={styles.itemContainer}>
          <ScrollView style={{height: PAGE_HEIGHT}}>
            {this.renderPublishMessage()}
            {this.renderSystemMessage()}
            <ListView
              dataSource={this.props.dataSource}
              renderRow={(rowData) => this.renderPrivateMsgBox(rowData)}
            />
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  let conversations = getOrderedConvsByType(state, PERSONAL_CONVERSATION)

  let newSystemMsg = hasNewMessageByType(state, msgTypes.SYSTEM_TYPE)
  let newPublishMsg = hasNewNoticeByType(state, msgTypes.PUBLISH_TYPE)

  let lastSystemNotice = getNewestNoticeByType(state, msgTypes.SYSTEM_TYPE)
  let lastPublishNotice = getNewestNoticeByType(state, msgTypes.PUBLISH_TYPE)

  newProps.newSystemMsg = newSystemMsg
  newProps.newPublishMsg = newPublishMsg
  newProps.lastSystemNotice = lastSystemNotice
  newProps.lastPublishNotice = lastPublishNotice
  newProps.dataSource = ds.cloneWithRows(conversations)
  return newProps
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(MessageBox)

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        marginTop: normalizeH(65),
      },
      android: {
        marginTop: normalizeH(45)
      }
    }),
  },
  itemView: {
    borderBottomWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
  },
  selectItem: {
    flexDirection: 'row',
    height: normalizeH(85),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  titleStyle: {
    fontSize: 17,
    color: '#4A4A4A',
    letterSpacing: 0.43,
  },
  msgTip: {
    fontSize: 12,
    color: '#AAAAAA',
    letterSpacing: 0.43,
  },
  timeTip: {
    fontSize: 14,
    color: '#9B9B9B',
    letterSpacing: 0.43,
    marginRight: normalizeW(15)
  },
  noticeIconView: {
    marginLeft: normalizeW(15),
    marginRight: normalizeW(19)
  },
  noticeIcon: {
    width: 50,
    height: 50,
  },
  noticeTip: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    right: 0,
  },
})