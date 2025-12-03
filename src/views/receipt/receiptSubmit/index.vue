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
        <j-form-item label="法人">
          <j-select
            v-model="query.legalCode"
            multiple
            clearable
            collapse-tags
            filterable
          >
            <j-option
              v-for="item in legalNamesList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="发票编号">
          <j-input v-model="query.invoiceNo" placeholder="发票编号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="币种">
          <j-select
            v-model="query.currency"
            clearable
            multiple
            collapse-tags
          >
            <j-option
              v-for="item in currencyList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="税率">
          <j-select
            v-model="query.taxRate"
            clearable
            multiple
            collapse-tags
          >
            <j-option
              v-for="item in taxList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="创建日期">
          <j-date-picker
            v-model="query.timeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'SRM-receipt-submit-purchaseInvoice'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button @click="handleExport">
            导出
          </j-button>
        </j-form-item>
      </j-form>
      <!-- 计税栏 -->
      <j-form
        v-show="activeName === '0'"
        ref="taxForm"
        :inline="true"
        label-position="left"
        label-width="85px"
        :model="taxForm"
        style="margin-top: 10px"
      >
        <j-form-item label="法人" >
          <j-select
            v-model="taxForm.legalCodes"
            multiple
            clearable
            collapse-tags
            filterable
            style="width: 310px"
          >
            <j-option
              v-for="item in legalNamesList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="税率" >
          <j-select
            v-model="taxForm.taxRates"
            clearable
            multiple
            collapse-tags
          >
            <j-option
              v-for="item in taxList"
              :key="item.lineNumber"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item style="margin-bottom: 0">
          <j-button v-check="'SRM-receipt-submit-saveInvoice'" type="primary" @click="handleTax">
            生成并计税
          </j-button>
        </j-form-item>
      </j-form>
      <j-tabs v-model="activeName" @tab-click="tabClick">
        <j-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.label + '（' + sum[item.count] + '）'"
          :name="item.name"
        />
      </j-tabs>
      <!-- 数据表 -->
      <j-table
        ref="table"
        v-loading="loading"
        stripe
        header-bold
        size="small"
        :data="tableData"
        :height="height"
        style="width: 100%"
        tooltip-effect="dark"
      >
        <j-table-column label="发票编号" width="160">
          <template slot-scope="scope">
            <j-link @click="handleDetail(scope.row, '明细')">
              {{ scope.row.invoiceNo }}
            </j-link>
          </template>
        </j-table-column>
        <j-table-column v-if="['0'].includes(activeName)" prop="money" label="操作">
          <template slot-scope="scope">
            <j-button type="text" @click="handleDetail(scope.row, '提交')">
              发票提交
            </j-button>
          </template>
        </j-table-column>
        <j-table-column prop="legalName" label="法人" />
        <j-table-column prop="currency" label="币种" />
        <j-table-column prop="taxRate" label="税率%">
          <template slot-scope="scope">
            {{ scope.row.taxRate }}%
          </template>
        </j-table-column>
        <j-table-column prop="taxAmount" label="税额" />
        <j-table-column prop="grossAmount" label="含税额" />
        <j-table-column prop="invoiceTaxAmount" label="纸质发票税额" />
        <j-table-column prop="invoiceGrossAmount" label="纸质发票含税额" />
        <j-table-column prop="checkAccountNo" label="对账单号" />
        <j-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            {{ statusDic[scope.row.status] }}
          </template>
        </j-table-column>
        <j-table-column prop="crtTime" label="创建日期" />
        <j-table-column prop="crtUserName" label="创建人" />
      </j-table>
      <div class="page">
        <j-pagination
          :current-page="tablePage.pageNum"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="tablePage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tablePage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </j-card>
    <detail
      ref="detail"
      :visible="detailVisible"
      :handle-type="handleType"
      :tab="activeName"
      @close="detailClose"
    />
  </div>
</template>

<script>
import * as receiptApi from '@/api/receipt/receipt'
import { getCodeList } from '@/views/common/dic'
import { arrayJoin } from '@/utils/index'
import detail from './detail.vue'

export default {
  name: 'ReceiptSubmit',
  components: { detail },
  data () {
    return {
      legalNamesList: [],
      currencyList: [],
      taxList: [],
      loading: false,
      status: 1,
      activeName: '0',
      tabList: [
        {
          label: '待提交',
          name: '0',
          count: 'staySubmitSum'
        },
        {
          label: '已提交',
          name: '1',
          count: 'submitSum'
        },
        {
          label: '待复核',
          name: '2',
          count: 'stayReviewSum'
        },
        {
          label: '已确认',
          name: '3',
          count: 'confirmSum'
        },
        {
          label: '已导入',
          name: '4',
          count: 'importSum'
        }
      ],
      sum: {
        staySubmitSum: 0,
        submitSum: 0,
        stayReviewSum: 0,
        confirmSum: 0,
        importSum: 0
      },
      statusDic: {
        0: '待提交',
        1: '已提交',
        2: '已确认',
        3: '待复核',
        4: '复核退回',
        5: '已导入',
        6: '已取消'
      },
      rules: {
        legalCodes: [
          { required: true, message: '请选择法人', trigger: 'change' }
        ],
        taxRates: [
          { required: true, message: '请选择税率', trigger: 'change' }
        ]
      },
      query: {
        invoiceNo: '',
        legalCode: '',
        currency: '',
        taxRate: '',
        timeRange: [],
        startCrtTime: '',
        endCrtTime: '',
        queryStatus: null
      },
      height: null,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      taxForm: {
        legalCodes: [],
        taxRates: []
      },
      handleType: '提交',
      detailVisible: false
    }
  },
  created () {
    this.initTable(1)
    this.getSelectData()
    this.getLegalName()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    handleDetail (row, handleType) {
      // console.log(this.activeName);
      this.handleType = this.activeName
      this.$refs.detail.init(row, parseInt(this.activeName))
      this.detailVisible = true
    },
    handleTax () {
      this.$refs.taxForm.validate((valid) => {
        if (valid) {
          receiptApi.saveInvoice(this.taxForm).then((res) => {
            if (res.code === '0' && res.data) {
              this.showMessage('操作成功！', 'success')
              this.initTable()
            }
          })
        } else {
          return false
        }
      })
    },
    getLegalName () {
      receiptApi.getCorporateNameAndCode().then((res) => {
        this.legalNamesList = res.data
      })
    },
    tabClick (tab) {
      this.query.queryStatus = parseInt(tab.name)
      this.initTable()
    },
    handleSizeChange (size) {
      this.tablePage.pageSize = size
      this.tablePage.pageNum = 1
      this.initTable(1)
    },
    handleCurrentChange (currentPage) {
      this.tablePage.pageNum = currentPage
      this.initTable(currentPage)
    },
    getSelectData () {
      getCodeList('code00065').then((list) => {
        this.currencyList = list
        // .map((item) => ({
        //   value: item.name,
        //   label: item.name
        // }))
      })
      getCodeList('code00066').then((list) => {
        this.taxList = list
      })
    },
    formatParams (nopage) {
      const params = Object.assign(
        {
          invoiceNo: this.query.invoiceNo,
          // legalCode: this.query.legalCode.length
          //   ? this.query.legalCode.join(',')
          //   : null,
          legalCode: arrayJoin(this.query.legalCode),
          currency: arrayJoin(this.query.currency),
          taxRate: arrayJoin(this.query.taxRate),
          startCrtTime:
            this.query.timeRange && this.query.timeRange.length
              ? this.query.timeRange[0] + ' 00:00:00'
              : '',
          endCrtTime:
            this.query.timeRange && this.query.timeRange.length
              ? this.query.timeRange[1] + ' 23:59:59'
              : '',
          queryStatus: parseInt(this.activeName)
        },
        nopage
          ? {}
          : { page: this.tablePage.pageNum, size: this.tablePage.pageSize }
      )
      return params
    },
    handleExport () {
      if (!this.tableData.length) {
        this.$message.warning('列表无数据，无法导出')
        return
      }
      receiptApi.exportPurchaseInvoice(this.formatParams(true))
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.query.status = this.status
      receiptApi.getPurchaseInvoicePage(this.formatParams()).then((res) => {
        if (res.code === '0' && res.data) {
          const dataList = res.data.srmFinancePurchaseInvoicePages.records
          this.tableData = dataList
          this.tablePage.total = res.data.srmFinancePurchaseInvoicePages.total
          // 更新tab的数字
          // const curtab = this.tabList.filter(
          //   (tab) => tab.name === this.activeName
          // )[0]
          // curtab.count = res.data.total
          // const {staySubmitSum,submitSum,stayReviewSum,confirmSum,importSum} = res.data
          this.sum.staySubmitSum = res.data.staySubmitSum
          this.sum.submitSum = res.data.submitSum
          this.sum.stayReviewSum = res.data.stayReviewSum
          this.sum.confirmSum = res.data.confirmSum
          this.sum.importSum = res.data.importSum
          this.loading = false
        }
      })
    },
    resetQuery () {
      this.query = {
        invoiceNo: '',
        legalCode: '',
        currency: '',
        taxRate: '',
        timeRange: [],
        startCrtTime: '',
        endCrtTime: '',
        queryStatus: null
      }
      this.initTable()
    },
    detailClose () {
      this.detailVisible = false
      this.initTable()
    }
  }
}
</script>
<style lang="less" scoped>
.el-pagination {
  text-align: center;
}
</style>
