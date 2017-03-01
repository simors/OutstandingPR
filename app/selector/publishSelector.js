/**
 * Created by wanpeng on 2017/2/18.
 */

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

