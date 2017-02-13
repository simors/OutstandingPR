/**
 * Created by wanpeng on 2017/2/13.
 */
import {combineReducers} from 'redux'
import inputFormReducer from './inputFormReducer'

const uiReducer = combineReducers({
  INPUTFORM: inputFormReducer,
})

export default uiReducer