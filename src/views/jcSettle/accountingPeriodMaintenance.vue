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
        <j-form-item label="收货供应商">
          <j-input
            v-model="query.receiveSupplier"
            placeholder="供应商编码/名称模糊查询"
            clearable
            @keyup.enter.native="initTable(1)"
          />
        </j-form-item>
        <j-form-item label="供应商">
          <j-input
            v-model="query.supplier"
            placeholder="供应商编码/名称模糊查询"
            clearable
            @keyup.enter.native="initTable(1)"
          />
        </j-form-item>
        <j-form-item label="创建日期">
          <j-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            value-format="yyyy-MM-dd"
          />
        </j-form-item>
        <div style="margin-bottom: 5px">
          <div class="right-btn">
            <j-button type="primary" @click="showAdd">
              新增
            </j-button>
            <j-button
              v-check="'deliveryManage-VmiAccountReport-getVmiPage'"
              type="primary"
              @click="initTable(1)"
            >
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button
              v-check="'deliveryManage-VmiAccountReport-exportVmiStock'"
              @click="handleExport"
            >
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
        <j-form-item label="收货供应商" prop="id">
          <supplier-select ref="supplierSelect" v-model="tableFormObj.id" @currentResult="getCurrentSupplier" />
        </j-form-item>
        <j-form-item label="账期（天数）" prop="paymentDays">
          <j-input-number
            v-model="tableFormObj.paymentDays"
            :precision="0"
            :min="1"
            :controls="false"
            placeholder="输入正整数"
            class="money-sum-inp no-margin-top"
          />
        </j-form-item>
        <j-form-item label="有效日期" prop="timeRange">
          <template slot="label">
            <j-tooltip effect="dark" placement="top">
              <span>有效日期<i class="el-icon-question" /></span>
              <div slot="content">
                <p>建议按自然年维护</p>
              </div>
            </j-tooltip>
          </template>
          <j-date-picker
            v-model="tableFormObj.timeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            value-format="yyyy-MM-dd"
          />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="dialogShow = false">取消</j-button>
        <j-button type="primary" @click="tableFormSave">保存</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import * as baseApi from '@/api/base/personOrg'
import * as jcSettleApi from '@/api/jcSettle/assignList'
import SupplierSelect from '@/components/SupplierSelect/index'
// import { getCodeList } from '@/views/common/dic'
import dayjs from 'dayjs'
import { formRules } from './configs/collectionDetails'

export default {
  name: 'AccountingPeriodMaintenance',
  components: { SupplierSelect },
  data () {
    return {
      formRules,
      tableFormObj: {
        id: '',
        receiveSupplierName: '',
        receiveSupplierCode: '',
        timeRange: [],
        validBeginDate: '',
        validEndDate: '',
        paymentDays: undefined
      },
      freshTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      query: {
        receiveSupplier: '',
        supplier: '',
        crtBeginTime: '',
        crtEndTime: ''
      },
      dialogShow: false,
      timeRange: [],
      height: null,
      tableData: [],
      tableColumns: [
        {
          prop: 'receiveSupplierCode',
          label: '收货供应商编码',
          width: '100'
        },
        {
          prop: 'receiveSupplierName',
          label: '收货供应商名称',
          width: '300'
        },
        {
          prop: 'paymentDays',
          label: '账期（天数）'
        },
        {
          prop: 'validBeginDate',
          label: '有效期自'
        },
        {
          prop: 'validEndDate',
          label: '有效期至'
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
          label: '最后更新人'
        },
        {
          prop: 'updTime',
          label: '最后更新人日期'
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
        pageSize: 15
      },
      tableOptions: {
        toolbarBottom: true,
        mutiSelect: false,
        index: false,
        loading: false,
        initTable: false
      },
      orgList: [],
      actionType: 'add'
    }
  },
  computed: {
    dialogTitle () {
      return this.actionType === 'add' ? '新增' : '编辑'
    }
  },
  created () {
    this.initTable()
  },
  mounted () {
    this.height = this.getHeight()
    this.getOrgList()
  },
  methods: {
    // 表单保存
    tableFormSave () {
      this.$refs.tableForm.validate((valid) => {
        if (valid) {
          this.fetchTableFormSave()
        }
      })
    },
    showEdit (row) {
      this.actionType = 'edit'
      this.tableFormObj = {
        id: row.id,
        receiveSupplierName: row.receiveSupplierName,
        receiveSupplierCode: row.receiveSupplierCode,
        timeRange: row.validBeginDate ? [row.validBeginDate, row.validEndDate] : [],
        validBeginDate: row.validBeginDate,
        validEndDate: row.validEndDate,
        paymentDays: row.paymentDays ? row.paymentDays : undefined
      }
      // this.tableFormObj.timeRange = [row.validBeginDate, row.validEndDate]
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
    fetchTableFormSave () {
      const tempParams = window._clone(this.tableFormObj)
      const tempQuery = {
        id: '',
        receiveSupplierName: '',
        receiveSupplierCode: '',
        timeRange: [],
        validBeginDate: '',
        validEndDate: '',
        paymentDays: undefined
      }
      Object.keys(tempQuery).forEach(item => {
        tempQuery[item] = tempParams[item]
      })
      tempQuery.receiveSupplierCode = this.currentSupplierArrObj[tempParams.id].code
      tempQuery.receiveSupplierName = this.currentSupplierArrObj[tempParams.id].name
      tempQuery.validBeginDate = dayjs(tempParams.timeRange[0]).format('YYYY-MM-DD 00:00:00')
      tempQuery.validEndDate = dayjs(tempParams.timeRange[1]).format('YYYY-MM-DD 23:59:59')
      delete tempQuery.timeRange
      if (this.actionType === 'add') {
        delete tempQuery.id
      }
      jcSettleApi.saveOrUpdateSrmFinanceReceivePayment(tempQuery).then(res => {
        if (Number(res.code) === 0) {
          this.initTable()
          this.$message.success('操作成功！')
          this.dialogShow = false
        } else {
          this.$message.warning(res.message)
        }
      }).catch((e) => {
        this.$message.warning(e.message)
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
    // 展示添加弹窗
    showAdd () {
      this.actionType = 'add'
      this.$refs.tableForm && this.$refs.tableForm.resetFields()
      this.tableFormObj = {
        id: '',
        receiveSupplierName: '',
        receiveSupplierCode: '',
        timeRange: [],
        validBeginDate: '',
        validEndDate: '',
        paymentDays: undefined
      }
      this.dialogShow = true
    },
    /**
     * 获取库存组织下拉框
     */
    getOrgList () {
      baseApi.getQuery({ page: 1, size: 500 }).then((res) => {
        this.orgList = res.data.records
      })
    },
    handleExport () {
      jcSettleApi.exportSrmFinanceReceivePayment(this.formatParams(true))
    },
    formatParams (nopage) {
      const params = Object.assign(
        {},
        this.query,
        nopage
          ? {}
          : { page: this.tablePage.pageNum, size: this.tablePage.pageSize }
      )
      if (this.timeRange && this.timeRange.length === 2) {
        params.crtBeginTime = `${this.timeRange[0]} 00:00:00`
        params.crtEndTime = `${this.timeRange[1]} 23:59:59`
      }
      delete params.timeRange
      return params
    },
    // 表格查询
    async initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      try {
        const res = await jcSettleApi.getSrmFinanceReceivePaymentPage(this.formatParams())
        if (res && res.code === '0') {
          this.tableData = res.data.records
          this.tablePage.total = res.data.total
        }
      } catch (e) {
        this.showMessage(e)
      } finally {
        this.tableOptions.loading = false
      }
    },
    resetQuery () {
      this.query = {
        receiveSupplier: '',
        supplier: '',
        crtBeginTime: '',
        crtEndTime: ''
      }
      this.timeRange = []
    }
  }
}
</script>
