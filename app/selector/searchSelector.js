/**
 * Created by wanpeng on 2017/2/26.
 */

export function getSearchedServices(state, searchKey) {
  let services = []
  let searchRecord = state.UI.SEARCH.get(searchKey)
  if (searchRecord === undefined) {
    return services
  }
  let searchResult = searchRecord.get('searchResult')
  if(searchResult) {
    searchResult.forEach((record) => {
      if(record.get('type') === 'service')
        services.push(record.toJS())
    })
  }
  return services
}

export function getSearchedHelp(state, searchKey) {
  let help = []
  let searchRecord = state.UI.SEARCH.get(searchKey)
  if (searchRecord === undefined) {
    return help
  }
  let searchResult = searchRecord.get('searchResult')
  if(searchResult) {
    searchResult.forEach((record) => {
      if(record.get('type') === 'help')
        help.push(record.toJS())
    })
  }
  return help
}