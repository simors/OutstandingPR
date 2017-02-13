import {Map, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import {Config} from '../models/ConfigModels'

const initialState = Config()

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function initConfig(payload) {
  let record = Config()
  if(payload) {
    record = record.withMutations((config) => {
      if(payload.banners) {
        config.set('banners', initBanners(payload.banners))
      }
      if(payload.columns) {
        config.set('columns', initColumns(payload.columns))
      }
    })
  }
  return record
}

function initBanners(banners) {
  let bannerMap = new Map()
  if(banners) {
    for(let type in banners) {
      bannerMap = bannerMap.set(type, initBanner(banners[type]))
    }
  }
  return bannerMap
}

function initBanner(banner) {
  let bannerItems = []
  banner.map((bannerItem) => {
    bannerItems.push(new BannerItemConfig(bannerItem))
  })
  return new List(bannerItems)
}





function initColumns(columns) {
  let columnMap = new Map()
  if(columns) {
    for(let type in columns) {
      columnMap = columnMap.set(type, initColumn(columns[type]))
    }
  }
  return columnMap
}

function initColumn(column) {
  let columnItems = []
  column.map((columnItem) => {
    columnItems.push(new ColumnItemConfig(columnItem))
  })
  return new List(columnItems)
}



function onRehydrate(state, action) {
  var incoming = action.payload.CONFIG
  if (!incoming) return state

  return state
}