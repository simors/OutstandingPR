/**
 * Created by wanpeng on 2017/2/16.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Platform,
  TouchableOpacity,
  InteractionManager,
  ListView,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {normalizeH, normalizeW} from '../../util/Responsive'
import {getIPublishedServices, getIPublishedHelp, getFavoritePublishes} from '../../selector/publishSelector'
import {activeUserId} from '../../selector/authSelector'
import THEME from '../../constants/theme'
import {getCreatedDay, getCreateMonth} from '../../util/dateUtils'
import Popup from 'react-native-popup'

const PAGE_WIDTH=Dimensions.get('window').width


const serviceDs = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

const helpDs = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

class Collection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItem: 'service'
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
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

  renderItemView() {
    if (this.state.selectedItem == 'service') {
      return(
        <ListView
          dataSource={this.props.favoriteServiceDs}
          renderRow={(rowData) => this.renderItem(rowData)}
          enableEmptySections={true}
        />
      )
    } else if (this.state.selectedItem == 'help') {
      return(
        <ListView
          dataSource={this.props.favoriteHelpDs}
          renderRow={(rowData) => this.renderItem(rowData)}
          enableEmptySections={true}
        />
      )
    }

  }

  onItemShow(rowData) {
    console.log("onItemShow rowData", rowData)
    if(this.state.selectedItem == 'service') {
      Actions.SERVICE_SHOW({publishId: rowData.objectId, userId: rowData.userId})
    } else if(this.state.selectedItem == 'help') {
      Actions.HELP_SHOW({publishId: rowData.objectId, userId: rowData.userId})
    }
  }

  submitSuccessCallback(userInfos) {
    Toast.show('成功关闭!')
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  onRefreshPublish(publishId, lastRefreshAt) {
    let nowTime = new Date()
    if((nowTime - lastRefreshAt) >= 5*60*1000) {
      this.props.updatePublishRefreshTime({
        publishId: publishId,
        refreshTime: nowTime,
      })
    }
  }

  getRefreshButtonStyle(lastRefreshAt) {
    let nowTime = new Date()
    if((nowTime - lastRefreshAt) >= 5*60*1000) {
      return styles.refresh
    }
    return styles.unRefresh
  }

  renderRefresh(publishId, lastRefreshAt) {
    return(
      <TouchableOpacity style={this.getRefreshButtonStyle(lastRefreshAt)} onPress={() => {this.onRefreshPublish(publishId, lastRefreshAt)}}>
        <Image
          source={require('../../assets/images/refresh.png')}
        />
        <Text style={{marginLeft: normalizeW(10), fontSize: 15, color: '#FFFFFF'}}>刷新</Text>
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

  renderItem(rowData) {
    return(
      <TouchableOpacity style={styles.serviceView} onPress={() => {this.onItemShow(rowData)}}>
        <View style={styles.title}>
          <TouchableOpacity onPress={() => {this.onAvatarClick(rowData.userId)}}>
            <Image
              style={{width: 50, height: 50, borderRadius: 25, marginLeft: normalizeW(10), marginRight: normalizeW(8)}}
              source={rowData.avatar? {uri: rowData.avatar} : require('../../assets/images/defualt_user40.png')}
            />
          </TouchableOpacity>
          <View style={styles.serviceTitle}>
            <Text style={styles.titleText}>{rowData.title}</Text>
            <View style={styles.titleTrip}>
              <Text style={styles.priceText}>¥ {rowData.price}元</Text>
            </View>
          </View>
        </View>
        <View style={styles.statusTrip}>
          <Text style={[styles.statusTripText, {marginLeft: normalizeW(68)}]}>围观200</Text>
          <Text style={[styles.statusTripText, {flex: 1, marginLeft: normalizeW(79)}]}>留言 {rowData.commentCnt}</Text>
          <Text style={[styles.statusTripText, {marginRight: normalizeW(46)}]}>私信 40</Text>
        </View>
        <View style={styles.button}>
          {this.renderRefresh(rowData.objectId, rowData.lastRefreshAt)}
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="我的收藏"
        />
        <View style={styles.body}>
          <View style={styles.itemHeader}>
            <View style={{flex: 1, paddingLeft: normalizeW(75)}}>
              {this.renderServiceBar()}
            </View>
            <View style={{flex: 1, paddingRight: normalizeW(75)}}>
              {this.renderHelpBar()}
            </View>
          </View>
          {this.renderItemView()}
          <Popup ref={popup => this.popup = popup}/>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let favoriteService = getFavoritePublishes(state, 'service')
  let favoriteHelp = getFavoritePublishes(state, 'help')
  let currentUser = activeUserId(state)

  return {
    currentUser: currentUser,
    favoriteServiceDs: serviceDs.cloneWithRows(favoriteService),
    favoriteHelpDs: helpDs.cloneWithRows(favoriteHelp)
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Collection)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
    backgroundColor: '#F5F5F5'
  },
  itemHeader: {
    width: PAGE_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  item: {
    height: normalizeH(43),
    width: normalizeW(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 15,
    color: '#AAAAAA'
  },
  serviceView: {
    marginBottom: normalizeH(10),
    width: PAGE_WIDTH,
    backgroundColor: '#FFFFFF',
  },
  title: {
    flexDirection: 'row',
    marginTop: normalizeH(20),
  },
  serviceTitle: {
    flex: 1,
    // height: normalizeH(72),
    borderBottomWidth: 3,
    borderBottomColor: '#F5F5F5',
  },
  titleTrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: normalizeH(10),
    marginBottom: normalizeH(8),
  },
  titleText: {
    fontSize: 17,
  },
  priceText: {
    fontSize: 15,
    color: THEME.colors.yellow,
  },
  statusText: {
    marginRight: normalizeH(46),
    fontSize: 12,
    color: '#00BE96'
  },
  date: {
    width: normalizeW(68),
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    // height: normalizeH(),
    justifyContent: 'flex-end',
    marginBottom: normalizeH(15)
  },
  statusTrip: {
    flexDirection: 'row',
    paddingBottom: normalizeH(20),
    paddingTop: normalizeH(3),
  },
  statusTripText: {
    fontSize: 12,
    color: '#AAAAAA',
  },
  refresh: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: normalizeW(80),
    height: normalizeH(35),
    marginRight: normalizeW(25),
    backgroundColor: '#F56A23'
  },
  unRefresh: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: normalizeW(80),
    height: normalizeH(35),
    marginRight: normalizeW(25),
    backgroundColor: '#AAAAAA'
  },
  close: {
    marginRight: normalizeW(13),
    width: normalizeW(80),
    height: normalizeH(35),
    backgroundColor: '#FF9D4E',
    justifyContent: 'center',
    alignItems: 'center'
  },
  closed: {
    marginRight: normalizeW(13),
    width: normalizeW(80),
    height: normalizeH(35),
    backgroundColor: '#AAAAAA',
    justifyContent: 'center',
    alignItems: 'center'
  },


})
