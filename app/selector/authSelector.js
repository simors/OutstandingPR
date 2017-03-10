/**
 * Created by yangyang on 2016/12/20.
 */
import {Map} from 'immutable'
import {UserInfo} from '../models/userModels'

export function activeUserId(state) {
  return state.AUTH.activeUser
}

export function activeUserAndToken(state) {
  return {
    token: state.AUTH ? state.AUTH.token : undefined,
    activeUser: state.AUTH ? state.AUTH.activeUser : undefined,
  }
}

export function isUserLogined(state) {
  let activeUser = activeUserAndToken(state).activeUser
  return activeUser ? true : false
}

export function userInfoById(state, userId) {
  return state.AUTH ? state.AUTH.getUserInfoById(userId) : new UserInfo()
}

export function userInfoByIds(state, userIds) {
  let users = []
  userIds.forEach((id) => {
    users.push(userInfoById(state, id).toJS())
  })
  return users
}

export function activeUserInfo(state) {
  let activeUser = activeUserId(state)
  return activeUser ? state.AUTH.getUserInfoById(activeUser) : new UserInfo()
}

export function isUserFollowed(state, userId) {
  let followeesMap = state.AUTH.get('followees')
  return followeesMap? followeesMap.has(userId): false
}

export function getFollowees(state) {
  let followees = []
  let followeesMap = state.AUTH.get('followees')
  if(followeesMap){
    followeesMap.forEach((result) => {
      followees.push(result.toJS())
    })
  }
  return followees
}
