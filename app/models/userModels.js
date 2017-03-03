import {Record, Map, List} from 'immutable'

export const UserInfoRecord = Record({
  id: undefined, //用户ID
  phone: undefined, //手机号码
  token: undefined, //
  avatar: undefined, //头像
  nickname: undefined, //昵称
  birthday: undefined, //出身年月日
  city: undefined, //所在城市
  industry: undefined, //所在行业
  name: undefined, //真实姓名
  organization: undefined, // 任职机构
  profession: undefined, // 职业
}, 'UserInfoRecord')

export const UserStateRecord = Record({
  activeUser: undefined,      // 已登录用户ID
  profiles: Map(),            // 用户个人信息列表，已用户id作为健值
  token: undefined,
  followees: Map(),
  followers: Map(),
  followersTotalCount: Map(),
  favoriteArticles: Map(),
}, 'UserStateRecord')

export class UserInfo extends UserInfoRecord {
  static fromLeancloudObject(lcObj, type) {
    let attrs = lcObj.attributes
    if(type) {
      lcObj = attrs[type]
      attrs = attrs[type].attributes
    }

    let info = new UserInfoRecord()
    info = info.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('avatar',lcObj.attributes.avatar)
      record.set('phone', attrs.mobilePhoneNumber)
      record.set('nickname', attrs.nickname)
      record.set('birthday', attrs.birthday)
      record.set('city', attrs.city)
      record.set('industry', attrs.industry)
      record.set('name', attrs.username)
      record.set('organization', attrs.organization)
      record.set('profession', attrs.profession)
    })
    return info
  }

  static fromLeancloudApi(lcObj) {
    let info = new UserInfoRecord()
    info = info.withMutations((record) => {
      record.set('id', lcObj.id)
      record.set('avatar',lcObj.avatar)
      record.set('phone', lcObj.phone)
      record.set('nickname', lcObj.nickname)
      record.set('birthday', lcObj.birthday)
      record.set('industry', lcObj.industry)
      record.set('name', lcObj.name)
      record.set('organization', lcObj.organization)
      record.set('profession', lcObj.profession)
      record.set('city', lcObj.city)
    })
    return info
  }



}

export class UserState extends UserStateRecord {
  getUserInfoById(userId) {
    const userInfo = this.profiles.get(userId)
    return userInfo ? userInfo : new UserInfo()
  }
}