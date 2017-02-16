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
import CommonTextInput from '../common/CommonTextInput'
import Symbol from 'es6-symbol'
import {normalizeH, normalizeW} from '../../util/Responsive'
import DateTimeInput from '../common/Input/DateTimeInput'
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../action/authActions'
import {activeUserInfo} from '../../selector/authSelector'
import * as Toast from '../common/Toast'



const PAGE_WIDTH=Dimensions.get('window').width

let profileForm = Symbol('profileForm')

const avatarInput = {
  formKey: profileForm,
  stateKey: Symbol('avatarInput'),
  type: "avatarInput",
}

const nicknameInput = {
  formKey: profileForm,
  stateKey: Symbol('nicknameInput'),
  type: "nicknameInput",
}

const nameInput = {
  formKey: profileForm,
  stateKey: Symbol('nameInput'),
  type: "nameInput",
}

const cityInput = {
  formKey: profileForm,
  stateKey: Symbol('cityInput'),
  type: "cityInput",
}

const birthdayInput = {
  formKey: profileForm,
  stateKey: Symbol('birthdayInput'),
  type: "birthdayInput",
}

const organizationInput = {
  formKey: profileForm,
  stateKey: Symbol('organizationInput'),
  type: "organizationInput",
}

const professionInput = {
  formKey: profileForm,
  stateKey: Symbol('professionInput'),
  type: "professionInput",
}

const industryInput = {
  formKey: profileForm,
  stateKey: Symbol('industryInput'),
  type: "industryInput",
}


class EditProfile extends Component {
  constructor(props) {
    super(props)
  }

  submitSuccessCallback() {
    Toast.show('保存信息成功')
    Actions.pop()
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  submit = () => {
    this.props.submitFormData({
      formKey: profileForm,
      submitType: INPUT_FORM_SUBMIT_TYPE.PROFILE_SUBMIT,
      id: this.props.userInfo && this.props.userInfo.id,
      success: this.submitSuccessCallback,
      error: this.submitErrorCallback
    })
  }

  render() {
    return (
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-arrow-back"
          leftPress={() => Actions.pop()}
          title="个人信息编辑"
          rightType="text"
          rightText="保存"
          rightPress={this.submit}
        />
        <View style={styles.body}>
          <TouchableOpacity style={styles.item}>
            <View style={{flex: 1, marginLeft: normalizeW(20)}}>
              <Text style={styles.itemText}>头像</Text>
            </View>
            <Image
              style={{marginRight: normalizeW(20)}}
              source={require('../../assets/images/defualt_user40.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemView}>
              <Text style={styles.itemText}>呢称</Text>
              <CommonTextInput {...nicknameInput}
                               maxLength={8}
                               containerStyle={styles.inputContainerStyle}
                               inputStyle={styles.inputStyle}
                               placeholder="输入你在非凡的昵称"/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemView}>
              <Text style={styles.itemText}>姓名</Text>
              <CommonTextInput {...nameInput}
                               maxLength={8}
                               containerStyle={styles.inputContainerStyle}
                               inputStyle={styles.inputStyle}
                               placeholder="真实姓名"/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.item, {marginTop: normalizeH(20)}]}>
            <View style={styles.itemView}>
              <Text style={styles.itemText}>所在城市</Text>
              <Text style={{fontSize: 17}}>长 沙</Text>
            </View>
            <Image
              style={{marginRight: normalizeW(20)}}
              source={require('../../assets/images/PinLeft_gray.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemView}>
              <Text style={[styles.itemText, {marginRight: 0}]}>出身年月</Text>
              <DateTimeInput {...birthdayInput}
                             initValue={'2001-01-01'}
                             value="2016-05-18" PickerStyle={{justifyContent: 'flex-start', paddingLeft: 0, backgroundColor: '#FFFFFF', width: normalizeW(140), borderWidth: 0}}/>
            </View>
            <Image
              style={{marginRight: normalizeW(20)}}
              source={require('../../assets/images/PinLeft_gray.png')}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemView}>
              <Text style={styles.itemText}>任职机构</Text>
              <CommonTextInput {...organizationInput}
                               maxLength={8}
                               containerStyle={styles.inputContainerStyle}
                               inputStyle={styles.inputStyle}
                               placeholder="输入信息，更非凡"/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemView}>
              <Text style={styles.itemText}>职业</Text>
              <CommonTextInput {...professionInput}
                               maxLength={8}
                               containerStyle={styles.inputContainerStyle}
                               inputStyle={styles.inputStyle}
                               placeholder="输入信息，更非凡"/>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item}>
            <View style={styles.itemView}>
              <Text style={styles.itemText}>所在行业</Text>
              <CommonTextInput {...industryInput}
                               maxLength={8}
                               containerStyle={styles.inputContainerStyle}
                               inputStyle={styles.inputStyle}
                               placeholder="输入信息，更非凡"/>
            </View>
          </TouchableOpacity>

        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let userInfo = activeUserInfo(state)
  return {
    userInfo: userInfo,
  }}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  submitFormData,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile)

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
    backgroundColor: '#F5F5F5'
  },
  item: {
    flexDirection: 'row',
    paddingLeft: normalizeW(10),
    paddingRight: normalizeW(10),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(170,170,170,0.2)',
    width: PAGE_WIDTH,
    height: normalizeH(68),
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  itemView: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: normalizeW(20),
  },
  itemText: {
    fontSize: 17,
    color: '#5A5A5A',
    width:normalizeW(87),
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
