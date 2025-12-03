<template>
  <div class="navbar">
    <div>
      <hamburger
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar"
      />
      <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    </div>
    <show-company />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <span class="greetings" style="margin-right: 10px">{{
          date | formatDate
        }}</span>
        <span class="greetings"> {{ name }}，欢迎回来！ </span>
        <span class="assistant" @click="goToDoc">操作手册</span>
        <j-tooltip content="全屏缩放" effect="dark" placement="bottom">
          <screenfull id="screenfull" class="right-menu-item hover-effect" />
        </j-tooltip>
        <j-tooltip content="下载管理" effect="dark" placement="bottom">
          <div class="download-wrapper" @click="toDownLoad">
            <img :src="downloadUrl" class="download">
          </div>
        </j-tooltip>
        <j-tooltip content="个人中心" effect="dark" placement="bottom">
          <div class="avatar-wrapper" @click="to">
            <img :src="Avatar" class="user-avatar">
          </div>
        </j-tooltip>
        <j-tooltip content="退出" effect="dark" placement="bottom">
          <div class="exit-wrapper" @click="open">
            退出
          </div>
        </j-tooltip>
      </template>
    </div>
  </div>
</template>

<script>
import ShowCompany from '@/components/SwitchCompany'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import Avatar from '@/assets/images/avatar.png'
import DownLoad from '@/assets/images/download.png'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    ShowCompany
  },
  filters: {
    formatDate (date) {
      // 当前时间格式化处理
      var str = ''
      var weekDay = [
        '星期天',
        '星期一',
        '星期二',
        '星期三',
        '星期四',
        '星期五',
        '星期六'
      ]
      str += date.getFullYear() + '年' // 获取年份
      str += date.getMonth() + 1 + '月' // 获取月份
      str += date.getDate() + '日' // 获取日
      str +=
        ' ' +
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) +
        ':' // 获取时
      str +=
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':' // 获取分
      str +=
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds() // 获取秒
      str += ' ' + weekDay[date.getDay()] // 获取星期
      return str
    }
  },
  data () {
    return {
      Avatar: Avatar,
      DownLoad: DownLoad,
      dialogVisible: false,
      date: new Date(), // 当前日期
      downloadUrl:
        'https://jyai.oss-cn-hangzhou.aliyuncs.com/rms/admin/upload/html/20220901111147904.png'
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'device', 'user', 'baseApi', 'name']),
    show: {
      get () {
        return this.$store.state.settings.showSettings
      },
      set (val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    }
  },
  created () {},
  mounted () {
    var _this = this
    this.timer = setInterval(() => {
      _this.date = new Date() // 修改日期数据
    }, 1000)
  },
  destroyed () {
    if (this.timer) {
      clearInterval(this.timer) // 在Vue实例销毁前，清除当前日期定时器
    }
  },
  methods: {
    goToDoc () {
      window.open('https://jyaiot.yuque.com/lg6ld2/wp9glt/cns3cogrlzo4bghd?singleDoc#')
    },
    // formatDate,
    to () {
      this.$router.push('/user/center')
    },
    toDownLoad () {
      this.$router.push('/down/downLoad')
    },
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    },
    open () {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout()
      })
    },
    logout () {
      this.$store.dispatch('LogOut').then(() => {
        if (location.href.indexOf('ticket') !== -1) {
          location.href = location.href
            .replace(/(\?ticket[^#]*#)/, '#')
            .replace(/([^#/]+)$/, '/login')
        } else {
          this.$router.replace('/login')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  // padding-top: 10px;
  height: 48px;
  overflow: hidden;
  position: relative;
  background: #fff;
  // box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    display: flex;
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 16px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }
    .avatar-wrapper {
      display: flex;
      align-items: center;
      cursor: pointer;
      margin: 0 5px;
      .user-avatar {
        cursor: pointer;
        width: 30px;
        height: 30px;
        border-radius: 10px;
      }
    }
    .download-wrapper {
      display: flex;
      align-items: center;
      padding: 0 8px;
      .download {
        cursor: pointer;
        width: 16px;
        height: 16px;
      }
    }
    .exit-wrapper {
      cursor: pointer;
      width: 40px;
      height: 40px;
      display: block;
      margin: 0 5px;
      font-size: 12px;
    }
    .greetings {
      font-size: 12px;
    }
    .assistant {
      font-size: 12px;
      color: #e56e2c;
      cursor: pointer;
    }
  }
}
</style>
