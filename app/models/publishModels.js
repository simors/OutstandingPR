/**
 * Created by wanpeng on 2017/2/17.
 */

import {Record, Map, List} from 'immutable'

export const PublishRecord = Record({
  objectId: undefined, //
  userId: undefined,  // 发布用户id
  title: undefined, //标题
  content: undefined, //公关内容
  imgGroup: undefined, //组图
  type: undefined, //发布类型
  price: undefined, //标价
  createAt: undefined, //发布时间
}, 'PublishRecord')

export class Publish extends PublishRecord {
  static fromLeancloudObject(lcObj) {
    let attrs = lcObj.attributes
    let publish = new PublishRecord()

    publish = publish.withMutations((record) => {
      record.set('objectId', lcObj.id)
      record.set('userId', attrs.user.id)
      record.set('title', attrs.title)
      record.set('content', attrs.content)
      record.set('imgGroup', attrs.imgGroup)
      record.set('type', attrs.type)
      record.set('price', attrs.price)
      record.set('createAt', lcObj.createdAt.valueOf())
    })
    return publish
  }
}

export const PublishState = Record({
  iPublishes: List(),
}, 'PublishState')
