import {Map, List} from 'immutable'
import {REHYDRATE} from 'redux-persist/constants'
import * as ConfigActionTypes from '../constants/configActionTypes'
import {Config, LocationRecord} from '../models/ConfigModels'

const initialState = Config()

export default function configReducer(state = initialState, action) {
  switch (action.type) {
    case ConfigActionTypes.UPDATE_CONFIG_BANNERS:
      return handleUpdateConfigBanners(state, action)
    case ConfigActionTypes.UPDATE_GEO_LOCATION:
      return handleUpdateGeolocation(state, action)
    case ConfigActionTypes.UPDATE_CONFIG_CITIES:
      return handleUpdateCities(state, action)
    case REHYDRATE:
      return onRehydrate(state, action)
    default:
      return state
  }
}

function handleUpdateConfigBanners(state, action) {
  let payload = action.payload
  let type = payload.type
  let _map = state.get('banners')
  _map = _map.set(type, payload.banner)
  state = state.set('banners',  _map)
  return state
}

function handleUpdateGeolocation(state, action) {
  let position = action.payload.position
  let location = new LocationRecord({
    latitude: position.latitude,
    longitude: position.longitude,
    address: position.address,
    country: position.country,
    province: position.province,
    city: position.city,
    district: position.district,
    street: position.street,
    streetNumber: position.streetNumber,
  })
  state = state.set('location', location)
  return state
}

function handleUpdateCities(state, action) {
  let cities = action.payload.cities
  state = state.set('cities', cities)
  return state
}

function onRehydrate(state, action) {
  var incoming = action.payload.CONFIG
  if (!incoming) return state

  let position = incoming.location
  if (position) {
    let location = new LocationRecord({
      latitude: position.latitude,
      longitude: position.longitude,
      address: position.address,
      country: position.country,
      province: position.province,
      city: position.city,
      district: position.district,
      street: position.street,
      streetNumber: position.streetNumber,
    })
    state = state.set('location', location)
  }

  return state
}