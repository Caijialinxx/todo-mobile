import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class Time extends Component {
  constructor(props) {
    super(props)
    this.state = {
      month: (new Date()).getMonth(),
      date: (new Date()).getDate(),
      day: (new Date()).getDay(),
    }
  }
  render() {
    let day = this.state.day
    switch (day) {
      case 1: day = '一'
        break
      case 2: day = '二'
        break
      case 3: day = '三'
        break
      case 4: day = '四'
        break
      case 5: day = '五'
        break
      case 6: day = '六'
        break
      default: day = '日'
        break
    }
    return (
      <Text style={styles.subtitle}>{this.state.month + 1 + '月' + this.state.date + '日 星期' + day}</Text>
    )
  }
  changeDate() {
    this.state.date.setHours(24)
  }
}

export default class ToDoHeader extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.maintitle}>我的一天</Text>
        <Time />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
    padding: 8,
  },
  header: {
    fontSize: 16,
  },
  maintitle: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
  }
});
