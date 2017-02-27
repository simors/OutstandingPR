/**
 * Created by wanpeng on 2017/2/27.
 */
import {List, Map, Set, Record} from 'immutable'
import * as types from '../constants/searchActionTypes'

const SearchRecord = Record({
  searchKey: undefined,
  searchType: undefined,
  searchResult: undefined
}, 'SearchRecord')

const initialState = Map({})

export default function searchReducer(state = initialState, action) {
  switch(action.type) {
    case types.ON_SEARCH_INPUT_CHANGE:
      return onSearchInputChange(state, action)
    default:
      return state
  }
}

function onSearchInputChange(state, action) {
  let searchKey = action.payload.searchKey
  let searchType = action.payload.searchType

  let searchRecord = state.get(searchKey)
  if (searchRecord === undefined) {
    searchRecord = new SearchRecord()
    searchRecord = searchRecord.set('searchType', searchType)
  }
  searchRecord = searchRecord.set('searchKey', searchKey)

  state = state.set(searchType, searchRecord)
  return state
}