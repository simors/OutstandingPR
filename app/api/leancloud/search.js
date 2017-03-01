/**
 * Created by wanpeng on 2017/2/27.
 */
import AV from 'leancloud-storage'
import ERROR from '../../constants/errorCode'
import {Publish} from '../../models/publishModels'
import {List} from 'immutable'

export function searchPublishServices(payload) {
  console.log("searchPublishServices payload", payload)

  let query = new AV.SearchQuery('Publishes')
  query.queryString(payload.searchKey)
  query.include('user')
  return query.find().then(function (results) {
    let services = []
    if(results) {
      results.forEach((record) => {
        services.push(Publish.fromLeancloudObject(record))
      })
    }
    return new List(services)
  }).catch((error) => {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}
