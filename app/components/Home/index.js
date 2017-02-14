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
          </TouchableOpacity>
        </View>
        <Image
          source={require('../../assets/images/banner.png')}
        />
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
    flexDirection: 'row',
    width: normalizeW(219),
    height: normalizeH(30),
    backgroundColor: 'rgba(170,170,170,0.1)',
    borderRadius: 15,
    alignItems: 'center',
    paddingLeft: 10,
  },
  notice: {
    marginLeft: normalizeW(41),
  }
})