import {combineReducers} from 'redux'

import configReducer from './configReducer'
import uiReducer from './uiReducer'
import authReducer  from './authReducer'
import publishReducer from './publishReducer'



const rootReducers = combineReducers({
  CONFIG: configReducer,
  UI: uiReducer,
  AUTH: authReducer,
  PUBLISH: publishReducer,
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