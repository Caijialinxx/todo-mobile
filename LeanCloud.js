import AV from 'leancloud-storage';
import { leancloud } from './private.json'

let APP_ID = leancloud.id
let APP_KEY = leancloud.key
AV.init({ appId: APP_ID, appKey: APP_KEY })

export const TodoModel = {
  fetch(successFn, errorFn) {
    let query = new AV.Query('Todo');
    query.addAscending('order').find().then((todos) => {
      let items = todos.map((todo) => {
        return {
          id: todo.id,
          order: todo.attributes.order,
          content: todo.attributes.content,
          status: todo.attributes.status
        }
      })
      successFn.call(undefined, items)
    }, (error) => { errorFn.call(undefined, `错误代码：${error.code}\n错误消息：请求被终止，请检查网络是否正确连接！`) })
  },
  create(item, successFn, errorFn) {
    if (AV.User.current()) {
      let Todo = AV.Object.extend('Todo')
      let todo = new Todo()
      todo.set('order', item.order)
      todo.set('content', item.content)
      todo.set('status', item.status)

      let acl = new AV.ACL()
      acl.setPublicReadAccess(false)
      acl.setReadAccess(AV.User.current(), true)
      acl.setWriteAccess(AV.User.current(), true)
      todo.setACL(acl)

      todo.save().then(function (todo) {
        successFn.call(undefined, todo.id)
      }, function (error) {
        errorFn.call(undefined, error)
      })
    } else {
      errorFn.call(undefined, '当前未登录！无法使用！')
    }
  },
}

export function logIn(email, password, successFn, errorFn) {
  AV.User.logIn(email, password).then((loggedInUser) => {
    let user = getUserInfo(loggedInUser)
    successFn.call(undefined, user)
  }, (error) => {
    switch (error.code) {
      case -1:
        errorFn.call(undefined, `错误代码：${error.code}\n错误消息：请求被终止，请检查网络是否正确连接！`)
        return;
      case 210:
        errorFn.call(undefined, `错误代码：${error.code}\n错误消息：账号或密码错误！请检查！`)
        return;
      case 211:
        errorFn.call(undefined, `错误代码：${error.code}\n错误消息：账号不存在！如果未注册请先注册。`)
        return;
      case 216:
        errorFn.call(undefined, `错误代码：${error.code}\n错误消息：电子邮箱未通过验证，请先验证再登录！验证邮件已发送至您的邮箱（${email}），请转至邮箱查收并进行验证！`)
        verify(email)
        return;
      case 219:
        errorFn.call(undefined, `错误代码：${error.code}\n错误消息：登录失败次数超过限制，请稍候再试！或者通过忘记密码重设密码。`)
        return;
      default:
        errorFn.call(undefined, `错误代码：${error.code}\n错误消息：${error.message}`)
        return;
    }
  })
}


function getUserInfo(AVUser) {
  return {
    id: AVUser.id,
    email: AVUser.attributes.email,
    emailVerified: AVUser.attributes.emailVerified,
    username: AVUser.attributes.username
  }
}