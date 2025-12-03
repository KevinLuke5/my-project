<template>
  <div class="app-container">
    <j-row :gutter="20">
      <j-col
        :xs="24"
        :sm="24"
        :md="8"
        :lg="6"
        :xl="5"
        style="margin-bottom: 10px"
      >
        <j-card class="box-card">
          <div slot="header" class="clearfix">
            <span>个人信息</span>
          </div>
          <div>
            <div style="text-align: center">
              <j-upload
                :show-file-list="false"
                :on-success="handleSuccess"
                :on-error="handleError"
                :headers="headers"
                :action="updateAvatarApi"
                class="avatar-uploader"
              >
                <img
                  :src="user.avatar ? baseApi + '/avatar/' + user.avatar : Avatar"
                  title="点击上传头像"
                  class="avatar"
                >
              </j-upload>
            </div>
            <ul class="user-info">
              <li>
                <div style="height: 100%">
                  <svg-icon icon-class="login" /> 登录账号<div class="user-right">
                    {{ user.userName }}
                  </div>
                </div>
              </li>
              <li>
                <svg-icon icon-class="user1" /> 用户昵称 <div class="user-right">
                  {{ user.nickName }}
                </div>
              </li>
              <li>
                <svg-icon icon-class="phone" /> 手机号码 <div class="user-right">
                  {{ user.phone }}
                </div>
              </li>
              <li>
                <svg-icon icon-class="email" /> 用户邮箱 <div class="user-right">
                  {{ user.email }}
                </div>
              </li>
              <li>
                <svg-icon icon-class="dept" /> 所属部门 <div class="user-right">
                  {{ user.department }} / {{ user.job }}
                </div>
              </li>
              <li>
                <svg-icon icon-class="anq" /> 安全设置
                <div class="user-right">
                  <a @click="$refs.pass.dialog = true">
                    修改密码
                  </a>
                  <a @click="$refs.email.dialog = true">
                    修改邮箱
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </j-card>
      </j-col>
      <j-col
        :xs="24"
        :sm="24"
        :md="16"
        :lg="18"
        :xl="19"
      >
        <!--    用户资料    -->
        <j-card class="box-card">
          <j-tabs v-model="activeName" @tab-click="handleClick">
            <j-tab-pane label="用户资料" name="first">
              <j-form
                ref="form"
                :model="form"
                :rules="rules"
                style="margin-top: 10px;"
                size="small"
                label-width="65px"
              >
                <j-form-item label="昵称" prop="nickName">
                  <j-input v-model="form.nickName" style="width: 35%" />
                  <span style="color: #C0C0C0;margin-left: 10px;">
                    用户昵称不作为登录使用
                  </span>
                </j-form-item>
                <j-form-item label="手机号" prop="phone">
                  <j-input v-model="form.phone" style="width: 35%;" />
                  <span style="color: #C0C0C0;margin-left: 10px;">
                    手机号码不能重复
                  </span>
                </j-form-item>
                <j-form-item label="性别">
                  <j-radio-group v-model="form.sex" style="width: 178px">
                    <j-radio label="男">
                      男
                    </j-radio>
                    <j-radio label="女">
                      女
                    </j-radio>
                  </j-radio-group>
                </j-form-item>
                <j-form-item label="">
                  <j-button
                    :loading="saveLoading"
                    size="mini"
                    type="primary"
                    @click="doSubmit"
                  >
                    保存配置
                  </j-button>
                </j-form-item>
              </j-form>
            </j-tab-pane>
            <!--    操作日志    -->
            <j-tab-pane label="操作日志" name="second">
              <j-table v-loading="loading" :data="logData" style="width: 100%;">
                <j-table-column prop="description" label="行为" />
                <j-table-column prop="requestIp" label="IP" />
                <j-table-column :show-overflow-tooltip="true" prop="address" label="IP来源" />
                <j-table-column prop="browser" label="浏览器" />
                <j-table-column prop="time" label="请求耗时" align="center">
                  <template slot-scope="scope">
                    <j-tag v-if="scope.row.time <= 300">
                      {{ scope.row.time }}ms
                    </j-tag>
                    <j-tag v-else-if="scope.row.time <= 1000" type="warning">
                      {{ scope.row.time }}ms
                    </j-tag>
                    <j-tag v-else type="danger">
                      {{ scope.row.time }}ms
                    </j-tag>
                  </template>
                </j-table-column>
              </j-table>
              <!--分页组件-->
              <j-pagination
                :total="total"
                :current-page="page + 1"
                style="margin-top: 8px;"
                layout="total, prev, pager, next, sizes"
                @size-change="sizeChange"
                @current-change="pageChange"
              />
            </j-tab-pane>
          </j-tabs>
        </j-card>
      </j-col>
    </j-row>
    <updatePass ref="pass" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import updatePass from './center/updatePass'
import { getToken } from '@/utils/auth'
import { getUserInfo } from '@/api/system/user'
import store from '@/store'
import { isvalidPhone } from '@/utils/validate'
import crud from '@/mixins/crud'
import Avatar from '@/assets/images/avatar.png'
export default {
  name: 'Center',
  components: { updatePass },
  mixins: [crud],
  data () {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      Avatar: Avatar,
      activeName: 'first',
      saveLoading: false,
      headers: {
        'Authorization': getToken()
      },
      // 用户信息
      user: {},
      form: {},
      loading: false,
      logData: [],
      rules: {
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      // 'user',
      'updateAvatarApi',
      'baseApi'
    ])
  },
  created () {
    this.getInfo()
  },
  methods: {
    // parseTime,
    handleClick (tab, event) {
      if (tab.name === 'second') {
        // this.init()
      }
    },
    handleSuccess (response, file, fileList) {
      this.$notify({
        title: '头像修改成功',
        type: 'success',
        duration: 2500
      })
      store.dispatch('GetInfo').then(() => { })
    },
    // 监听上传失败
    handleError (e, file, fileList) {
      const msg = JSON.parse(e.message)
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
    },
    // 获取个人中心用户信息
    getInfo () {
      getUserInfo().then(res => {
        this.user = res.data
        this.form.nickName = this.user.nickName
        this.form.phone = this.user.phone
        this.form.gender = this.user.gender
      })
    },
    doSubmit () {
      if (this.$refs['form']) {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.$notify({
              title: '功能开发中',
              type: 'success',
              duration: 2500
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader-icon {
  font-size: 28px;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  border-radius: 50%;
}
.user-info {
  padding-left: 0;
  list-style: none;
  li {
    border-bottom: 1px solid #f0f3f4;
    padding: 11px 0;
    font-size: 13px;
  }
  .user-right {
    float: right;

    a {
      color: #317ef3;
    }
  }
}
</style>
