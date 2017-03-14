/**
 * Created by wanpeng on 2017/3/2.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Platform,
  InteractionManager,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  ListView,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import Triangle from '../common/Triangle'


const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class SystemMessageBox extends Component {
  constructor(props) {
    super(props)
  }

  renderSystemMsg(rowData) {
    return(
      <View style={styles.itemView}>
        <View style={{marginTop: normalizeH(40), marginLeft: normalizeW(15)}}>
          <Image style={{width: 40, height: 40, borderRadius: 20}} source={{uri: 'https://dn-1bofhd4c.qbox.me/e2c84bce695c18727035.jpg'}}/>
        </View>
        <View style={{paddingLeft: normalizeW(5)}}>
          <Text style={{marginLeft: normalizeW(10), marginTop: normalizeH(30), marginBottom: normalizeH(8), fontSize: 12, color: '#5A5A5A'}}>推荐关注</Text>
          <TouchableOpacity style={{flexDirection: 'row'}}>
            <Triangle style={styles.triangle}  color={'#FFFFFF'} direction="left"/>
            <View style={{backgroundColor: '#FFFFFF', width: normalizeW(290), height: normalizeH(86), borderRadius: 10}}>
              <Text style={{marginTop: normalizeH(8), fontSize: 17, color: '#5A5A5A'}}>【大型活动策划】</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={{marginTop: normalizeH(10), marginLeft: normalizeW(10), width: normalizeW(220), fontSize: 12, color: '#AAAAAA'}}>美国大学公共关系专业广泛使用的教书, 从专业角度全面诠释了公共关…</Text>
                <Image style={{width: 40, height: 40}} source={{uri: 'https://dn-1bofhd4c.qbox.me/9dd578a0ba8de265ad94.jpg'}}/>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render() {
    return(
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="系统消息"
        />
        <View style={styles.itemContainer}>
          <ScrollView style={{height: PAGE_HEIGHT}}>
            {this.renderSystemMsg()}
            {this.renderSystemMsg()}
            <ListView
              dataSource={this.props.dataSource}
              renderRow={(rowData) => this.renderSystemMsg(rowData)}
              enableEmptySections={true}
            />
          </ScrollView>
        </View>
      </View>

    )
  }
}


const mapStateToProps = (state, ownProps) => {
  let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  let conversations = []
  return {
    dataSource: ds.cloneWithRows(conversations)
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SystemMessageBox)


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  itemContainer: {
    width: PAGE_WIDTH,
    ...Platform.select({
      ios: {
        marginTop: normalizeH(65),
      },
      android: {
        marginTop: normalizeH(45)
      }
    }),
    backgroundColor: '#F5F5F5'
  },
  itemView: {
    flexDirection: 'row',

  },
  selectItem: {
    flexDirection: 'row',
    height: normalizeH(63),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  titleStyle: {
    fontSize: 17,
    color: '#4A4A4A',
    letterSpacing: 0.43,
  },
  msgTip: {
    fontSize: 14,
    color: '#9B9B9B',
    letterSpacing: 0.43,
  },
  timeTip: {
    fontSize: 14,
    color: '#9B9B9B',
    letterSpacing: 0.43,
    marginRight: normalizeW(15)
  },
  noticeIconView: {
    marginLeft: normalizeW(15),
    marginRight: normalizeW(19)
  },
  noticeIcon: {
    width: 35,
    height: 35,
  },
  noticeTip: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  triangle: {
    // position: 'absolute',
    marginTop: normalizeH(10),
  },
})