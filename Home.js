import React, { Component } from 'react'
import { TodoModel } from './LeanCloud'
import ToDoHeader from './ToDoHeader'
import ToDoItem from './ToDoItem'
import ToDoInput from './ToDoInput'
import { Image, StyleSheet, View, FlatList, Keyboard, KeyboardAvoidingView, Alert, Animated, } from 'react-native'
import profileImg from './imgs/profile.png'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      todoList: [],
      newTodo: '',
      scrollEnabled: true,
    }
    this.headerHeight = new Animated.Value(120)
    this.headerOpacity = new Animated.Value(1)
    this.navHeaderOpacity = new Animated.Value(0)

    this.navigate = this.props.navigation.navigate
    if (this.props.navigation.state.params === undefined) {
      this.navigate('SignInOrUp')
      return
    } else {
      TodoModel.fetch(
        (items) => { this.setState({ todoList: items }) },
        (err) => { Alert.alert(err) }
      )
    }
  }
  render() {
    const navigate = this.navigate
    return (
      <View style={styles.container}>
        <View style={styles.navigatorContainer}>
          <View style={styles.profileBtn}
            onTouchEnd={() => navigate('Profile', { username: this.props.navigation.state.params.username })}>
            <Image source={profileImg} style={styles.profileImg} />
          </View>
          <View style={styles.navHeaderContainer}>
            <Animated.Text style={[styles.navHeaderText, { opacity: this.navHeaderOpacity }]}>我的一天</Animated.Text>
          </View>
        </View>
        <Animated.View ref={component => this._header = component} style={[styles.headerContainer, { height: this.headerHeight, opacity: this.headerOpacity }]}>
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
            onMomentumScrollBegin={this.scroll.bind(this)}
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
      </View >
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
    Animated.parallel([
      Animated.timing(this.headerHeight, {
        toValue: 0,
        duration: e.duration,
      }).start(),
      Animated.timing(this.headerOpacity, {
        toValue: 0,
        duration: e.duration,
      }).start(),
      Animated.timing(this.navHeaderOpacity, {
        toValue: 1,
        duration: e.duration,
      }).start(),
    ])
  }
  keyboardWillHide(e) {
    Animated.parallel([
      Animated.timing(this.headerHeight, {
        toValue: 120,
        duration: e.duration,
      }).start(),
      Animated.timing(this.headerOpacity, {
        toValue: 1,
        duration: e.duration,
      }).start(),
      Animated.timing(this.navHeaderOpacity, {
        toValue: 0,
        duration: e.duration,
      }).start(),
    ])
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
      this.keyboardWillShow.call(this, { duration: 180 })
    } else if (scrollY < 0) {
      this.keyboardWillHide.call(this, { duration: 180 })
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
        { text: '取消', style: 'cancel' },
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
    backgroundColor: '#fff',
  },
  navigatorContainer: {
    paddingTop: 20,
    backgroundColor: '#5d6fec',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileBtn: {
    padding: 10,
  },
  profileImg: {
    tintColor: '#fff',
    width: 20,
    height: 20,
  },
  navHeaderContainer: {
    padding: 10,
  },
  navHeaderText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContainer: {
    justifyContent: 'flex-end',
    overflow: 'hidden',
    backgroundColor: '#5d6fec',
  },
  itemsContainer: {
    flex: 1,
  },
})