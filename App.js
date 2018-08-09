import React, { Component } from 'react';
import ToDoHeader from './ToDoHeader'
import ToDoInput from './ToDoInput'
import { StyleSheet, Text, View, FlatList, KeyboardAvoidingView } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: '',
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <ToDoHeader />
        </View>
        <View style={styles.itemsContainer}>
          <FlatList style={{ backgroundColor: '#fff', paddingHorizontal: 8 }}
            data={[{ key: '代办1' }, { key: '代办2' }, { key: '代办3' }]}
            renderItem={({ item }) =>
              <View style={{ paddingVertical: 16, borderBottomWidth: 1, borderColor: '#eaeaea' }}>
                <Text>{item.key}</Text>
              </View>
            }
          />
        </View>
        <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
          <ToDoInput style={{ borderColor: '#eaeaea', borderTopWidth: 1, paddingVertical: 16, }}
            onChangeText={(text) => { this.setState({ text }) }}
            onSubmitEditing={() => { this.setState({ text: '' }) }}
            value={this.state.text}
          />
        </KeyboardAvoidingView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  headerContainer: {
  },
  itemsContainer: {
    flex: 1,
  },
  inputContainer: {
    paddingHorizontal: 8
  }
});
