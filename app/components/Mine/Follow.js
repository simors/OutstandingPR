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
  ListView,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {normalizeH, normalizeW} from '../../util/Responsive'
import {getFollowees} from '../../selector/authSelector'

const dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 != r2,
})

class Follow extends Component {
  constructor(props) {
    super(props)
  }


  renderItem(rowData) {
    return(
      <View style={styles.userInfoView}>
        <TouchableOpacity onPress={() => {Actions.PERSONAL_HOMEPAGE({userId: rowData.id})}}>
          <Image
            style={{width: 50, height: 50, borderRadius: 25, marginTop: normalizeH(20), marginRight: normalizeW(15),marginLeft: normalizeW(15)}}
            source={rowData.avatar? {uri: rowData.avatar} : require('../../assets/images/defualt_user40.png')}
          />
        </TouchableOpacity>
        <View style={{flex: 1}}>
          <Text style={{fontSize: 17, marginTop: normalizeH(28), }}>{rowData.nickname}</Text>
          <Text style={{fontSize: 12, color: '#5A5A5A', marginTop: normalizeH(5)}}>大活动策划</Text>
          <View style={{flexDirection: 'row', marginTop: normalizeH(3), marginBottom: normalizeH(5)}}>
            <Text style={{fontSize: 12, color: '#AAAAAA'}}>发布 (5)</Text>
            <Text style={{fontSize: 12, color: '#AAAAAA',marginLeft: normalizeW(50)}}>三天前来过</Text>
          </View>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="我的关注"
        />
        <View style={styles.body}>
          <ListView
            dataSource={this.props.followees}
            renderRow={(rowData) => this.renderItem(rowData)}
            enableEmptySections={true}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let iFollowees = getFollowees(state)
  return {
    followees: dataSource.cloneWithRows(iFollowees),
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Follow)

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
  },
  avatar: {
    marginTop: normalizeH(20),
    marginBottom: normalizeH(15),
  },
  name: {
    fontSize: 17,
    color: '#5A5A5A',
    marginBottom: normalizeH(24)
  },
  userInfoView: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'

  }

})
