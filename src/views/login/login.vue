<template>
  <div class="box">
    <div class="login">
      <j-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        label-position="left"
        label-width="0px"
        class="login-form"
      >
        <div class="er-code" @click="scanCode" />
        <h3 class="title">
          供应商协同门户
        </h3>
        <j-form-item prop="username">
          <j-input
            v-model="loginForm.username"
            type="text"
            size="medium"
            auto-complete="off"
            placeholder="账号"
          >
            <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" />
          </j-input>
        </j-form-item>
        <j-form-item prop="password">
          <j-input
            v-model="loginForm.password"
            type="password"
            size="medium"
            auto-complete="off"
            show-password
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" />
          </j-input>
        </j-form-item>
        <j-form-item style="width:100%;">
          <j-button
            :loading="loading"
            size="medium"
            type="primary"
            style="width:100%;"
            @click.native.prevent="handleLogin"
          >
            <span v-if="!loading">
              登 录
            </span>
            <span v-else>
              登 录 中...
            </span>
          </j-button>
          <div>
            <j-button type="text" @click="handleRegistered">
              注册  
            </j-button>
            <!-- &nbsp;/ -->
            <!-- <span>忘记密码</span> -->
          </div>
        </j-form-item>
      </j-form>
      <!-- <div class="footer">
        <span>Copyright © 2020 九阳JOYOUNG | </span>
        <span class="wangbei" />
        <j-link style="font-size:12px;" href="https://beian.miit.gov.cn/" target="_blank">
          鲁公网安备 37010402000117号 鲁ICP备10015959号-1
        </j-link>
      </div> -->
    </div>
    <!-- <registered :registered-visible="registeredVisible" /> -->
  </div>
</template>

<script>
import Cookies from 'js-cookie'
// import { setUserInfo } from '@/utils/index'
import { removeWatermark } from '@base/jy-watermark'

export default {
  name: 'Login',
  data () {
    return {
      codeUrl: '',
      ticket: '',
      cookiePass: '',
      loginForm: {
        username: '',
        password: '',
        // rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', message: '用户名不能为空' }
        ],
        password: [
          { required: true, trigger: 'blur', message: '密码不能为空' }
        ],
        code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      },
      loading: false,
      redirect: undefined,
      registeredVisible: false
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created () {
    this.getCookie()
  },
  mounted () {
    // 进入时移除水印
    removeWatermark()
  },
  beforeDestroy () {
    // 离开时添加水印
    this.addWatermark('', '', { opacity: 0.3, angle: 15, width: 210, height: 120, fontSize: '14px' })
  },
  methods: {
    handleRegistered () {
      this.$router.push({
        path: '/registered'        
      })
    },
    // 跳转至扫码登录界面
    scanCode () {
      const url = location.href.replace(/[#].*$/, '')
      window.location.href = process.env.VUE_APP_CAS + url
    },
    // 二维码登录
    codeLog () {
      this.$store
        .dispatch('CodeLogin', this.ticket)
        .then(() => {
          const obj = this.$route.query
          delete obj.redirect
          // setUserInfo().finally(() => {
          this.$router.replace({ path: this.redirect, query: this.$route.query })
          // })
        })
        .catch((res) => {
          this.loading = false
        })
        
    },
    getCookie () {
      const username = Cookies.get('username')
      let password = Cookies.get('password')
      // const rememberMe = Cookies.get('rememberMe')
      // 保存cookie里面的加密后的密码
      this.cookiePass = password === undefined ? '' : password
      password = password === undefined ? this.loginForm.password : password
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password,
        code: ''
      }
    },
    handleLogin () {
      this.$refs.loginForm.validate(valid => {
        const user = {
          username: this.loginForm.username,
          password: this.loginForm.password,
          code: this.loginForm.code,
          uuid: this.loginForm.uuid
        }
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', user)
            .then(() => {
              this.loading = false
              // setUserInfo().finally(() => {
              this.$router.replace({ path: '/' }).catch(() => {})
              // })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  height: 100%;
  padding-bottom: 30px;
}
.login {
  height: 100%;
  background: url(http://soa.joyoung.com/cas/images/swipe_1.jpg) no-repeat
    center center;
  background-size: 100% 100%;
}
.title {
  margin: 0 auto 30px auto;
  text-align: center;
  color: #707070;
}
.login-form {
  overflow: hidden;
  border-radius: 6px;
  position: absolute;
  top: 50%;
  right: 60px;
  transform: translateY(-50%);
  background: rgba(#fff, 0.9);
  width: 385px;
  padding: 25px 25px 5px 25px;
  .er-code {
    width: 64px;
    height: 64px;
    position: absolute;
    right: 0px;
    top: 0px;
    cursor: pointer;
    background: url("~@/assets/images/erCode.png") no-repeat center center;
    background-size: 100% 100%;
  }
  .el-input {
    height: 38px;
    input {
      height: 38px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  display: inline-block;
  height: 38px;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.footer {
  width: 100%;
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  font-size: 12px;
  color: #000;
  .wangbei {
    display: inline-block;
    width: 15px;
    height: 15px;
    vertical-align: middle;
    background: url("~@/assets/images/wangbei.png") no-repeat center center;
    background-size: 100% 100%;
  }
}
</style>
