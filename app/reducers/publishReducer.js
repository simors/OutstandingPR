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
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleAddPublish(state, action) {
  let publish = action.payload.publish
  let _list = undefined
  _list = state.get('iPublishes') || new List()
  _list = _list.insert(0, publish)
  state = state.set('iPublishes', _list)
  return state
}


function onRehydrate(state, action) {
  console.log("onRehydrate: payload", action.payload)
  var incoming = action.payload.PUBLISH
  if (incoming) {
    state = state.set('iPublishes', List(incoming.iPublishes))
  }
  return state
}

