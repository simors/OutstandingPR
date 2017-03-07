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
import CommonButton from '../common/CommonButton'
import {normalizeH, normalizeW} from '../../util/Responsive'
import {getIPublushes, getIPublishedServices, getIPublishedHelp} from '../../selector/publishSelector'
import {fetchPublishesByUserId} from '../../action/publishAction'
import {activeUserId} from '../../selector/authSelector'
import THEME from '../../constants/theme'
import {getCreatedDay, getCreateMonth} from '../../util/dateUtils'
import CommonListView from '../common/CommonListView'

const PAGE_WIDTH=Dimensions.get('window').width

const serviceDs = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

const helpDs = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

class Published extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItem: 'service'
    }
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.fetchPublishesByUserId({userId: this.props.currentUser})
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
          dataSource={this.props.iServiceDataSource}
          renderRow={(rowData) => this.renderItem(rowData)}
          enableEmptySections={true}
        />
      )
    } else if (this.state.selectedItem == 'help') {
      return(
        <ListView
          dataSource={this.props.iHelpDataSource}
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

  onClosePublish(status, publishId) {
    if(status) {

    }
  }

  renderItemStatus(status, objectId) {
    return(
      <TouchableOpacity style={styles.close} onPress={() => {this.onClosePublish(status, objectId)}}>
        <Text style={{fontSize: 15, color: '#FFFFFF'}}>{status? '关闭': '已解决'}</Text>
      </TouchableOpacity>

    )
  }

  renderItem(rowData) {
    console.log("renderItem", rowData)
    return(
      <TouchableOpacity style={styles.serviceView} onPress={() => {this.onItemShow(rowData)}}>
          <View style={styles.title}>
          <View style={styles.date}>
            <Image style={{backgroundColor:'transparent', alignItems: 'center', justifyContent: 'flex-end'}}
                   source={require('../../assets/images/date.png')}>
              <Text style={{color: '#FFFFFF', fontSize: 17}}>{getCreatedDay(rowData.createdAt)}</Text>
              <Text style={{color: '#FFFFFF', fontSize: 10}}>{getCreateMonth(rowData.createdAt)}</Text>
            </Image>
          </View>
          <View style={styles.serviceTitle}>
            <Text style={styles.titleText}>{rowData.title}</Text>
            <View style={styles.titleTrip}>
              <Text style={styles.priceText}>¥ {rowData.price}元</Text>
              <Text style={styles.statusText}>显示中</Text>
            </View>
          </View>
        </View>
        <View style={styles.statusTrip}>
          <Text style={[styles.statusTripText, {marginLeft: normalizeW(68)}]}>围观200</Text>
          <Text style={[styles.statusTripText, {flex: 1, marginLeft: normalizeW(79)}]}>留言 {rowData.commentCnt}</Text>
          <Text style={[styles.statusTripText, {marginRight: normalizeW(46)}]}>私信 40</Text>
        </View>
        <View style={styles.button}>
          {this.renderItemStatus(rowData.status, rowData.objectId)}
          <TouchableOpacity style={styles.refresh}>
            <Image
              source={require('../../assets/images/refresh.png')}
            />
            <Text style={{marginLeft: normalizeW(10), fontSize: 15, color: '#FFFFFF'}}>刷新</Text>
          </TouchableOpacity>
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
          title="我的发布"
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

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUser = activeUserId(state)
  const iService = getIPublishedServices(state)
  const iHelp = getIPublishedHelp(state)
  return {
    currentUser: currentUser,
    iServiceDataSource: serviceDs.cloneWithRows(iService),
    iHelpDataSource: helpDs.cloneWithRows(iHelp),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchPublishesByUserId,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Published)

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
  close: {
    marginRight: normalizeW(13),
    width: normalizeW(80),
    height: normalizeH(35),
    backgroundColor: '#FF9D4E',
    justifyContent: 'center',
    alignItems: 'center'
  }


})
