/**
 * Created by wanpeng on 2017/2/17.
 */
import * as PublishActionTypes from '../constants/publishActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Map, List} from 'immutable'
import {PublishState} from '../models/publishModels'

const initialState = new PublishState()

export default function publishReducer(state = initialState, action) {
  switch (action.type) {
    case PublishActionTypes.ADD_PUBLISH:
      return handleAddPublish(state, action)
    case PublishActionTypes.UPDATE_PUBLISH:
      return handleUpdatePublish(state, action)
    case PublishActionTypes.UPDATE_PUBLISHES:
      return handleUpdatePublishes(state, action)
    case PublishActionTypes.FETCH_PUBLISHES:
      return handleFetchPublishes(state, action)
    case PublishActionTypes.PUBLISH_COMMENT_SUCCESS:
      return handleAddPublishComment(state, action)
    case PublishActionTypes.PUBLISH_UPDATE_COMMENTCNT:
      return handleUpdateCommentCnt(state, action)
    case PublishActionTypes.UPDATE_PUBLISH_COMMENTS:
      return handleUpdatePublishComments(state, action)
    case PublishActionTypes.UPDATE_PUBLISH_STATUS:
      return handleUpdatePublishStatus(state, action)
    case PublishActionTypes.UPDATE_PUBLISH_REFRESHTIME:
      return handleUpdatePublishRefreshTime(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleAddPublish(state, action) {
  let publish = action.payload.publish
  console.log("handleAddPublish publish", publish)
  let _list = undefined
  _list = state.get('iPublishes') || new List()
  _list = _list.insert(0, publish)
  state = state.set('iPublishes', _list)
  return state
}

function handleUpdatePublish(state, action) {
  let publish = action.payload.publish
  console.log("handleUpdatePublish publish", publish)
  let _list = undefined
  _list = state.get('iPublishes')
  if (_list) {
    index= _list.findIndex((record) => {
      return publish.get('objectId') == record.objectId
    })
    console.log("index", index)
    if (index != -1)
      _list = _list.set(index, publish)
  }
  state = state.set('iPublishes', _list)
  return state
}

function handleUpdatePublishes(state, action) {
  let publishes = action.payload.pubishes
  state = state.set('iPublishes', publishes)
  return state
}

function handleFetchPublishes(state, action) {
  let payload = action.payload
  let publishes = payload.pubishes
  let type = payload.type
  let _list = undefined

  if(payload.isPaging) {
    if(type == 'service') {
      _list = state.get('lastServices') || new List()
      _list = _list.concat(publishes)
      state = state.set('lastServices', _list)
    } else if (type == 'help') {
      _list = state.get('lastHelp') || new List()
      _list = _list.concat(publishes)
      state = state.set('lastHelp', _list)
    }
  } else {
    if(type == 'service') {
      state = state.set('lastServices', publishes)
    } else if (type == 'help') {
      state = state.set('lastHelp', publishes)
    }
  }
  return state
}

function handleAddPublishComment(state, action) {
  let publishComment = action.payload.publishComment
  let publishCommentList = state.getIn(['publishComments', action.payload.publishId])
  if (!publishCommentList) {
    publishCommentList = new List()
  }
  publishCommentList = publishCommentList.insert(0, publishComment)
  state = state.setIn(['publishComments', action.payload.publishId], publishCommentList)
  return state

  return state
}

function handleUpdateCommentCnt(state, action) {
  let publishId = action.payload.publishId

  let lastServices = state.get('lastServices')
  if(lastServices) {
    let key = lastServices.findKey((record) => {
      if(record.get('objectId') == publishId)
        return true
      return false
    })
    if(key){
      state = state.updateIn(['lastServices', key, 'commentCnt'], val => val +1)
      return state
    }
  }

  let lastHelp = state.get('lastHelp')
  if(lastHelp) {
    let key = lastHelp.findKey((record) => {
      if(record.get('objectId') == publishId)
        return true
      return false
    })
    if(key){
      state = state.updateIn(['lastHelp', key, 'commentCnt'], val => val +1)
      return state
    }
  }

  let iPublish = state.get('iPublishes')
  if(iPublish) {
    let key = iPublish.findKey((record) => {
      if(record.get('objectId') == publishId)
        return true
      return false
    })
    if(key){
      state = state.updateIn(['iPublishes', key, 'commentCnt'], val => val +1)
      return state
    }
  }

  return state
}

function handleUpdatePublishComments(state, action) {
  let payload = action.payload
  let _map = state.get('publishComments')
  _map = _map.set(payload.publishId, payload.publishComments)
  state = state.set('publishComments', _map)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.PUBLISH
  if (incoming) {
    // state = state.set('iPublishes', List(incoming.iPublishes))
  }
  return state
}

function handleUpdatePublishStatus(state, action) {
  let payload = action.payload
  let iPublish = state.get('iPublishes')
  if(iPublish) {
    let key = iPublish.findKey((record) => {
      if(record.get('objectId') == payload.publishId)
        return true
      return false
    })
    if(key){
      state = state.updateIn(['iPublishes', key, 'status'], val => payload.status)
      return state
    }
  }
  return state
}

function handleUpdatePublishRefreshTime(state, action) {
  let payload = action.payload
  let refreshTime = payload.refreshTime.getTime()
  let iPublish = state.get('iPublishes')
  if(iPublish) {
    let key = iPublish.findKey((record) => {
      if(record.get('objectId') == payload.publishId)
        return true
      return false
    })
    if(key != undefined){
      state = state.updateIn(['iPublishes', key, 'lastRefreshAt'], val => refreshTime)
      return state
    }
  }
  return state
}
