import React, { Component } from 'react'
import { TodoModel, logIn } from './LeanCloud'
import { testuser } from './private.json'
import ToDoHeader from './ToDoHeader'
import ToDoItem from './ToDoItem'
import ToDoInput from './ToDoInput'
import { StyleSheet, View, FlatList, KeyboardAvoidingView, Alert, Animated, } from 'react-native'

export default class App extends Component {
  constructor(props) {
    super(props)
    logIn(testuser.email, testuser.password, () => { }, (error) => { Alert.alert(error) })
    this.state = {
      todoList: [],
      newTodo: '',
      scrollEnabled: true,
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
          <FlatList scrollEnabled={this.state.scrollEnabled}
            data={this.state.todoList.filter((item) => item.status !== 'deleted').map((item) => item)}
            keyExtractor={(item, index) => {
              if (index > 2) {
                this.lastItemOffsetY = (index - 2) * 50
              } else {
                this.lastItemOffsetY = 1
              }
              return item.id
            }}
            renderItem={({ item }) =>
              <ToDoItem todo={item}
                scrollEnabled={this.state.scrollEnabled}
                changeStatus={this.changeStatus.bind(this)}
                deleteTodo={this.deleteTodo.bind(this)}
                setScrollEnabled={this.setScrollEnabled.bind(this)}
              />
            }
            keyboardDismissMode='interactive'
            onScroll={this.scroll.bind(this)}
            ref={(flatList) => this._flatList = flatList}
          />
        </View>
        <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
          <ToDoInput
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
  getIdByPosition(y) {
    for (let i = 0; i < this.itemsRefs.length; i++) {
      if (y > i * 50 && y <= 50 * (i + 1)) {
        return i
      } else if (i === this.itemsRefs.length - 1) {
        return -1
      }
    }
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
      (updateTodo) => {
        todoTarget = updateTodo
        this.setState(this.state)
      },
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
  setScrollEnabled(boolean) {
    this.setState({ scrollEnabled: boolean })
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
  }
});
