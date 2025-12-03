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
        <j-form-item label="模块">
          <j-select v-model="query.model" clearable multiple>
            <j-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
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
        <j-form-item label="账号类型">
          <j-select v-model="query.accountType" clearable multiple>
            <j-option label="九阳" value="0" />
            <j-option label="供应商" value="5" />
          </j-select>
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getMessageConfigPage'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'saveOrUpdateConfig'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'getMessageConfigPage'" @click="handleExport">
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
        <j-form-item label="模块" prop="model">
          <j-select v-model="editForm.model" clearable>
            <j-option
              v-for="item in modelList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="类型" prop="type">
          <j-select v-model="editForm.type" clearable>
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="账号类型" prop="accountType">
          <j-select v-model="editForm.accountType" clearable>
            <j-option label="九阳" value="0" />
            <j-option label="供应商" value="5" />
          </j-select>
        </j-form-item>
        <j-form-item label="发送时间点" prop="sendTime">
          <j-time-picker v-model="editForm.sendTime" type="datetime" value-format="HH:mm:ss" />
        </j-form-item>
        <j-form-item label="发送频率" prop="sendFrequency">
          <!-- <j-select v-model="editForm.sendFrequency" clearable>
            <j-option
              v-for="(value, index) in frequencyDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select> -->
          <j-input-number v-model="editForm.sendFrequency" :precision="1" :min="0" /> 小时
        </j-form-item>
        <j-form-item label="发送内容" prop="sendContent">
          <j-input
            v-model="editForm.sendContent"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </j-form-item>
        <j-form-item label="逻辑说明" prop="logicExplain">
          <j-input
            v-model="editForm.logicExplain"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
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
import { getCodeList } from '@/views/common/dic'

export default {
  name: 'MsgSet',
  data () {
    return {
      query: {
        model: [],
        type: [],
        accountType: []
      },
      frequencyDic: {
        0: '实时',
        1: '小时',
        2: '天',
        3: '月',
        4: '季',
        5: '年'
      },
      height: null,
      tableData: [],
      tableColumns: [
        {
          label: '模块',
          render: (h, row) => (
            <span>
              {this.modelList.length
                ? (
                  this.modelList.find(
                    (dic) => dic.lineNumber === row.model
                  ) || { name: '' }
                ).name
                : ''}
            </span>
          )
        },
        {
          label: '操作',
          width: '100px',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vCheck={'saveOrUpdateConfig'}
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
                编辑
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'deleteConfig'}
                onClick={() => {
                  this.handleDel(row)
                }}
              >
                删除
              </j-button>
            </div>
          )
        },
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
          prop: 'sendTime',
          label: '发送时间'
        },
        {
          prop: 'sendFrequency',
          label: '发送频率'
          // render: (h, row) => (
          //   <span>{this.frequencyDic[row.sendFrequency]}</span>
          // )
        },
        {
          prop: 'sendContent',
          label: '发送内容',
          width: '250px'
        },
        {
          prop: 'logicExplain',
          label: '逻辑说明',
          width: '250px'
        },
        {
          prop: 'crtUserName',
          label: '创建人'
        },
        {
          prop: 'crtTime',
          label: '创建日期'
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
      modelList: [],
      typeList: [],
      peopleList: [],
      oldUser: {},
      editVisible: false,
      editForm: {
        id: '',
        type: '',
        accountId: '',
        userName: '',
        companyId: '',
        companyCode: '',
        companyName: '',
        accountType: '',
        sendTime: '',
        sendFrequency: '',
        sendContent: '',
        logicExplain: ''
      },
      rules: {
        model: [{ required: true, message: '请选择模块', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        accountType: [
          { required: true, message: '请选择账号类型', trigger: 'blur' }
        ],
        sendTime: [
          { required: true, message: '请选择发送时间点', trigger: 'blur' }
        ],
        sendFrequency: [
          { required: true, message: '请填写发送频率', trigger: 'blur' }
        ],
        sendContent: [
          { required: true, message: '请填写发送内容', trigger: 'blur' }
        ],
        logicExplain: [
          { required: true, message: '请填写逻辑说明', trigger: 'blur' }
        ]
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
      getCodeList('code00068').then((list) => {
        this.modelList = list
      })
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.handleType = '编辑'
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editVisible = true
    },
    handleExport (row) {},
    handleDel (row) {
      msgApi.deleteConfig({ id: row.id }).then((res) => {
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
          model: this.query.model.length ? this.query.model.join(',') : null,
          type: this.query.type.length ? this.query.type.join(',') : null,
          accountType: this.query.accountType.length ? this.query.accountType.join(',') : null
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
        .getMessageConfigPage(params)
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
          msgApi.saveOrUpdateConfig(this.editForm).then((res) => {
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
        id: '',
        type: '',
        accountId: '',
        userName: '',
        companyId: '',
        companyCode: '',
        companyName: '',
        accountType: '',
        sendTime: '',
        sendFrequency: '',
        sendContent: '',
        logicExplain: ''
      }
    },
    resetQuery () {
      this.query = {
        model: [],
        type: [],
        accountType: []
      }
    }
  }
}
</script>