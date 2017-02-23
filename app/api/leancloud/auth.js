import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import {UserInfo, UserDetail, HealthProfileRecord, HealthProfile} from '../../models/userModels'
import ERROR from '../../constants/errorCode'
import * as oPrs from './databaseOprs'
import * as numberUtils from '../../util/numberUtils'

export function become(payload) {
  return AV.User.become(payload.token).then(() => {
    // do nothing
  }, (err) => {
    throw err
  })
}

/**
 * 用户名和密码登录
 * @param payload
 * @returns {IPromise<U>|*|AV.Promise}
 */
export function loginWithPwd(payload) {
  let phone = payload.phone
  let password = payload.password
  return AV.User.logInWithMobilePhone(phone, password).then((loginedUser) => {
    let userInfo = UserInfo.fromLeancloudObject(loginedUser)
    userInfo = userInfo.set('token', loginedUser.getSessionToken())
    console.log("loginWithPwd", userInfo)
    return {
      userInfo: userInfo,
    }
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 用户名和密码注册
 * @param payload
 * @returns {IPromise<U>|*|AV.Promise}
 */
export function register(payload) {
  console.log("register entry")

  let user = new AV.User()
  user.set('type', 'normal')
  user.setUsername(payload.phone)
  user.setPassword(payload.password)
  user.setMobilePhoneNumber(payload.phone)
  return user.signUp().then((loginedUser) => {
    let detail = {
      objName: 'UserDetail',
      args: {}
    }
    oPrs.createObj(detail).then((detail)=> {
      const updatePayload = {
        name: '_User',
        objectId: loginedUser.id,
        setArgs: {
          nickname: numberUtils.hidePhoneNumberDetail(payload.phone),
          mobilePhoneVerified: true,
          detail: detail
        },
        increArgs: {}
      }
      console.log("register updatePayload", updatePayload)

      oPrs.updateObj(updatePayload)
    })
    let userInfo = UserInfo.fromLeancloudObject(loginedUser)
    modifyMobilePhoneVerified({id: loginedUser.id})
    return {
      userInfo: userInfo,
      token: user.getSessionToken()
    }
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function profileSubmit(payload) {

  console.log("profileSubmit:payload=", payload)
  var userInfo = AV.Object.createWithoutData('_User', payload.userId);
  userInfo.set('nickname', payload.nickname)
  userInfo.set('avatar', payload.avatar)
  userInfo.set('birthday', payload.birthday)
  userInfo.set('username', payload.name)
  userInfo.set('city', payload.city)
  userInfo.set('industry', payload.industry)
  userInfo.set('organization', payload.organization)
  userInfo.set('profession', payload.profession)

  return userInfo.save().then((loginedUser)=>{
    let userInfo = UserInfo.fromLeancloudObject(loginedUser)
    return {
      userInfo: userInfo,
    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })

}


export function submitCompleteShopInfo(payload) {
  let shopId = payload.shopId
  let shopCategoryObjectId = payload.shopCategoryObjectId
  let openTime = payload.openTime
  let contactNumber = payload.contactNumber
  let ourSpecial = payload.ourSpecial
  let album = payload.album
  let coverUrl = payload.coverUrl
  let tagIds = payload.tagIds
  let shop = AV.Object.createWithoutData('Shop', shopId)
  let targetShopCategory = null
  if(shopCategoryObjectId) {
    targetShopCategory = AV.Object.createWithoutData('ShopCategory', shopCategoryObjectId)
    shop.set('targetShopCategory', targetShopCategory)
  }

  let containedTag = []
  if(tagIds && tagIds.length) {
    tagIds.forEach((tagId) =>{
      containedTag.push(AV.Object.createWithoutData('ShopTag', tagId))
    })
  }
  shop.set('containedTag', containedTag)
  shop.set('coverUrl', coverUrl)
  shop.set('openTime', openTime)
  shop.set('contactNumber', contactNumber)
  shop.set('ourSpecial', ourSpecial)
  shop.set('album', album)
  // console.log('submitCompleteShopInfo.shop====', shop)
  return shop.save().then(function (result) {
    return true
  }, function (err) {
    console.log('submitCompleteShopInfo.err====', err)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
  
}

export function requestSmsAuthCode(payload) {
  console.log("requestSmsAuthCode payload: ", payload)
    let phone = payload.phone
    return AV.Cloud.requestSmsCode({
      mobilePhoneNumber:phone,
      name: '非凡公关',
      op: '注册',
      ttl: 10}).then(function () {
      // do nothing
    }, function (err) {
      console.log("requestSmsCode errorCode:", err.code)
      err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
      throw err
    })
  }


export function verifySmsCode(payload) {
  let smsAuthCode = payload.smsAuthCode
  let phone = payload.phone
  return AV.Cloud.verifySmsCode(smsAuthCode, phone).then(function (success) {
    //
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function requestResetPwdSmsCode(payload) {
  let phone = payload.phone
  return AV.User.requestPasswordResetBySmsCode(phone).then((success) => {
    // do nothing
  }, (err) => {
    console.log("requestPasswordResetBySmsCode err code:", err.code)
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function resetPwdBySmsCode(payload) {
  let smsAuthCode = payload.smsAuthCode
  let password = payload.password
  return AV.User.resetPasswordBySmsCode(smsAuthCode, password).then((success) => {
    return success
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function modifyMobilePhoneVerified(payload) {
  return AV.Cloud.run('hLifeModifyMobilePhoneVerified', payload).then((result)=>{
    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}


export function verifyInvitationCode(payload) {
  let params = {}
  let invitationsCode = payload.invitationsCode
  if(!invitationsCode) {
    return false
  }
  params.invitationsCode = invitationsCode
  return AV.Cloud.run('hLifeVerifyInvitationCode', params).then((result)=>{
    return true
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getUserById(payload) {
  let params = {}
  let userId = payload.userId
  if (!userId) {
    return false
  }
  params.userId = userId
  return AV.Cloud.run('hLifeGetUserinfoById', params).then((result) => {
    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getUsers(payload) {
  let params = {}
  params.userIds = payload.userIds    // 传入一个数组
  return AV.Cloud.run('hLifeGetUsers', params).then((result) => {
    return result
  }, (err) => {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 查询指定用户的粉丝列表
 * @param payload
 * @returns {*|AV.Promise|IPromise<U>}
 */
export function fetchOtherUserFollowers(payload) {
  let userId = payload.userId
  let user = AV.Object.createWithoutData('_User', userId)
  let query = new AV.Query('_Follower')
  query.equalTo('user', user)
  query.include('follower')
  return query.find().then((results)=>{
    // console.log('fetchOtherUserFollowers==results=', results)
    let followers = []
    results.forEach((result)=>{
      followers.push(UserInfo.fromLeancloudObject(result, 'follower'))
    })
    return {
      userId: userId,
      followers: new List(followers)
    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 查询指定用户的粉丝总数
 * @param payload
 * @returns {*|AV.Promise|IPromise<U>}
 */
export function fetchOtherUserFollowersTotalCount(payload) {
  let userId = payload.userId
  let user = AV.Object.createWithoutData('_User', userId)
  let query = new AV.Query('_Follower')
  query.equalTo('user', user)
  return query.count().then((totalCount)=>{
    // console.log('fetchOtherUserFollowersTotalCount==totalCount=', totalCount)
    return {
      userId: userId,
      followersTotalCount: totalCount
    }
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 查询自己的粉丝总数
 * @returns {*}
 */
export function fetchUserFollowersTotalCount() {
  let query = AV.User.current().followerQuery()
  return query.count().then(function(totalCount) {
    // console.log('fetchUserFollowersTotalCount==totalCount=', totalCount)
    return {
      userId: AV.User.current().id,
      followersTotalCount: totalCount
    }
  }).catch((err) =>{
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 查询自己的粉丝
 * @returns {*}
 */
export function fetchUserFollowers() {
  let query = AV.User.current().followerQuery()
  query.include('follower')
  return query.find().then(function(results) {
    let followers = []
    results.forEach((result)=>{
      followers.push(UserInfo.fromLeancloudObject(result))
    })
    return {
      userId: AV.User.current().id,
      followers: new List(followers)
    }
  }).catch((err) =>{
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

/**
 * 查询自己关注的用户列表
 * @returns {*}
 */
export function fetchUserFollowees() {
  let query = AV.User.current().followeeQuery()
  query.include('followee')
  return query.find().then(function(results) {
    let followees = []
    results.forEach((result)=>{
      followees.push(UserInfo.fromLeancloudObject(result))
    })
    return {
      currentUserId: AV.User.current().id,
      followees: new List(followees)
    }
  }).catch((err) =>{
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}



