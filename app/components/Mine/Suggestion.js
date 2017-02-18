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
import CommonTextInput from '../common/CommonTextInput'
import Header from '../common/Header'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import CommonButton from '../common/CommonButton'
import ArticleEditor from '../common/ArticleEditor'
import {normalizeH, normalizeW} from '../../util/Responsive'

const PAGE_WIDTH=Dimensions.get('window').width


let suggestionForm = Symbol('suggestionForm')

const suggestionType = {
  formKey: suggestionForm,
  stateKey: Symbol('suggestionType'),
  type: "suggestionType",
}

const contactInput = {
  formKey: suggestionForm,
  stateKey: Symbol('contactInput'),
  type: "contactInput",
}

const suggestionContent = {
  formKey: suggestionForm,
  stateKey: Symbol('suggestionContent'),
  type: "suggestionContent",
}

const contentHeight = {
  ...Platform.select({
    ios: {
      height: normalizeH(65 + 88),
    },
    android: {
      height: normalizeH(45 + 88)
    }
  })
}

class Suggestion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ArticleFocused: true,
    }
    this.insertImages = []

  }

  getRichTextImages(images) {
    this.insertImages = images
    console.log('images list', this.insertImages)
  }

  onFocusChanged = () => {
    this.setState({
      ArticleFocused: true,
    })
  }

  onFocusLost = () => {
    this.setState({
      ArticleFocused: false
    })
  }

  renderKeyboardAwareToolBar() {
    return (
      <KeyboardAwareToolBar
        show={this.state.ArticleFocused}
        initKeyboardHeight={-50}
      >
        <TouchableOpacity style={{flex: 1, flexDirection: 'row', justifyContent: 'center',alignItems: 'center',height: normalizeH(40), backgroundColor: '#F5F5F5'}}>
          <Image
            style={{marginRight: normalizeW(10)}}
            source={require('../../assets/images/add_picture.png')}
          />
          <Text style={{fontSize: 15, color: '#AAAAAA'}}>添加图片</Text>
        </TouchableOpacity>
        <CommonButton title="发布"
                      buttonStyle={{width: normalizeW(64), height: normalizeH(40)}}
                      titleStyle={{fontSize: 15}}
                      onPress={() => this.onButtonPress()}/>
      </KeyboardAwareToolBar>
    )
  }

  render() {
    return (
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="意见反馈"
        />
        <View style={styles.body}>
          <View>
            <CommonTextInput maxLength={10}
                             {...suggestionType}
                             containerStyle={styles.titleContainerStyle}
                             inputStyle={styles.titleInputStyle}
                             placeholder="问题类型"
                             onFocus={this.onFocusLost}/>
          </View>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemView}>
              <Text style={styles.itemText}>联系方式</Text>
              <CommonTextInput {...contactInput}
                               maxLength={8}
                               containerStyle={styles.inputContainerStyle}
                               inputStyle={styles.inputStyle}
                               placeholder="手机号或邮箱（选填）"
                               onFocus={this.onFocusLost}/>
            </View>
          </TouchableOpacity>
          <View>
            <ArticleEditor
              {...suggestionContent}
              wrapHeight={contentHeight.height}
              onFocus={this.onFocusChanged}
              placeholder="正文"
              getImages={(images) => this.getRichTextImages(images)}
            />

          </View>

        </View>
        {this.renderKeyboardAwareToolBar()}

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Suggestion)

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
  avatar: {
    marginTop: normalizeH(20),
    marginBottom: normalizeH(15),
  },
  name: {
    fontSize: 17,
    color: '#5A5A5A',
    marginBottom: normalizeH(24)
  },
  titleContainerStyle: {
    flex: 1,
    height: normalizeH(44),
    paddingLeft: 0,
    paddingRight: 0,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderBottomColor: '#E9E9E9',
  },
  titleInputStyle: {
    flex: 1,
    fontSize: 17,
    paddingLeft: normalizeW(20),
    backgroundColor: '#FFFFFF',
    color: '#5A5A5A',
  },
  item: {
    flexDirection: 'row',
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(170,170,170,0.2)',
    width: PAGE_WIDTH,
    height: normalizeH(60),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  itemView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: normalizeW(10),
  },
  itemText: {
    fontSize: 17,
    color: '#5A5A5A',
    width:normalizeW(87),
  },
  inputContainerStyle: {
    flex: 1,
    height: normalizeH(44),
    paddingLeft: 0,
    paddingRight: 0,

  },
  inputStyle: {
    flex: 1,
    fontSize: 17,
    paddingLeft: 0,
    backgroundColor: '#FFFFFF',
    color: '#5A5A5A',
    borderWidth: 0,
  }

})
