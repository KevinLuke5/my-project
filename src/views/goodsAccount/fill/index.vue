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
        <j-form-item label="对账单号">
          <j-input v-model="query.billNo" placeholder="对账单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="法人">
          <j-select
            v-model="query.legal"
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
        <j-form-item label="包含无发生额单据">
          <j-select v-model="query.containsNoInvoice" clearable>
            <j-option label="是" :value="1" />
            <j-option label="否" :value="0" />
          </j-select>
        </j-form-item>
        <j-form-item label="发布日期">
          <j-date-picker
            v-model="releaseRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item label="回复日期">
          <j-date-picker
            v-model="replyRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item label="确认日期">
          <j-date-picker
            v-model="confirmRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'SRM1-goodsAccount-fill-getPaymentBill'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button
            v-check="'SRM1-goodsAccount-fill-exportPaymentBill'"
            @click="handleExport"
          >
            导出
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
        <j-table-column label="对账单号" width="160">
          <template slot-scope="scope">
            <j-link @click="handleDetail(scope.row)">
              {{ scope.row.billNo }}
            </j-link>
          </template>
        </j-table-column>
        <j-table-column prop="legalName" label="法人" />
        <j-table-column prop="period" label="对账期间" />
        <j-table-column prop="currency" label="币种" />
        <j-table-column prop="joyoungBalance" label="九阳余额" />
        <j-table-column prop="supplierBalance" label="供应商余额" />
        <j-table-column prop="difference" label="差异" />
        <j-table-column prop="diffReason" label="供应商填差异原因" />
        <j-table-column prop="releaseUser" label="发布人" />
        <j-table-column prop="releaseTime" label="发布日期" />
        <j-table-column
          v-if="['1','2'].includes(activeName)"
          key="replyTime"
          prop="replyTime"
          label="回复日期"
        />
        <j-table-column
          v-if="activeName === '2'"
          key="confirmTime"
          prop="confirmTime"
          label="确认日期"
        />
        <j-table-column
          v-if="activeName === '2'"
          key="remark"
          prop="remark"
          label="备注"
        />
        <j-table-column label="是否超期" width="120">
          <template slot-scope="scope">
            {{ scope.row.isOverdue === 1 ? '是' : '否' }}
          </template>
        </j-table-column>
        <j-table-column key="log" label="操作记录">
          <template slot-scope="scope">
            <j-popover placement="right" width="400" trigger="click">
              <j-table :data="logData">
                <j-table-column width="100" property="operationUser" label="操作人" />
                <j-table-column width="150" property="operationTime" label="操作日期" />
                <j-table-column width="100" property="operationItem" label="操作" />
              </j-table>
              <j-button
                slot="reference"
                v-check="'SRM1-goodsAccount-fill-getOperationItem'"
                type="text"
                @click="handleLog(scope.row.id)"
              >
                操作日志
              </j-button>
            </j-popover>
          </template>
        </j-table-column>
        <j-table-column prop="supplierCode" label="供应商编码" />
        <j-table-column prop="supplierName" label="供应商名称" />
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
import * as payBillApi from '@/api/goodsAccount/index'
import { arrayJoin } from '@/utils/index'
import detail from './detail.vue'
import dayjs from 'dayjs'

export default {
  name: 'GoodsAccountFill',
  components: { detail },
  data () {
    return {
      legalNamesList: [],
      loading: false,
      activeName: '0',
      tabList: [
        {
          label: '已发布',
          name: '0',
          count: 'publishedNum'
        },
        {
          label: '已提交',
          name: '1',
          count: 'submitNum'
        },
        {
          label: '已确认',
          name: '2',
          count: 'confirmNum'
        }
        // {
        //   label: '已取消',
        //   name: '3',
        //   count: 'cancelNum'
        // }
      ],
      sum: {
        publishedNum: 0,
        submitNum: 0,
        confirmNum: 0,
        cancelNum: 0
      },
      statusDic: {
        0: '已发布',
        1: '已提交',
        2: '已确认',
        3: '已取消'
      },
      query: {
        billNo: '',
        legal: '',
        containsNoInvoice: '',
        startReleaseTime: '',
        endReleaseTime: '',
        startReplyTime: '',
        endReplyTime: '',
        startConfirmTime: '',
        endConfirmTime: '',
        status: null
      },
      releaseRange: [],
      replyRange: [],
      confirmRange: [],
      height: null,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      handleType: '提交',
      detailVisible: false,
      logData: []
    }
  },
  created () {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const lastThreeMonth = dayjs()
      .subtract(3, 'month')
      .format('YYYY-MM-DD HH:mm:ss')
    this.releaseRange = [lastThreeMonth, now]
    this.initTable(1)
    this.getLegalName()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    handleDetail (row) {
      // console.log(this.activeName);
      this.handleType = this.activeName === '0' ? '编辑' : '详情'
      this.$refs.detail.init(row)
      this.detailVisible = true
    },
    handleLog (billId) {
      payBillApi
        .getOperationItem({ billId })
        .then((res) => {
          if (res.code === '0' && res.data) {
            this.logData = res.data
          }
        })
    },
    getLegalName () {
      receiptApi.getCorporateNameAndCode().then((res) => {
        this.legalNamesList = res.data
      })
    },
    tabClick (tab) {
      this.query.status = parseInt(tab.name)
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
    formatParams (nopage) {
      const params = Object.assign(
        {
          billNo: this.query.billNo,
          legal: arrayJoin(this.query.legal),
          containsNoInvoice: this.query.containsNoInvoice,
          startReleaseTime: this.timeRangeFormat(this.releaseRange)[0],
          endReleaseTime: this.timeRangeFormat(this.releaseRange)[1],
          startReplyTime: this.timeRangeFormat(this.replyRange)[0],
          endReplyTime: this.timeRangeFormat(this.replyRange)[1],
          startConfirmTime: this.timeRangeFormat(this.confirmRange)[0],
          endConfirmTime: this.timeRangeFormat(this.confirmRange)[1],
          status: parseInt(this.activeName)
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
      payBillApi.exportPaymentBill(this.formatParams(true))
    },
    initTable (page) {
      this.loading = true
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      payBillApi
        .getPaymentBill(this.formatParams())
        .then((res) => {
          if (res.code === '0' && res.data) {
            this.tableData = res.data.srmFinancePaymentBillIPage.records
            this.tablePage.total = res.data.srmFinancePaymentBillIPage.total
            this.sum.publishedNum = res.data.publishedNum
            this.sum.submitNum = res.data.submitNum
            this.sum.confirmNum = res.data.confirmNum
            this.sum.cancelNum = res.data.cancelNum
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    resetQuery () {
      this.query = {
        billNo: '',
        legal: '',
        containsNoInvoice: '',
        startReleaseTime: '',
        endReleaseTime: '',
        startReplyTime: '',
        endReplyTime: '',
        startConfirmTime: '',
        endConfirmTime: '',
        status: null
      }
      this.releaseRange = []
      this.replyRange = []
      this.confirmRange = []
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
