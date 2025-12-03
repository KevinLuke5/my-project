<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-form
        class="head-container"
        size="mini"
        :inline="true"
        label-position="left"
        label-width="84px"
        :model="query"
      >
        <j-form-item label="收货供应商">
          <j-input v-model="query.receiveSupplier" placeholder="供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="供应商">
          <j-input v-model="query.supplier" placeholder="供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="状态">
          <dic-srm-select v-model="query.status" code="code00076" />
        </j-form-item>
        <j-form-item label="分类">
          <dic-srm-select v-model="query.classify" code="code00075" />
        </j-form-item>
        <j-form-item label="收款日期">
          <j-date-picker
            v-model="query.receiptTimeRange"
            :clearable="false"
            type="daterange"
            range-separator="~"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            value-format="yyyy-MM-dd"
          />
        </j-form-item>
        <j-form-item label="创建日期">
          <j-date-picker
            v-model="query.crtTimeRange"
            :clearable="false"
            type="daterange"
            range-separator="~"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            value-format="yyyy-MM-dd"
          />
        </j-form-item>
        <j-form-item label="银行流水">
          <j-input v-model="query.bankCode" placeholder="银行流水" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="创建人">
          <j-input v-model="query.crtName" placeholder="创建人模糊搜索" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="备注">
          <j-input v-model="query.remark" placeholder="备注模糊搜索" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="提交日期">
          <j-date-picker
            v-model="query.updTimeRange"
            :clearable="false"
            type="daterange"
            range-separator="~"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            value-format="yyyy-MM-dd"
          />
        </j-form-item>
        <div style="margin-bottom: 5px">
          <j-button type="primary" @click="showAdd">
            新增
          </j-button>
          <j-button type="primary" @click="multiSubmit">
            提交
          </j-button>
          <j-button type="danger" plain @click="importVisible = true">
            模版导入
          </j-button>
          <div class="right-btn">
            <j-button type="primary" @click="initTable(1)">
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button @click="handleExport">
              导出
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
        @selection-change="handleSelectionChange"
      />
    </j-card>
    <!-- 新增、编辑 -->
    <j-dialog
      :title="dialogTitle"
      :visible.sync="dialogShow"
      :modal="false"
      width="500px"
    >
      <j-form
        ref="tableForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="tableFormObj"
        :rules="formRules"
      >
        <j-form-item label="供应商" prop="id">
          <supplier-select ref="supplierSelect" v-model="tableFormObj.id" @currentResult="getCurrentSupplier" />
        </j-form-item>
        <j-form-item label="分类" prop="classify">
          <dic-srm-select v-model="tableFormObj.classify" code="code00075" />
        </j-form-item>
        <j-form-item label="银行流水" prop="bankCode">
          <j-input v-model="tableFormObj.bankCode" placeholder="请输入银行流水" maxlength="50" />
        </j-form-item>
        <j-form-item label="收款金额" prop="receiptMoney">
          <j-input-number
            v-model="tableFormObj.receiptMoney"
            :precision="2"
            :controls="false"
            class="money-sum-inp no-margin-top"
          />
        </j-form-item>
        <j-form-item label="收款日期" prop="receiptDate">
          <j-date-picker v-model="tableFormObj.receiptDate" type="date" placeholder="选择日期" />
          <p class="warn-tip">
            请及时录入收款明细，只能补录近3个月的收款明细哦！
          </p>
        </j-form-item>
        <j-form-item label="备注" prop="remark">
          <j-input v-model="tableFormObj.remark" placeholder="请输入备注" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="dialogShow = false">取消</j-button>
        <j-button type="primary" @click="tableFormSave">保存</j-button>
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
import * as srmFinanceReceiptDetailApi from '@/api/srmFinanceReceiptDetail'

import SupplierSelect from '@/components/SupplierSelect/index'
import dayjs from 'dayjs'
import excelImport from '@/components/ExcelImport/excelImport'
import DicSrmSelect from '@/components/DicSrmSelect/index'

import { formRules } from './configs/collectionDetails'

class QueryForm {
  supplier = ''
  receiveSupplier = ''
  receiptTimeRange = [
    dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
  ]
  crtTimeRange = [
    dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
  ]
  bankCode = ''
  crtName = ''
  remark = ''
  updTimeRange = [
    dayjs().subtract(1, 'year').format('YYYY-MM-DD'),
    dayjs().format('YYYY-MM-DD')
  ]
}

class TableFormObj {
  id = ''
  receiveSupplierName = ''
  receiveSupplierCode = ''
  classify = ''
  bankCode = ''
  receiptMoney = ''
  receiptDate = ''
  remark = ''
}

const statusValue = {
  DRAFT: 0,
  SUBMIT: 1
}

const statusValueToCN = {
  [statusValue.DRAFT]: '草稿',
  [statusValue.SUBMIT]: '已提交'
}

const classifyValue = {
  COLLECTION: 1,
  BACKWASH: 2,
  DIFFERENCE: 3
}

const classifyValueToCN = {
  [classifyValue.COLLECTION]: '收款',
  [classifyValue.BACKWASH]: '收款回冲',
  [classifyValue.DIFFERENCE]: '差异调整'
}

export default {
  name: 'CollectionDetails',
  components: { excelImport, SupplierSelect, DicSrmSelect },
  data () {
    return {
      selectList: [],
      formRules,
      tableFormObj: new TableFormObj(),
      currentSupplierArrObj: {}, // 当前查询的经销商列表对象
      dialogShow: false,
      importVisible: false,
      importUrl: srmFinanceReceiptDetailApi.uploadSrmFinanceReceiptDetailExcelFile,
      query: new QueryForm(),
      timeRange: [],
      height: null,
      tableData: [],
      tableColumns: [
        {
          prop: 'receiveSupplierCode',
          label: '收货供应商编码'
        },
        {
          prop: 'receiveSupplierName',
          label: '收货供应商名称'
        },
        {
          prop: 'statusStr',
          label: '状态'
        },
        {
          prop: 'classifyStr',
          label: '分类'
        },
        {
          prop: 'bankCode',
          label: '银行流水号'
        },
        {
          prop: 'receiptMoney',
          label: '收款金额'
        },
        {
          prop: 'receiptDate',
          label: '收款日期'
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'crtUserName',
          label: '创建人'
        },
        {
          prop: 'crtTime',
          label: '创建日期'
        },
        {
          prop: 'updUserName',
          label: '提交人'
        },
        {
          prop: 'updTime',
          label: '提交日期'
        },
        {
          prop: 'supplierCode',
          label: '供应商编码'
        },
        {
          prop: 'supplierName',
          label: '供应商名称'
        },
        {
          prop: 'type',
          label: '操作',
          fixed: 'right',
          render: (h, row) => (
            <j-button
              disabled={ row.status === statusValue.DRAFT }
              type="text"
              onClick={() => {
                this.showEdit(row)
              }}
            >
              修改
            </j-button>
          )
        }
      ],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      },
      tableOptions: {
        toolbarBottom: true,
        mutiSelect: true,
        index: false,
        loading: false,
        initTable: false
      }
    }
  },
  computed: {
    dialogTitle () {
      return this.actionType === 'add' ? '新增' : '编辑'
    }
  },
  mounted () {
    this.height = this.getHeight()
    this.initTable()
  },
  methods: {
    // 提交
    multiSubmit () {
      if (this.selectList.length === 0) {
        this.$message.warning('请选择要提交的数据')
        return
      }
      const hasSubmit = this.selectList.some(item => {
        return item.status !== statusValue.DRAFT
      })
      if (hasSubmit) {
        this.$message.warning('只能提交草稿状态的数据')
        return
      }
      const ids = this.selectList.map(item => item.id)
      this.fetchUpdateStatus(ids)
    },
    async fetchUpdateStatus (ids) {
      const params = { ids }
      const res = await srmFinanceReceiptDetailApi.submitSrmFinanceReceiptDetail(params)
      if (res.code === '0') {
        this.$message({
          showClose: true,
          message: '操作成功！',
          type: 'success'
        })
        this.initTable()
      }
    },
    handleSelectionChange (val) {
      this.selectList = val
    },
    fetchTableFormSave () {
      const tempParams = window._clone(this.tableFormObj)
      const tempQuery = new TableFormObj()
      Object.keys(tempQuery).forEach(item => {
        tempQuery[item] = tempParams[item]
      })
      tempQuery.receiveSupplierCode = this.currentSupplierArrObj[tempParams.id].code
      tempQuery.receiveSupplierName = this.currentSupplierArrObj[tempParams.id].name
      tempQuery.receiptDate = dayjs(tempParams.receiptDate).format('YYYY-MM-DD 00:00:00')
      if (this.actionType === 'add') {
        delete tempQuery.id
      }
      srmFinanceReceiptDetailApi.saveOrUpdateSrmFinanceReceiptDetail(tempQuery).then(res => {
        if (Number(res.code) === 0) {
          this.initTable()
          this.dialogShow = false
        }
      }).catch(() => {})
    },
    // 表单保存
    tableFormSave () {
      this.$refs.tableForm.validate((valid) => {
        if (valid) {
          this.fetchTableFormSave()
        }
      })
    },
    // 获取当前供应商
    getCurrentSupplier (e) {
      const tempObj = {}
      e.forEach(item => {
        tempObj[item.id] = item
      })
      this.currentSupplierArrObj = tempObj
    },
    showEdit (row) {
      this.actionType = 'edit'
      this.tableFormObj = window._clone(row)
      this.$refs.tableForm && this.$refs.tableForm.resetFields()
      this.dialogShow = true
      this.currentSupplierArrObj = {
        [row.id]: {
          code: row.receiveSupplierCode,
          name: row.receiveSupplierName
        }
      }
      this.$nextTick(() => {
        this.$refs.supplierSelect.selectOptions = [
          {
            label: row.receiveSupplierName,
            value: row.id
          }
        ]
      })
    },
    // 展示添加弹窗
    showAdd () {
      this.actionType = 'add'
      this.tableFormObj = new TableFormObj()
      this.$refs.tableForm && this.$refs.tableForm.resetFields()
      this.dialogShow = true
    },
    importSuccess () {
      this.initTable()
    },
    handleImportTem () {
      srmFinanceReceiptDetailApi.modelDownloadSrmFinanceReceiptDetail()
    },
    handleExport () {
      srmFinanceReceiptDetailApi.exportSrmFinanceReceiptDetail(this.formatParams(true))
    },
    formatParams (nopage) {
      const params = window._clone(this.query)
      if (params.receiptTimeRange && params.receiptTimeRange.length === 2) {
        params.receiptBeginDate = `${params.receiptTimeRange[0]} 00:00:00`
        params.receiptEndDate = `${params.receiptTimeRange[1]} 23:59:59`
      }
      if (params.crtTimeRange && params.crtTimeRange.length === 2) {
        params.crtBeginTime = `${params.crtTimeRange[0]} 00:00:00`
        params.crtEndTime = `${params.crtTimeRange[1]} 23:59:59`
      }
      if (params.updTimeRange && params.updTimeRange.length === 2) {
        params.updBeginTime = `${params.updTimeRange[0]} 00:00:00`
        params.updEndTime = `${params.updTimeRange[1]} 23:59:59`
      }
      delete params.receiptTimeRange
      delete params.crtTimeRange
      delete params.updTimeRange
      if (!nopage) {
        params.page = this.tablePage.pageNum
        params.size = this.tablePage.pageSize
      }
      return params
    },
    // 表格查询
    async initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const res = await srmFinanceReceiptDetailApi.getSrmFinanceReceiptDetailPage(this.formatParams())
      this.tableOptions.loading = false
      if (res && res.code === '0') {
        this.tableData = this.handleTableData(window._get(res, 'data.records') || [])
        this.tablePage.total = res.data.total
      }
    },
    handleTableData (tableData) {
      tableData.forEach(tableItem => {
        Object.keys(tableItem).forEach(tableItemKey => {
          tableItem[tableItemKey] = (tableItem[tableItemKey] || tableItem[tableItemKey] === 0) ? tableItem[tableItemKey] : '-'
        })
        tableItem.statusStr = statusValueToCN[tableItem.status] || '-'
        tableItem.classifyStr = classifyValueToCN[tableItem.classify] || '-'
      })
      return tableData
    },
    resetQuery () {
      this.query = new QueryForm()
      this.query.receiptTimeRange = []
      this.query.crtTimeRange = []
      this.query.updTimeRange = []
    }
  }
}
</script>
<style lang="less" scoped>
.warn-tip {
  color: #FAAD14;
}

.el-input {
  width: 200px;
}
</style>
