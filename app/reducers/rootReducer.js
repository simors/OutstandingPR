import {combineReducers} from 'redux'

import configReducer from './configReducer'
import uiReducer from './uiReducer'
import authReducer  from './authReducer'
import publishReducer from './publishReducer'
import messageReducer from './messageReducer'
import notifyReducer from './notifyReducer'
import pushReducer from './pushReducer'



const rootReducers = combineReducers({
  CONFIG: configReducer,
  UI: uiReducer,
  AUTH: authReducer,
  PUBLISH: publishReducer,
  MESSAGE: messageReducer,
  NOTICE: notifyReducer,
  PUSH: pushReducer,
})

const rootReducersWrapper = (state, action) => {
  action.rootState = state
  if (action.error) {
    return {
      ...state
    }
  } else {
    return rootReducers(state, action)
  }
}

export default rootReducersWrapper