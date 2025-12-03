import axios from 'axios'
import {
  Notification,
  MessageBox
} from '@base/jy-ui-plus'
import store from '../store'
import {
  getToken
} from '@/utils/auth'
import Config from '@/settings'
import Qs from 'qs'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api 的 base_url
  timeout: Config.timeout // 请求超时时间
})

// 请求列表(防重复提交)
const requestList = []
const cancelToken = axios.CancelToken

// request拦截器
service.interceptors.request.use(
  config => {
    // 防止重复提交（如果本次是重复操作，则取消，否则将该操作标记到requestList中）
    config.cancelToken = new cancelToken((cancel) => {
      const requestFlag = JSON.stringify(config.url) + JSON.stringify(config.data) + '&' + config.method
      // 请求标记已经存在，则取消本次请求，否则在请求列表中加入请求标记
      if (requestList.includes(requestFlag)) {
        // 取消本次请求
        cancel()
      } else {
        requestList.push(requestFlag)
      }
    })

    if (config.data) {
      config.data = Qs.stringify(config.data)
    }

    // 设置请求头
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded', // 模拟form表单方式提交请求
      'Authorization': store.getters.token === undefined ? '' : getToken() // 设置token
      // 'Accept-Language': Cookies.get('language') || (navigator.language || navigator.browserLanguage).substr(0,2)
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    // 请求返回后，将请求标记从requestList中移除
    const requestFlag = JSON.stringify(response.config.url) + JSON.stringify(response.config.data) + '&' + response.config.method
    requestList.splice(requestList.findIndex(item => item === requestFlag), 1)

    const code = response.status
    const reqestCode = response.data.errorCode
    if (code === 200) {
      if (reqestCode === '0000') {
        return response.data
      } else if (reqestCode === '1000') {
        MessageBox.alert(
          'token不存在或token非法，请重新登录！',
          '系统提示', {
            confirmButtonText: '重新登录',
            showClose: false,
            closeOnClickModal: false,
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      } else if (reqestCode === '1001') {
        MessageBox.alert(
          '登录状态已过期，请重新登录！',
          '系统提示', {
            confirmButtonText: '重新登录',
            showClose: false,
            closeOnClickModal: false,
            type: 'warning'
          }
        ).then(() => {
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      } else if (typeof (reqestCode) === 'undefined') {
        // Notification.error({
        //   title: "数据格式错误，请联系管理员！"
        // })
        // return Promise.reject('error')
        return response.data
      } else {
        Notification.error({
          title: response.data.message
        })
        return Promise.reject('error')
      }
    }
  },
  error => {
    if (error.response) { // cancel掉的请求会走到error里弹出报错,做一个判断过滤掉
      let code = 0
      try {
        code = error.response.data.status
      } catch (e) {
        if (error.toString().indexOf('Error: timeout') !== -1) {
          Notification.error({
            title: '网络请求超时',
            duration: 3000
          })
          return Promise.reject(error)
        }
      }
      if (code) {
        const errorMsg = error.response.data.message || error.response.data.status
        if (errorMsg !== undefined) {
          Notification.error({
            title: errorMsg,
            duration: 3000
          })
        }
      } else {
        Notification.error({
          title: '接口请求失败',
          duration: 3000
        })
      }
      return Promise.reject(error)
    }
  }
)
export default service
