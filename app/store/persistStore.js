import {AsyncStorage} from 'react-native'
import {persistStore} from 'redux-persist'
import configureStore from '../store/configureStore'
import * as authSelectors from '../selector/authSelector'
import {become} from '../api/leancloud/auth'
import {initMessageClient} from '../action/messageAction'
import {fetchUserFollowees} from '../action/authActions'
import * as AuthTypes from '../constants/authActionTypes'
import {createAction} from 'redux-actions'




export default function persist(store) {
  return persistStore(store, {
    storage: AsyncStorage,
    whitelist: ['AUTH', 'CONFIG', 'PUBLISH'],
  }, () => {
    store.dispatch(restoreFromPersistence())
  })
}

export function restoreFromPersistence() {
  return (dispatch, getState) => {
    if (authSelectors.isUserLogined(getState())) {
      dispatch(verifyToken())
    } else {
      // Actions.LOGIN()
      try {
      } catch (e) {
        console.log("restoreFromPersistence error is", e)
      }
    }
  }
}

function verifyToken() {
  return (dispatch, getState) => {
    let payload = {
      ...authSelectors.activeUserAndToken(getState())
    }

    become(payload).then((user) => {
      let loginAction = createAction(AuthTypes.LOGIN_SUCCESS)
      dispatch(loginAction({...user}))
      dispatch(fetchUserFollowees())
      return dispatch(initMessageClient())
    }).then(() => {
      // Actions.HOME()
    }).catch((error) => {
      console.log('verify token error:', error)
    })
  }
}

export const store = configureStore()
export const persistor = persist(store)

