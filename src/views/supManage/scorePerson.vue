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
        <j-form-item label="供应商">
          <j-input v-model="query.supplierName" placeholder="供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="指标">
          <j-input v-model="query.indexName" placeholder="指标编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="考核维度">
          <j-select
            v-model="query.accessDimensionCode"
            filterable
            clearable
            multiple
            collapse-tags
            @focus="getIndexTypeList"
          >
            <j-option
              v-for="item in indexTypeList"
              :key="item.accessDimensionCode"
              :label="item.accessDimensionName"
              :value="item.accessDimensionCode"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="业务类型">
          <j-input v-model="query.businessName" placeholder="业务类型名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="BU">
          <j-select
            v-model="query.buId"
            filterable
            clearable
            multiple
            collapse-tags
          >
            <j-option
              v-for="item in buList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="产品线">
          <j-input v-model="query.lineName" placeholder="产品线编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <div style="margin-bottom: 5px">
          <j-button
            v-check="'kpi-scorePerson-insertOrUpdateIndexScoreBind'"
            type="primary"
            @click="handleAdd"
          >
            新增
          </j-button>
          <div class="right-btn">
            <j-button v-check="'kpi-scorePerson-getIndexScoreBindList'" type="primary" @click="initTable(1)">
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button v-check="'kpi-scorePerson-export'" @click="handleExport">
              导出
            </j-button>
            <j-button
              v-check="'kpi-scorePerson-uploadCoefficientExcelFile'"
              @click="importVisible = true"
            >
              导入
            </j-button>
            <j-button v-check="'kpi-scorePerson-deleteIndexScoreBind'" @click="handleDel">
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
        label-width="100px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="供应商" prop="supplierName">
          <j-select
            v-model="editForm.supplierName"
            value-key="id"
            filterable
            placeholder="供应商编码/名称模糊查询"
            remote
            :remote-method="searchSupplier"
            :loading="loading"
            @change="setSupplier"
          >
            <j-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="指标" prop="indexName">
          <j-select
            v-model="editForm.indexName"
            value-key="id"
            filterable
            placeholder="指标名称模糊查询"
            remote
            :remote-method="searchIndex"
            @change="setIndex"
          >
            <j-option
              v-for="item in indexList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="BU" prop="buId">
          <j-select v-model="editForm.buId" filterable>
            <j-option
              v-for="item in buList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="产品线" prop="lineName">
          <j-select
            v-model="editForm.lineName"
            value-key="id"
            filterable
            @change="editLineChange"
          >
            <j-option
              v-for="item in pdtLineList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </j-select>
        </j-form-item>
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
        <j-form-item label="打分人" prop="gradeUserName">
          <j-autocomplete
            v-model="editForm.gradeUserName"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchName"
            :trigger-on-focus="false"
            placeholder="输入编号或名称搜索"
            @select="selectName"
          >
            <template slot-scope="{ item }">
              <div class="name">
                {{ item.name }}
              </div>
            </template>
          </j-autocomplete>
        </j-form-item>
        <j-form-item label="审核人" prop="checkUserInfoList">
          <j-select
            v-model="editForm.checkUserInfoList"
            filterable
            multiple
            value-key="checkUserId"
            placeholder="请输入关键词搜索"
            remote
            :remote-method="getCheckNameList"
          >
            <j-option
              v-for="item in checkNameList"
              :key="item.checkUserId"
              :label="item.checkUserName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="备注">
          <j-input v-model="editForm.remark" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="editSave">保存</j-button>
      </span>
    </j-dialog>
    <!-- 导入 -->
    <excel-import
      :visible="importVisible"
      :import-url="importUrl"
      @close="importVisible = false"
      @handleTem="handleImportTem"
      @succesImport="importSuccess"
    />
  </div>
</template>

<script>
import {
  getIndexScoreBindList,
  insertOrUpdateSrmAccessIndexScoreBind,
  // getIndexScoreBindDetail,
  deleteIndexScoreBind,
  indexScoreExport,
  indexScoreTemplate,
  indexScoreUploadUrl
} from '@/api/kpi/base'
import * as assessApi from '@/api/kpi/assess'
import * as supplierApi from '@/api/supplier/pool'
import * as assessmentIndicatorsApi from '@/api/kpi/procure'
import { getExpertList  } from '@/api/base/professorPool'
import { returnIds, clearNullProperty } from '@/utils/index'
import { getCodeList } from '@/views/common/dic'
import _ from 'lodash'
const excelImport = () => import('@/components/ExcelImport/excelImport')

export default {
  name: 'ScorePerson',
  components: { excelImport },
  data () {
    return {
      loading: false,
      query: {
        supplierName: '',
        indexName: '',
        accessDimensionCode: [],
        businessName: '',
        buId: [],
        lineName: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        supplierName: '',
        indexCode: '',
        indexName: '',
        buId: '',
        lineCode: '',
        lineName: '',
        businessName: '',
        gradeUserId: '',
        gradeUserName: '',
        checkUserInfoList: [],
        remark: ''
      },
      rules: {
        supplierName: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        indexName: [{ required: true, message: '请选择指标', trigger: 'change' }],
        buId: [{ required: true, message: '请选择BU', trigger: 'change' }],
        lineName: [
          { required: true, message: '请选择产品线', trigger: 'change' }
        ],
        businessName: [
          { required: true, message: '请选择业务类型', trigger: 'change' }
        ],
        gradeUserName: [
          { required: true, message: '请选择打分人', trigger: 'change' }
        ],
        checkUserInfoList: [
          { required: true, message: '请选择审核人', trigger: 'change' }
        ]
      },
      indexTypeList: [],
      indexList: [],
      smallTypeList: [],
      buList: [],
      checkNameList: [],
      pdtLineList: [],
      supplierList: [],
      personList: [],
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'supplierCode',
          label: '供应商编码'
        },
        {
          prop: 'supplierName',
          label: '供应商名称'
        },
        {
          prop: 'indexCode',
          label: '指标编码'
        },
        {
          prop: 'indexName',
          label: '指标名称'
        },
        {
          prop: 'accessDimensionName',
          label: '考核维度'
        },
        {
          prop: 'buName',
          label: 'BU'
        },
        {
          prop: 'lineName',
          label: '产品线'
        },
        {
          prop: 'businessName',
          label: '业务类型'
        },
        {
          prop: 'gradeUserName',
          label: '打分人'
        },
        {
          label: '审核人',
          render: (h, row) => (
            <span>
              {row.checkUserInfoList && row.checkUserInfoList.length
                ? row.checkUserInfoList.map(item => item.checkUserName).join(',')
                : ''}
            </span>
          )
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vCheck={'kpi-scorePerson-insertOrUpdateIndexScoreBind'}
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
      importUrl: indexScoreUploadUrl
    }
  },
  created () {
    this.initTable()
    this.getSelectData()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
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
    // 获取产品线下拉
    getPdtLineList () {
      supplierApi.getPdtLineList().then((res) => {
        this.pdtLineList = res.data.records
      })
    },
    editLineChange (item) {
      this.editForm.lineCode = item.code
      this.editForm.lineName = item.name
    },
    getIndexTypeList () {
      assessmentIndicatorsApi.getMentIndicatorsDimensionName().then(res => {
        if (res.code === '0') {
          this.indexTypeList = res.data
        }
      })
    },
    searchIndex (name) {
      if (name) {
        assessmentIndicatorsApi.getMentIndicators({ page: 1, size: 500, name })
          .then((res) => {
            if (res.code === '0') {
              this.indexList = res.data.records
            }
          })
      } else {
        this.indexList = []
      }
    },
    setIndex (item) {
      this.editForm.indexCode = item.code
      this.editForm.indexName = item.name
      // 指标带出考核维度
      this.editForm.accessDimensionCode = item.accessDimensionCode
      this.editForm.accessDimensionName = item.accessDimensionName
    },
    getSelectData () {
      this.getPdtLineList()
      this.getIndexTypeList()
      getCodeList('code00034').then((list) => {
        this.buList = list
      })
    },
    searchSupplier (name) {
      if (name) {
        this.loading = true
        assessApi
          .getSupplierByName({ name })
          .then((res) => {
            if (res && res.code === '0') {
              this.supplierList = res.data
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.supplierList = []
      }
    },
    setSupplier (supplier) {
      this.editForm.supplierName = supplier.name
      this.editForm.supplierCode = supplier.code
    },
    searchName (name, cb) {
      getExpertList({ name, type: 0, page: 1, size: 10 })
        .then((res) => {
          if (res.code === '0') {
            this.personList = res.data.records
          }
        })
        .finally(() => {
          cb(this.personList)
        })
    },
    selectName (item) {
      this.editForm.gradeUserId = item.accountId
      this.editForm.gradeUserName = item.name
    },
    getCheckNameList (name) {
      if (name) {
        getExpertList({ name, type: 0, page: 1, size: 10 })
          .then((res) => {
            if (res.code === '0') {
              this.checkNameList = res.data.records.map((item) => ({
                checkUserId: item.accountId,
                checkUserName: item.name
                // id: item.id
              }))
            }
          })
      } else {
        this.checkNameList = []
      }
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
        const ids = returnIds(this.tableSelectList).join(',')
        deleteIndexScoreBind({ ids }).then((res) => {
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
      const params = clearNullProperty(Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum
      }))
      getIndexScoreBindList(params)
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
          insertOrUpdateSrmAccessIndexScoreBind(this.editForm).then((res) => {
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
        supplierName: '',
        indexCode: '',
        indexName: '',
        buId: '',
        lineCode: '',
        lineName: '',
        businessName: '',
        gradeUserId: '',
        gradeUserName: '',
        checkUserInfoList: [],
        remark: ''
      }
    },
    resetQuery () {
      this.query = {
        supplierName: '',
        indexName: '',
        accessDimensionCode: [],
        businessName: '',
        buId: [],
        lineName: ''
      }
    },
    handleExport () {
      const params = Object.assign({}, this.query, {
        buId: this.query.buId.join(','),
        accessDimensionCode: this.query.accessDimensionCode.join(',')
      })
      indexScoreExport(params)
    },
    handleImportTem () {
      indexScoreTemplate()
    },
    importSuccess () {
      this.initTable()
    }
  }
}
</script>