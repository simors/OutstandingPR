/**
 * Created by wanpeng on 2017/2/27.
 */
import {List, Map, Set, Record} from 'immutable'
import * as types from '../constants/searchActionTypes'

const SearchRecord = Record({
  searchKey: undefined,
  searchResult: undefined
}, 'SearchRecord')

const initialState = Map({})

export default function searchReducer(state = initialState, action) {
  switch(action.type) {
    case types.ON_SEARCH_INPUT_CHANGE:
      return onSearchInputChange(state, action)
    case types.ON_SEARCH_BTN_CLICKED:
      return onSearchService(state, action)
    default:
      return state
  }
}

function onSearchInputChange(state, action) {
  let searchKey = action.payload.searchKey

  let searchRecord = state.get(searchKey)
  if (searchRecord === undefined) {
    searchRecord = new SearchRecord()
  }
  searchRecord = searchRecord.set('searchKey', searchKey)

  state = state.set(searchKey, searchRecord)
  return state
}

function onSearchService(state, action) {
  console.log("onSearchService", action.payload)
  let searchKey = action.payload.searchKey
  let searchResult = action.payload.searchResult

  let searchRecord = state.get(searchKey)
  if (searchRecord === undefined) {
    searchRecord = new SearchRecord()
  }
  searchRecord = searchRecord.set('searchKey', searchKey)
  searchRecord = searchRecord.set('searchResult', searchResult)

  state = state.set(searchKey, searchRecord)
  return state
}