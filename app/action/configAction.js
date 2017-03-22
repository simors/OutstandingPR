/**
 * Created by zachary on 2016/12/15.
 */

import {createAction} from 'redux-actions'
import {Actions} from 'react-native-router-flux'
import * as ConfigActionTypes from '../constants/configActionTypes'
import * as lcConfig from '../api/leancloud/config'

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

export function fetchCitiesInfo(payload) {
  return (dispatch, getState) => {
    lcConfig.getAllCitiesInfo(payload).then((result) => {
      let updateCitiesAction = createAction(ConfigActionTypes.UPDATE_CONFIG_CITIES)
      dispatch(updateCitiesAction({cities: result}))
    }).catch((error) => {
      if(payload.error){
        payload.error(error)
      }
    })
  }
}

