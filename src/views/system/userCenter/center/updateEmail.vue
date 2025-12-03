<template>
  <div style="display: inline-block;">
    <j-dialog
      :visible.sync="dialog"
      :close-on-click-modal="false"
      :before-close="cancel"
      :title="title"
      append-to-body
      width="475px"
      @close="cancel"
    >
      <j-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="88px"
      >
        <j-form-item label="新邮箱" prop="email">
          <j-input v-model="form.email" auto-complete="on" style="width: 200px;" />
          <j-button
            :loading="codeLoading"
            :disabled="isDisabled"
            size="small"
            @click="sendCode"
          >
            {{ buttonName }}
          </j-button>
        </j-form-item>
        <j-form-item label="验证码" prop="code">
          <j-input v-model="form.code" style="width: 320px;" />
        </j-form-item>
        <j-form-item label="当前密码" prop="pass">
          <j-input v-model="form.pass" type="password" style="width: 320px;" />
        </j-form-item>
      </j-form>
      <div slot="footer" class="dialog-footer">
        <j-button type="text" @click="cancel">
          取消
        </j-button>
        <j-button :loading="loading" type="primary" @click="doSubmit">
          确认
        </j-button>
      </div>
    </j-dialog>
  </div>
</template>

<script>
export default {
  props: {
    email: {
      type: String,
      required: true
    }
  },
  data () {
    const validMail = (rule, value, callback) => {
      if (value === '' || value === null) {
        callback(new Error('新邮箱不能为空'))
      } else if (value === this.email) {
        callback(new Error('新邮箱不能与旧邮箱相同'))
      } else if (value) {
        callback()
      } else {
        callback(new Error('邮箱格式错误'))
      }
    }
    return {
      loading: false, dialog: false, title: '修改邮箱', form: { pass: '', email: '', code: '' },
      user: { email: '', password: '' }, codeLoading: false,
      codeData: { type: 'email', value: '' },
      buttonName: '获取验证码', isDisabled: false, time: 60,
      rules: {
        pass: [
          { required: true, message: '当前密码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, validator: validMail, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel () {
      this.resetForm()
    },
    sendCode () {
      if (this.form.email && this.form.email !== this.email) {
        this.codeLoading = true
        this.buttonName = '验证码发送中'
        this.codeData.value = this.form.email
      }
    },
    doSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true

        } else {
          return false
        }
      })
    },
    resetForm () {
      this.dialog = false
      this.$refs['form'].resetFields()
      window.clearInterval(this.timer)
      this.time = 60
      this.buttonName = '获取验证码'
      this.isDisabled = false
      this.form = { pass: '', email: '', code: '' }
    }
  }
}
</script>

<style scoped>
</style>
