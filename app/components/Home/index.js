/**
 * Created by wanpeng on 2017/2/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions,
  InteractionManager,
  ListView,
  ScrollView,
  Text,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions, Scene, Switch, ActionConst, Modal} from 'react-native-router-flux'

import CommonBanner from '../common/CommonBanner'
import {fetchBanner} from '../../action/configAction'
import {getBanner, getSelectCity} from '../../selector/configSelector'
import {normalizeH, normalizeW} from '../../util/Responsive'
import THEME from '../../constants/theme'
import ImageGroupViewer from '../../components/common/ImageGroupViewer'
import {getLastServices, getLastHelp} from '../../selector/publishSelector'
import {fetchPublishes} from '../../action/publishAction'
import MessageBell from '../common/MessageBell'
import {activeUserId, activeUserInfo, isUserLogined} from '../../selector/authSelector'
import CommonListView from '../common/CommonListView'
import Toast from '../common/Toast'
import {getCurrentLocation} from '../../action/locAction'
import {fetchUserFollowees} from '../../action/authActions'

const PAGE_WIDTH=Dimensions.get('window').width
const PAGE_HEIGHT=Dimensions.get('window').height

const serviceDs = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

const helpDs = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItem: 'service'
    }
  }
  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchBanner({type: 0})
      // this.props.fetchPublishes({isRefresh: true, type: 'service'})
      this.props.fetchPublishes({isRefresh: true, type: 'help'})
      this.props.getCurrentLocation()
      // if(this.props.isLogin)
        // this.props.fetchUserFollowees()
    })
  }

  setService = () => {
    this.setState({
      selectedItem: 'service'
    })
  }

  setHelp = () => {
    this.setState({
      selectedItem: 'help'
    })
  }


  renderService(rowData, rowId) {
    return(
      <TouchableOpacity key={rowId} style={styles.serviceView} onPress={() => Actions.SERVICE_SHOW({publishId: rowData.objectId, userId: rowData.userId})}>
        <Text style={{fontSize: 17, color: '#5A5A5A', marginTop: normalizeH(15)}}>{rowData.title}</Text>
        <View style={{flexDirection: 'row', marginTop: normalizeH(12)}}>
          <Text style={{fontSize: 15, color: '#5A5A5A'}}>{rowData.nickname}</Text>
          <Text style={{marginLeft: normalizeW(24), fontSize: 15, color: '#AAAAAA'}}>{rowData.profession}</Text>
        </View>
        <View style={{justifyContent: 'space-between', marginTop: normalizeH(12), flexDirection: 'row'}}>
          <Text style={{fontSize: 15, color: THEME.colors.yellow}}>¥ {rowData.price}元</Text>
          <Text style={{fontSize: 12, color: '#AAAAAA'}}>111 人看过</Text>
        </View>
        <View style={{marginTop: normalizeH(9), marginBottom: normalizeH(9)}}>
          <ImageGroupViewer containerStyle={{}}
                            images={rowData.imgGroup}
                            showMode="oneLine"/>
        </View>
      </TouchableOpacity>
    )
  }

  onAvatarClick(userId) {
    if(this.props.currentUser == userId) {
      Actions.PROFILE()
    } else {
      Actions.PERSONAL_HOMEPAGE({userId: userId})
    }
  }

  renderHelp(rowData, rowId) {
    return(
      <View key={rowId} style={styles.helpView}>
        <TouchableOpacity onPress={() => {this.onAvatarClick(rowData.userId)}}>
          <Image
            style={{width: 50, height: 50, borderRadius: 25, marginTop: normalizeH(23), marginRight: normalizeW(15)}}
            source={rowData.avatar? {uri: rowData.avatar} : require('../../assets/images/defualt_user40.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1}} onPress={() => Actions.HELP_SHOW({publishId: rowData.objectId, userId: rowData.userId})}>
          <Text style={{fontSize: 17, color: '#5A5A5A', marginTop: normalizeH(20)}}>{rowData.title}</Text>
          <View style={{flexDirection: 'row', marginTop: normalizeH(12)}}>
            <Text style={{fontSize: 15, color: '#5A5A5A'}}>{rowData.nickname}</Text>
            <Text style={{marginLeft: normalizeW(24), fontSize: 15, color: '#AAAAAA'}}>{rowData.profession}</Text>
          </View>
          <View style={{justifyContent: 'space-between', marginBottom: normalizeH(20),marginTop: normalizeH(12), flexDirection: 'row'}}>
            <Text style={{fontSize: 15, color: THEME.colors.yellow}}>¥ {rowData.price}元</Text>
            <Text style={{fontSize: 12, color: '#AAAAAA'}}>111 人看过</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderServiceBar() {
    if (this.state.selectedItem == 'service') {
      return(
        <TouchableOpacity style={[styles.item, {borderBottomColor: THEME.colors.yellow, borderBottomWidth: 3}]} onPress={this.setService}>
          <Text style={[styles.itemText, {color: THEME.colors.yellow}]}>公关服务</Text>
        </TouchableOpacity>
      )
    } else if (this.state.selectedItem == 'help') {
      return(
        <TouchableOpacity style={styles.item} onPress={this.setService}>
          <Text style={styles.itemText}>公关服务</Text>
        </TouchableOpacity>
      )
    }
  }

  renderHelpBar() {
    if (this.state.selectedItem == 'help') {
      return(
        <TouchableOpacity style={[styles.item, {borderBottomColor: THEME.colors.yellow, borderBottomWidth: 3}]} onPress={this.setHelp}>
          <Text style={[styles.itemText, {color: THEME.colors.yellow}]}>公关需求</Text>
        </TouchableOpacity>
      )
    } else if (this.state.selectedItem == 'service') {
      return(
        <TouchableOpacity style={styles.item} onPress={this.setHelp}>
          <Text style={styles.itemText}>公关需求</Text>
        </TouchableOpacity>
      )
    }
  }

  refreshPublish() {
    this.loadMoreData(true)
  }

  loadMoreData(isRefresh) {
    console.log("loadMoreData")
    let lastRefreshAt = undefined
    let currentPublishes = undefined
    switch (this.state.selectedItem) {
      case 'service':
        currentPublishes = this.props.lastService
        break
      case 'help':
        currentPublishes = this.props.lastHelp
        break
      default:
        break
    }

    if(currentPublishes && currentPublishes.length) {
      lastRefreshAt = currentPublishes[currentPublishes.length - 1].lastRefreshAt
    }
    let payload = {
      type: this.state.selectedItem,
      lastRefreshAt: lastRefreshAt,
      isRefresh: !!isRefresh,
      success: (isEmpty) => {
        if(!this.listView) {
          return
        }
        if(isEmpty) {
          this.listView.isLoadUp(false)
        }else {
          this.listView.isLoadUp(true)
        }
      },
      error: (err)=>{
        Toast.show(err.message, {duration: 1000})
      }
    }
    this.props.fetchPublishes(payload)
  }

  renderItemView(rowData, rowId) {
    switch (rowData.itemType) {
      case 'banner':
        return this.renderBanner()
      case 'itemBar':
        return this.renderItemBar()
      default:
        return this.renderItem(rowData, rowId)
    }
  }

  renderBanner() {
    return(
      <View style={styles.advertisementModule}>
        {this.props.banner &&
        <CommonBanner
          banners={this.props.banner}
        />
        }
      </View>
    )
  }

  renderItemBar() {
    return(
      <View style={styles.itemHeader}>
        <View style={{flex: 1, paddingLeft: normalizeW(75)}}>
          {this.renderServiceBar()}
        </View>
        <View style={{flex: 1, paddingRight: normalizeW(75)}}>
          {this.renderHelpBar()}
        </View>
      </View>
    )
  }

  renderItem(rowData, rowId) {
    if(this.state.selectedItem == 'service') {
      return this.renderService(rowData, rowId)
    } else if(this.state.selectedItem == 'help') {
      return this.renderHelp(rowData, rowId)
    }
  }

  selectDataSource() {
    if(this.state.selectedItem == 'service') {
      return this.props.ServiceDataSource
    } else if(this.state.selectedItem == 'help') {
      return this.props.HelpDataSource
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginRight: normalizeW(13)}}
                            onPress={() => Actions.SELECT_CITY()}>
            <Text style={{fontSize: 17, color: THEME.colors.yellow, marginLeft: normalizeW(12)}}>{this.props.city}</Text>
            <Image source={require('../../assets/images/Triangle.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.search} onPress={() => Actions.SEARCH()}>
            <Image source={require('../../assets/images/search.png')}/>
            <Text style={{fontSize: 15, marginLeft: normalizeH(33), color: '#AAAAAA'}}>输入关键词</Text>
          </TouchableOpacity>
          <MessageBell />
        </View>
        <View style={{height: PAGE_HEIGHT - normalizeH(65) - 50}}>
          <CommonListView
            contentContainerStyle={{backgroundColor: '#E5E5E5'}}
            dataSource={this.selectDataSource()}
            renderRow={(rowData, rowId) => this.renderItemView(rowData, rowId)}
            loadNewData={()=> {
              this.refreshPublish()
            }}
            loadMoreData={()=> {
              this.loadMoreData(false)
            }}
            ref={(listView) => this.listView = listView}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const isLogin = isUserLogined(state)
  let currentUser = activeUserId(state)
  let currentUserInfo = activeUserInfo(state)
  let city = getSelectCity(state) || '长沙'
  const banner = getBanner(state, 0)
  let lastService = getLastServices(state)
  let lastHelp = getLastHelp(state)

  let serviceDataArray = []
  let helpDataArray = []
  serviceDataArray.push({itemType: 'banner'})
  serviceDataArray.push({itemType: 'itemBar'})
  serviceDataArray = serviceDataArray.concat(lastService)

  helpDataArray.push({itemType: 'banner'})
  helpDataArray.push({itemType: 'itemBar'})
  helpDataArray = helpDataArray.concat(lastHelp)
  return {
    isLogin: isLogin,
    city: city,
    currentUser: currentUser,
    hasNotice: 1,
    banner: banner,
    ServiceDataSource: serviceDs.cloneWithRows(serviceDataArray),
    lastService: lastService,
    HelpDataSource: helpDs.cloneWithRows(helpDataArray),
    lastHelp: lastHelp,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchBanner,
  fetchPublishes,
  getCurrentLocation,
  fetchUserFollowees
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    ...Platform.select({
      ios: {
        paddingTop: normalizeH(20),
      },
      android: {
        paddingTop: normalizeH(0)
      }
    }),
    flexDirection: 'row',
    height: normalizeH(65),
    width: PAGE_WIDTH,
    alignItems: 'center',

  },
  location: {
    width: normalizeW(78),
    alignItems: 'center',
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    marginRight: normalizeW(41),
    height: normalizeH(30),
    backgroundColor: 'rgba(170,170,170,0.1)',
    borderRadius: 15,
    alignItems: 'center',
    paddingLeft: 10,
  },
  noticeTip: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  itemHeader: {
    width: PAGE_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  item: {
    height: normalizeH(45),
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 17,
    color: '#AAAAAA'
  },
  advertisementModule: {
    height: normalizeH(154),
    backgroundColor: '#fff', //必须加上,否则android机器无法显示banner
  },
  serviceView: {
    width: PAGE_WIDTH,
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  helpView: {
    flexDirection: 'row',
    width: PAGE_WIDTH,
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  }

})