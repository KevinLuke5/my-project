import Vue from 'vue'
import store from '@/store'

Vue.directive('dragContent', {
  bind (el, binding, vnode, oldVnode) {
    const dragTop = el.querySelector('.topContent')
    const dragBottom = el.querySelector('.bottomContent')
    const dragBody = el.querySelector('.dragContent')

    const maxinstance = el.style.height.replace(/\px/g, '') - 100
    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const top = dragTop.style.height
    const bottom = dragBottom.style.height

    dragBody.onmousedown = e => {
      const dis = e.clientY - dragTop.offsetTop

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
      // 获取到的值带px 正则匹配替换
      let styT, styB

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (top.includes('%')) {
        styT =
          +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styB =
          +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styT = +dragTop.style.height.replace(/\px/g, '')
        styB = +dragBottom.style.height.replace(/\px/g, '')
      }

      document.onmousemove = function (e) {
        const instance = e.clientY - dis

        if (styT + instance < 100) {
          dragTop.style.height = '100px'
          dragBottom.style.height = `${maxinstance}px`
        } else if (styB - instance < 100) {
          dragBottom.style.height = '100px'
          dragTop.style.height = `${maxinstance}px`
        } else {
          dragTop.style.height = `${styT + instance}px`
          dragBottom.style.height = `${styB - instance}px`
        }
      }
    }
  }
})

// 注册一个全局自定义指令 `v-check`
Vue.directive('check', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding) {
    // 传入一个对象字面的形式  使用方法v-check="'对应的属性'"
    const codes = store.getters && store.getters.codes // 获取store的codes值
    // if (codes[binding.value]) {
    if (!codes[binding.value]) {
      // 判断codes 的值是否是true
      el.parentNode.removeChild(el) // 如果codes 的值不是true  移除元素
    }
    // }
  }
})

// 注册一个全局自定义指令 `v-auth`
Vue.directive('auth', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el, binding) {
    const auths = JSON.parse(sessionStorage.getItem('auths')) || []
    if (!auths.includes(binding.value)) {
      el.parentNode.removeChild(el) // 如果auths不存在该值 移除元素
    }
  }
})

Vue.directive('Zloading', {
  update (el, binding, vnode) {
    if (binding.value) {
      el.style.position = 'relative'
      const div = document.createElement('div')
      div.setAttribute('id', 'loading')
      const height = el.offsetHeight
      const width = el.offsetWidth
      div.innerHTML = '加载中...'
      div.style.color = 'white'
      div.style.padding = '200px'
      div.style.zIndex = '999'
      div.style.display = 'flex'
      div.style.alignItems = 'top'
      div.style.justifyContent = 'center'
      div.style.position = 'absolute'
      div.style.height = `${height}px`
      div.style.width = `${width}px`
      div.style.top = '0'
      div.style.transition = '0.5s'
      div.style.background = 'rgba(0,0,0,0.3)'
      div.style.left = '0'
      el.appendChild(div)
    } else {
      el && el.removeChild(document.getElementById('loading'))
    }
  }
})

// v-dialogDrag: 弹窗拖拽
Vue.directive('dialogDrag', {
  bind (el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dialogHeaderEl.style.cursor = 'move'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

    dialogHeaderEl.onmousedown = e => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop

      // 获取到的值带px 正则匹配替换
      let styL, styT

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL =
          +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT =
          +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        const t = e.clientY - disY

        // 移动当前元素
        dragDom.style.left = `${l + styL}px`
        dragDom.style.top = `${t + styT}px`

        // 将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})

// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
  bind (el, binding, vnode, oldVnode) {
    const dragDom = el.querySelector('.el-dialog')

    dragDom.onmousedown = e => {
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - el.offsetLeft

      document.onmousemove = function (e) {
        e.preventDefault() // 移动时禁用默认事件

        // 通过事件委托，计算移动的距离
        const l = e.clientX - disX
        dragDom.style.width = `${l}px`
      }

      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  }
})
