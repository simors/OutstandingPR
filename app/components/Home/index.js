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
  Text,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {normalizeH, normalizeW} from '../../util/Responsive'
import THEME from '../../constants/theme'

const PAGE_WIDTH=Dimensions.get('window').width


class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedItem: 'service'
    }
  }
  renderTip() {
    if (this.props.hasNotice) {
      return <View style={styles.noticeTip}></View>
    }
    return <View/>
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
          <Text style={styles.itemText}>公关服务</Text>
        </TouchableOpacity>
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
          <TouchableOpacity style={styles.search}>
            <Image source={require('../../assets/images/search.png')}/>
            <Text style={{fontSize: 15, marginLeft: normalizeH(33), color: '#AAAAAA'}}>输入关键词</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.notice}>
            <Image source={require('../../assets/images/notice.png')}/>
            {this.renderTip()}
          </TouchableOpacity>
        </View>
        <Image
          source={require('../../assets/images/banner.png')}
        />
        <View style={styles.itemHeader}>
          <View style={{flex: 1, paddingLeft: normalizeW(75)}}>
            {this.renderServiceBar()}
          </View>
          <View style={{flex: 1, paddingRight: normalizeW(75)}}>
            {this.renderHelpBar()}
          </View>
        </View>

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let newMsg = 1
  let newNotice = 0
  newProps.hasNotice = newMsg || newNotice
  return newProps
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

})

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
    width: normalizeW(80),
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 17,
    color: '#AAAAAA'
  },
})