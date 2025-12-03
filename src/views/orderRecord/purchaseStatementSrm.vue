<!--
 * @Author: lvkaijun
 * @Date: 2023-05-15 11:15:17
 * @LastEditTime: 2023-05-15 16:15:17
 * @Description: 采购对账单
-->
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
        <j-form-item label="对账单号">
          <j-input v-model="query.billNo" placeholder="对账单号" @keyup.enter.native="init(1)" />
        </j-form-item>
        <j-form-item label="法人">
          <j-select
            v-model="query.legalCode"
            multiple
            clearable
            filterable
            :collapse-tags="true"
          >
            <j-option
              v-for="item in legalCodeList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="币种">
          <j-select v-model="query.currency" clearable multiple>
            <j-option
              v-for="item in currencyList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="税率%">
          <j-select v-model="query.taxRate" clearable multiple>
            <j-option
              v-for="item in taxRateList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="供应商">
          <j-input v-model="query.supplierCode" placeholder="供应商编码/名称模糊查询" @keyup.enter.native="init(1)" />
        </j-form-item>
        <j-form-item label="创建日期">
          <j-date-picker
            v-model="occurTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <div class="btn">
          <div>
            <j-button
              v-if="tabName === 'first'"
              v-check="'deductiongys'"
              type="primary"
              @click="openRelease"
            >
              确认
            </j-button>
          </div>
          <j-form-item class="btn-group" style="margin-bottom: 0">
            <j-button v-check="'deductiongys-selectPage'" type="primary" @click="init(1)">
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button @click="handleExport">
              导出
            </j-button>
          </j-form-item>
        </div>
      </j-form>
      <!-- tab 标签 -->
      <j-tabs v-model="activeName" @tab-click="tabClick">
        <j-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.label"
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
        @selection-change="handleSelect"
      >
        <j-table-column type="selection" />
        <j-table-column prop="billNo" label="对账单号" min-width="160">
          <template slot-scope="scope">
            <j-button
              type="text"
              size="mini"
              @click="handleStatementDetails(scope.row.billNo, tabName, scope.row)"
            >
              {{ scope.row.billNo }}
            </j-button>
          </template>
        </j-table-column>
        <j-table-column prop="legalName" label="法人" />
        <j-table-column prop="supplierCode" label="供应商编码" />
        <j-table-column prop="supplierName" label="供应商名称" />
        <j-table-column prop="currency" label="币种" />
        <j-table-column prop="taxRate" label="税率%">
          <template slot-scope="scope">
            {{ scope.row.taxRate }}%
          </template>
        </j-table-column>
        <j-table-column prop="taxAmount" label="税额" />
        <j-table-column prop="netAmount" label="未税额" />
        <j-table-column prop="grossAmount" label="含税额" />
        <j-table-column prop="checkDate" label="对账截止日期" width="120">
          <template slot-scope="scope">
            {{ changeTimes(scope.row.checkDate) }}
          </template>
        </j-table-column>
        <j-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? '未发布' : scope.row.status === 1 ? '已发布' : scope.row.status === 2 ? '已取消' : scope.row.status === 3 ? '已确认' : '已开票' }}
          </template>
        </j-table-column>
        <j-table-column prop="crtUserName" label="创建人" />
        <j-table-column prop="crtTime" label="创建日期" />
        <j-table-column
          v-if="tabName !== 'first'"
          :key="345"
          prop="confirmUserName"
          label="确认人"
        />
        <j-table-column
          v-if="tabName !== 'first'"
          :key="34"
          prop="confirmTime"
          label="确认日期"
        />
      </j-table>
      <div class="page">
        <span class="page-outer-span">
          <span>第</span>
          {{ pagination.pageSize * (pagination.currentPage - 1) + 1 }}
          <span>到</span>
          {{ endNum }}
          <span>项</span>
        </span>
        <j-pagination
          :current-page="pagination.currentPage"
          :page-sizes="[15, 20, 50, 100]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="sizeChange"
          @current-change="pageChange"
        />
      </div>
    </j-card>
    <!-- 确认 -->
    <j-dialog :visible.sync="releaseVisible" width="400px" :before-close="releaseClose">
      确定对账单吗？
      <span slot="footer" class="dialog-footer">
        <j-button @click="releaseClose">取 消</j-button>
        <j-button type="primary" @click="refuseRelease">确 认</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import { clearForm, downloadFile } from '@/utils'
import * as orderRecordApi from '@/api/orderRecord/index'
import { changeTime } from '../../utils/timeStyle'
import { getCodeList } from '@/views/common/dic'
import { getCorporateNameAndCode } from '@/api/receipt/receipt'
import dayjs from 'dayjs'

export default {
  name: 'PurchaseStatementSrm',
  props: {},
  data () {
    return {
      legalCodeList: [],
      currencyList: [],
      taxRateList: [],
      releaseVisible: false,
      tabName: 'first',
      // tab 标签页
      activeName: 'first',
      firstCount: 0,
      secondCount: 0,
      threeCount: 0,
      tabList: [
        {
          label: '已发布（0）', name: 'first'
        },
        {
          label: '已确认（0）', name: 'second'
        },
        {
          label: '已开票（0）', name: 'three'
        }
      ],
      query: {
        supplierCode: '',
        deliverNo: '',
        legalCode: '',
        currency: '',
        taxRate: []
      },
      occurTime: [],
      queryParams: {},
      selectList: [],
      exptLoading: false,  // 导出按钮 loading
      pagination: {
        pageSize: 15,
        currentPage: 1,
        total: 0
      },
      loading: false,
      height: null,
      tableData: [
        {
          deliveryNo: '123123'
        }
      ],
      status: 1
    }
  },
  computed: {
    endNum () {
      return Math.min(this.pagination.pageSize * this.pagination.currentPage, this.pagination.total)
    }
  },
  watch: {
    firstCount (val) {
      this.tabList[0].label = `已发布（${val}）`
    },
    secondCount (val) {
      this.tabList[1].label = `已确认（${val}）`
    },
    threeCount (val) {
      this.tabList[2].label = `已开票（${val}）`
    },
    occurTime (val) {
      if (val && val.length > 0) {
        this.query = Object.assign(this.query, changeTime(val, 'startCrtTime', 'endCrtTime'))
      }
    }
  },
  mounted () {
    this.height = this.getHeight() - 54
    this.init()
    this.getLegalName()
    this.getSelectData()
  },
  activated () {
    this.init()
  },
  methods: {
    changeTimes (time) {
      const newTime = dayjs(time).format('YYYY-MM-DD')
      // console.log(newTime);
      return newTime
    },
    /**
     * 确认
    */
    handleRelease () {
      const params = []
      this.selectList.forEach(item => {
        const obj = {
          id: item.id,
          status: 3
        }
        params.push(obj)
      })
      orderRecordApi.batchConfirm(params).then(res => {
        if (res && res.code === '0') {
          this.$message({
            showClose: true,
            message: '对账单确认成功！',
            type: 'success'
          })
          this.init()
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    handleStatementDetails (val, type, detail) {
      this.$router.push(`/orderRecord/statementDetails?id=${val}&type=${type}&detail=${JSON.stringify(detail)}`)
    },
    refuseRelease () {
      this.handleRelease()
      this.releaseClose()
    },
    openRelease () {
      if (this.selectList.length === 0) {
        this.$message.warning('请选择需要确认的数据')
        return
      }
      this.releaseVisible = true
    },
    releaseClose () {
      this.releaseVisible = false
    },
    getSelectData () {
      getCodeList('code00065').then((list) => {
        const newList = []
        list.forEach(item => {
          newList.push({
            value: item.name,
            label: item.name
          })
        })
        this.currencyList = newList
      })
      getCodeList('code00066').then((list) => {
        const newList = []
        list.forEach(item => {
          newList.push({
            value: item.name,
            label: item.name
          })
        })
        this.taxRateList = newList
      })
    },
    getLegalName () {
      getCorporateNameAndCode().then(res => {
        const list = []
        res.data.forEach(item => {
          list.push({
            value: item.code,
            label: item.name
          })
        })
        this.legalCodeList = list
      })
    },
    // 展开、收起表单时高度改变
    heightChange (height) {
      this.height = height
    },
    tabClick (tab) {
      console.log(tab.name)
      console.log(this.activeName)
      this.tabName = tab.name
      this.status = this.activeName === 'first' ? 1 : this.activeName === 'second' ? 3 : 4
      this.init()
    },
    init (isSearch = false) {
      if (isSearch) this.pagination.currentPage = 1
      const params = {
        queryStatus: this.status
      }
      for (const k in this.query) {
        if (this.query[k]) params[k] = this.query[k]
      }
      if (!params.legalCode) {
        params.legalCode = []
      }
      if (!params.supplierLocationName) {
        params.supplierLocationName = []
      }
      if (!params.currency) {
        params.currency = []
      }
      params.legalCode = params.legalCode.join(',')
      params.currency = params.currency.join(',')
      params.taxRate = params.taxRate.join(',')
      if (params.data) {
        params.startTransactionDate = params.data[0]
        params.endTransactionDate = params.data[1]
        delete params.data
      }
      console.log(params)
      this.queryParams = {
        ...params,
        size: this.pagination.pageSize,
        page: this.pagination.currentPage
      }
      // this.loading = true
      // 无票费用
      this.$nextTick(() => {
        orderRecordApi.getBillInfoPage(this.queryParams).then(res => {
          if (res && res.code === '0') {
            const dataList = res.data.srmFinanceBillInfoPages.records
            this.tableData = dataList
            this.pagination.total = res.data.srmFinanceBillInfoPages.total
            this.firstCount = res.data.publishedSum
            this.secondCount = res.data.confirmSum
            this.threeCount = res.data.invoiceSum
            if (isSearch) {
              this.$message({
                showClose: true,
                message: '查询成功',
                type: 'success'
              })
            }
          } else {
            this.$message({
              showClose: true,
              message: res.message,
              type: 'warning'
            })
          }
          this.loading = false
        })
      })
    },
    resetQuery () {
      this.query = clearForm(this.query)
      this.$nextTick(() => {
        this.init()
      })
    },
    handleSelect (val) {
      this.selectList = val
    },
    // 导出
    handleExport () {
      this.init()
      if (!this.tableData.length) {
        this.$message.warning('列表无数据，无法导出')
        return
      }
      this.exptLoading = true
      orderRecordApi.exportBillInfo(this.queryParams)
      this.exptLoading = false
    },
    sizeChange (val) {
      this.pagination.currentPage = 1
      this.pagination.pageSize = val
      this.init()
    },
    pageChange (e) {
      this.pagination.currentPage = e
      this.init()
    }
  }
}
</script>
<style scoped>
.export {
  display: inline-block;
  line-height: 52px;
  margin-left: 10px;
}
.first-btn {
  float: left;
}
.btn {
  display: flex;
  justify-content: space-between;
}
</style>
