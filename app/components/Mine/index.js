/**
 * Created by wanpeng on 2017/2/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {normalizeH, normalizeW} from '../../util/Responsive'

const PAGE_WIDTH=Dimensions.get('window').width


class Mine extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container}>
          <TouchableOpacity style={styles.info}>
            <Image
              style={{width: 72, height: 72, borderRadius: 36, overflow: 'hidden', marginLeft: normalizeW(31)}}
              source={require('../../assets/images/mine_select.png')}
            />
            <View style={{flex:1, marginLeft: normalizeW(17)}}>
              <Text style={{fontSize: 17, color: '#5A5A5A'}}>鹏程万里</Text>
            </View>
            <Image
              style={{marginRight: normalizeW(30)}}
              source={require('../../assets/images/PinLeft.png')}
            />
          </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <View style={{flex: 1, marginLeft: normalizeW(20)}}>
            <Text style={styles.itemText}>我的发布</Text>
          </View>
          <Image
            style={{marginRight: normalizeW(20)}}
            source={require('../../assets/images/PinLeft_gray.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <View style={{flex: 1, marginLeft: normalizeW(20)}}>
            <Text style={styles.itemText}>我的关注</Text>
          </View>
          <Image
            style={{marginRight: normalizeW(20)}}
            source={require('../../assets/images/PinLeft_gray.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <View style={{flex: 1, marginLeft: normalizeW(20)}}>
            <Text style={styles.itemText}>我的收藏</Text>
          </View>
          <Image
            style={{marginRight: normalizeW(20)}}
            source={require('../../assets/images/PinLeft_gray.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <View style={{flex: 1, marginLeft: normalizeW(20)}}>
            <Text style={styles.itemText}>用户反馈</Text>
          </View>
          <Image
            style={{marginRight: normalizeW(20)}}
            source={require('../../assets/images/PinLeft_gray.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <View style={{flex: 1, marginLeft: normalizeW(20)}}>
            <Text style={styles.itemText}>系统设置</Text>
          </View>
          <Image
            style={{marginRight: normalizeW(20)}}
            source={require('../../assets/images/PinLeft_gray.png')}
          />
        </TouchableOpacity>




      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

})

export default connect(mapStateToProps, mapDispatchToProps)(Mine)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    paddingTop: normalizeH(20),
    flexDirection: 'row',
    backgroundColor: 'rgba(245,245,245,1)',
    alignItems: 'center',
    height: normalizeH(157),
    width: PAGE_WIDTH,
  },
  item: {
    flexDirection: 'row',
    marginLeft: normalizeW(10),
    marginRight: normalizeW(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(170,170,170,0.2)',
    height: normalizeH(68),
    alignItems: 'center',

  },
  itemText: {
    fontSize: 17,
    color: '#5A5A5A',
  }
})