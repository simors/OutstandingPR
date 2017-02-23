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
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import Header from '../common/Header'
import CommonTextInput from '../common/CommonTextInput'
import Symbol from 'es6-symbol'
import {normalizeH, normalizeW} from '../../util/Responsive'
import DateTimeInput from '../common/Input/DateTimeInput'
import {submitFormData, submitInputData,INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import {activeUserInfo} from '../../selector/authSelector'
import * as Toast from '../common/Toast'
import ImageInput from '../common/Input/ImageInput'
import RegionPicker from '../common/Input/RegionPicker'
import {inputFormOnDestroy} from '../../action/inputFormActions'




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
    this.state = {
      shouldUploadImage: false
    }
  }

  componentWillUnmount() {
    this.props.inputFormOnDestroy({formKey: profileForm})
  }

  submitSuccessCallback() {
    Toast.show('保存信息成功')
    Actions.pop()
  }

  uploadImageCallback() {
    this.updateProfile()
  }

  submitErrorCallback(error) {
    Toast.show(error.message)
  }

  submit = () => {
    this.setState({
      shouldUploadImage: true
    })
  }

  updateProfile() {
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
          <KeyboardAwareScrollView>
            <TouchableOpacity style={styles.item}>
              <View style={{flex: 1, marginLeft: normalizeW(20)}}>
                <Text style={styles.itemText}>头像</Text>
              </View>
              <ImageInput
                {...avatarInput}
                initValue={this.props.userInfo.avatar? this.props.userInfo.avatar: undefined}
                containerStyle={styles.imageInputStyle}
                addImage={require('../../assets/images/defualt_user40.png')}
                choosenImageStyle={{borderWidth: 0, borderColor: '#FFFFFF', borderRadius: normalizeW(20), overflow: 'hidden', width: normalizeW(40), height: normalizeH(40), overlayColor: '#FFFFFF'}}
                addImageBtnStyle={{width: normalizeW(40), height: normalizeH(40), top: 0, left: 0}}
                shouldUploadImage={this.state.shouldUploadImage}
                uploadImageCallback={(leanHeadImgUrl)=>{this.uploadImageCallback(leanHeadImgUrl)}}
              />

            </TouchableOpacity>
            <TouchableOpacity style={styles.item}>
              <View style={styles.itemView}>
                <Text style={styles.itemText}>呢称</Text>
                <CommonTextInput {...nicknameInput}
                                 initValue={this.props.userInfo.nickname? this.props.userInfo.nickname: undefined}
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
                                 initValue={this.props.userInfo.name? this.props.userInfo.name: undefined}
                                 maxLength={8}
                                 containerStyle={styles.inputContainerStyle}
                                 inputStyle={styles.inputStyle}
                                 placeholder="真实姓名"/>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.item, {marginTop: normalizeH(20)}]}>
              <View style={styles.itemView}>
                <Text style={styles.itemText}>所在城市</Text>
                <View style={{flex: 1}}>
                  <RegionPicker {...cityInput}
                                initValue={this.props.userInfo.city? this.props.userInfo.city: '长沙'}
                                containerStyle={{paddingRight:0, paddingLeft: 0}}
                                inputStyle={{width: normalizeW(160), height: normalizeH(44), fontSize: 16, backgroundColor: '#fff', borderWidth: 0, paddingLeft: 0,}}
                  />
                </View>
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
                               initValue={this.props.userInfo.birthday? this.props.userInfo.birthday: undefined}
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
                                 initValue={this.props.userInfo.organization? this.props.userInfo.organization: undefined}
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
                                 initValue={this.props.userInfo.profession? this.props.userInfo.profession: undefined}
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
                                 initValue={this.props.userInfo.industry? this.props.userInfo.industry: undefined}
                                 maxLength={8}
                                 containerStyle={styles.inputContainerStyle}
                                 inputStyle={styles.inputStyle}
                                 placeholder="输入信息，更非凡"/>
              </View>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
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
  inputFormOnDestroy
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
  },
  imageInputStyle: {
    backgroundColor: '#FFFFFF',
    width: normalizeW(40),
    height: normalizeH(40),
    borderWidth: 1,
    borderRadius: normalizeW(20),
    overflow: 'hidden',
    marginRight: normalizeW(20),
  },
  regionContainerStyle: {
    paddingRight:0,
    borderWidth: 1,
    borderColor:'red'
  },
  regionInputStyle:{
    height: normalizeH(44),
    fontSize: 16,
    backgroundColor: '#fff',
    borderWidth: 0,
    paddingLeft: 0,
  },

})
