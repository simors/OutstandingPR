/**
 * Created by wanpeng on 2017/2/13.
 */
import {combineReducers} from 'redux'
import inputFormReducer from './inputFormReducer'
import searchReducer from './searchReducer'

const uiReducer = combineReducers({
  INPUTFORM: inputFormReducer,
  SEARCH: searchReducer,
})

export default uiReducer