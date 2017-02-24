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
  Text,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'
import {Actions, Scene, Switch, ActionConst, Modal} from 'react-native-router-flux'


import CommonBanner from '../common/CommonBanner'
import {fetchBanner} from '../../action/configAction'
import {getBanner} from '../../selector/configSelector'
import {normalizeH, normalizeW} from '../../util/Responsive'
import THEME from '../../constants/theme'

const PAGE_WIDTH=Dimensions.get('window').width


class Search extends Component {
  constructor(props) {
    super(props)

  }
  componentDidMount() {

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
            <TextInput
              style={{flex: 1, marginLeft: normalizeW(16), fontSize: 15}}
              multiline={false}
              autoFocus= {true}
              placeholder="请输入关键字"
            />
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={{ fontSize: 15, color: '#FFFFFF'}}>搜索</Text>
          </TouchableOpacity>
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Search)

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

})