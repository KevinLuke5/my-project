import Vue from 'vue'
import 'normalize.css/normalize.css'
// 引入全局指令
import '@/utils/directive.js'

// 权限指令
import permission from './components/Permission'
import App from './App'
import store from './store'
import router from './router/routers'
import moment from 'moment'

import './assets/icons' // icon
import './router/index' // permission control
import './plugins/jyui.js'

import point from '@base/jy-point'
window.point = point

import Print from 'vue-print-nb'
Vue.use(Print)
// import * as Sentry from '@sentry/vue'

// import { BrowserTracing } from '@sentry/tracing'
import { addWatermark } from '@base/jy-watermark'
import { getDepthValue, formatPrice, copy, deepClone, plus, subtract, multiply, divide } from '@base/utils'

// 提供全局的一些方法
window._get = getDepthValue
window._clone = deepClone
window._formatPrice = formatPrice
window._copy = copy
window._plus = plus
window._subtract = subtract
window._multiply = multiply
window._divide = divide


Vue.use(permission)

// 注册全局组件
import ImgViewer from '@/components/Viewer/ImgViewer'
import PdfViewer from '@/components/Viewer/PdfViewer'
import VideoViewer from '@/components/Viewer/VideoViewer'
import FileViewer from '@/components/Viewer/FileViewer'
import AllViewer from '@/components/Viewer/AllViewer'
Vue.component('ImgViewer', ImgViewer)
Vue.component('PdfViewer', PdfViewer)
Vue.component('VideoViewer', VideoViewer)
Vue.component('FileViewer', FileViewer)
Vue.component('AllViewer', AllViewer)

import ImgUpload from '@/components/OssUpload/imgUpload'
import PdfUpload from '@/components/OssUpload/pdfUpload'
import VideoUpload from '@/components/OssUpload/videoUpload'
import FileUpload from '@/components/OssUpload/fileUpload'
import AllUpload from '@/components/OssUpload/allUpload'
Vue.component('ImgUpload', ImgUpload)
Vue.component('PdfUpload', PdfUpload)
Vue.component('VideoUpload', VideoUpload)
Vue.component('FileUpload', FileUpload)
Vue.component('AllUpload', AllUpload)


Vue.config.productionTip = false

Vue.prototype.getHeight = function () {
  let height = document.documentElement.clientHeight
  const fix = document.querySelector('.fixed-header').clientHeight
  let head = 0
  if (document.querySelector('.head-container') !== null) {
    head = document.querySelector('.head-container').clientHeight
  }
  const page = document.querySelector('.page').clientHeight
  height = height - head - page - fix - 88
  if (height < 400) {
    return 400
  } else {
    return height
  }
}

Vue.prototype.calHeight = function (otherHt) {
  let height = document.documentElement.clientHeight
  const fix = document.querySelector('.fixed-header').clientHeight
  let head = 0, page = 0
  if (document.querySelector('.head-container')) {
    head = document.querySelector('.head-container').clientHeight
  }
  if (document.querySelector('.page')) {
    page = document.querySelector('.page').clientHeight
  }
  height = height - head - page - fix - 88 - otherHt
  return height
}

// 自定义全局message
Vue.prototype.showMessage = function (message = '', type = 'warning') {
  this.$message({
    message,
    type
  })
}

// 自定义全局confirm
Vue.prototype.showConfirm = function (content = '', title = '提示', confirm = '确定', cancel = '取消') {
  return this.$confirm(content, title, {
    confirmButtonText: confirm,
    cancelButtonText: cancel,
    type: 'warning'
  })
}

// 自定义全局水印
Vue.prototype.addWatermark = (word, domid, params) => {
  let str = ''
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  if (userInfo) {
    str = userInfo.name + userInfo.userName
  }
  // 如果传值覆盖水印文字
  if (word) {
    str = word
  }
  addWatermark(str, domid, params)
}
// 处理日期
import { timeRangeFormat } from '@/utils/index'
Vue.prototype.timeRangeFormat = timeRangeFormat

point.webInit({
  pointPlatform: 2, //  都加埋点1 活动平台2 友盟3
  activityId: 149, // 活动平台id
  router,
  publicPath: '/srm-web/#'
})

// 挂载$bus
Vue.prototype.$bus = new Vue()

Vue.prototype.$moment = moment

// if (process.env.NODE_ENV === 'production') {
//   Sentry.init({
//     Vue,
//     dsn: 'https://5d14757523314385a5824728dc74212d@sentry-test.joyoung.com/12',
//     release: `${process.env.NODE_ENV}`,
//     integrations: [
//       new BrowserTracing({
//         routingInstrumentation: Sentry.vueRouterInstrumentation(router)
//       })
//     ],
//     tracesSampleRate: 1.0,
//     beforeSend (event) {
//       return event
//     }
//   })
// }

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
