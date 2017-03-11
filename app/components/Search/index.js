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
  TextInput,
  InteractionManager,
  ListView,
  Text,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Symbol from 'es6-symbol'
import Icon from 'react-native-vector-icons/Ionicons'
import {Actions} from 'react-native-router-flux'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {searchBtnClickedAction} from '../../action/searchActions'
import {SEARCH_SERVICE, SEARCH_HELP} from '../../constants/searchActionTypes'
import {getSearchedHelp, getSearchedServices} from '../../selector/searchSelector'
import CommonTextInput from '../common/CommonTextInput'
import {normalizeH, normalizeW} from '../../util/Responsive'
import THEME from '../../constants/theme'
import {getInputData} from '../../selector/inputFormSelector'


const PAGE_WIDTH=Dimensions.get('window').width

let searchForm = Symbol('searchForm')
const searchKeyInput = {
  formKey: searchForm,
  stateKey: Symbol('searchKeyInput'),
  type: "searchKeyInput",
}

const serviceDs = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

const helpDs = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItem: SEARCH_SERVICE,
    }
  }
  componentDidMount() {

  }

  setService = () => {
    this.setState({
      selectedItem: SEARCH_SERVICE
    })
  }

  setHelp = () => {
    this.setState({
      selectedItem: SEARCH_HELP
    })
  }

  onSearchBtnClicked = () => {
    searchPayload = {
      searchKey: this.props.searchKey,
    }
    this.props.searchBtnClickedAction(searchPayload)
  }

  renderItemView() {
    if (this.state.selectedItem == SEARCH_SERVICE) {
      return(
        <ListView
          dataSource={this.props.serviceDataSource}
          renderRow={(rowData) => this.renderHelp(rowData)}
          enableEmptySections={true}
        />
      )
    } else if (this.state.selectedItem == SEARCH_HELP) {
      return(
        <ListView
          dataSource={this.props.helpDataSource}
          renderRow={(rowData) => this.renderHelp(rowData)}
          enableEmptySections={true}
        />
      )
    }
  }

  renderServiceBar() {
    if (this.state.selectedItem == SEARCH_SERVICE) {
      return(
        <TouchableOpacity style={[styles.item, {borderBottomColor: THEME.colors.yellow, borderBottomWidth: 3}]} onPress={this.setService}>
          <Text style={[styles.itemText, {color: THEME.colors.yellow}]}>公关服务</Text>
        </TouchableOpacity>
      )
    } else if (this.state.selectedItem == SEARCH_HELP) {
      return(
        <TouchableOpacity style={styles.item} onPress={this.setService}>
          <Text style={styles.itemText}>公关服务</Text>
        </TouchableOpacity>
      )
    }
  }

  renderHelpBar() {
    if (this.state.selectedItem == SEARCH_HELP) {
      return(
        <TouchableOpacity style={[styles.item, {borderBottomColor: THEME.colors.yellow, borderBottomWidth: 3}]} onPress={this.setHelp}>
          <Text style={[styles.itemText, {color: THEME.colors.yellow}]}>公关需求</Text>
        </TouchableOpacity>
      )
    } else if (this.state.selectedItem == SEARCH_SERVICE) {
      return(
        <TouchableOpacity style={styles.item} onPress={this.setHelp}>
          <Text style={styles.itemText}>公关需求</Text>
        </TouchableOpacity>
      )
    }
  }

  renderHelp(rowData) {
    return(
      <View style={styles.helpView} >
        <TouchableOpacity onPress={() => Actions.PERSONAL_HOMEPAGE()}>
          <Image
            style={{width: 50, height: 50, borderRadius: 25,marginTop: normalizeH(23), marginRight: normalizeW(15)}}
            source={rowData.avatar? {uri: rowData.avatar} : require('../../assets/images/defualt_user40.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{flex: 1}} onPress={() => Actions.SERVICE_SHOW({publishId: rowData.objectId, userId: rowData.userId})}>
          <Text style={{fontSize: 17, color: '#5A5A5A', marginTop: normalizeH(20)}}>{rowData.title}</Text>
          <View style={{flexDirection: 'row', marginTop: normalizeH(12)}}>
            <Text style={{fontSize: 15, color: '#5A5A5A'}}>{rowData.nickname}</Text>
            <Text style={{marginLeft: normalizeW(24), fontSize: 15, color: '#AAAAAA'}}>{rowData.profession}</Text>
          </View>
          <View style={{justifyContent: 'space-between', marginTop: normalizeH(12), flexDirection: 'row'}}>
            <Text style={{fontSize: 15, color: THEME.colors.yellow}}>¥ {rowData.price}元</Text>
            <Text style={{fontSize: 12, color: '#AAAAAA'}}>111 人看过</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={{ alignItems: 'center', paddingRight: normalizeW(13)}} onPress={() => Actions.pop()}>
            <Icon
              name="ios-arrow-back"
              style={{marginLeft: normalizeW(11), fontSize: 32, color: THEME.colors.yellow}}/>
          </TouchableOpacity>
          <View style={styles.search}>
            <Image source={require('../../assets/images/search.png')}/>
            <CommonTextInput {...searchKeyInput}
                             placeholder="请输入关键字"
                             autoFocus= {true}
                             maxLength={8}
                             containerStyle={{flex: 1, height: normalizeH(30),paddingLeft: 0, paddingRight: 0, }}
                             inputStyle={{marginLeft: normalizeW(16), height: normalizeH(30),fontSize: 15, color: '#5A5A5A'}}
            />
          </View>
          <TouchableOpacity style={styles.searchButton} onPress={() =>{this.onSearchBtnClicked()}}>
            <Text style={{ fontSize: 15, color: '#FFFFFF'}}>搜索</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.itemHeader}>
          <View style={{flex: 1, paddingLeft: normalizeW(75)}}>
            {this.renderServiceBar()}
          </View>
          <View style={{flex: 1, paddingRight: normalizeW(75)}}>
            {this.renderHelpBar()}
          </View>
        </View>
        <KeyboardAwareScrollView>
          {this.renderItemView()}
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let searchKey = getInputData(state, searchKeyInput.formKey, searchKeyInput.stateKey)
  let service = getSearchedServices(state, searchKey.text)
  let help = getSearchedHelp(state, searchKey.text)
  return {
    searchKey: searchKey.text,
    serviceDataSource: serviceDs.cloneWithRows(service),
    helpDataSource: helpDs.cloneWithRows(help),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchBtnClickedAction,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Search)

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
    backgroundColor: '#F5F5F5'

  },
  location: {
    width: normalizeW(78),
    alignItems: 'center',
  },
  search: {
    flex: 1,
    flexDirection: 'row',
    height: normalizeH(30),
    backgroundColor: 'rgba(170,170,170,0.1)',
    borderRadius: 5,
    alignItems: 'center',
    paddingLeft: 10,
  },
  searchButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: normalizeW(50),
    height: normalizeH(30),
    borderRadius: 5,
    backgroundColor: THEME.colors.yellow,
    marginRight: normalizeW(15),
    marginLeft: normalizeW(10)
  },
  itemHeader: {
    width: PAGE_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
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

})