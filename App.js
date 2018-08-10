import React, { Component } from 'react';
import { TodoModel, logIn } from './LeanCloud'
import { testuser } from './private.json'
import ToDoHeader from './ToDoHeader'
import ToDoInput from './ToDoInput'
import { StyleSheet, Text, View, FlatList, KeyboardAvoidingView, Alert, TouchableWithoutFeedback } from 'react-native'

export default class App extends Component {
  constructor(props) {
    super(props)
    logIn(testuser.email, testuser.password, () => { }, (error) => { Alert.alert(error) })
    this.state = {
      todoList: [],
      newTodo: '',
    }
    TodoModel.fetch(
      (items) => { this.setState({ todoList: items }) },
      (err) => { Alert.alert(err) }
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <ToDoHeader />
        </View>
        <View style={styles.itemsContainer}>
          <FlatList style={{ backgroundColor: '#fff', paddingHorizontal: 8 }}
            data={this.state.todoList}
            renderItem={({ item }) =>
              <TouchableWithoutFeedback onPress={this.changeStatus.bind(this, item)}>
                <View style={{ paddingVertical: 16, borderBottomWidth: 1, borderColor: '#eaeaea' }}>
                  <Text style={{ textDecorationLine: item.status === 'undone' ? 'none' : 'line-through' }}>{item.content}</Text>
                </View>
              </TouchableWithoutFeedback>
            }
          />
        </View>
        <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
          <ToDoInput style={{ borderColor: '#eaeaea', borderTopWidth: 1, paddingVertical: 16, }}
            onChangeText={(newTodo) => { this.setState({ newTodo }) }}
            onSubmitEditing={this.addItem.bind(this)}
            value={this.state.newTodo}
          />
        </KeyboardAvoidingView>
      </View>
    )
  }
  changeStatus(todoTarget) {
    TodoModel.update('status', todoTarget,
      (updatedTodo) => { this.setState(updatedTodo) },
      (error) => { console.error(error) }
    )
  }
  addItem() {
    let { newTodo, todoList } = this.state
    let newItem = {
      order: todoList.length,
      content: newTodo,
      status: 'undone',
    }
    TodoModel.create(newItem,
      (id) => {
        newItem.id = id
        todoList.push(newItem)
        this.setState({
          newTodo: '',
          todoList: todoList
        })
      },
      (error) => { Alert.alert(error) })
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
