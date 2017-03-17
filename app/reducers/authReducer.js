/**
 * Created by zachary on 2016/12/9.
 */

import * as AuthTypes from '../constants/authActionTypes'
import {REHYDRATE} from 'redux-persist/constants'
import {Map, List} from 'immutable'
import {UserState, UserInfo, HealthProfile} from '../models/userModels'


const initialState = new UserState()

export default function authReducer(state = initialState, action) {
  switch(action.type) {
    case AuthTypes.REGISTER_SUCCESS:
      return handleRegisterSuccess(state, action)
    case AuthTypes.LOGIN_SUCCESS:
      return handleLoginSuccess(state, action)
    case AuthTypes.LOGIN_OUT:
      return handleUserLogout(state, action)
    case AuthTypes.SHOP_CERTIFICATION_SUCCESS:
      return handleShopCertificationSuccess(state, action)
    case AuthTypes.PROFILE_SUBMIT_SUCCESS:
      return handleProfileSubmitSuccess(state, action)
    case AuthTypes.ADD_USER_PROFILE:
      return handleAddUserProfile(state, action)
    case AuthTypes.FETCH_USER_FOLLOWEES_SUCCESS:
      return handleFetchUserFolloweesSuccess(state, action)
    case AuthTypes.ADD_HEALTH_PROFILE:
      return handleAddHealthProfile(state, action)
    case AuthTypes.ADD_USER_FOLLOWEE_SUCCESS:
      return handleAddUserFollowee(state, action)
    case AuthTypes.DEL_USER_FOLLOWEE_SUCCESS:
      return handleDelUserFollowee(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleRegisterSuccess(state, action) {
  let userInfo = action.payload.userInfo
  state = state.set('activeUser', userInfo.id)
  state = state.set('token', userInfo.token)
  state = state.setIn(['profiles', userInfo.id], userInfo)
  return state
}

function handleLoginSuccess(state, action) {
  const userInfo = action.payload.userInfo
  state = state.set('activeUser', userInfo.get('id'))
  state = state.set('token', userInfo.get('token'))
  state = state.setIn(['profiles', userInfo.id], userInfo)
  return state
}

function handleUserLogout(state, action) {
  let activeUser = state.get('activeUser')
  state = state.set('activeUser', undefined)
  state = state.set('token', undefined)
  state = state.deleteIn(['profiles', activeUser])
  return state
}

function handleShopCertificationSuccess(state, action) {
  let payload = action.payload
  let shop = payload.shop
  state = state.set('shop',  shop)
  return state
}

function handleProfileSubmitSuccess(state, action) {
  let userInfo = action.payload.userInfo

  state = state.setIn(['profiles', userInfo.id], userInfo)
  return state
}

function handleAddUserProfile(state, action) {
  let userInfo = action.payload.userInfo
  state = state.setIn(['profiles', userInfo.id], userInfo)
  return state
}

function handleFetchUserFolloweesSuccess(state, action) {
  let followees = action.payload.followees
  state = state.set('followees', followees)
  return state
}

function handleAddUserFollowee(state, action) {
  let userId = action.payload.userId
  let userInfo = action.payload.userInfo
  let followeesMap = state.get('followees')
  if(followeesMap && !followeesMap.has(userId)) {
    state = state.setIn(['followees', userId], userInfo)
  }
  return state
}

function handleDelUserFollowee(state, action) {
  let userId = action.payload.userId
  let followeesMap = state.get('followees')
  if(followeesMap && followeesMap.has(userId)) {
    followeesMap = followeesMap.delete(userId)
    state = state.set('followees', followeesMap)
  }
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.AUTH
  console.log("onRehydrate incoming", incoming)
  if (incoming) {
    if (!incoming.activeUser) {
      return state
    }
    state = state.set('activeUser', incoming.activeUser)
    state = state.set('token', incoming.token)

    const profiles = Map(incoming.profiles)
    try {
      for (let [userId, profile] of profiles) {
        if (userId && profile) {
          const userInfo = new UserInfo({...profile})
          state = state.setIn(['profiles', userId], userInfo)
        }
      }
    } catch (e) {
      profiles.clear()
    }

    const healthProfiles = Map(incoming.healthProfiles)
    try {
      for (let [userId, profile] of healthProfiles) {
        if (userId && profile) {
          const healthProfile = new HealthProfile({...profile})
          state = state.setIn(['healthProfiles', userId], healthProfile)
        }
      }
    } catch (e) {
      healthProfiles.clear()
    }

    // const followeesMap = Map(incoming.followees)
    // try {
    //   for (let [userId, userInfo] of followeesMap) {
    //     if (userId && userInfo) {
    //       const userInfoRecord = new UserInfo({...userInfo})
    //       state = state.setIn(['followees', userId], userInfoRecord)
    //     }
    //   }
    // } catch (e) {
    //   followeesMap.clear()
    // }

  }
  return state
}