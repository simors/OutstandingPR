/**
 * Created by zachary on 2016/12/15.
 */
import AV from 'leancloud-storage'
import {Map, List, Record} from 'immutable'
import {
  BannerItem,
} from '../../models/ConfigModels'
import ERROR from '../../constants/errorCode'

export function getBanner(payload) {
  let type = payload.type
  let query = new AV.Query('Banners')
  query.equalTo('type', type)
  if (typeof payload.geo === 'object') {
    let point = new AV.GeoPoint(payload.geo);
    query.withinKilometers('geo', point, 10);
  }
  return query.find().then(function (results) {
    let banner = []
    results.forEach((result) => {
      banner.push(BannerItem.fromLeancloudObject(result))
    })
    return new List(banner)
  }, function (err) {
    err.message = ERROR[err.code] ? ERROR[err.code] : ERROR[9999]
    throw err
  })
}

export function getAllCitiesInfo(payload) {
  return AV.Cloud.run('prGetAllCityMap', payload).then((result) => {
    return  result
  }).catch((error) => {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function getAreaInfo(payload) {
  return AV.Cloud.run('prGetProviceList', payload).then((result) => {
    let areaInfo = []
    let provinceArray = result
    if(provinceArray && provinceArray.length > 1) {
      provinceArray.forEach((province) => {
        let pData = {}
        let pName = province.area_name
        pData[pName] = []
        AV.Cloud.run('prGetSubAreaList', {areaCode: province.area_code}).then((result) => {
          let cityArray = result
          if(cityArray && cityArray.length > 0) {
            cityArray.forEach((city) => {
              let cData = {}
              let cName = city.area_name
              cData[cName] = []
              AV.Cloud.run('prGetSubAreaList', {areaCode: city.area_code}).then((result) => {
                let areaArray = result
                if(areaArray && areaArray.length > 0) {
                  areaArray.forEach((area) => {
                    cData[cName].push(area.area_name)
                  })
                }
              }).catch((error) => {
                error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
                throw error
              })
              pData[pName].push(cData)
            })
          }
        }).catch((error) => {
          error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
          throw error
        })
        areaInfo.push(pData)
      })
    }
    return areaInfo
  }).catch((error) => {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function getProviceList(payload) {
  return AV.Cloud.run('prGetProviceList', payload).then((result) => {
    return result
  }).catch((error) => {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}

export function getSubAreaList(payload) {
  return AV.Cloud.run('prGetSubAreaList', payload).then((result) => {
    return result
  }).catch((error) => {
    error.message = ERROR[error.code] ? ERROR[error.code] : ERROR[9999]
    throw error
  })
}






