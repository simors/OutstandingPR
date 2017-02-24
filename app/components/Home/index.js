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
import {getBanner} from '../../selector/configSelector'
import {normalizeH, normalizeW} from '../../util/Responsive'
import THEME from '../../constants/theme'
import ImageGroupViewer from '../../components/common/ImageGroupViewer'

const PAGE_WIDTH=Dimensions.get('window').width

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

  renderTip() {
    if (this.props.hasNotice) {
      return <View style={styles.noticeTip}></View>
    }
    return <View/>
  }

  renderService(rowData) {
    return(
      <TouchableOpacity style={styles.serviceView}>
        <Text style={{fontSize: 17, color: '#5A5A5A', marginTop: normalizeH(15)}}>大型活动策划</Text>
        <View style={{flexDirection: 'row', marginTop: normalizeH(12)}}>
          <Text style={{fontSize: 15, color: '#5A5A5A'}}>佐凯</Text>
          <Text style={{marginLeft: normalizeW(24), fontSize: 15, color: '#AAAAAA'}}>欣木科技活动策划</Text>
        </View>
        <View style={{justifyContent: 'space-between', marginTop: normalizeH(12), flexDirection: 'row'}}>
          <Text style={{fontSize: 15, color: THEME.colors.yellow}}>¥ 500元</Text>
          <Text style={{fontSize: 12, color: '#AAAAAA'}}>111 人看过</Text>
        </View>
        <View style={{marginTop: normalizeH(9), marginBottom: normalizeH(9)}}>
          <ImageGroupViewer containerStyle={{}}
                            images={this.props.imageTest}
                            showMode="oneLine"/>
        </View>
      </TouchableOpacity>
    )
  }

  renderHelp(rowDate) {
    return(
      <TouchableOpacity style={styles.helpView}>
        <View>
          <Image
            style={{width: 50, height: 50, marginTop: normalizeH(23), marginRight: normalizeW(15)}}
            source={require('../../assets/images/defualt_user40.png')}
          />
        </View>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 17, color: '#5A5A5A', marginTop: normalizeH(20)}}>大型活动策划</Text>
          <View style={{flexDirection: 'row', marginTop: normalizeH(12)}}>
            <Text style={{fontSize: 15, color: '#5A5A5A'}}>佐凯</Text>
            <Text style={{marginLeft: normalizeW(24), fontSize: 15, color: '#AAAAAA'}}>欣木科技活动策划</Text>
          </View>
          <View style={{justifyContent: 'space-between', marginTop: normalizeH(12), flexDirection: 'row'}}>
            <Text style={{fontSize: 15, color: THEME.colors.yellow}}>¥ 500元</Text>
            <Text style={{fontSize: 12, color: '#AAAAAA'}}>111 人看过</Text>
          </View>
        </View>
      </TouchableOpacity>
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

  renderItemView() {
    if (this.state.selectedItem == 'service') {
      return(
        <ListView
          dataSource={this.props.ServiceDataSource}
          renderRow={(rowData) => this.renderService(rowData)}
        />
      )
    } else if (this.state.selectedItem == 'help') {
      return(
        <ListView
          dataSource={this.props.HelpDataSource}
          renderRow={(rowData) => this.renderService(rowData)}
        />
      )
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', marginRight: normalizeW(13)}}>
            <Text style={{fontSize: 17, color: THEME.colors.yellow, marginLeft: normalizeW(12)}}>长沙</Text>
            <Image source={require('../../assets/images/Triangle.png')}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.search} onPress={() => Actions.SEARCH()}>
            <Image source={require('../../assets/images/search.png')}/>
            <Text style={{fontSize: 15, marginLeft: normalizeH(33), color: '#AAAAAA'}}>输入关键词</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notice}>
            <Image source={require('../../assets/images/notice.png')}/>
            {this.renderTip()}
          </TouchableOpacity>
        </View>
        <View style={styles.advertisementModule}>
          {this.props.banner &&
            <CommonBanner
              banners={this.props.banner}
            />
          }
        </View>
        <View style={styles.itemHeader}>
          <View style={{flex: 1, paddingLeft: normalizeW(75)}}>
            {this.renderServiceBar()}
          </View>
          <View style={{flex: 1, paddingRight: normalizeW(75)}}>
            {this.renderHelpBar()}
          </View>
        </View>
        <ScrollView>
          {this.renderService()}
          {this.renderHelp()}
        </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newMsg = 1
  let newNotice = 0
  const banner = getBanner(state, 0)
  const Service = undefined
  const Help = undefined
  let imageTest = ['https://dn-1bofhd4c.qbox.me/60fd11e75e312f3b37ca.jpg', 'https://dn-1bofhd4c.qbox.me/60fd11e75e312f3b37ca.jpg']
  return {
    hasNotice: newMsg || newNotice,
    banner: banner,
    // ServiceDataSource: serviceDs.cloneWithRows(Service),
    // HelpDataSource: helpDs.cloneWithRows(Help),
    imageTest: imageTest,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchBanner,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Home)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: normalizeH(20),
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
  notice: {
    padding: 5,
    marginRight: normalizeW(12),
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
    height: normalizeH(107),
    width: PAGE_WIDTH,
    paddingLeft: normalizeW(15),
    paddingRight: normalizeW(15),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  }

})