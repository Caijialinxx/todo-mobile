import React, { Component } from 'react'
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native'

export default class LogIn extends Component {
  render() {
    return (
      <View style={styles.logInContainer}>
        <View>
          <TextInput ref={component => this._emailInput = component}
            value={this.props.data.email}
            textContentType='emailAddress'
            keyboardType='email-address'
            style={styles.input}
            placeholder='you@example.com'
            onChangeText={text => this.props.changeState.call(undefined, { email: text })}
            onSubmitEditing={() => this._passwordInput.focus()}
          />
          <TextInput ref={component => this._passwordInput = component}
            value={this.props.data.password}
            textContentType='password'
            secureTextEntry={true}
            style={styles.input}
            placeholder='password'
            onChangeText={text => this.props.changeState.call(undefined, { password: text })}
            onSubmitEditing={this.verifyInfo.bind(this)}
          />
        </View>
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsText} onPress={() => this.props.changeState.call(undefined, { selectedTab: 'signUp', password: '', passwordSet: '' })}>没有账号？去注册</Text>
          <Text style={styles.optionsText} onPress={() => this.props.resetPassword.call(undefined)}>忘记密码</Text>
        </View>
        <View style={styles.actionContainer}>
          <Button color='#fff' title='登录' onPress={this.verifyInfo.bind(this)} />
        </View>
      </View>
    )
  }
  verifyInfo() {
    let { email, password } = this.props.data,
      index_at = email.indexOf('@'),
      index_point = email.indexOf('.'),
      length_strAfterPoint = email.substr(index_point + 1).length

    if (email.trim() === '') {
      Alert.alert('邮箱不能为空', '请输入您注册的邮箱，如果未注册，点击下方的注册链接。', [{ onPress: () => { this._emailInput.focus() } }])
    } else if (password.trim() === '') {
      Alert.alert('密码不能为空', '', [{ onPress: () => { this._passwordInput.focus() } }])
    } else if (index_at < 1 || index_point < index_at + 2 || length_strAfterPoint < 2) {
      Alert.alert('电子邮箱无效', '请输入正确的电子邮箱地址！', [{ onPress: () => { this._emailInput.focus() } }])
    } else {
      this.props.logIn.call(undefined)
    }
  }
}

const styles = StyleSheet.create({
  logInContainer: {
    paddingHorizontal: 40,
  },
  input: {
    fontSize: 16,
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 6,
    marginVertical: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionsText: {
    textDecorationLine: 'underline',
    color: '#5575ee',
    paddingVertical: 10,
  },
  actionContainer: {
    height: 44,
    borderRadius: 8,
    padding: 6,
    marginVertical: 10,
    backgroundColor: '#5575ee',
  }
})