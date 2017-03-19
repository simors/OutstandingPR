/**
 * Created by wanpeng on 2017/3/2.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Platform,
  TouchableOpacity,
  ScrollView,
  ListView,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Header from '../common/Header'
import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import {getNoticeListByType} from '../../selector/notifySelector'
import * as msgActionTypes from '../../constants/messageActionTypes'



const PAGE_WIDTH = Dimensions.get('window').width
const PAGE_HEIGHT = Dimensions.get('window').height

class PublishNotifyView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      topicId: '',
      replyTo: '',
      commentId: '',
      replyUserNickName: '',
    }
  }

  componentDidMount() {
  }

  renderNoticeItem(notice) {
    console.log("renderNoticeItem notice", notice)
    if(notice) {
      return (
        <View style={styles.itemView}>
          <TouchableOpacity style={styles.personView} onPress={() => Actions.PERSONAL_HOMEPAGE({userId: notice.userId})}>
            <Image style={{width: 50, height: 50}} source={{uri: notice.avatar}}/>
          </TouchableOpacity>
          <TouchableOpacity style={{}} onPress={() => Actions.SERVICE_SHOW({publishId: notice.publishId})}>
            <Text style={{fontSize: 17, color: '#5A5A5A', marginTop: normalizeH(25)}}>{notice.nickname + ' 给您留言了'}</Text>
            <Text style={{fontSize: 12, color: '#AAAAAA', marginTop: normalizeH(12)}}>{notice.text + '['+ notice.timestamp + ']'}</Text>
          </TouchableOpacity>
        </View>
      )
    }

  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="留言"
        />
        <View style={styles.itemContainer}>
          <ScrollView style={{height: PAGE_HEIGHT}}>
            {this.renderNoticeItem()}
            <ListView
              dataSource={this.props.dataSource}
              renderRow={(notice) => this.renderNoticeItem(notice)}
              enableEmptySections={true}
            />
          </ScrollView>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let newProps = {}
  let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
  let noticeList = getNoticeListByType(state, msgActionTypes.PUBLISH_TYPE)

  newProps.dataSource = ds.cloneWithRows(noticeList)

  return newProps
}
const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PublishNotifyView)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
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
  },
  itemView: {
    flexDirection: 'row',
    marginBottom: 10,
    backgroundColor: '#FFFFFF'
  },
  personView: {
    marginTop: normalizeH(20),
    marginBottom: normalizeH(15),
    marginLeft: normalizeW(20),
    marginRight: normalizeW(11),
  },
  avtarView: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden'
  },
  avtarStyle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden'
  },
  userNameStyle: {
    fontSize: 15,
    color: '#50E3C2'
  },
  msgViewStyle: {
    marginTop: 21,
    marginBottom: 15,
    justifyContent: 'center',
    paddingLeft: 18,
    paddingRight: 18,
  },
})