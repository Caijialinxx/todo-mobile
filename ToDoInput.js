import React, { Component } from 'react';
import { Platform, TextInput } from 'react-native';

export default class NewTextInput extends Component {
  shouldComponentUpdate(nextProps) {
    console.log(this.props.defaultValue, nextProps.defaultValue)
    console.log(this.props.defaultValue === nextProps.defaultValue)
    return Platform.OS !== 'ios'
      || (this.props.value === nextProps.value && (nextProps.defaultValue == undefined || nextProps.defaultValue == ''))
      || (this.props.defaultValue === nextProps.defaultValue && (nextProps.value == undefined || nextProps.value == ''));
  }
  render() {
    return <TextInput {...this.props} placeholder='添加待办事项' placeholderTextColor='#5575ee' enablesReturnKeyAutomatically={true} />;
  }
}