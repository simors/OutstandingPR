/**
 * Created by wanpeng on 2017/2/24.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Icon from 'react-native-vector-icons/Ionicons'
import Symbol from 'es6-symbol'
import {normalizeH, normalizeW} from '../../util/Responsive'
import THEME from '../../constants/theme'
import ArticleViewer from '../../components/common/ArticleViewer'
import * as Toast from '../common/Toast'
import {activeUserId} from '../../selector/authSelector'


const PAGE_WIDTH=Dimensions.get('window').width

class HelpShow extends Component {
  constructor(props) {
    super(props)
  }

  renderEdit() {
    if(this.props.help.userId == this.props.currentUser) {
      return(
        <View style={styles.edit} >
          <TouchableOpacity onPress={() => Actions.EDIT_HELP({help: this.props.help})}>
            <Image style={{marginLeft: normalizeW(10), marginRight: normalizeW(10)}} source={require('../../assets/images/edite.png')}/>
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={{ alignItems: 'center', paddingRight: normalizeW(13)}} onPress={() => Actions.pop()}>
            <Icon
              name="ios-arrow-back"
              style={{marginLeft: normalizeW(11), fontSize: 32, color: THEME.colors.yellow}}/>
          </TouchableOpacity>
          {this.renderEdit()}
          <TouchableOpacity style={styles.share} onPress={() => {Toast.show("嘿嘿！暂时无法分享")}}>
            <Image
              source={require('../../assets/images/share.png')}
            />
          </TouchableOpacity>
        </View>
        <ScrollView>
          <View style={styles.titleView}>
            <Text style={styles.title}>{this.props.help.title}</Text>
            <Text style={styles.price}>¥ {this.props.help.price}元</Text>
          </View>
          <View style={styles.serviceView}>
            <ArticleViewer artlcleContent={JSON.parse(this.props.help.content)}/>
          </View>
          <View style={styles.comments}>
            <View style={styles.commentHeader}>
              <View style={{width: normalizeW(5), height: normalizeH(15), backgroundColor: THEME.colors.yellow, marginLeft: normalizeW(15)}}/>
              <Text style={{fontSize: 17, color: '#5A5A5A', marginLeft: normalizeW(10)}}>留言 (5)</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}

HelpShow.defaultProps = {
  help: {
    title: undefined,
    content: undefined,
    price: undefined,
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUser = activeUserId(state)
  return {
    currentUser: currentUser,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(HelpShow)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: normalizeH(20),
      },
      android: {
        marginTop: normalizeH(0)
      }
    }),
  },
  header: {
    paddingTop: normalizeH(20),
    flexDirection: 'row',
    height: normalizeH(65),
    width: PAGE_WIDTH,
    alignItems: 'center',
    backgroundColor: '#F5F5F5'
  },
  edit: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    height: normalizeH(30),
    borderRadius: 5,
    paddingLeft: 10,
    marginRight: normalizeW(28),
  },
  share: {
    paddingRight: normalizeW(20),
  },
  titleView: {
    flexDirection: 'row',
    width: PAGE_WIDTH,
    height: normalizeH(50),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#F5F5F5'
  },
  title: {
    flex: 1,
    marginLeft: normalizeW(15),
    fontSize: 17,
    color: '#5A5A5A',

  },
  price: {
    fontSize: 15,
    color: THEME.colors.yellow,
    marginRight: normalizeW(20),
  },
  serviceView: {
    marginBottom: normalizeW(20),
  },
  comments: {
    justifyContent: 'center',
    height: normalizeH(40),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5'
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  }

})