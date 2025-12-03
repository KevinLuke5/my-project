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
        <j-form-item label="供应商编码" label-width="100px">
          <j-input v-model="query.code" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="供应商名称" label-width="100px">
          <j-input v-model="query.name" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="ERP系统编码" label-width="100px">
          <j-input v-model="query.erpCode" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="供应商法人编码" label-width="100px">
          <j-input v-model="query.legalCode" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="供应商法人名称" label-width="100px">
          <j-input v-model="query.legalName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <!-- <j-button>
            导出
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
        <j-form-item label="供应商名称">
          <j-input v-model="editForm.name" disabled />
        </j-form-item>
        <j-form-item label="供应商状态" prop="status">
          <j-select v-model="editForm.status">
            <j-option
              v-for="(value, index) in statusDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="ERP系统编码">
          <j-input v-model="editForm.erpCode" />
        </j-form-item>
        <j-form-item label="供应商法人">
          <j-select
            v-model="editForm.legalName"
            collapse-tags
            filterable
            value-key="code"
            style="width: 265px"
            @change="getSupCode"
          >
            <j-option
              v-for="(item,index) in supList"
              :key="index"
              :label="item.name"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="考核业务类型" prop="accessBusinessType">
          <j-select
            v-model="editForm.accessBusinessType"
            value-key="smallTypeCode"
            multiple
            filterable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="getSmallType"
            :loading="loading"
            style="width: 265px"
          >
            <j-option
              v-for="item in smallTypeList"
              :key="item.smallTypeCode"
              :label="item.smallTypeName"
              :value="item"
            />
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
import { getQuery, querySupList, saveSupList } from '@/api/base/supAttribute'
import * as assessApi from '@/api/kpi/assess'
import _ from 'lodash'
export default {
  name: 'SupAttribute',
  components: {},
  data () {
    return {
      loading: false,
      handleType: '',
      supList: [],
      query: {
        code: '',
        name: '',
        erpCode: '',
        legalCode: '',
        legalName: '',
        status: ''
      },
      statusDic: {
        0: '新注册',
        1: '待核审',
        2: '核审不通过',
        3: '潜在',
        4: '预备',
        5: '合格',
        6: '冻结',
        7: '淘汰'
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'code',
          label: '供应商编码'
          // width: 150
        },
        {
          prop: 'name',
          label: '供应商名称',
          width: '200px'
        },
        {
          label: '供应商状态',
          render: (h, row) => (<span>{this.statusDic[row.status]}</span>)
        },
        {
          prop: 'erpCode',
          label: 'ERP系统编码'
        },
        {
          prop: 'legalCode',
          label: '供应商法人编码'
        },
        {
          prop: 'legalName',
          label: '供应商法人名称',
          width: '200px'
        },
        {
          prop: 'accessBusinessType',
          label: '考核业务类型',
          width: '350px',
          render: (h, row) => (
            <span>
              {row.accessBusinessType
                ? row.accessBusinessType
                  .map((item) => item.smallTypeName)
                  .join(',')
                : ''}
            </span>
          )
        }, {
          label: '操作',
          render: (h, row) => (
            <j-button
              type="text"
              size="mini"
              vCheck={'pdtLineSaveOrUpdate'}
              onClick={() => {
                this.handleEdit(row)
              }}
            >
              编辑
            </j-button>
          )
        }
      ],
      editVisible: false,
      editForm: {
        name: '',
        erpCode: '',
        legalName: '',
        legalCode: '',
        accessBusinessType: []
      },
      smallTypeList: [],
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
      rules: {
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.initTable()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    getSupCode (val) {
      this.editForm.legalCode = val.code
    },
    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const { id, name, status, linkPerson, linkPhone, significance, professional, lean, quality } = this.editForm
          const data = { id, name, status, linkPerson, linkPhone, significance, professional, lean, quality }
          const params = Object.assign(data,
            {
              accessBusinessType: this.editForm.accessBusinessType,
              legalName: this.editForm.legalName,
              erpCode: this.editForm.erpCode,
              legalCode: this.editForm.legalCode
            })
          saveSupList(params).then(res => {
            if (res && res.code === '0') {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.editClose()
            } else {
              this.$message({
                message: res.message,
                type: 'warning'
              })
            }
          })
        } else {
          return false
        }
      })
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        name: '',
        erpCode: '',
        legalName: '',
        accessBusinessType: ''
      }
      this.smallTypeList = []
      this.initTable()
    },
    getSmallType: _.debounce(function (keyword) {
      if (keyword) {
        this.loading = true
        assessApi
          .getSmallClassByName({ name: keyword })
          .then((res) => {
            if (res && res.code === '0') {
              this.smallTypeList = res.data.map((item) => ({
                smallTypeCode: item.smallTypeCode,
                smallTypeName: item.smallTypeName
              }))
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    }, 500),
    // 供方法人查询
    getSupList () {
      querySupList({ name: '' }).then(res => {
        if (res && res.code === '0') {
          this.supList = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'warning'
          })
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
      getQuery(params).then((res) => {
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
    handleEdit (row) {
      this.handleType = '编辑'
      this.editForm = JSON.parse(JSON.stringify(row))
      this.checkUserNameData = row.accessBusinessType ? row.accessBusinessType.map((item) => ({
        smallTypeCode: item.smallTypeCode,
        smallTypeName: item.smallTypeName
      })) : []
      this.smallTypeList = this.checkUserNameData
      this.$set(this.editForm, 'accessBusinessType', this.checkUserNameData)
      this.editVisible = true
      this.getSupList()

    },
    resetQuery () {
      this.query = {
        code: '',
        name: '',
        erpCode: '',
        legalCode: '',
        legalName: '',
        status: ''
      }
    }
  }
}
</script>
