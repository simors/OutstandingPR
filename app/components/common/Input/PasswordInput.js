import React, {Component} from 'react'
import {
	StyleSheet,
	Text,
	View,
	Image,
	TouchableOpacity,
	Dimensions,
	Platform,
	TextInput,
	TouchableWithoutFeedback
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {FormInput} from 'react-native-elements'
import {initInputForm, inputFormUpdate} from '../../../action/inputFormActions'
import {getInputData} from '../../../selector/inputFormSelector'
import {normalizeH, normalizeW} from '../../../util/Responsive'


class PasswordInput extends Component {

	constructor(props) {
		super(props)
		this.state = {showPwd: false}
	}

	componentDidMount() {
		let formInfo = {
			formKey: this.props.formKey,
	    stateKey: this.props.stateKey,
	    type: "passwordInput",
		  initValue: "",
			checkValid: this.validInput
		}
    this.props.initInputForm(formInfo)
  }

	validInput(data) {
		if(!data.text){
			return {isVal:false, errMsg:"未填写密码"}
		}
		if (!(/^([0-9a-zA-Z]){6,16}$/.test(data.text))) {
			return {isVal:false, errMsg:"密码须为6-16位大小写和数字字符"}
		}
		return {isVal:true, errMsg:"ok"}
	}

  inputChange(text) {
  	let formInfo = {
			formKey: this.props.formKey,
	    stateKey: this.props.stateKey,
		  data: {text}
		}
    this.props.inputFormUpdate(formInfo)
  }

  onShowPwdClicked = () => {
		this.setState({showPwd: !this.state.showPwd})
	}

	render() {
		return (
      <View style={[styles.container, this.props.containerStyle && this.props.containerStyle]}>
	      <FormInput
		      onChangeText={(text) => this.inputChange(text)}
		      autoFocus={this.props.autoFocus}
		      placeholder={this.props.placeholder}
		      placeholderTextColor={this.props.placeholderTextColor}
		      maxLength={this.props.maxLength}
		      secureTextEntry={!this.state.showPwd}
		      underlineColorAndroid="transparent"
		      containerStyle={{marginLeft:0, marginRight: 0,borderBottomWidth:0}}
		      value={this.props.data}
		      inputStyle={[styles.input, this.props.inputStyle && this.props.inputStyle]}
	      />
	      <View style={[this.state.showPwd ? styles.eyeOpenIcon  : styles.eyeCloseIcon,
	              {right:
	               (this.props.containerStyle && this.props.containerStyle.paddingRight)
	               ? (this.props.inputStyle && this.props.inputStyle.marginRight)
	                  ? this.props.containerStyle.paddingRight + this.props.inputStyle.marginRight + 15
	                  : this.props.containerStyle.paddingRight + 15
	               : (this.props.inputStyle && this.props.inputStyle.marginRight)
	                  ? normalizeW(17) + this.props.inputStyle.marginRight + 15
	                  : normalizeW(17) + 15}]}>
		      <TouchableWithoutFeedback onPress={this.onShowPwdClicked}>
			      <Image source={this.state.showPwd ?
								require('../../../assets/images/eye_open.png') : require('../../../assets/images/eye_close.png')}
			      />
		      </TouchableWithoutFeedback>
	      </View>
	    </View>)
	}
}

PasswordInput.defaultProps = {
	placeholder: '设置密码(6-16位数字或字母)',
	maxLength: 16, //6-16位数字或字母
	autoFocus: false,
  placeholderTextColor: '#B2B2B2',
  editable: true
}

const styles = StyleSheet.create({
  container: {
		marginLeft: 0,
		marginRight: 0,
		marginBottom: 0,
		marginTop: 0,
		borderBottomWidth: 0,
		paddingLeft: normalizeW(17),
		paddingRight: normalizeW(17),
  },
  input: {
		height: normalizeH(50),
		paddingLeft: normalizeW(10),
		paddingRight: normalizeW(10),
		backgroundColor: '#F3F3F3',
		borderWidth: 1,
		borderColor: '#E9E9E9',
		fontSize: 16,
		color: '#B2B2B2'
  },
  eyeOpenIcon: {
  	position: 'absolute',
  	right: 15,
  	top: 10
  },
  eyeCloseIcon: {
  	position: 'absolute',
  	right: 15,
  	top: 18
  }
})

const mapStateToProps = (state, ownProps) => {
	let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  //let formData = getInputFormData(state, ownProps.formKey)
  return {
    data: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
	initInputForm,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PasswordInput)
