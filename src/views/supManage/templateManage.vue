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
        <j-form-item label="业务类型">
          <j-input v-model="query.businessName" placeholder="业务类型编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="时间维度">
          <j-select v-model="query.timeDimension" clearable>
            <j-option
              v-for="item in timeDimensionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="是否含包内">
          <j-select v-model="query.include" clearable>
            <j-option label="是" :value="1" />
            <j-option label="否" :value="0" />
          </j-select>
        </j-form-item>
        <j-form-item label="配件等级">
          <j-select v-model="query.type" clearable>
            <j-option
              v-for="(name, index) in typeDic"
              :key="index"
              :label="name"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="模板">
          <j-input v-model="query.templateName" placeholder="模板编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <div style="margin-bottom: 5px">
          <j-button
            v-check="'kpi-TemplateManage-TemplateBusinessBind'"
            type="primary"
            @click="handleAdd"
          >
            新增
          </j-button>
          <div class="right-btn">
            <j-button
              v-check="'kpi-TemplateManage-getTemplateBusinessBindList'"
              type="primary"
              @click="initTable(1)"
            >
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button
              v-check="'kpi-TemplateManage-deleteTemplateBusinessBind'"
              @click="handleDel"
            >
              删除
            </j-button>
          </div>
        </div>
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
      class="dialog-form"
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
        label-width="105px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="业务类型" prop="businessName">
          <j-select
            v-model="editForm.businessName"
            value-key="smallTypeCode"
            filterable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="getSmallType"
            :loading="loading"
            @change="typeChange"
          >
            <j-option
              v-for="item in smallTypeList"
              :key="item.smallTypeCode"
              :label="item.smallTypeName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="时间维度" prop="timeDimension">
          <j-select v-model="editForm.timeDimension">
            <j-option
              v-for="item in timeDimensionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="是否含包内" prop="include">
          <j-select v-model="editForm.include">
            <j-option label="是" :value="1" />
            <j-option label="否" :value="0" />
          </j-select>
        </j-form-item>
        <j-form-item label="配件类别" prop="type">
          <j-select v-model="editForm.type">
            <j-option
              v-for="(name, index) in typeDic"
              :key="index"
              :label="name"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="模板" prop="templateName">
          <j-select
            v-model="editForm.templateName"
            value-key="id"
            filterable
            placeholder="指标名称模糊查询"
            remote
            :remote-method="searchTemplate"
            @change="setTemplate"
          >
            <j-option
              v-for="item in templateList"
              :key="item.id"
              :label="item.name"
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
import {
  getTemplateBusinessBindList,
  insertOrUpdateTemplateBusinessBind,
  // getTemplateBusinessBindDetail,
  deleteTemplateBusinessBind
} from '@/api/kpi/base'
import * as assessApi from '@/api/kpi/assess'
import * as inspectionTemApi from '@/api/kpi/procure'
import { returnIds, clearNullProperty } from '@/utils/index'
import { timeDimensionList } from '@/views/common/dic'
import _ from 'lodash'

export default {
  name: 'TemplateManage',
  data () {
    return {
      loading: false,
      query: {
        businessName: '',
        timeDimension: '',
        include: '',
        type: '',
        templateName: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        businessCode: '',
        businessName: '',
        timeDimension: '',
        include: '',
        type: '',
        templateCode: '',
        templateName: ''
      },
      typeDic: {
        0: 'A类',
        1: 'B类',
        2: 'C类'
      },
      rules: {
        businessName: [
          { required: true, message: '请选择业务类型', trigger: 'change' }
        ],
        timeDimension: [
          { required: true, message: '请选择时间维度', trigger: 'change' }
        ],
        include: [
          { required: true, message: '请选择是否含包内', trigger: 'change' }
        ],
        type: [{ required: true, message: '请选择配件类别', trigger: 'change' }],
        templateName: [
          { required: true, message: '请选择模板', trigger: 'change' }
        ]
      },
      smallTypeList: [],
      templateList: [],
      keyValue: 0,
      timeDimensionList: [],
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'businessCode',
          label: '业务类型编码'
        },
        {
          prop: 'businessName',
          label: '业务类型'
        },
        {
          prop: 'timeDimension',
          label: '时间维度',
          render: (h, row) => (
            <span>
              {row.timeDimension !== undefined && row.timeDimension !== null
                ? this.timeDimensionList[row.timeDimension].label
                : ''}
            </span>
          )
        },
        {
          label: '是否含包内',
          render: (h, row) => (
            <span>
              {row.include === 1 ? '是' : row.include === 0 ? '否' : ''}
            </span>
          )
        },
        {
          label: '配件类别',
          render: (h, row) => <span>{this.typeDic[row.type]}</span>
        },
        {
          prop: 'templateCode',
          label: '模板编码'
        },
        {
          prop: 'templateName',
          label: '模板名称'
        },
        {
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vCheck={'kpi-TemplateManage-TemplateBusinessBind'}
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
                编辑
              </j-button>
            </div>
          )
        },
        {
          prop: 'updTime',
          label: '更新时间',
          width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
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
      importVisible: false,
      importUrl: ''
    }
  },
  watch: {
    timeDimensionList () {
      this.keyValue++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
    }
  },
  created () {
    this.timeDimensionList = timeDimensionList
    this.initTable()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    handleTimeChange (timeType) {
      console.log(timeType)
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
    // 业务类型改变
    typeChange (item) {
      this.editForm.businessCode = item.smallTypeCode
      this.editForm.businessName = item.smallTypeName
    },
    searchTemplate (name) {
      if (name) {
        inspectionTemApi
          .getInspectionTem({ page: 1, size: 500, name })
          .then((res) => {
            if (res.code === '0') {
              this.templateList = res.data.records
            }
          })
      } else {
        this.templateList = []
      }
    },
    setTemplate (item) {
      this.editForm.templateCode = item.code
      this.editForm.templateName = item.name
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.handleType = '编辑'
      this.editVisible = true
    },
    handleDel () {
      if (this.tableSelectList.length) {
        const ids = returnIds(this.tableSelectList).join()
        deleteTemplateBusinessBind({ ids }).then((res) => {
          if (res.code === '0') {
            this.showMessage('删除成功！', 'success')
            this.initTable()
          } else {
            this.showMessage(res.message, 'error')
          }
        })
      } else {
        this.showMessage('请先选择数据！')
      }
    },
    // 表格查询
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = clearNullProperty(
        Object.assign({}, this.query, {
          size: this.tablePage.pageSize,
          page: this.tablePage.pageNum,
          timeDimension: this.query.timeDimension !== '' ? [this.query.timeDimension] : []
        })
      )
      getTemplateBusinessBindList(params)
        .then((res) => {
          if (res && res.code === '0') {
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
          } else {
            if (res && res.message) {
              this.showMessage(res.message)
            }
          }
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          insertOrUpdateTemplateBusinessBind(this.editForm).then((res) => {
            if (res && res.code === '0') {
              this.showMessage('操作成功！', 'success')
              this.editClose()
              this.initTable()
            } else {
              this.showMessage(res.message, 'error')
            }
          })
        }
      })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        businessName: '',
        timeDimension: '',
        include: '',
        type: '',
        templateCode: '',
        templateName: ''
      }
    },
    resetQuery () {
      this.query = {
        businessCode: '',
        businessName: '',
        timeDimension: '',
        include: '',
        type: '',
        templateName: ''
      }
    }
  }
}
</script>