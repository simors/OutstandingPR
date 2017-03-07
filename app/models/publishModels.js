/**
 * Created by wanpeng on 2017/2/17.
 */

import {Record, Map, List} from 'immutable'

export const PublishRecord = Record({
  objectId: undefined, //
  userId: undefined,  // 发布用户id
  avatar: undefined, //用户头像
  nickname: undefined, //用户昵称
  profession: undefined, //职业
  title: undefined, //标题
  content: undefined, //公关内容
  imgGroup: undefined, //组图
  type: undefined, //发布类型
  price: undefined, //标价
  commentCnt: undefined, //评论数
  createdAt: undefined, //发布时间
  updatedAt: undefined, //更新时间
  status: undefined, // 发布信息状态 0 -- 关闭／已解决 ，1 -- 正常
  lastRefreshAt: undefined, //最近刷新时间
}, 'PublishRecord')

export class Publish extends PublishRecord {
  static fromLeancloudObject(lcObj) {
    let attrs = lcObj.attributes
    let publish = new PublishRecord()
    let user = lcObj.get('user')

    publish = publish.withMutations((record) => {
      record.set('objectId', lcObj.id)
      record.set('userId', attrs.user.id)
      record.set('avatar', user.get('avatar'))
      record.set('nickname', user.get('nickname'))
      record.set('profession', user.get('profession'))
      record.set('title', attrs.title)
      record.set('content', attrs.content)
      record.set('imgGroup', attrs.imgGroup)
      record.set('type', attrs.type)
      record.set('price', attrs.price)
      record.set('commentCnt', attrs.commentCnt)
      record.set('status', attrs.status)
      if(lcObj.lastRefreshAt) {
        record.set('lastRefreshAt', attrs.lastRefreshAt)
      } else {
        record.set('lastRefreshAt', lcObj.createdAt.valueOf())
      }
      if(lcObj.createdAt)
        record.set('createdAt', lcObj.createdAt.valueOf())
      if(lcObj.updatedAt)
        record.set('updatedAt', lcObj.updatedAt.valueOf())
    })
    return publish
  }
}


export const PublishCommentRecord = Record({
  content: undefined,   //评论内容
  objectId: undefined,  //评论对象id
  nickname: undefined,  //评论用户昵称
  createdAt: undefined, //评论创建时间
  avatar: undefined,    //评论用户头像
  userId:undefined,     //评论用户id
  geoPoint: undefined,
  position: undefined,
  parentCommentUserId: undefined,     //父评论的作者Id
  parentCommentUserName: undefined,     //父评论的作者昵称
}, 'PublishCommentRecord')

export class PublishComment extends PublishCommentRecord {
  static fromLeancloudObject(lcObj) {
    let attrs = lcObj.attributes
    let publishComment = new PublishCommentRecord()
    let user = lcObj.get('user')
    let publish = lcObj.get('publish')


    let parentUserPoint = undefined
    let parentUserId = undefined
    let parentCommentUserName = undefined

    if(attrs.parentComment) {
      parentUserPoint = attrs.parentComment.attributes.user
      parentUserId = attrs.parentComment.id
      parentCommentUserName = parentUserPoint.get('nickname')
    }

    publishComment = publishComment.withMutations((record) => {
      record.set('objectId', lcObj.id)
      record.set('userId', attrs.user.id)
      record.set('content', attrs.content)
      record.set('nickname', user.get('nickname'))
      record.set('createdAt', lcObj.createdAt.valueOf())
      record.set('avatar', user.get('avatar'))
      if(attrs.parentComment) {
        record.set('parentCommentUserId', parentUserId)
        record.set('parentCommentUserName', parentCommentUserName)

      }
    })
    return publishComment
  }
}

export const PublishState = Record({
  iPublishes: List(),
  lastServices: List(),
  lastHelp: List(),
  publishComments:Map(),
}, 'PublishState')
