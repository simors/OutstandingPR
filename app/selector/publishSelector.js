/**
 * Created by wanpeng on 2017/2/18.
 */

export function getIPublushes(state) {
  return state.PUBLISH.get('iPublishes').toJS()
}
