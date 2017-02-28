/**
 * Created by wanpeng on 2017/2/26.
 */
import {createAction} from 'redux-actions'
import * as types from '../constants/searchActionTypes'
import {getSearchKeyByType} from '../selector/searchSelector'
import * as lcSearch from '../api/leancloud/search'

export function searchBtnClickedAction(payload) {
  console.log("searchBtnClickedAction payload", payload)
  return (dispatch, getState) => {
    lcSearch.searchPublishServices(payload).then((results) => {
      if (payload.success) {
        payload.success()
      }
      payload.searchResult = results
      let searchPublishAction = createAction(types.ON_SEARCH_BTN_CLICKED)
      dispatch(searchPublishAction(payload))
    }).catch((error) => {
      if (payload.error) {
        payload.error(error)
      }
    })
  }
}
