<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-form
        class="head-container"
        size="mini"
        :inline="true"
        label-position="left"
        label-width="110px"
        :model="query"
      >
        <j-form-item label="法人">
          <j-select
            v-model="query.legalCodes"
            multiple
            collapse-tags
            clearable
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
        <j-form-item label="库存组织">
          <j-select
            v-model="query.inventoryOrganizationCodes"
            filterable
            clearable
            :collapse-tags="true"
            multiple
          >
            <j-option
              v-for="item in orgList"
              :key="item.id"
              :label="item.orgName"
              :value="item.orgCode"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="付款单编号">
          <j-input v-model="query.paymentCode" placeholder="对账单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="发票编号">
          <j-input v-model="query.invoiceNo" placeholder="对账单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="银行账户">
          <j-input v-model="query.bankAccount" placeholder="对账单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="付款日期">
          <j-date-picker
            v-model="timeRange"
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
        <j-table-column prop="legalName" label="法人" />
        <j-table-column prop="supplierCode" label="供应商编码" />
        <j-table-column prop="supplierName" label="供应商名称" />
        <j-table-column prop="paymentCode" label="付款编号" />
        <j-table-column prop="paymentTime" label="付款日期" />
        <j-table-column prop="invoiceNo" label="发票编号" />
        <j-table-column prop="paymentAmount" label="付款金额" />
        <j-table-column prop="bankAccount" label="银行账户" />
        <j-table-column prop="inventoryOrganizationName" label="库存组织" />
        <j-table-column prop="supplierLocationName" label="供应商地点" />
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
  </div>
</template>

<script>
import * as receiptApi from '@/api/receipt/receipt'
import * as baseApi from '@/api/base/personOrg'
import * as payBillApi from '@/api/goodsAccount/index'
import { arrayJoin } from '@/utils/index'
import dayjs from 'dayjs'

export default {
  name: 'PayDetail',
  data () {
    return {
      loading: false,
      legalNamesList: [],
      orgList: [],
      statusDic: {
        0: '已发布',
        1: '已提交',
        2: '已确认',
        3: '已取消'
      },
      query: {
        legalCodes: '',
        inventoryOrganizationCodes: '',
        paymentCode: '',
        invoiceNo: '',
        bankAccount: '',
        paymentBeginTime: '',
        paymentEndTime: ''
      },
      timeRange: [],
      height: null,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      }
    }
  },
  created () {
    // const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    // const lastThreeMonth = dayjs()
    //   .subtract(3, 'month')
    //   .format('YYYY-MM-DD HH:mm:ss')
    // this.timeRange = [lastThreeMonth, now]
    this.initTable(1)
    this.getLegalName()
    this.getOrg()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    getLegalName () {
      receiptApi.getCorporateNameAndCode().then((res) => {
        this.legalNamesList = res.data
      })
    },
    /**
     * 获取库存组织下拉框
     */
    getOrg () {
      baseApi.getQuery({ page: 1, size: 500 }).then((res) => {
        if (res && res.data) this.orgList = res.data.records
      })
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
    formatParams (nopage) {
      const params = Object.assign(
        {
          paymentCode: this.query.paymentCode,
          invoiceNo: this.query.invoiceNo,
          bankAccount: this.query.bankAccount,
          legalCodes: arrayJoin(this.query.legalCodes),
          inventoryOrganizationCodes: arrayJoin(
            this.query.inventoryOrganizationCodes
          ),
          paymentBeginTime: this.timeRangeFormat(this.timeRange)[0],
          paymentEndTime: this.timeRangeFormat(this.timeRange)[1]
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
      payBillApi.exportSrmFinancePaymentDetail(this.formatParams(true))
    },
    initTable (page) {
      this.loading = true
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      payBillApi
        .getSrmFinancePaymentDetailPage(this.formatParams())
        .then((res) => {
          if (res.code === '0' && res.data) {
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    resetQuery () {
      this.query = {
        legalCodes: '',
        inventoryOrganizationCodes: '',
        paymentCode: '',
        invoiceNo: '',
        bankAccount: '',
        paymentBeginTime: '',
        paymentEndTime: ''
      }
      this.timeRange = []
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
