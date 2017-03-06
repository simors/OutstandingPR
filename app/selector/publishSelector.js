/**
 * Created by wanpeng on 2017/2/18.
 */
import {Publish} from '../models/publishModels'

export function getIPublushes(state) {
  return state.PUBLISH.get('iPublishes').toJS()
}

export function getIPublishedServices(state) {
  let service = []
  let publishList = state.PUBLISH.get('iPublishes')
  if(publishList) {
    publishList.forEach((value) => {
      if(value.type == 'service')
        service.push(value)
    })
  }
  return service
}

export function getIPublishedHelp(state) {
  let help = []
  let publishList = state.PUBLISH.get('iPublishes')
  if(publishList) {
    publishList.forEach((value) => {
      if(value.type == 'help')
        help.push(value)
    })
  }
  return help
}

export function getLastServices(state) {
  let service = []
  let publishList = state.PUBLISH.get('lastServices')
  if(publishList) {
    publishList.forEach((value) => {
      service.push(value)
    })
  }
  return service
}

export function getLastHelp(state) {
  let help = []
  let publishList = state.PUBLISH.get('lastHelp')
  if(publishList) {
    publishList.forEach((value) => {
      help.push(value)
    })
  }
  return help
}

export function getPublishComments(state, publishId) {
  let publishCommentMap = state.PUBLISH.get('publishComments')
  if(publishCommentMap) {
    let publishCommentList = publishCommentMap.get(publishId)
    if(publishCommentList)
      return publishCommentList.toJS()
  }
  return []
}

export function getPublishById(state, publishId) {
  let serviceList = state.PUBLISH.get('lastServices')
  if(serviceList) {
    let service = serviceList.find((record) => {
      if(record.get('objectId') === publishId)
        return true
      return false
    })
    if(service)
      return service.toJS()
    return new Publish().toJS()
  }

  let helpList = state.PUBLISH.get('lastHelp')
  if(helpList) {
    let help = helpList.find((record) => {
      if(record.get('objectId') === publishId)
        return true
      return false
    })
    if(help)
      return help.toJS()
    return new Publish().toJS()
  }


}
