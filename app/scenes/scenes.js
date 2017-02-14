import React, {Component} from 'react'
import {StyleSheet, AsyncStorage} from 'react-native'
import {Actions, Scene, Switch, ActionConst, Modal} from 'react-native-router-flux'

import TabIcon from '../components/common/TabIcon'

import Launch from '../components/Launch'
import Home from '../components/Home'
import Mine from '../components/Mine'
import Login from '../components/Login'
import Regist from '../components/Login/Regist'
import ForgetPassword from '../components/Login/ForgetPassword'
import ResetPassword from '../components/Login/ResetPassword'
import Publish from '../components/Publish'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabBarStyle: {
    backgroundColor: '#FAFAFA',
  },
  tabBarSelectedItemStyle: {
    backgroundColor: 'transparent',
  }
})

export const scenes = Actions.create(
  <Scene key="modal" component={Modal}>
    <Scene key="root" hideNavBar={true}>
      <Scene key="LAUNCH" component={Launch} hideTabBar hideNavBar initial={true}/>
      <Scene key="LOGIN" component={Login} />
      <Scene key="REGIST" component={Regist} />
      <Scene key="FORGETPWD" component={ForgetPassword} />
      <Scene key="RESETPWD" component={ResetPassword} />
      <Scene key="PUBLISH_ENTER" component={Publish} />


      <Scene key="HOME" tabs hideNavBar tabBarStyle={styles.tabBarStyle}>
        <Scene key="HOME_INDEX" title="首页" number={0} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
          <Scene key="PR" component={Home}/>
        </Scene>
        <Scene key="PUBLISH"  number={1} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
        </Scene>

        <Scene key="MINE" title="我的" number={2} icon={TabIcon} hideNavBar onPress={(props) => {tapActions(props)}}>
          <Scene key="MINE_INDEX" component={Mine}/>
        </Scene>
      </Scene>
    </Scene>
  </Scene>
)

function tapActions(props) {
  switch (props.index) {
    case 0: {
      Actions.HOME_INDEX()
      break
    }
    case 1: {
      Actions.PUBLISH_ENTER()
      break
    }
    case 2: {
      Actions.LOGIN()
      break
    }
  }

}


