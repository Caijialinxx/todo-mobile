import React, { Component } from 'react';
import { TodoModel, logIn } from './LeanCloud'
import { testuser } from './private.json'
import ToDoHeader from './ToDoHeader'
import ToDoInput from './ToDoInput'
import { PanResponder, StyleSheet, Text, View, FlatList, KeyboardAvoidingView, Alert, TouchableWithoutFeedback, Animated, Image, ScrollView } from 'react-native'

export default class App extends Component {
  constructor(props) {
    super(props)
    logIn(testuser.email, testuser.password, () => { }, (error) => { Alert.alert(error) })
    this.state = {
      todoList: [],
      newTodo: '',
      isLongPressed: false,
      scrollEnabled: true,
    }
    this.headerHeight = new Animated.Value(190)
    this.horizontalScrollData = { originalValue: 0, action: '' }
    TodoModel.fetch(
      (items) => { this.setState({ todoList: items }) },
      (err) => { Alert.alert(err) }
    )

    this.itemsRefs = []       // 存放所有scrollview组件
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        // 记录当前触摸的位置
      },
      onPanResponderMove: (e, gestureState) => {
        if (this.state.isLongPressed) {
          this.setState({ scrollEnabled: false })
          // 激活样式并且跟着手指移动
        }
      },
      onPanResponderRelease: () => {
        // 取消样式，归位

        this.setState({ scrollEnabled: true, isLongPressed: false })
      },
      onShouldBlockNativeResponder: () => true,
    })
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
              <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
                horizontal={true} showsHorizontalScrollIndicator={false}
                onScroll={(e) => {
                  let distance = e.nativeEvent.contentOffset.x - this.horizontalScrollData.originalValue
                  if (distance < -40) {
                    this.horizontalScrollData.action = 'changeStatus'
                  } else if (distance > 40) {
                    this.horizontalScrollData.action = 'delete'
                  }
                }}
                scrollEventThrottle={16}
                onMomentumScrollEnd={this.horizontalScroll.bind(this, item)}
                scrollEnabled={this.state.scrollEnabled}
                ref={component => this.itemsRefs[item.order] = component}
                {... this.state.isLongPressed ? this._panResponder.panHandlers : null}
              >
                <View style={{ backgroundColor: '#388E3C', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 20 }}>
                  <Image style={{ tintColor: '#fff', width: 20, height: 20 }} source={require('./imgs/hook.png')} />
                </View>
                <TouchableWithoutFeedback
                  onPress={this.changeStatus.bind(this, item)}
                  onLongPress={() => { this.setState({ isLongPressed: true, scrollEnabled: false }) }}
                >
                  <View style={{ width: '100%', paddingHorizontal: 12, }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', height: 50, paddingVertical: 16, borderBottomWidth: 1, borderColor: '#eaeaea', }}>
                      <Image style={{ width: 14, height: 14, marginRight: 8 }} source={item.status === 'undone' ? require('./imgs/undone.png') : require('./imgs/done.png')} />
                      <Text style={{ textDecorationLine: item.status === 'undone' ? 'none' : 'line-through' }}>{item.content}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
                <View style={{ backgroundColor: '#db3a29', width: '100%', flexDirection: 'row', alignItems: 'center', paddingLeft: 20 }}>
                  <Image style={{ tintColor: '#fff', width: 20, height: 20 }} source={require('./imgs/bin.png')} />
                </View>
              </ScrollView>
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
  horizontalScroll(item) {
    if (this.horizontalScrollData.action === 'changeStatus') {
      this.changeStatus.call(this, item)
    } else if (this.horizontalScrollData.action === 'delete') {
      this.deleteTodo.call(this, item)
    }
    this.horizontalScrollData.action = ''
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
