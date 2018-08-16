import React, { Component } from 'react'
import { ScrollView, View, Text, Image, TouchableWithoutFeedback, PanResponder, StyleSheet } from 'react-native'

export default class ToDoItems extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLongPressed: false,
    }
    this.horizontalScrollData = { originalValue: 0, action: '', activedColor: '#ccc' }
    this.itemsRefs = []       // 存放所有scrollview组件
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => { this.startAt.call(this, e) },
      onPanResponderMove: (e, gestureState) => {
        if (this.state.isLongPressed) {
          this.props.setScrollEnabled(false)
          this.moveTo.call(this, e, gestureState)
        }
      },
      onPanResponderRelease: () => {
        this.endMoveAt.call(this)
        this.setState({ isLongPressed: false })
        this.props.setScrollEnabled(true)
      },
      onShouldBlockNativeResponder: () => true,
    })
  }
  render() {
    return (
      <ScrollView scrollEnabled={this.props.scrollEnabled}
        ref={component => this.itemsRefs[this.props.todo.order] = component}
        contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
        horizontal={true} showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={(e) => {
          let distance = e.nativeEvent.contentOffset.x - this.horizontalScrollData.originalValue
          if (distance < -40) {
            this.horizontalScrollData.action = 'changeStatus'
          }
          else if (distance > 40) {
            this.horizontalScrollData.action = 'delete'
          }
        }}
        onMomentumScrollEnd={this.horizontalScroll.bind(this, this.props.todo)}
        {... this.state.isLongPressed ? this._panResponder.panHandlers : null}
      >
        <View style={styles.changeStatusContainer}
        >
          <Image style={styles.imageInHiddenContainer} source={require('./imgs/hook.png')} />
        </View>
        <TouchableWithoutFeedback
          onPress={() => { this.props.changeStatus.call(this, this.props.todo) }}
          onLongPress={() => { this.setState({ isLongPressed: true }) }}
        >
          <View style={styles.itemContainer}>
            <View style={styles.itemView}>
              <Image style={styles.itemImage} source={this.props.todo.status === 'undone' ? require('./imgs/undone.png') : require('./imgs/done.png')} />
              <Text style={this.props.todo.status === 'undone' ? styles.itemUndone : styles.itemDone}>{this.props.todo.content}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.deleteItemContainer}
        >
          <Image style={styles.imageInHiddenContainer} source={require('./imgs/bin.png')} />
        </View>
      </ScrollView>
    )
  }
  horizontalScroll(todo) {
    if (this.horizontalScrollData.action === 'changeStatus') {
      this.props.changeStatus.call(undefined, todo)
    } else if (this.horizontalScrollData.action === 'delete') {
      this.props.deleteTodo.call(undefined, todo)
    }
    this.horizontalScrollData.action = ''
  }
  startAt(e) {
    // return the position which event started at
  }
  moveTo(e, ges) {
    // move element to the place needed
  }
  endMoveAt() {
    // place the element to right place side by side
  }
}

const styles = StyleSheet.create({
  changeStatusContainer: {
    backgroundColor: '#388E3C',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 20,
  },
  deleteItemContainer: {
    backgroundColor: '#DB3A29',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
  },
  imageInHiddenContainer: {
    tintColor: '#fff',
    width: 20,
    height: 20,
  },
  itemContainer: {
    width: '100%',
    paddingHorizontal: 12,
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  itemImage: {
    width: 14,
    height: 14,
    marginRight: 8,
  },
  itemUndone: {
    textDecorationLine: 'none',
    color: '#000',
  },
  itemDone: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
})