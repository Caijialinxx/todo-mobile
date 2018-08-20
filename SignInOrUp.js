import React, { Component } from 'react'
import { Platform, StyleSheet, Keyboard, ScrollView, View, Animated, Alert, AlertIOS } from 'react-native'
import SignUp from './SignUp'
import LogIn from './LogIn'
import { logIn, signUp, reset } from './LeanCloud'
import logo from './imgs/logo.png'

export default class SignUpOrIn extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'logIn',
      email: '',
      passwordSet: '',
      password: '',
    }
    this.logoSize = new Animated.Value(100)
  }
  render() {
    return (
      <ScrollView scrollEnabled={false} keyboardDismissMode='interactive' behavior="padding" style={styles.container}>
        <View style={styles.headerContainer}>
          <Animated.Image style={{ width: this.logoSize, height: this.logoSize }} source={logo} />
        </View>
        {
          this.state.selectedTab === 'signUp' ?
            <SignUp data={this.state} changeState={this.changeState.bind(this)} signUp={this.signUp.bind(this)} /> :
            <LogIn data={this.state} changeState={this.changeState.bind(this)} logIn={this.logIn.bind(this)} resetPassword={this.resetPassword.bind(this)} />
        }
      </ScrollView>
    )
  }
  componentDidMount() {
    this._keyboardWillShow = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
    this._keyboardWillHide = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
  }
  componentWillUnmount() {
    this._keyboardWillShow.remove();
    this._keyboardWillHide.remove();
  }
  keyboardWillShow(e) {
    Animated.timing(this.logoSize, {
      toValue: 50,
      duration: e.duration,
    }).start()
  }
  keyboardWillHide(e) {
    Animated.timing(this.logoSize, {
      toValue: 100,
      duration: e.duration,
    }).start()
  }
  changeState(stateObj) {
    this.setState({
      selectedTab: (stateObj.selectedTab === undefined ? this.state.selectedTab : stateObj.selectedTab),
      email: (stateObj.email === undefined ? this.state.email : stateObj.email),
      passwordSet: (stateObj.passwordSet === undefined ? this.state.passwordSet : stateObj.passwordSet),
      password: (stateObj.password === undefined ? this.state.password : stateObj.password),
    })
  }
  resetPassword() {
    if (Platform.OS === 'ios') {
      AlertIOS.prompt('重置密码',
        `请输入电子邮箱地址，我们将向其发送重置密码的邮件，您根据此邮件的说明即可重新设置新密码。一旦设置成功，旧密码就会失效，您需要通过新密码重新登录。`,
        [
          {
            text: '发送', onPress: (email) => {
              console.log(email)
              let success = () => { Alert.alert(`已向您的邮箱【${email.trim()}】发送重置密码邮件，请转至邮箱查收！`) },
                error = (error) => { Alert.alert(error) }
              reset(email, success, error)
            }
          },
          { text: '取消', style: 'cancel' }
        ], 'plain-text', this.state.email, 'email-address')
    } else {
      let email = this.state.email
      if (email)
        Alert.alert('重置密码', `我们将会向您的邮箱【${this.state.email}】发送重置密码的邮件，一旦设置成功，旧密码就会失效，您需要通过新密码重新登录。`, [
          {
            text: '发送', onPress: () => {
              let success = () => { Alert.alert(`已向您的邮箱【${email}】发送重置密码邮件，请转至邮箱查收！`) },
                error = (error) => { Alert.alert(error) }
              reset(email, success, error)
            }
          },
          { text: '取消', style: 'cancel' }
        ], )
      else {
        Alert.alert('请输入电子邮箱地址', `请在登录页面的电子邮箱输入框中输入电子邮箱地址，然后再点击忘记密码。`)
      }
    }
  }
  signUp() {
    let { email, password } = this.state,
      success = () => {
        Alert.alert('验证邮件已发送', `已向你的邮箱【${email.trim()}】发送验证邮件，请转至邮箱查收并进行验证！`,
          [{ onPress: () => this.changeState.call(this, { passwordSet: '', selectedTab: 'logIn' }) }])
      },
      error = (error) => {
        Alert.alert('错误', error, [{ onPress: () => this.setState({ passwordSet: '', password: '' }) }])
      }
    signUp(email, password, success, error)
  }
  logIn() {
    let { email, password } = this.state,
      success = (user) => { this.props.navigation.navigate('Home', { username: user.username }) },
      error = (error) => { Alert.alert(error) }
    logIn(email, password, success, error)
    this.setState({ password: '' })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  headerContainer: {
    paddingTop: 30,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpContainer: {
    paddingHorizontal: 40,
  },
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