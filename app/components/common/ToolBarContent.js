/**
 * Created by zachary on 2017/1/3.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Platform,
  TextInput,
  TouchableOpacity,
  Text
} from 'react-native'

import {em, normalizeW, normalizeH, normalizeBorder} from '../../util/Responsive'
import THEME from '../../constants/theme'

export default class ToolBarContent extends Component {

  static defaultProps = {
    placeholder: '回复:',
    multiline: true
  }

  constructor(props) {
    super(props)

    this.state = {
      content: '',
    }
  }

  setFocus() {
    this.input.focus()
  }

  onSend() {
    this.props.onSend(this.state.content)
  }

  onChangeText(text) {
    this.setState({
      content: text
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <TextInput
          ref={(input) => this.input = input}
          placeholder={this.props.placeholder}
          placeholderTextColor={this.props.placeholderTextColor}
          multiline={this.props.multiline}
          onChange={this.props.onChange}
          onChangeText={this.onChangeText.bind(this)}
          style={[styles.textInput, this.props.textInputStyle]}
          value={this.props.initValue}
          enablesReturnKeyAutomatically={true}
          underlineColorAndroid="transparent"
          {...this.props.textInputProps}
        />

        <TouchableOpacity
          style={[styles.btnContainer, this.props.btnContainerStyle]}
          onPress={() => {this.onSend()}}
        >
          <Text style={[styles.btnText, this.props.btnTextStyle]}>{this.props.label || '发表'}</Text>
        </TouchableOpacity>
      </View>

    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    height: normalizeH(50),
  },
  textInput: {
    flex: 1,
    margin:0,
    padding: 10,
    fontSize: 16,
  },
  btnContainer: {
    padding: 5,
    width: 60,
    backgroundColor: THEME.colors.yellow,
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  }
})
