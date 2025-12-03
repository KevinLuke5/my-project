<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-form
        class="head-container"
        size="mini"
        :inline="true"
        label-position="left"
        label-width="76px"
        :model="query"
      >
        <j-form-item label="用户账号">
          <j-input v-model="query.username" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="用户名">
          <j-input v-model="query.name" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="手机号">
          <j-input v-model="query.phoneNumber" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="所属公司">
          <j-input v-model="query.companyName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="状态">
          <j-select v-model="query.status" clearable>
            <j-option label="启用" value="running" />
            <j-option label="停用" value="locking" />
            <j-option label="注销" value="stop" />
          </j-select>
        </j-form-item>
        <j-form-item label="账号类型">
          <j-select v-model="query.type" clearable>
            <j-option label="九阳账号" value="0" />
            <j-option label="经销商账号" value="1" />
            <j-option label="供应商账号" value="5" />
          </j-select>
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getUserList'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'insertUser'" @click="handleAdd">
            新增
          </j-button>
          <!-- <j-button @click="handleDel">
            删除
          </j-button> -->
        </j-form-item>
      </j-form>

      <j-table-with-page
        :columns="tableColumns"
        :data-source="tableData"
        :options="tableOptions"
        :fetch="initTable"
        :pagination="tablePage"
        :height="height"
        @selection-change="selectTable"
      />
    </j-card>
    <!-- 新增、编辑 -->
    <j-dialog
      :title="handleType"
      :visible.sync="editVisible"
      :modal="false"
      :before-close="editClose"
      width="400px"
    >
      <j-form
        ref="editForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="用户账号" prop="username">
          <j-input v-model="editForm.username" :disabled="handleType === '编辑'" />
        </j-form-item>
        <j-form-item label="用户名" prop="name">
          <j-input v-model="editForm.name" />
        </j-form-item>
        <j-form-item label="账号类型" prop="type">
          <j-select v-model="editForm.type" clearable>
            <j-option label="九阳账号" value="E" />
            <j-option label="经销商账号" value="S" />
            <j-option label="供应商账号" value="O" />
          </j-select>
        </j-form-item>
        <j-form-item label="所属公司" prop="companyName">
          <!-- <j-input v-model="editForm.companyName" /> -->
          <j-select
            v-model="editForm.companyName"
            filterable
            allow-create
            default-first-option
            placeholder="请选择"
            :disabled="handleType === '编辑'"
          >
            <j-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="邮箱" prop="mail">
          <j-input v-model="editForm.mail" />
        </j-form-item>
        <j-form-item label="手机号" prop="phoneNumber">
          <j-input v-model="editForm.phoneNumber" />
        </j-form-item>
        <j-form-item v-show="handleType !== '编辑'" label="密码">
          <j-input v-model="editForm.password" />
        </j-form-item>
        <!-- <j-form-item
          v-show="handleType==='新增'"
          label="密码"
          prop="password"
          :rules="{ required: true, message: '请输入密码', trigger: 'change' }"
        >
          <j-input v-model="editForm.password" />
        </j-form-item> -->
        <j-form-item v-show="handleType !== '编辑'" label="确认密码">
          <j-input v-model="editForm.confirmPwd" />
        </j-form-item>
        <!-- <j-form-item
          v-show="handleType==='新增'"
          label="确认密码"
          prop="confirmPwd"
          :rules="{ required: true, message: '请输入密码', trigger: 'change' }"
        >
          <j-input v-model="editForm.confirmPwd" />
        </j-form-item> -->
        <j-form-item label="状态" prop="status">
          <j-select v-model="editForm.status" clearable>
            <j-option label="启用" value="running" />
            <j-option label="停用" value="locking" />
            <j-option label="注销" value="stop" />
          </j-select>
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="editSave">保存</j-button>
      </span>
    </j-dialog>
    <!-- 添加采购组织 -->
    <j-dialog
      title="添加采购组织"
      :visible.sync="orgVisible"
      :modal="false"
      :before-close="orgClose"
      width="600px"
    >
      <j-form
        ref="orgForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="orgForm"
        :rules="rules"
      >
        <j-form-item label="采购组织" prop="orgName">
          <j-select
            v-model="orgForm.orgName"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethodOrg"
            value-key="orgCode"
            clearable
            style="width: 400px"
          >
            <j-option
              v-for="item in orgList"
              :key="item.orgCode"
              :label="item.orgName"
              :value="item"
            />
          </j-select>
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="orgClose">取消</j-button>
        <j-button type="primary" @click="orgSave">保存</j-button>
      </span>
    </j-dialog>
    <!-- 添加供应商公司 -->
    <j-dialog
      title="添加供应商公司"
      :visible.sync="supplierVisible"
      :modal="false"
      :before-close="supplierClose"
      width="600px"
    >
      <j-form
        ref="supplierForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="supplierForm"
        :rules="rules"
      >
        <j-form-item label="供应商公司" prop="supplierName">
          <j-select
            v-model="supplierForm.supplierName"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="remoteMethodSupplier"
            value-key="supplierCode"
            clearable
            style="width:400px"
          >
            <j-option
              v-for="item in supplierList"
              :key="item.supplierCode"
              :label="item.supplierName"
              :value="item"
            />
          </j-select>
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="supplierClose">取消</j-button>
        <j-button type="primary" @click="supplierSave">保存</j-button>
      </span>
    </j-dialog>
    <!-- 密码重置 -->
    <j-dialog
      title="密码重置："
      :visible.sync="passwordVisible"
      :modal="false"
      :before-close="passwordClose"
      width="400px"
    >
      <j-form
        ref="passwordForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="passwordForm"
        :rules="pwdRules"
      >
        <j-form-item label="密码" prop="password">
          <j-input v-model="passwordForm.password" type="password" />
        </j-form-item>
        <j-form-item label="确认密码" prop="confirmPwd">
          <j-input v-model="passwordForm.confirmPwd" type="password" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="passwordClose">取消</j-button>
        <j-button type="primary" @click="passwordSave">保存</j-button>
      </span>
    </j-dialog>
    <data-own-auth ref="dataOwnAuth" :close="authClose" />
    <data-manage-auth ref="dataManageAuth" :close="authClose" />
    <roleAuth ref="roleAuth" :close="authClose" />
  </div>
</template>

<script>
import {
  getQuery,
  addList,
  update,
  deleteId,
  accountOrgAdd,
  accountSupplierAdd
} from '@/api/powerManage/accountManage'
import * as personOrgApi from '@/api/base/personOrg'
import { getSupplierName, resetPassword } from '@/api/verify/typeVerify'
import { returnIds } from '@/utils/index'
import DataOwnAuth from './components/dataOwnAuth.vue'
import DataManageAuth from './components/dataManageAuth.vue'
import roleAuth from './components/roleAuth.vue'

export default {
  name: 'accountManage',
  components: { DataOwnAuth, DataManageAuth, roleAuth },
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.passwordForm.password) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    }
    return {
      passwordForm: {
        password: '',
        confirmPwd: '',
        type: '',
        id: ''
      },
      passwordVisible: false,
      query: {
        username: '',
        name: '',
        phoneNumber: '',
        companyName: '',
        status: '',
        type: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        id: '',
        username: '',
        name: '',
        type: '',
        companyName: '',
        mail: '',
        phoneNumber: '',
        password: '',
        confirmPwd: '',
        status: ''
      },
      orgVisible: false,
      orgForm: {
        orgId: '',
        orgCode: '',
        orgName: []
      },
      supplierList: [],
      orgList: [],
      registrationId: '',
      supplierVisible: false,
      supplierForm: {
        supplierId: '',
        supplierCode: '',
        supplierName: []
      },
      rules: {
        username: [
          { required: true, message: '请输入用户账号', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入用户名', trigger: 'change' }],
        type: [{ required: true, message: '请选择账号类型', trigger: 'blur' }],
        companyName: [
          { required: true, message: '请输入所属公司', trigger: 'change' }
        ],
        phoneNumber: [
          { required: true, message: '请输入手机号', trigger: 'change' }
        ],
        // password: [
        //   { required: true, message: '请输入密码', trigger: 'change' }
        // ],
        // confirmPwd: [
        //   { required: true, message: '请输入确认密码', trigger: 'change' }
        // ],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      pwdRules: {
        password: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        confirmPwd: [
          { required: true, validator: validatePass2, trigger: 'blur' }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'username',
          label: '用户账号'
        },
        {
          prop: 'name',
          label: '用户名 '
        },
        {
          label: '状态 ',
          render: (h, row) => <span>{this.statusDic[row.status]}</span>
        },
        {
          label: '账号类型 ',
          render: (h, row) => <span>{this.typeDic[row.type]}</span>
        },
        {
          prop: 'companyName',
          label: '所属公司 '
        },
        {
          prop: 'dept',
          label: '所属部门 '
        },
        {
          prop: 'mail',
          label: '邮箱 '
        },
        {
          prop: 'phoneNumber',
          label: '手机号 '
        },
        {
          label: '采购组织 ',
          render: (h, row) => (
            <span>
              {row.srmBasicsAccountOrganizationRelList
                ? row.srmBasicsAccountOrganizationRelList
                  .map((item) => item.orgName)
                  .join(',')
                : ''}
            </span>
          )
        },
        {
          label: '供应商公司 ',
          width: '300px',
          render: (h, row) => (
            <span>
              {row.srmBasicsAccountSupplierRelList
                ? row.srmBasicsAccountSupplierRelList
                  .map((item) => item.supplierName)
                  .join(',')
                : ''}
            </span>
          )
        },
        {
          prop: 'status',
          label: '操作',
          width: 150,
          fixed: 'right',
          render: (h, row) => (
            <div class="operate-btn-group">
              <j-button
                type="text"
                size="mini"
                vCheck={'updateUser'}
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
                编辑
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'accountManage-resetPassword'}
                onClick={() => {
                  this.handleEditPassword(row)
                }}
              >
                密码重置
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'bindFunctionRole'}
                onClick={() => {
                  this.handleRoleAuth(row)
                }}
              >
                分配功能角色
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'getOwnerRoles'}
                onClick={() => {
                  this.handleDataAuth(row, 'dataOwnAuth')
                }}
              >
                分配已拥有数据角色
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'getManagerRoles'}
                onClick={() => {
                  this.handleDataAuth(row, 'dataManageAuth')
                }}
              >
                分配可管理数据角色
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'bindOrganization'}
                onClick={() => {
                  this.handlePurchaseOrg(row)
                }}
              >
                添加采购组织
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'bindSupplierCompany'}
                onClick={() => {
                  this.handleSupplierCompany(row)
                }}
              >
                添加供应商公司
              </j-button>
            </div>
          )
        }
      ],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      tableOptions: {
        toolbarBottom: true,
        mutiSelect: true,
        index: false,
        loading: false,
        initTable: false
      },
      statusDic: {
        running: '启用',
        locking: '停用',
        stop: '注销'
      },
      typeDic: {
        E: '九阳',
        S: '经销商',
        2: '分销商',
        3: '飞虎队',
        G: '终端商',
        O: '供应商'
      },
      companyList: []
    }
  },
  created () {
    this.initTable()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    searchSupplier () {
      getSupplierName({ name: this.editForm.companyName }).then((res) => {
        if (res.code === '0' && res.data) {
          this.companyList = res.data
        }
      })
    },
    supplierSave () {
      accountSupplierAdd(this.supplierForm.supplierName).then((res) => {
        if (res.code === '0') {
          this.showMessage('添加成功！', 'success')
          this.supplierClose()
          this.initTable()
        } else {
          this.showMessage(res.message, 'error')
        }
      })
    },
    remoteMethodSupplier (name) {
      getSupplierName({ name }).then((res) => {
        if (res.code === '0' && res.data) {
          this.supplierList = res.data.map((item) => ({
            registrationId: this.registrationId,
            supplierId: item.id,
            supplierCode: item.code,
            supplierName: item.name
          }))
        } else {
          this.supplierList = []
        }
      })
    },
    handleSupplierCompany (row) {
      this.remoteMethodSupplier('')
      this.supplierVisible = true
      this.registrationId = row.id
      if (row.srmBasicsAccountSupplierRelList) {
        const supplierData = row.srmBasicsAccountSupplierRelList.map((item) => ({
          registrationId: item.registrationId,
          supplierId: item.supplierId,
          supplierCode: item.supplierCode,
          supplierName: item.supplierName
        }))
        this.$set(this.supplierForm, 'supplierName', supplierData)
      } else {
        row.srmBasicsAccountSupplierRelList = []
      }
    },
    supplierClose () {
      this.supplierVisible = false
      this.supplierForm = {
        supplierId: '',
        supplierCode: '',
        supplierName: []
      }
    },
    orgSave () {
      this.orgForm.orgName = this.orgForm.orgName.map((item) => ({
        registrationId: this.registrationId,
        orgId: item.id,
        orgCode: item.orgCode,
        orgName: item.orgName
      }))
      accountOrgAdd(this.orgForm.orgName).then((res) => {
        if (res.code === '0') {
          this.showMessage('添加成功！', 'success')
          this.orgClose()
          this.initTable()
        } else {
          this.showMessage(res.message, 'error')
        }
      })
    },
    remoteMethodOrg (orgName) {
      personOrgApi.getQuery({ orgName, page: 1, size: 500 }).then((res) => {
        if (res.code === '0' && res.data.records) {
          this.orgList = res.data.records
        } else {
          this.orgList = []
        }
      })
    },
    handlePurchaseOrg (row) {
      this.remoteMethodOrg()
      this.orgVisible = true
      this.registrationId = row.id
      const orgData = row.srmBasicsAccountOrganizationRelList.map((item) => ({
        registrationId: item.registrationId,
        orgId: item.orgId,
        orgCode: item.orgCode,
        orgName: item.orgName
      }))
      this.$set(this.orgForm, 'orgName', orgData)
    },
    orgClose () {
      this.orgVisible = false
      this.orgForm = {
        orgId: '',
        orgCode: '',
        orgName: []
      }
    },
    handleAdd () {
      this.searchSupplier()
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.searchSupplier()
      this.editForm = JSON.parse(JSON.stringify(row))
      this.handleType = '编辑'
      this.editVisible = true
    },
    handleEditPassword (row) {
      this.passwordVisible = true
      console.log(row)
      this.passwordForm.id = row.accountId
      this.passwordForm.type = row.type
    },
    passwordClose () {
      this.passwordVisible = false
      this.$refs.passwordForm.resetFields()
    },
    passwordSave () {
      this.$refs.passwordForm.validate((valid) => {
        if (valid) {
          if (this.passwordForm.type !== 'O') {
            this.showMessage('九阳人员密码不可重置', 'error')
            return
          }
          const params = {
            accountId: this.passwordForm.id,
            password: this.passwordForm.password
          }
          resetPassword(params).then((res) => {
            if (res.code === 'success') {
              this.showMessage('修改成功！', 'success')
              this.passwordClose()
              this.initTable()
            } else {
              this.showMessage(res.message, 'error')
            }
          })
        }
      })
    },
    handleDel () {
      const ids = returnIds(this.tableSelectList).join()
      deleteId({ ids: ids }).then((res) => {
        if (res.code === '0') {
          this.showMessage('删除成功！', 'success')
          this.initTable()
        } else {
          this.showMessage(res.message, 'error')
        }
      })
    },
    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.handleType === '新增') {
            delete this.editForm.id
            addList(this.editForm).then((res) => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            update(this.editForm).then((res) => {
              if (res.code === '0') {
                this.showMessage('修改成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          }
        }
      })
    },
    // 表格查询
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum
      })
      getQuery(params)
        .then((res) => {
          this.tableData = res.data.records
          this.tablePage.total = res.data.total
          this.loading = false
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        id: '',
        username: '',
        name: '',
        type: '',
        companyName: '',
        mail: '',
        phoneNumber: '',
        password: '',
        confirmPwd: '',
        status: ''
      }
    },
    // 分配数据角色
    handleDataAuth (row, ref) {
      this.$refs[ref].init(row.userId)
      // this.$refs[ref].init('663f39a2a0c111eab65d0242aa000003')
    },
    handleRoleAuth (row) {
      this.$refs.roleAuth.initRole(row.accountId)
    },
    // 权限弹窗关闭
    authClose () {
      this.initTable()
    },
    resetQuery () {
      this.query = {
        username: '',
        name: '',
        phoneNumber: '',
        companyName: '',
        status: '',
        type: ''
      }
    }
  }
}
</script>
