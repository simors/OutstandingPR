/**
 * Created by wanpeng on 2017/2/13.
 */
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  AppState,
} from 'react-native';
import {Provider, connect} from 'react-redux'
import {Router} from 'react-native-router-flux'
import {store} from './app/store/persistStore'
import {scenes} from './app/scenes/scenes'
import AV from 'leancloud-storage'
import * as LC_CONFIG from './app/constants/appConfig'
import Raven from 'raven-js'
require('raven-js/plugins/react-native')(Raven)
import {handleAppStateChange} from './app/util/AppStateUtils'
import * as AVUtils from './app/util/AVUtils'

const RouterWithRedux = connect()(Router)

const KM_Dev = {
  appId: LC_CONFIG.LC_DEV_APP_ID,
  appKey: LC_CONFIG.LC_DEV_APP_KEY,
}

const KM_PRO = {
  appId: LC_CONFIG.LC_PRO_APP_ID,
  appKey: LC_CONFIG.LC_PRO_APP_KEY,
}

//AV.setProduction(false)
AV.init(
  __DEV__ ? KM_Dev : KM_PRO
)

Raven.config('https://500e7d8d1d9a4fd2a2407d4c1edd4b69@sentry.io/150128', { release: 'version_01' }).install();

export default class PREntry extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.disableYellowBox = true

    AppState.addEventListener('change', handleAppStateChange);
    // 通知初始化
    AVUtils.configurePush(
      __DEV__ ? KM_Dev : KM_PRO
    )
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', handleAppStateChange);
  }

  render() {
    return (
      <Provider store={store}>
        <View style={{flex: 1}}>
          <RouterWithRedux scenes={scenes} store={store} sceneStyle={getSceneStyle}/>
        </View>
      </Provider>
    )
  }
}

const getSceneStyle = (props, computedProps) => {
  const style = {
    flex: 1,
    backgroundColor: 'white',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
  }
  if (computedProps.isActive) {
    style.marginTop = computedProps.hideNavBar ? 0 : 64
    style.marginBottom = computedProps.hideTabBar ? 0 : 50
  }
  return style
}
