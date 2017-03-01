/**
 * Created by wanpeng on 2017/1/17.
 */

/**
 * 出生年-月-日获取年龄
 *
 * @param dateString
 * @returns {number}
 */
export function getAgeFromBirthday(dateString) {
  let today = new Date()
  let birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  let m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age --
  }
  return age
}

export function getCreatedDay(time) {
  let date = new Date(time)
  let monthDate = date.getDate()

  return monthDate
}

export function getCreateMonth(time) {
  let date = new Date(time)
  let month = date.getMonth()
  let monthZH = undefined

  switch (month) {
    case 1:
      monthZH = '二月'
      break
    case 2:
      monthZH = '三月'
      break
    case 3:
      monthZH = '四月'
      break
    case 4:
      monthZH = '五月'
      break
    case 5:
      monthZH = '六月'
      break
    case 6:
      monthZH = '七月'
      break
    case 7:
      monthZH = '八月'
      break
    case 8:
      monthZH = '九月'
      break
    case 9:
      monthZH = '十月'
      break
    case 10:
      monthZH = '十一月'
      break
    case 11:
      monthZH = '十二月'
      break
    case 12:
      monthZH = '一月'
      break
    default:
      break
  }

  return monthZH
}