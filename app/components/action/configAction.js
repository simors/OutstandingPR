/**
 * Created by zachary on 2016/12/15.
 */

import {createAction} from 'redux-actions'
import {Actions} from 'react-native-router-flux'
import * as ConfigActionTypes from '../../constants/configActionTypes'
import * as lcConfig from '../../api/leancloud/config'

export function fetchBanner(payload) {
  return (dispatch ,getState) => {
    lcConfig.getBanner(payload).then((banner) => {
      let updateBannerAction = createAction(ConfigActionTypes.UPDATE_CONFIG_BANNERS)
      dispatch(updateBannerAction({type: payload.type, banner: banner}))
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

export function fetchAnnouncement(payload) {
  return (dispatch, getState) => {
    lcConfig.getAnnouncement(payload).then((announcement) => {
      let updateAnnouncementAction = createAction(ConfigActionTypes.UPDATE_CONFIG_ANNOUNCEMENT)
      dispatch(updateAnnouncementAction({type: payload.type, announcement: announcement}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}


export function fetchColumn() {
  return (dispatch, getState) => {
    lcConfig.getColumn().then((column) => {
      let updateColumnAction = createAction(ConfigActionTypes.UPDATE_CONFIG_COLUMN)
      dispatch(updateColumnAction({column: column}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function getAllTopicCategories(payload) {
  return (dispatch, getState) => {
    lcConfig.getTopicCategories().then((topicCategories) => {
      let updateTopicsAction = createAction(ConfigActionTypes.UPDATE_CONFIG_TOPIC_CATEGORIES)
      dispatch(updateTopicsAction({topicCategories: topicCategories}))
    }).catch((error) => {
      if(payload.error) {
        payload.error(error)
      }
    })
  }
}

export function fetchShopCategories(payload) {
  return (dispatch, getState) => {
    lcConfig.getShopCategories(payload).then((shopCategories) => {
      let updateAction = createAction(ConfigActionTypes.UPDATE_CONFIG_SHOP_CATEGORIES)
      dispatch(updateAction({shopCategories: shopCategories}))
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}
