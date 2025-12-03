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
        <j-form-item label="年份">
          <j-date-picker
            v-model="query.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年份"
          />
        </j-form-item>
        <j-form-item label="时间维度">
          <j-cascader
            :key="keyValue"
            v-model="query.timeDimensionTwo"
            collapse-tags
            clearable
            :props="{ expandTrigger: 'hover', multiple: true }"
            :options="timeDimensionList"
            @change="queryTimeChange"
          />
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
            v-check="'kpi-TypeManage-insertOrUpdateSupplierBusinessBind'"
            type="primary"
            @click="handleAdd"
          >
            新增
          </j-button>
          <div class="right-btn">
            <j-button
              v-check="'kpi-TypeManage-getSupplierBusinessBindList'"
              type="primary"
              @click="initTable(1)"
            >
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button v-check="'kpi-TypeManage-export'" @click="handleExport">
              导出
            </j-button>
            <j-button
              v-check="'kpi-TypeManage-uploadCoefficientExcelFile'"
              @click="importVisible = true"
            >
              导入
            </j-button>
            <j-button
              v-check="'kpi-TypeManage-deleteSupplierBusinessBind'"
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
        <j-form-item label="年份" prop="year">
          <j-date-picker
            v-model="editForm.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年份"
          />
        </j-form-item>
        <j-form-item label="时间维度" prop="timeDimensionTwo">
          <j-cascader
            :key="keyValue"
            v-model="editForm.timeDimensionTwo"
            :props="{ expandTrigger: 'hover' }"
            :options="timeDimensionList"
            @change="editTimeChange"
          />
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
        <j-form-item label="数量" prop="num">
          <j-input v-model="editForm.num" />
        </j-form-item>
        <j-form-item label="供应商总数量" prop="supplierCount">
          <j-input v-model="editForm.supplierCount" />
        </j-form-item>
        <j-form-item label="BU总数量" prop="buCount">
          <j-input v-model="editForm.buCount" />
        </j-form-item>
        <j-form-item label="供应商维度占比" prop="supplierProportion">
          <j-input v-model="editForm.supplierProportion" />&nbsp;%
        </j-form-item>
        <j-form-item label="BU维度占比" prop="buProportion">
          <j-input v-model="editForm.buProportion" />&nbsp;%
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
  getSupplierBusinessBindList,
  insertOrUpdateSupplierBusinessBind,
  // getSupplierBusinessBindDetail,
  deleteSupplierBusinessBind,
  businessTypeExport,
  businessTypeTemplate,
  businessTypeUploadUrl
} from '@/api/kpi/base'
import * as assessApi from '@/api/kpi/assess'
import * as supplierApi from '@/api/supplier/pool'
import { returnIds, clearNullProperty } from '@/utils/index'
import { timeDimensionList } from '@/views/common/dic'
import { getCodeList } from '@/views/common/dic'
import _ from 'lodash'
const excelImport = () => import('@/components/ExcelImport/excelImport')

export default {
  name: 'TypeManage',
  components: { excelImport },
  data () {
    const validateIntNumber = (rule, value, callback) => {
      if (value && !/^(0|[1-9]\d*)$/.test(value)) {
        callback(new Error('数字必须为0或正整数'))
      } else {
        callback()
      }
    }
    const validateFloatNumber = (rule, value, callback) => {
      if (value && !/^(?:0|[1-9]\d?|100)(?:\.\d{1,2})?$/.test(value)) {
        callback(new Error('数字必须大于0小于100，且最多两位小数'))
      } else {
        callback()
      }
    }
    const validateSupplierRate = (rule, value, callback) => {
      if (value) {
        if (!/^(?:0|[1-9]\d?|100)(?:\.\d{1,2})?$/.test(value)) {
          callback(new Error('数字必须大于0小于100，且最多两位小数'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请填写供应商维度占比'))
      }
    }
    return {
      loading: false,
      query: {
        supplierName: '',
        year: '',
        timeDimensionTwo: [],
        timeDimension: '',
        timeDimensionValue: '',
        businessName: '',
        buId: [],
        lineName: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        supplierName: '',
        supplierCode: '',
        year: '',
        timeDimensionTwo: [],
        timeDimension: '',
        timeDimensionValue: '',
        buId: '',
        lineCode: '',
        lineName: '',
        businessCode: '',
        businessName: '',
        num: '',
        supplierCount: '',
        buCount: '',
        supplierProportion: '',
        buProportion: '',
        remark: ''
      },
      rules: {
        supplierName: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        year: [{ required: true, message: '请选择年份', trigger: 'change' }],
        timeDimensionTwo: [
          { required: true, message: '请选择时间维度', trigger: 'change' }
        ],
        buId: [{ required: true, message: '请选择BU', trigger: 'change' }],
        lineName: [
          { required: true, message: '请选择产品线', trigger: 'change' }
        ],
        businessName: [
          { required: true, message: '请选择业务类型', trigger: 'change' }
        ],
        num: [{ validator: validateIntNumber, trigger: ['change', 'blur'] }],
        supplierCount: [
          { validator: validateIntNumber, trigger: ['change', 'blur'] }
        ],
        buCount: [{ validator: validateIntNumber, trigger: ['change', 'blur'] }],
        supplierProportion: [
          { required: true, validator: validateSupplierRate, trigger: 'change' }
        ],
        buProportion: [
          { validator: validateFloatNumber, trigger: ['change', 'blur'] }
        ]
      },
      smallTypeList: [],
      buList: [],
      keyValue: 0,
      timeDimensionList: [],
      pdtLineList: [],
      supplierList: [],
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
          prop: 'year',
          label: '年份'
        },
        // {
        //   prop: 'timeDimension',
        //   label: '时间维度',
        //   render: (h, row) => (
        //     <span>
        //       {row.timeDimension !== undefined && row.timeDimension !== null
        //         ? this.timeDimensionList[row.timeDimension].label
        //         : ''}
        //     </span>
        //   )
        // },
        {
          prop: 'timeDimensionName',
          label: '时间维度'
        },
        {
          prop: 'timeDimensionValue',
          label: '时间维度值'
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
          prop: 'num',
          label: '数量'
        },
        {
          prop: 'supplierCount',
          label: '供应商总数量',
          width: '100'
        },
        {
          prop: 'buCount',
          label: 'BU总数量'
        },
        {
          // prop: 'supplierProportion',
          label: '供应商维度占比',
          width: '108',
          render: (h, row) => (<span>{row.supplierProportion}%</span>)
        },
        {
          // prop: 'buProportion',
          label: 'BU维度占比',
          width: '100',
          render: (h, row) => (<span>{row.buProportion}%</span>)
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
                vCheck={'kpi-TypeManage-insertOrUpdateSupplierBusinessBind'}
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
      importUrl: businessTypeUploadUrl
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
    this.getSelectData()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    queryTimeChange (timeArr) {
      if (timeArr && timeArr.length) {
        this.query.timeDimension = timeArr.map(arr => arr[0])
        this.query.timeDimensionValue = timeArr.map(arr => arr[1])
      } else {
        this.query.timeDimension = []
        this.query.timeDimensionValue = []
      }
    },
    editTimeChange (timeArr) {
      if (timeArr && timeArr.length) {
        this.editForm.timeDimension = timeArr[0]
        this.editForm.timeDimensionValue = timeArr[1]
      }
    },
    editLineChange (item) {
      this.editForm.lineCode = item.code
      this.editForm.lineName = item.name
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
    // 获取产品线下拉
    getPdtLineList () {
      supplierApi.getPdtLineList().then((res) => {
        this.pdtLineList = res.data.records
      })
    },
    getSelectData () {
      this.getPdtLineList()
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
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editForm.timeDimensionTwo = [this.editForm.timeDimension, this.editForm.timeDimensionValue]
      this.handleType = '编辑'
      this.editVisible = true
    },
    handleDel () {
      if (this.tableSelectList.length) {
        const ids = returnIds(this.tableSelectList).join()
        deleteSupplierBusinessBind({ ids }).then((res) => {
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
      getSupplierBusinessBindList(params)
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
          insertOrUpdateSupplierBusinessBind(this.editForm).then((res) => {
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
        supplierCode: '',
        year: '',
        timeDimensionTwo: [],
        timeDimension: '',
        timeDimensionValue: '',
        buId: '',
        lineCode: '',
        lineName: '',
        businessCode: '',
        businessName: '',
        num: '',
        supplierCount: '',
        buCount: '',
        supplierProportion: '',
        buProportion: '',
        remark: ''
      }
    },
    resetQuery () {
      this.keyValue++
      this.query = {
        supplierName: '',
        year: '',
        timeDimensionTwo: [],
        timeDimension: '',
        timeDimensionValue: '',
        businessName: '',
        buId: [],
        lineName: ''
      }
    },
    handleExport () {
      const params = Object.assign({}, this.query, {
        buId: this.query.buId.join(','),
        timeDimension: this.query.timeDimensionTwo.map(arr => arr[0]).join(','),
        timeDimensionValue: this.query.timeDimensionTwo.map(arr => arr[1]).join(','),
        timeDimensionTwo: ''
      })
      businessTypeExport(params)
    },
    handleImportTem () {
      businessTypeTemplate()
    },
    importSuccess () {
      this.initTable()
    }
  }
}
</script>