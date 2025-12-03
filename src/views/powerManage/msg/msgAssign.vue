<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-form
        class="head-container"
        size="mini"
        :inline="true"
        label-position="left"
        label-width="85px"
        :model="query"
      >
        <j-form-item label="用户">
          <j-input v-model="query.userName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="供应商">
          <j-input v-model="query.companyName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="类型">
          <j-select v-model="query.type" clearable multiple>
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getMessageUserPage'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'saveOrUpdateMessageUser'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'getMessageUserPage'" @click="handleExport">
            导出
          </j-button>
        </j-form-item>
      </j-form>

      <j-table-with-page
        :columns="tableColumns"
        :data-source="tableData"
        :options="tableOptions"
        :fetch="initTable"
        :pagination="tablePage"
        :height="height"
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
        <j-form-item label="类型" prop="type">
          <j-select v-model="editForm.type">
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="账号" prop="people">
          <j-select
            v-model="editForm.people"
            value-key="accountId"
            filterable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="searchPeople"
            :loading="loading"
            @change="peopleChange"
          >
            <j-option
              v-for="item in peopleList"
              :key="item.accountId"
              :label="item.userName"
              :value="item"
            >
              <span>
                {{ item.userName }}
              </span>
              <span style="margin-left: 5px; color: #8492a6; font-size: 12px">
                {{ item.companyName }}
              </span>
            </j-option>
          </j-select>
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="editSave">保存</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import * as msgApi from '@/api/msg'
import * as taskApi from '@/api/task/task'
import { getCodeList } from '@/views/common/dic'

export default {
  name: 'MsgAssign',
  data () {
    return {
      query: {
        userName: '',
        companyName: '',
        type: []
      },
      height: null,
      tableData: [],
      tableColumns: [
        {
          label: '类型',
          render: (h, row) => (
            <span>
              {this.typeList.length
                ? (
                  this.typeList.find(
                    (dic) => dic.lineNumber === row.type
                  ) || { name: '' }
                ).name
                : ''}
            </span>
          )
        },
        {
          prop: 'userName',
          label: '账号',
          width: '200px'
        },
        {
          prop: 'companyName',
          label: '所属公司',
          width: '180px'
        },
        {
          prop: 'accountType',
          label: '账号类型',
          render: (h, row) => (
            <span>
              {row.accountType === '0'
                ? '九阳'
                : row.accountType === '5'
                  ? '供应商'
                  : '其他'}
            </span>
          )
        },
        {
          label: '操作',
          fixed: 'right',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vCheck={'saveOrUpdateMessageUser'}
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
                编辑
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'deleteMessageUser'}
                onClick={() => {
                  this.handleDel(row)
                }}
              >
                删除
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
        mutiSelect: false,
        index: false,
        loading: false,
        initTable: false
      },
      typeList: [],
      peopleList: [],
      oldUser: {},
      editVisible: false,
      editForm: {
        type: '',
        accountId: '',
        unionid: '',
        userName: '',
        companyId: '',
        companyCode: '',
        companyName: '',
        accountType: '',
        people: ''
      },
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        people: [{ required: true, message: '请选择用户', trigger: 'blur' }]
      },
      handleType: '新增',
      loading: false
    }
  },
  created () {
    this.initTable(1)
    this.getSelectData()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    getSelectData () {
      getCodeList('code00067').then((list) => {
        this.typeList = list
      })
    },
    searchPeople (keyWords) {
      if (keyWords) {
        this.loading = true
        taskApi
          .getUserCompanyRel({ keyWords })
          .then((res) => {
            if (res && res.code === '0') {
              this.peopleList = res.data.map((item) => ({
                accountId: item.accountId,
                unionid: item.unionid,
                accountType: item.type,
                userName: item.name,
                companyId: item.id,
                companyCode: item.companyCode,
                companyName: item.companyName
              }))
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.peopleList = []
      }
    },
    peopleChange (item) {
      this.editForm.accountId = item.accountId
      this.editForm.unionid = item.unionid
      this.editForm.accountType = item.accountType
      this.editForm.userName = item.userName
      this.editForm.companyId = item.companyId
      this.editForm.companyCode = item.companyCode
      this.editForm.companyName = item.companyName
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.handleType = '编辑'
      const rowData = JSON.parse(JSON.stringify(row))
      this.editForm = rowData
      const user = {
        accountId: rowData.accountId,
        unionid: rowData.unionid,
        accountType: rowData.accountType,
        userName: rowData.userName,
        companyId: rowData.companyId,
        companyCode: rowData.companyCode,
        companyName: rowData.companyName
      }
      this.$set(this.editForm, 'people', user)
      this.peopleList = [user]
      this.editVisible = true
    },
    handleExport (row) {},
    handleDel (row) {
      msgApi.deleteMessageUser({ id: row.id }).then((res) => {
        if (res.code === '0') {
          this.showMessage('删除成功!', 'success')
          this.initTable()
        } else {
          this.showMessage(res.message)
        }
      })
    },
    formatParams (nopage) {
      const params = Object.assign(
        {
          userName: this.query.userName,
          companyName: this.query.companyName,
          type: this.query.type.length ? this.query.type.join(',') : null
        },
        nopage
          ? {}
          : { page: this.tablePage.pageNum, size: this.tablePage.pageSize }
      )
      return params
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = Object.assign(this.formatParams())
      msgApi
        .getMessageUserPage(params)
        .then((res) => {
          if (res.code === '0' && res.data) {
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
          }
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          msgApi.saveOrUpdateMessageUser(this.editForm).then((res) => {
            if (res && res.code === '0') {
              this.showMessage('操作成功!', 'success')
              this.editClose()
              this.initTable()
            } else {
              this.showMessage(res.message)
            }
          })
        }
      })
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        type: '',
        accountId: '',
        unionid: '',
        userName: '',
        companyId: '',
        companyCode: '',
        companyName: '',
        accountType: '',
        people: ''
      }
    },
    resetQuery () {
      this.query = {
        userName: '',
        companyName: '',
        type: []
      }
    }
  }
}
</script>