import React, { Component } from 'react';
import { Platform, View, Image, TextInput } from 'react-native';

export default class NewTextInput extends Component {
  shouldComponentUpdate(nextProps) {
    return Platform.OS !== 'ios'
      || (this.props.value === nextProps.value && (nextProps.defaultValue == undefined || nextProps.defaultValue == ''))
      || (this.props.defaultValue === nextProps.defaultValue && (nextProps.value == undefined || nextProps.value == ''));
  }
  render() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderColor: '#eaeaea', borderTopWidth: 1, paddingHorizontal: 8 }}>
        <Image style={{ width: 14, height: 14, marginRight: 8, marginVertical: 16, }} source={require('./imgs/add.png')} />
        <TextInput {...this.props} style={{ paddingVertical: 16, flex: 1 }} placeholder='添加待办事项' placeholderTextColor='#5575ee' enablesReturnKeyAutomatically={true} />
      </View>
    )
  }
}