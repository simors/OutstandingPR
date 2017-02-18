/**
 * Created by wanpeng on 2017/2/17.
 */
import AV from 'leancloud-storage'
import {List} from 'immutable'
import ERROR from '../../constants/errorCode'
import {Publish} from '../../models/publishModels'

export function publishService(payload) {
  let Publishes = AV.Object.extend('Publishes')
  let publish = new Publishes()

  var user = AV.Object.createWithoutData('_User', payload.userId)

  publish.set('user', user)
  publish.set('imgGroup', payload.imgGroup)
  publish.set('title', payload.title)
  publish.set('content', payload.content)
  publish.set('price', payload.price)
  publish.set('type', 'service')

  return publish.save().then(function (result) {
    let newPublish = result
    newPublish.attributes.user = AV.User.current()
    return Publish.fromLeancloudObject(newPublish)
  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })

}
