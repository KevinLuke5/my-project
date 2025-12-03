<template>
  <div class="box">
    <div class="login">
      <j-form
        ref="registeredForm"
        :model="registeredForm"
        :rules="loginRules"
        label-position="left"
        label-width="0px"
        class="login-form"
      >
        <!-- <div class="er-code" @click="scanCode" /> -->
        <j-button type="text" @click="handleLogin">
          登陆   
        </j-button>
        <h3 class="title">
          欢迎，请注册
        </h3>
        <j-steps
          :space="200"
          :active="active"
          finish-status="success"
          :align-center="true"
        >
          <j-step title="注册信息" />
          <j-step title="设置密码" />
          <j-step title="完善资料" />
        </j-steps><br>
        <div v-if="active === 1">
          <j-form-item prop="companyName">
            <j-input
              v-model="registeredForm.companyName"
              type="text"
              size="medium"
              auto-complete="off"
              placeholder="请输入企业全称"
            >
              <!-- <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" /> -->
            </j-input>
          </j-form-item>
          <j-form-item prop="name">
            <j-input
              v-model="registeredForm.name"
              type="text"
              size="medium"
              auto-complete="off"
              placeholder="请输入姓名"
            >
              <!-- <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" /> -->
            </j-input>
          </j-form-item>
          <j-form-item prop="position">
            <j-input
              v-model="registeredForm.position"
              type="text"
              size="medium"
              auto-complete="off"
              placeholder="请输入职位"
            >
              <!-- <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" /> -->
            </j-input>
          </j-form-item>
          <j-form-item style="width:100%;">
            <j-button
              size="medium"
              type="primary"
              style="width:100%;"
              @click="nextStep"
            >
              <span>
                下一步
              </span>
            </j-button>
          </j-form-item>
        </div>
        <div v-if="active === 2">
          <j-form-item prop="phoneNumber">
            <j-input
              v-model="registeredForm.phoneNumber"
              type="text"
              size="medium"
              auto-complete="off"
              placeholder="请输入手机号码"
            >
              <!-- <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" /> -->
            </j-input>
          </j-form-item>
          <j-form-item prop="password">
            <j-input
              v-model="registeredForm.password"
              type="text"
              size="medium"
              auto-complete="off"
              placeholder="请输入密码"
            >
              <!-- <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon" /> -->
            </j-input>
          </j-form-item>
          <j-form-item prop="confirmPwd">
            <j-input
              v-model="registeredForm.confirmPwd"
              type="text"
              size="medium"
              auto-complete="off"
              placeholder="请输入确认密码"
            >
              <!-- <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon" /> -->
            </j-input>
          </j-form-item>
          <!-- <j-checkbox v-model="checkedAgreement" />
          <j-button type="text">
            同意使用协议   
          </j-button> -->
          <j-form-item style="width:100%;">
            <j-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width:100%;"
              @click="registeredCheck"
            >
              <span>
                注册
              </span>
            </j-button>
          </j-form-item>
        </div>
        <div v-if="active === 3">
          <j-form-item style="width:100%;">
            <h2 class="title">
              待完善资料
            </h2>
            <div v-for="(v, k) in detailForm" :key="k" class="content-item">
              <span>{{ fields[k] }}:</span>
              <span>{{ v }}</span>
            </div>
            <span style="color:red;font-size: 14px;">
              当前阶段不代表注册完成，请联系采购分配功能权限和数据权限，分配完成后，再补充完善企业基础信息，否则认定注册失败
            </span>
            <j-button
              :loading="loading"
              size="medium"
              type="primary"
              style="width:100%;"
              @click.native.prevent="jumpLogin"
            >
              <span>
                跳转登入
              </span>
            </j-button>
          </j-form-item>
        </div>
      </j-form>
    </div>
  </div>
</template>

<script>
import { registered } from '@/api/registered'
// import { setUserInfo } from '@/utils/index'
import { removeWatermark } from '@base/jy-watermark'

export default {
  name: 'Registered',
  props: {
    registeredVisible: Boolean
  },
  data () {
    const fields = {
      companyCode: '恭喜您成功申请到企业编码',
      username: '个人账号'
    }
    return {
      fields,
      active: 0,
      checkedAgreement: true,
      codeUrl: '',
      ticket: '',
      cookiePass: '',
      detailForm: {
        companyCode: '',
        username: ''
      },
      registeredForm: {
        companyName: '',
        name: '',
        position: '',
        phoneNumber: '',
        password: '',
        confirmPwd: ''
      },
      username: '',
      loginForm: {
        // username: process.env.VUE_APP_DOMAIN ? '' : this.registeredForm.name,
        // password: process.env.VUE_APP_DOMAIN ? '' : this.registeredForm.password,
        // rememberMe: false,
        code: '',
        uuid: ''
      },
      loginRules: {
        // username: [
        //   { required: true, trigger: 'blur', message: '用户名不能为空' }
        // ],
        // password: [
        //   { required: true, trigger: 'blur', message: '密码不能为空' }
        // ],
        // code: [{ required: true, trigger: 'change', message: '验证码不能为空' }]
      },
      loading: false,
      redirect: undefined
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
    this.active = 1
    // this.getCookie()
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
    handleLogin () {
      this.$router.push({
        path: '/login'        
      })
    },
    nextStep () {
      this.active = 2
    },
    registeredCheck () {
      this.loading = true
      // if (this.checkedAgreement === false) {
      //   this.loading = false
      //   this.showMessage('请勾选协议！', 'warning')
      // } else {
      registered(this.registeredForm).then(res => {
        this.loading = false
        if (res.code === '0') {
          this.active = 3
          this.showMessage('注册成功！', 'success')
          this.username = res.data.username
          this.detailForm.companyCode = res.data.companyCode
          this.detailForm.username = res.data.username
        } else {
          this.showMessage(res.message, 'error')
        }
      })
      // }
    },
    jumpLogin () {
      const user = {
        username: this.username,
        password: this.registeredForm.password,
        code: this.loginForm.code,
        uuid: this.loginForm.uuid
      }
      this.loading = true
      this.$store
        .dispatch('Login', user)
        .then(() => {
          this.loading = false
          // setUserInfo().finally(() => {
          this.$router.replace({ path: '/' })
          // })
        })
        .catch(() => {
          this.loading = false
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
  .content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .content-item {
        width: 33%;
        display: flex;
        margin: 8px 0;
        span:first-child {
          width: auto;
          margin-right: 8px;
        }
        span:last-child {
          flex: 1;
        }
      }
    }
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
</style>
