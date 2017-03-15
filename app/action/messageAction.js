/**
 * Created by yangyang on 2016/12/20.
 */
import  {Platform, CameraRoll} from 'react-native'
import {createAction} from 'redux-actions'
import {Map, List} from 'immutable'
import AV from 'leancloud-storage'
import {TypedMessage, messageType, Realtime} from 'leancloud-realtime'
import {TypedMessagePlugin}from 'leancloud-realtime-plugin-typed-messages'
import * as LC_CONFIG from '../constants/appConfig'
import * as msgTypes from '../constants/messageActionTypes'
import {Conversation, Message} from '../models/messageModels'
import {
  TopicLikeMsg,
  ShopLikeMsg,
  UserFollowMsg,
  ShopFollowMsg,
  PublishCommentMsg,
  NotifyMessage,
} from '../models/notifyModel'
import {activeUserId, activeUserInfo} from '../selector/authSelector'
import {messengerClient} from '../selector/messageSelector'
import mime from '../util/mime-types'

class TextMessage extends TypedMessage {
}
messageType(msgTypes.MSG_TEXT)(TextMessage)

class ImageMessage extends TypedMessage {
}
messageType(msgTypes.MSG_IMAGE)(ImageMessage)

class AudioMessage extends TypedMessage {
}
messageType(msgTypes.MSG_AUDIO)(AudioMessage)

class ArticleLikeMessage extends TypedMessage {
}
messageType(msgTypes.MSG_ARTICLE_LIKE)(ArticleLikeMessage)

class TopicLikeMessage extends TypedMessage {
}
messageType(msgTypes.MSG_TOPIC_LIKE)(TopicLikeMessage)

class ShopLikeMessage extends TypedMessage {
}
messageType(msgTypes.MSG_SHOP_LIKE)(ShopLikeMessage)

class UserFollowMessage extends TypedMessage {
}
messageType(msgTypes.MSG_USER_FOLLOW)(UserFollowMessage)

class ShopFollowMessage extends TypedMessage {
}
messageType(msgTypes.MSG_SHOP_FOLLOW)(ShopFollowMessage)

class PublishCommentMessage extends TypedMessage {
}
messageType(msgTypes.MSG_PUBLISH_COMMENT)(PublishCommentMessage)


//we should move this to the server to avoid reverse-engineering


const appId = __DEV__ ? LC_CONFIG.LC_DEV_APP_ID : LC_CONFIG.LC_PRO_APP_ID
const appKey = __DEV__ ? LC_CONFIG.LC_DEV_APP_KEY : LC_CONFIG.LC_PRO_APP_KEY

const realtime = new Realtime({
  appId: appId,
  appKey: appKey,
  region: 'cn',
  noBinary: true,
  pushOfflineMessages: true,
  plugins: [TypedMessagePlugin],
})
realtime.register(TextMessage)
realtime.register(ImageMessage)
realtime.register(AudioMessage)
realtime.register(ArticleLikeMessage)
realtime.register(TopicLikeMessage)
realtime.register(ShopLikeMessage)
realtime.register(UserFollowMessage)
realtime.register(ShopFollowMessage)
realtime.register(PublishCommentMessage)

const initMessenger = createAction(msgTypes.INIT_MESSENGER_CLIENT)
const onCreateConversation = createAction(msgTypes.ON_CONVERSATION_CREATED)
const onEnterConversation = createAction(msgTypes.ON_ENTER_CONVERSATION)
const onLeaveConversation = createAction(msgTypes.ON_LEAVE_CONVERSATION)
const onCreateMessage = createAction(msgTypes.ON_MESSAGE_CREATED)
const onSendMessage = createAction(msgTypes.ON_MESSAGE_SENTED)
const onRecvMessage = createAction(msgTypes.ON_MESSAGE_RECEIVED)
const onUpdateConversation = createAction(msgTypes.ON_UPDATE_CONVERSATION)

export function initMessageClient(payload) {
  return (dispatch, getState) => {
    const userId = activeUserId(getState())

    if (!userId) {
      if (payload.error) {
        payload.error({message: '用户未登录'})
      }
    }
    let tag = 'web'
    if (Platform.OS == 'ios' || Platform.OS == 'android') {
      tag = 'mobile'
    }

    return dispatch(initLcMessenger({
      tag: tag,
      userId: userId,
    }))
  }
}

export function initLcMessenger(payload) {
  return (dispatch) => {
    realtime.createIMClient(payload.userId, {}, payload.tag).then((client) => {
      client.on('message', function (message, conversation) {
        dispatch(onReceiveMsg(message, conversation))
      })

      client.on('disconnect', function () {
        console.log('网络连接已断开');
      })
      client.on('schedule', function (attempt, delay) {
        console.log(delay + 'ms 后进行第' + (attempt + 1) + '次重连');
      })
      client.on('retry', function (attempt) {
        console.log('正在进行第' + attempt + '次重连');
      })
      client.on('reconnect', function () {
        console.log('网络连接已恢复');
      })

      dispatch(initMessenger({client: client}))
      console.log('IM客户端已登录')
    }).catch((error) => {
      console.log(error)
    })
  }
}

export function createConversation(payload) {
  return (dispatch, getState) => {
    dispatch(createLcConversation(payload)).then((conversation) => {
      dispatch(onCreateConversation(conversation))
      dispatch(enterConversation({conversationId: conversation.id}))
      if (payload.success) {
        payload.success({meesage: '创建对话成功'})
      }
    }).catch((error) => {
      console.log('failed to create conversation: ', error)
    })
  }
}

export function sendMessage(payload) {
  return (dispatch, getState) => {

    if (!payload.text || payload.text.length == 0) {
      return
    }

    let attributes = {}
    if (payload.type == msgTypes.MSG_IMAGE) {
      attributes['localUri'] = payload.uri
    } else if (payload.type == msgTypes.MSG_AUDIO) {
      attributes['localUri'] = payload.uri
      attributes['duration'] = payload.duration
    }

    let msg = new Message({
      id: payload.msgId,
      from: activeUserId(getState()),
      type: payload.type,
      text: payload.text,
      conversation: payload.conversationId,
      status: 'created',
      attributes: Map(attributes)
    })

    dispatch(onCreateMessage({createdMsgId: payload.msgId, message: msg}))

    dispatch(sendLcTypedMessage(payload)).then((message) => {
      dispatch(onSendMessage({createdMsgId: payload.msgId, message: message}))
    }).catch((error) => {
      console.log(error)
      const failMsg = new Message({
        id: payload.msgId,
        from: activeUserId(getState()),
        type: payload.type,
        text: payload.text,
        conversation: payload.conversationId,
        status: 'fail',
        attributes: Map(attributes),
      })
      dispatch(onSendMessage({message: failMsg}))
    })
  }
}

export function enterTypedNotify(payload) {
  return (dispatch, getState) => {
    let onEnterTypedNotify = createAction(msgTypes.ON_ENTER_TYPED_NOTIFY)
    dispatch(onEnterTypedNotify({type: payload.type}))
  }
}

export function enterConversation(payload) {
  return (dispatch, getState) => {
    dispatch(onEnterConversation({cid: payload.conversationId}))
  }
}

export function leaveConversation(payload) {
  return (dispatch, getState) => {
    dispatch(onLeaveConversation())
  }
}

export function fetchConversation(payload) {
  return (dispatch, getState) => {
    let userId = activeUserId(getState())
    let params = {
      userId: userId,
      type: payload.type,
    }
    dispatch(fetchLcConversation(params)).then((convs) => {
      let initConversations = createAction(msgTypes.INIT_CONVERSATION)
      dispatch(initConversations({conversations: convs}))
    })
  }
}

export function fetchChatMessages(payload) {
  return (dispatch, getState) => {
    dispatch(fetchLcChatMessages(payload)).then((messages) => {
      let initMessages = createAction(msgTypes.ON_INIT_MESSAGES)
      dispatch(initMessages({
        conversationId: payload.conversationId,
        messages: messages,
      }))
    }).catch((err) => {
      console.log(err)
    })
  }
}

function fetchLcConversation(payload) {
  return (dispatch, getState) => {
    let client = messengerClient(getState())
    if (!client) {
      if (payload.error) {
        payload.error()``
      }
      console.log('leancloud Messenger init failed, can\'t get client')
      return undefined
    }

    return client.getQuery().containsMembers([payload.userId]).contains('type', payload.type).find()
      .then((lcConvs) => {
        let convs = []
        lcConvs.map((conv) => {
          convs.unshift(Conversation.fromLeancloudConversation(conv))
        })
        return convs
      })
  }
}

function fetchLcChatMessages(payload) {
  return (dispatch, getState) => {
    let client = messengerClient(getState())
    if (!client) {
      if (payload.error) {
        payload.error()
      }
      console.log('leancloud Messenger init failed, can\'t get client')
      return undefined
    }

    return client.getConversation(payload.conversationId).then((conversation)=> {
      return conversation.queryMessages({limit: 10})
    }).then((lcMsgs)=> {
      let msgs = []
      lcMsgs.map((msg) => {
        msgs.unshift(Message.fromLeancloudMessage(msg))
      })
      return msgs
    }).catch((err) => {
      console.log(err)
    })
  }
}

function createLcConversation(payload) {
  return (dispatch, getState) => {
    let client = messengerClient(getState())
    if (!client) {
      if (payload.error) {
        payload.error()
      }
      console.log('leancloud Messenger init failed, can\'t get client')
      return undefined
    }
    if (payload.type === msgTypes.INQUIRY_CONVERSATION) {
      let wuaiSysDoctor = payload.members.includes(msgTypes.WUAI_SYSTEM_DOCTOR)
      if (!wuaiSysDoctor) {
        payload.members.push(msgTypes.WUAI_SYSTEM_DOCTOR)    // 为了区分问诊或私信的会话，如果是问诊的会话，则插入系统医生所为会话参与者
      }
    }
    return client.createConversation({
      members: payload.members,
      name: payload.name,
      unique: true,
      type: payload.type,   // 会话的类型，可以是问诊（INQUIRY_CONVERSATION），或私信（PERSONAL_CONVERSATION）
      status: 1,
    }).then((conversation) => {
      return Conversation.fromLeancloudConversation(conversation)
    })
  }
}

function setLcConversation(payload) {
  return (dispatch, getState) => {
    let client = messengerClient(getState())
    if (!client) {
      if (payload.error) {
        payload.error()
      }
      console.log('leancloud Messenger init failed, can\'t get client')
      return undefined
    }

    return client.getConversation(payload.conversationId).then((conversation)=> {
      let today = new Date()
      let interval = today.getTime() - conversation.createdAt.getTime()
      if (interval > 1 * 3600 * 1000){ //快速问诊24小时候后失效
        conversation.set('status', 0)
        return conversation.save()
      }
      return undefined
    }).then((conversation) => {
      if (conversation)
        console.log('setLcConversation', conversation)
        return Conversation.fromLeancloudConversation(conversation)
      return undefined
    }).catch((err) => {
      console.log(err)
    })
  }
}

function createOriginalConversation(payload) {
  return (dispatch, getState) => {
    let client = messengerClient(getState())
    if (!client) {
      if (payload.error) {
        payload.error()
      }
      console.log('leancloud Messenger init failed, can\'t get client')
      return undefined
    }

    let wuaiSysSpeaker = payload.members.includes(msgTypes.WUAI_SYSTEM_SPEAKER)
    if (!wuaiSysSpeaker) {
      payload.members.push(msgTypes.WUAI_SYSTEM_SPEAKER)    // 为了区分通知消息或私信的会话，如果是通知的会话，则插入系统用户为会话参与者
    }

    return client.createConversation({
      members: payload.members,
      name: payload.name,
      unique: true,
      status: 1,
    })
  }
}

function sendLcTypedMessage(payload) {
  return (dispatch, getState) => {
    let client = messengerClient(getState())
    if (!client) {
      if (payload.error) {
        payload.error()
      }
      console.log('leancloud Messenger init failed, can\'t get client')
      return undefined
    }

    return client.getConversation(payload.conversationId).then((conversation)=> {
      switch (payload.type) {
        case msgTypes.MSG_IMAGE:
          return sendImageMessage(conversation, payload)

        case msgTypes.MSG_AUDIO:
          return sendAudioMessage(conversation, payload)

        case msgTypes.MSG_TEXT:
        default:
          return sendTextMessage(conversation, payload)
      }
    })
  }
}

function onReceiveMsg(message, conversation) {
  return (dispatch, getState) => {
    let msgType = message.type
    console.log('onReceiveMsg', message)
    if (msgType === msgTypes.MSG_TEXT || msgType === msgTypes.MSG_AUDIO || msgType === msgTypes.MSG_IMAGE) {
      dispatch(onRecvNormalMessage(message, conversation))
    }
    if (msgType === msgTypes.MSG_ARTICLE_COMMENT
      || msgType === msgTypes.MSG_TOPIC_COMMENT
      || msgType === msgTypes.MSG_SHOP_COMMENT
      || msgType === msgTypes.MSG_ARTICLE_LIKE
      || msgType === msgTypes.MSG_TOPIC_LIKE
      || msgType === msgTypes.MSG_SHOP_LIKE
      || msgType === msgTypes.MSG_USER_FOLLOW
      || msgType === msgTypes.MSG_SHOP_FOLLOW
      || msgType === msgTypes.MSG_PUBLISH_COMMENT
      || msgType === msgTypes.MSG_SYSTEM) {
      dispatch(onRecvNotifyMessage(message, conversation))
    }
  }
}

function onRecvNormalMessage(message, conversation) {
  return (dispatch, getState) => {
    dispatch(onRecvMessage({
      message: Message.fromLeancloudMessage(message),
      conversation: Conversation.fromLeancloudConversation(conversation)
    }))
  }
}

function onRecvNotifyMessage(message, conversation) {
  return (dispatch, getState) => {
    let msgType = message.type
    let addNotifyMsg = createAction(msgTypes.ADD_NOTIFY_MSG)
    if (msgType === msgTypes.MSG_TOPIC_LIKE) {
      dispatch(addNotifyMsg({
        message: TopicLikeMsg.fromLeancloudMessage(message),
        conversation: Conversation.fromLeancloudConversation(conversation)
      }))
    } else if (msgType === msgTypes.MSG_SHOP_LIKE) {
      dispatch(addNotifyMsg({
        message: ShopLikeMsg.fromLeancloudMessage(message),
        conversation: Conversation.fromLeancloudConversation(conversation)
      }))
    } else if (msgType === msgTypes.MSG_USER_FOLLOW) {
      dispatch(addNotifyMsg({
        message: UserFollowMsg.fromLeancloudMessage(message),
        conversation: Conversation.fromLeancloudConversation(conversation)
      }))
    } else if (msgType === msgTypes.MSG_SHOP_FOLLOW) {
      dispatch(addNotifyMsg({
        message: ShopFollowMsg.fromLeancloudMessage(message),
        conversation: Conversation.fromLeancloudConversation(conversation)
      }))
    } else if (msgType === msgTypes.MSG_PUBLISH_COMMENT) {
      dispatch(addNotifyMsg({
        message: PublishCommentMsg.fromLeancloudMessage(message),
        conversation: Conversation.fromLeancloudConversation(conversation)
      }))
    }
  }
}

function sendTextMessage(conversation, payload) {
  let message = new TextMessage()
  message.setText(payload.text)
  return conversation.send(message).then((msg)=> {
    return Message.fromLeancloudMessage(msg, payload)
  })
}

function sendImageMessage(conversation, payload) {
  let message = new ImageMessage()
  message.setText(payload.text)
  let file = new AV.File(payload.fileName, {blob: {uri: payload.uri}}, mime.lookup(payload.uri))
  return file.save().then((savedFile)=> {
    message.setAttributes({
      'mediaId': savedFile.attributes.url
    })
    return conversation.send(message)
  }).then((message)=> {
    return Message.fromLeancloudMessage(message, payload)
  })
}

function sendAudioMessage(conversation, payload) {
  let message = new AudioMessage()
  message.setText(payload.text)
  let file = new AV.File(payload.fileName, {blob: {uri: payload.uri}}, mime.lookup(payload.uri))
  return file.save().then((savedFile)=> {
    message.setAttributes({
      'mediaId': savedFile.attributes.url,
      'duration': payload.duration
    })
    return conversation.send(message)
  }).then((message)=> {
    return Message.fromLeancloudMessage(message, payload)
  })
}

function createTypedMessage(msgType) {
  switch (msgType) {
    case msgTypes.MSG_ARTICLE_LIKE:
      return new ArticleLikeMessage()
    case msgTypes.MSG_TOPIC_COMMENT:
      return new TopicCommentMessage()
    case msgTypes.MSG_TOPIC_LIKE:
      return new TopicLikeMessage()
    case msgTypes.MSG_SHOP_COMMENT:
      return new ShopCommentMessage()
    case msgTypes.MSG_SHOP_LIKE:
      return new ShopLikeMessage()
    case msgTypes.MSG_USER_FOLLOW:
      return new UserFollowMessage()
    case msgTypes.MSG_SHOP_FOLLOW:
      return new ShopFollowMessage()
    case msgTypes.MSG_PUBLISH_COMMENT:
      return new PublishCommentMessage()
    default:
      return new TextMessage()
  }
}


export function notifyPublishComment(payload) {
  console.log("notifyPublishComment:payload", payload)
  return (dispatch, getState) => {
    let toPeers = []
    // let topicInfo = getTopicById(getState(), payload.topicId)
    // console.log('topicInfo:', topicInfo)

    if (payload.replyTo) {
      toPeers.push(payload.replyTo)
    } else {
      // toPeers.push(topicInfo.userId)
    }

    let currentUser = activeUserInfo(getState())
    let notifyConv = {
      members: toPeers,   // 可以是一个数组
      unique: true
    }
    dispatch(createOriginalConversation(notifyConv)).then((conversation) => {
      let message = createTypedMessage(msgTypes.MSG_PUBLISH_COMMENT)
      let attrs = {
        msgType: msgTypes.MSG_PUBLISH_COMMENT,
        userId: currentUser.id,
        nickname: currentUser.nickname,
        avatar: currentUser.avatar,
        topicId: payload.topicId,
        publishId: payload.publishId,
        // title: topicInfo.title,
        commentId: payload.commentId,
        commentContent: payload.content,
      }
      let text = currentUser.nickname + '在您的发布信息《' + '********' + '》中发表了评论'
      message.setText(text)
      message.setAttributes(attrs)
      conversation.send(message)
    }, (err) => {
      console.log(err)
    })
  }
}


export function notifyUserFollow(payload) {
  return (dispatch, getState) => {
    let currentUser = activeUserInfo(getState())
    let notifyConv = {
      members: [payload.toPeers],   // 可以是一个数组
      unique: true
    }
    dispatch(createOriginalConversation(notifyConv)).then((conversation) => {
      let message = createTypedMessage(msgTypes.MSG_USER_FOLLOW)
      let attrs = {
        msgType: msgTypes.MSG_USER_FOLLOW,
        userId: currentUser.id,
        nickname: currentUser.nickname,
        avatar: currentUser.avatar,
      }
      let text = currentUser.nickname + '关注了您'
      message.setText(text)
      message.setAttributes(attrs)
      conversation.send(message)
    }, (err) => {
      console.log(err)
    })
  }
}


export function updateConversationStatus(payload) {
  return (dispatch, getState) => {
    dispatch(setLcConversation(payload)).then((conversation) => {
      if (conversation)
        dispatch(onUpdateConversation(conversation))
    }).catch((error) => {
      console.log('failed to create conversation: ', error)
    })
  }
}