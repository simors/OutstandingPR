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

function onRehydrate(state, action) {
  var incoming = action.payload.PUBLISH
  if (incoming) {
    // state = state.set('iPublishes', List(incoming.iPublishes))
  }
  return state
}

