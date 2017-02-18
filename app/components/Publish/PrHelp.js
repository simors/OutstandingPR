/**
 * Created by wanpeng on 2017/2/15.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import * as Toast from '../common/Toast'
import CommonTextInput from '../common/CommonTextInput'
import {normalizeH, normalizeW} from '../../util/Responsive'
import {submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../action/authActions'
import THEME from '../../constants/theme'
import ArticleEditor from '../common/ArticleEditor'
import KeyboardAwareToolBar from '../common/KeyboardAwareToolBar'
import CommonButton from '../common/CommonButton'

const PAGE_WIDTH=Dimensions.get('window').width

let serviceForm = Symbol('serviceForm')
const serviceName = {
  formKey: serviceForm,
  stateKey: Symbol('serviceName'),
  type: "serviceName",
}
const servicePrice = {
  formKey: serviceForm,
  stateKey: Symbol('servicePrice'),
  type: "servicePrice"
}
const serviceContent = {
  formKey: serviceForm,
  stateKey: Symbol('serviceContent'),
  type: "serviceContent"
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

class PrHelp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ArticleFocused: true,
    }
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
    return(
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="发布公关需求"
        />
        <View style={styles.body}>
          <View>
            <CommonTextInput maxLength={36}
                             {...serviceName}
                             containerStyle={styles.titleContainerStyle}
                             inputStyle={styles.titleInputStyle}
                             placeholder="输入标题"/>
          </View>
          <View style={styles.price}>
            <Text style={{fontSize: 17, color: '#AAAAAA', paddingLeft: normalizeW(20)}}>价格</Text>
            <Text style={{marginLeft: normalizeW(38), fontSize: 20, color: THEME.colors.yellow}}>¥</Text>
            <CommonTextInput maxLength={7}
                             {...servicePrice}
                             containerStyle={styles.priceContainerStyle}
                             inputStyle={styles.priceInputStyle}
                             placeholder="10000"
                             keyboardType='numeric'/>
          </View>
          <View>
            <ArticleEditor
              {...serviceContent}
              wrapHeight={contentHeight.height}
              placeholder="正文"
              onFocus={this.onFocusChanged}
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
  submitFormData,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PrHelp)

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
    fontFamily: 'PingFangSC-Semibold',
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9E9',
    borderStyle: 'solid',

  },
  priceContainerStyle: {
    flex: 1,
    height: normalizeH(44),
    paddingLeft: 0,
    paddingRight: 0,
  },
  priceInputStyle: {
    flex: 1,
    fontSize: 20,
    paddingLeft: normalizeW(5),
    backgroundColor: '#FFFFFF',
    color: THEME.colors.yellow,
    fontFamily: 'PingFangSC-Semibold',
    borderWidth: 0,
  },

})