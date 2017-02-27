/**
 * Created by wanpeng on 2017/2/27.
 */
import AV from 'leancloud-storage'
import ERROR from '../../constants/errorCode'


export function searchPublishServices(payload) {
  console.log("searchPublishServices", payload)
  let query = new AV.SearchQuery('Publishes')
  query.queryString('*')
  return query.find().then(function (results) {
    console.log("Find " + query.hits() + " records.")
  }).catch((error) => {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}
