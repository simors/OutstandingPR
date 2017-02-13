import React, {Component} from 'react'
import {
	StyleSheet,
	Dimensions,
  View,
  Image,
  TouchableOpacity,
	Platform
} from 'react-native'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import { FormInput } from 'react-native-elements'
import {initInputForm, inputFormUpdate} from '../../action/inputFormActions'
import {getInputData} from '../../selector/inputFormSelector'
import {normalizeW, normalizeH} from '../../../util/Responsive'
import {removeSpace, formatPhone} from '../../../util/numberUtils'
import THEME from '../../../constants/theme'

class  PhoneInput extends Component {
	constructor(props) {
		super(props)
    this.state = {
      showClear: false,
    }
	}

	componentDidMount() {
		let formInfo = {
			formKey: this.props.formKey,
	    stateKey: this.props.stateKey,
	    type: this.props.type,
		  initValue: {text: this.props.initValue},
      checkValid: this.validInput
		}
    this.props.initInputForm(formInfo)
    if (formInfo.initValue.text && formInfo.initValue.text.length > 0) {
      this.setState({showClear: true})
    }
  }
  
  componentWillReceiveProps(nextProps) {
    if(this.props.initValue != nextProps.initValue) {
      this.inputChange(nextProps.initValue)
    }
  }

  validInput(data) {
    if(!data || !data.text){
      return {isVal:false, errMsg:"手机号不能为空"}
    }

    // let phoneNum = data.text
    // if (!(/^1[34578]\d{9}$/.test(phoneNum))) {
    //   return {isVal:false, errMsg:"手机号码格式有误，请重填"}
    // }
    return {isVal:true, errMsg:"ok"}
  }

  inputChange(text) {
  	let _text = removeSpace(text)
  	let formInfo = {
			formKey: this.props.formKey,
	    stateKey: this.props.stateKey,
	    data: {text: _text}
		}
    this.props.inputFormUpdate(formInfo)

    if (text && text.length > 0) {
      this.setState({showClear: true})
    } else {
      this.setState({showClear: false})
    }
  }

  renderClearBtn() {
    if (this.state.showClear) {
      return (
        <View style={[styles.defaultClearBtnStyle,
            {right:
               (this.props.containerStyle && this.props.containerStyle.paddingRight)
               ? (this.props.inputStyle && this.props.inputStyle.marginRight)
                  ? this.props.containerStyle.paddingRight + this.props.inputStyle.marginRight + 12
                  : this.props.containerStyle.paddingRight + 12
               : (this.props.inputStyle && this.props.inputStyle.marginRight)
                  ? normalizeW(17) + this.props.inputStyle.marginRight + 12
                  : normalizeW(17) + 12},
            this.props.clearBtnStyle]}>
          <TouchableOpacity onPress={() => this.clearInput()}>
            <Image style={{width: 25, height: 25}} source={require('../../../assets/images/delete_input.png')} />
          </TouchableOpacity>
        </View>
      )
    } else {
      return (
        <View />
      )
    }
  }

  clearInput() {
    let inputForm = {
      formKey: this.props.formKey,
      stateKey: this.props.stateKey,
      data: {text: ''}
    }
    this.props.inputFormUpdate(inputForm)
    this.setState({showClear: false})
  }

	render() {
		return (
      <View style={styles.containerWrap}>
        <FormInput
          onChangeText={(text) => this.inputChange(text)}
          autoFocus={this.props.autoFocus}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          maxLength={this.props.maxLength}
          underlineColorAndroid="transparent"
          value={formatPhone(this.props.data)}
          keyboardType={this.props.keyboardType}
          containerStyle={[styles.container, this.props.containerStyle && this.props.containerStyle]}
          inputStyle={[styles.input, this.props.inputStyle && this.props.inputStyle]}
          editable={this.props.editable}
        /> 
        {this.renderClearBtn()}
      </View>
      )
	}
}

PhoneInput.defaultProps = {
	placeholder: '请输入手机号',
	maxLength: 13, //11位手机号+2位空格
	autoFocus: false,
	keyboardType: "phone-pad",
  placeholderTextColor: '#B2B2B2',
  editable: true
}

const styles = StyleSheet.create({
  containerWrap: {
    
  },
  defaultClearBtnStyle: {
    position: 'absolute',
    right: normalizeW(12),
    top: normalizeH(12)
  },
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
  }
})

const mapStateToProps = (state, ownProps) => {
	let inputData = getInputData(state, ownProps.formKey, ownProps.stateKey)
  return {
    data: inputData.text
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
	initInputForm,
  inputFormUpdate,
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(PhoneInput)
