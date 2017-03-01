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

export function publishHelp(payload) {
  let Publishes = AV.Object.extend('Publishes')
  let publish = new Publishes()

  var user = AV.Object.createWithoutData('_User', payload.userId)

  publish.set('user', user)
  publish.set('imgGroup', payload.imgGroup)
  publish.set('title', payload.title)
  publish.set('content', payload.content)
  publish.set('price', payload.price)
  publish.set('type', 'help')

  return publish.save().then(function (result) {
    let newPublish = result
    newPublish.attributes.user = AV.User.current()
    return Publish.fromLeancloudObject(newPublish)
  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })

}

export function updateService(payload) {
  console.log("updateService")
  var publish = AV.Object.createWithoutData('Publishes', payload.publishId)

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

export function getPublishedByUserId(payload) {
  console.log("getServicesByUserId payload", payload)
  let userId = payload.userId
  var userInfo = AV.Object.createWithoutData('_User', userId)
  var publish = new AV.Query('Publishes')

  publish.equalTo('user', userInfo)
  publish.descending('createdAt')

  return publish.find().then(function (results) {
    let publishes = []
    if (results) {
      results.forEach((record) => {
        publishes.push(Publish.fromLeancloudObject(record))
      })
    }
    return new List(publishes)
  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })

}

export function fetchLastPublishes(payload) {
  console.log("fetchLastPublishes payload", payload)

  let query = new AV.Query('Publishes')
  query.equalTo('type', payload.type)
  query.limit(10)
  query.descending('createdAt')

  return query.find().then(function (results) {
    let publishes = []
    if(results) {
      results.forEach((record) => {
        publishes.push(Publish.fromLeancloudObject(record))
      })
      return new List(publishes)
    }
  }, function (error) {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}
