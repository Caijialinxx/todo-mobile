import React, { Component } from 'react'
import { StyleSheet, View, Text, TextInput, Button, Alert } from 'react-native'

export default class SignUp extends Component {
  render() {
    return (
      <View style={styles.signUpContainer}>
        <View>
          <TextInput ref={component => this._emailInput = component}
            value={this.props.data.email}
            textContentType='emailAddress'
            keyboardType='email-address'
            style={styles.input}
            placeholder='you@example.com'
            onChangeText={text => this.props.changeState.call(undefined, { email: text })}
            onSubmitEditing={() => this._passwordSetInput.focus()}
          />
          <TextInput ref={component => this._passwordSetInput = component}
            value={this.props.data.passwordSet}
            textContentType='password'
            secureTextEntry={true}
            style={styles.input}
            placeholder='create a password'
            onChangeText={text => this.props.changeState.call(undefined, { passwordSet: text })}
            onSubmitEditing={() => this._passwordConfirmInput.focus()}
          />
          <TextInput ref={component => this._passwordConfirmInput = component}
            value={this.props.data.password}
            textContentType='password'
            secureTextEntry={true}
            style={styles.input}
            placeholder='confirm your password'
            onChangeText={text => this.props.changeState.call(undefined, { password: text })}
            onSubmitEditing={this.verifyInfo.bind(this)}
          />
        </View>
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsText} onPress={() => this.props.changeState.call(undefined, { selectedTab: 'logIn', passwordSet: '' })}>已有账号？去登录</Text>
        </View>
        <View style={styles.actionContainer}>
          <Button color='#fff' title='注册' onPress={this.verifyInfo.bind(this)} />
        </View>
      </View>
    )
  }
  verifyInfo() {
    let { email, passwordSet, password } = this.props.data,
      index_at = email.indexOf('@'),
      index_point = email.indexOf('.'),
      length_strAfterPoint = email.substr(index_point + 1).length

    if (email.indexOf(' ') > -1 || email === '') {
      Alert.alert('电子邮箱无效', '请检查电子邮箱地址是否为空或含有空格！', [{ onPress: () => { this._emailInput.focus() } }])
    } else if (index_at < 1 || index_point < index_at + 2 || length_strAfterPoint < 2) {
      Alert.alert('电子邮箱无效', '请检查电子邮箱地址的格式！', [{ onPress: () => { this._emailInput.focus() } }])
    } else if (password.indexOf(' ') > -1 || password === '') {
      Alert.alert('密码无效', '密码不能为空或含有空格，请重新设置！', [{
        onPress: () => {
          this.props.changeState.call(undefined, { passwordSet: '', password: '' })
          this._passwordSetInput.focus()
        }
      }])
    } else if (passwordSet !== password) {
      Alert.alert('密码不一致', '两次输入的密码不一致，注意大小写及标点符号的使用。请重新输入！', [{
        onPress: () => {
          this.props.changeState.call(undefined, { passwordSet: '', password: '' })
          this._passwordSetInput.focus()
        }
      }])
    }
    else {
      this.props.signUp.call(undefined)
    }
  }
}

const styles = StyleSheet.create({
  signUpContainer: {
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