import React, { Component } from 'react';
import { TodoModel, logIn } from './LeanCloud'
import { testuser } from './private.json'
import ToDoHeader from './ToDoHeader'
import ToDoInput from './ToDoInput'
import { StyleSheet, Text, View, FlatList, KeyboardAvoidingView, Alert, TouchableWithoutFeedback, Animated } from 'react-native'

export default class App extends Component {
  constructor(props) {
    super(props)
    logIn(testuser.email, testuser.password, () => { }, (error) => { Alert.alert(error) })
    this.state = {
      todoList: [],
      newTodo: '',
    }
    this.headerHeight = new Animated.Value(190)
    TodoModel.fetch(
      (items) => { this.setState({ todoList: items }) },
      (err) => { Alert.alert(err) }
    )
  }
  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={{ height: this.headerHeight, justifyContent: 'flex-end' }}>
          <ToDoHeader />
        </Animated.View>
        <View style={styles.itemsContainer}>
          <FlatList style={{ backgroundColor: '#fff', paddingHorizontal: 8 }}
            data={this.state.todoList.filter((item) => item.status !== 'deleted').map((item) => item)}
            keyExtractor={(item, index) => {
              if (index > 2) {
                this.lastItemOffsetY = (index - 2) * 48
              } else {
                this.lastItemOffsetY = 1
              }
              return item.id
            }}
            renderItem={({ item }) =>
              <TouchableWithoutFeedback
                onPress={this.changeStatus.bind(this, item)}
                onLongPress={this.deleteTodo.bind(this, item)}
              >
                <View style={{ paddingVertical: 16, borderBottomWidth: 1, borderColor: '#eaeaea' }}>
                  <Text style={{ textDecorationLine: item.status === 'undone' ? 'none' : 'line-through' }}>{item.content}</Text>
                </View>
              </TouchableWithoutFeedback>
            }
            keyboardDismissMode='interactive'
            onScroll={this.scroll.bind(this)}
            ref={(flatList) => this._flatList = flatList}
          />
        </View>
        <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
          <ToDoInput style={{ borderColor: '#eaeaea', borderTopWidth: 1, paddingVertical: 16, }}
            onChangeText={(newTodo) => { this.setState({ newTodo }) }}
            onSubmitEditing={this.addItem.bind(this)}
            value={this.state.newTodo}
            returnKeyType='done'
            blurOnSubmit={false}
            onFocus={this.scrollViewUp.bind(this)}
          />
        </KeyboardAvoidingView>
      </View>
    )
  }
  scroll(e) {
    this.headerFoldOrNot(e.nativeEvent.contentOffset.y)
  }
  headerFoldOrNot(scrollY) {
    if (scrollY > 0) {
      Animated.spring(this.headerHeight, {
        toValue: 100,
        duration: 50,
      }).start()
    } else if (scrollY < 0) {
      Animated.spring(this.headerHeight, {
        toValue: 190,
        duration: 50,
      }).start()
    }
  }
  scrollViewUp() {
    this._flatList.scrollToOffset({ offset: this.lastItemOffsetY, animated: true })
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
        this._flatList.scrollToEnd()
      },
      (error) => { Alert.alert(error) })
  }
  deleteTodo(todo) {
    Alert.alert('删除待办事项', `确定要删除【${todo.content}】吗？`,
      [
        { text: '取消', onPress: () => { }, style: 'cancel' },
        {
          text: '确定', onPress: () => {
            TodoModel.destroy(todo.id,
              () => {
                todo.status = 'deleted'
                this.setState(todo)
              },
              () => { Alert.alert('错误', '删除失败') }
            )
          }
        }
      ]
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
