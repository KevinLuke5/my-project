<template>
  <div style="display: inline-block">
    <j-dialog
      :visible.sync="dialog"
      :close-on-click-modal="false"
      :before-close="cancel"
      :title="title"
      append-to-body
      width="500px"
      @close="cancel"
    >
      <j-form
        ref="form"
        :model="form"
        :rules="rules"
        size="small"
        label-width="88px"
      >
        <j-form-item label="旧密码" prop="oldPassword">
          <j-input
            v-model="form.oldPassword"
            type="password"
            auto-complete="on"
            style="width: 370px;"
          />
        </j-form-item>
        <j-form-item label="新密码" prop="newPassword">
          <j-input
            v-model="form.newPassword"
            type="password"
            auto-complete="on"
            style="width: 370px;"
          />
        </j-form-item>
        <j-form-item label="确认密码" prop="confirmPassword">
          <j-input
            v-model="form.confirmPassword"
            type="password"
            auto-complete="on"
            style="width: 370px;"
          />
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
import store from '@/store'
import { updatingPass } from '@/api/system/user'

export default {
  data () {
    const newPassword = (rule, value, callback) => {
      if (value) {
        if (this.form.oldPassword === value) {
          callback(new Error('新密码不能与旧密码相同'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入新密码'))
      }
    }
    const confirmPassword = (rule, value, callback) => {
      if (value) {
        if (this.form.newPassword !== value) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请再次输入密码'))
      }
    }
    return {
      loading: false, dialog: false, title: '修改密码', form: { oldPassword: '', newPassword: '', confirmPassword: '' },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: newPassword, trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: confirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel () {
      this.resetForm()
    },
    doSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          const data = { oldPassword: this.form.oldPassword, newPassword: this.form.newPassword }
          updatingPass(data).then(res => {
            this.resetForm()
            this.$notify({
              title: "密码修改成功，请重新登录！",
              type: "success",
              duration: 2500
            })
            setTimeout(() => {
              store.dispatch('LogOut').then(() => {
                location.reload()
              })
            }, 1500)
          }).catch(err => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    resetForm () {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { oldPassword: '', newPassword: '', confirmPassword: '' }
    }
  }
}
</script>

<style scoped>
</style>
