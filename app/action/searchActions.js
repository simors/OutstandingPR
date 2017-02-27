/**
 * Created by wanpeng on 2017/2/26.
 */
import {createAction} from 'redux-actions'
import * as types from '../constants/searchActionTypes'
import {getSearchKeyByType} from '../selector/searchSelector'
import * as lcSearch from '../api/leancloud/search'

export function searchInputChangeAction(payload) {
  return (dispatch, getState) => {
    let inputChangeAction = createAction(types.ON_SEARCH_INPUT_CHANGE)
    dispatch(inputChangeAction(payload))
  }
}

export function searchBtnClickedAction(payload) {
  return (dispatch, getState) => {
    let searchType = payload.searchType
    let searchKey = getSearchKeyByType(getState(), searchType)

    switch (searchType) {
      case types.SEARCH_SERVICE:
        payload.pageIndex = 0
        payload.searchKey = searchKey
        dispatch(searchPublishServices(payload))
        break
      case types.SEARCH_HELP:
        return
      default:
        console.log('unknown search type:', searchType)
        return
    }
  }
}

export function searchPublishServices(payload) {
  return (dispatch, getState) => {
    lcSearch.searchPublishServices(payload).then((results) => {

    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }

}