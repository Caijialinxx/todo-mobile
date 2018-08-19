import React, { Component } from 'react'
import { StyleSheet, View, Text, Image, Button, } from 'react-native'
import { logOut } from './LeanCloud'
import homeImg from './imgs/home.png'
import profileImg from './imgs/profile.png'

export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: this.props.navigation.state.params.username,
    }
  }
  render() {
    const { navigate } = this.props.navigation
    return (
      <View style={styles.container}>
        <View style={styles.navigatorContainer}>
          <View style={styles.homeBtn} onTouchEnd={() => navigate('Home')}>
            <Image source={homeImg} style={styles.homeImg} />
          </View>
        </View>
        <View style={styles.headerContainer}>
          <View style={styles.profileContainer}>
            <Image source={profileImg} style={styles.profileImg} />
          </View>
          <Text style={{ fontSize: 16 }}>{this.state.username}</Text>
        </View>
        <View style={styles.itemsContainer}>
          <Button color='red' title='注销'
            onPress={() => {
              logOut()
              navigate('SignInOrUp')
            }} />
        </View>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  navigatorContainer: {
    paddingTop: 20,
    backgroundColor: '#fafafa',
    borderBottomColor: '#eaeaea',
    borderBottomWidth: 1,
    marginVertical: 8,
  },
  homeBtn: {
    padding: 10,
  },
  homeImg: {
    tintColor: '#5575ee',
    width: 20,
    height: 20,
  },
  headerContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderColor: '#eaeaea',
    borderWidth: 1,
    marginVertical: 8,
  },
  profileContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  profileImg: {
    tintColor: '#aaa',
    width: 20,
    height: 20,
  },
  itemsContainer: {
    // flex: 1,
    // justifyContent: 'flex-start',
    backgroundColor: '#fafafa',
    borderColor: '#eaeaea',
    borderWidth: 1,
    marginVertical: 8,
    paddingVertical: 6,
  },
})