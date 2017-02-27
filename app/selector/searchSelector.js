/**
 * Created by wanpeng on 2017/2/26.
 */

export function getSearchKeyByType(state, type) {
  let searchRecord = state.UI.SEARCH.get(type)

  if (searchRecord === undefined) {
    return ''
  }

  let searchKey = searchRecord.get('searchKey')
  if (searchKey === undefined)
    searchKey = ''
  return searchKey
}
