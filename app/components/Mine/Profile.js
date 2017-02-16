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
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {normalizeH, normalizeW} from '../../util/Responsive'

class Profile extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="个人信息"
          rightType="image"
          rightContainerStyle={{paddingRight: 15}}
          rightImageSource={require('../../assets/images/edite.png')}
          rightPress={() => Actions.EDIT_PROFILE()}
        />
        <View style={styles.body}>
          <View style={{alignItems: 'center', borderBottomWidth: 1, borderBottomColor: 'rgba(170,170,170,0.2)',}}>
            <Image
              style={styles.avatar}
              source={require('../../assets/images/defualt_user.png')}
            />
            <Text style={styles.name}>非凡的昵称</Text>
          </View>
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
              <Text style={styles.itemText}>出身年月</Text>
            </View>
            <Image
              style={{marginRight: normalizeW(20)}}
              source={require('../../assets/images/PinLeft_gray.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={{flex: 1, marginLeft: normalizeW(20)}}>
              <Text style={styles.itemText}>任职机构</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={{flex: 1, marginLeft: normalizeW(20)}}>
              <Text style={styles.itemText}>职位</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={{flex: 1, marginLeft: normalizeW(20)}}>
              <Text style={styles.itemText}>所在行业</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Profile)

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
  }

})
