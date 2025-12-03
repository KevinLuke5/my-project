<!--
 * @Author: lvkaijun
 * @Date: 2023-05-05 16:15:17
 * @LastEditTime: 2023-05-05 16:15:17
 * @Description: 对账单明细
-->
<template>
  <div class="app-container">
    <!-- <query-form
      :query-form="queryForm"
      @search="init"
      @reset="reset"
      @heightChange="heightChange"
    /> -->
    <j-card class="box-card" shadow="never" :body-style="{'padding-top': '0px'}">
      <div class="table-btn export">
        <j-button
          v-if="types === 'first'"
          v-check="'exportExpenseRecordInt'"
          type="danger"
          plain
          @click="openRelease"
        >
          确认
        </j-button>
        <j-button
          type="danger"
          plain
          :loading="exptLoading"
          @click="handleExport"
        >
          导出
        </j-button>
      </div>
      <div class="title">
        <span>对账单号：{{ detail.billNo }}</span>
        <span>法人：{{ detail.legalName }}</span>
        <span>供应商：{{ detail.supplierName }}</span>
        <span>对账截止日期：{{ changeTime(detail.checkDate) }}</span>
        <span>未税额：{{ detail.netAmount }}</span>
        <span>币种：{{ detail.currency }}</span>
        <span>税率%：{{ detail.taxRate }}</span>
      </div>
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
        class="h490"
        size="small"
        :data="tableData"
        :height="height"
        style="width: 100%"
        tooltip-effect="dark"
        @selection-change="handleSelect"
      >
        <j-table-column type="index" label="序号" />
        <!-- <j-table-column prop="isChecked" v-if="tabName === 'first'" :key="123" label="本次是否对账"  min-width="120">
          <template slot-scope="scope">
            <j-link v-show="!scope.row.changing" @click="numInputShow(scope.row, scope.$index)">
              {{ scope.row.isChecked }}
            </j-link>
            <j-input
              v-show="scope.row.changing"
              :ref="'numInput' + scope.$index"
              v-model="scope.row.isChecked"
              style="width: 80px"
              size="mini"
              @blur="inputDone(scope.row)"
              @change="inputDone(scope.row)"
            />
          </template>
        </j-table-column> -->
        <j-table-column
          v-if="tabName === 'first' || tabName === 'second' || tabName === 'three'"
          :key="91"
          prop="productLineName"
          label="产品线"
        />
        <j-table-column
          v-if="tabName === 'first' || tabName === 'second' || tabName === 'three'"
          :key="92"
          prop="deliveryNo"
          label="送货单号"
          min-width="90"
        />
        <j-table-column
          v-if="tabName === 'six'"
          :key="913"
          prop="letterNo"
          label="单号"
          min-width="90"
        />
        <j-table-column
          v-if="tabName === 'four'"
          :key="93"
          prop="code"
          label="单号"
          min-width="90"
        />
        <j-table-column
          v-if="tabName === 'first' || tabName === 'second' || tabName === 'three' || tabName === 'five'"
          :key="93"
          prop="orderNo"
          label="订单号"
          min-width="90"
        />
        <j-table-column
          v-if="tabName === 'first' || tabName === 'second' || tabName === 'three' || tabName === 'five'"
          :key="94"
          prop="lineNo"
          label="订单行"
          min-width="90"
        />
        <j-table-column
          v-if="tabName === 'first'"
          :key="23"
          prop="lineNo"
          label="操作"
          min-width="90"
        />
        <j-table-column
          v-if="tabName === 'first' || tabName === 'second' || tabName === 'three' || tabName === 'five'"
          :key="95"
          prop="materialCode"
          label="物料编码"
        />
        <j-table-column
          v-if="tabName === 'first' || tabName === 'second' || tabName === 'three' || tabName === 'five'"
          :key="96"
          prop="materialName"
          label="物料名称"
        />
        <j-table-column
          v-if="tabName === 'first' || tabName === 'second' || tabName === 'three'"
          :key="97"
          prop="transactionType"
          label="事务类型"
        />
        <j-table-column
          v-if="tabName === 'first' || tabName === 'second' || tabName === 'three'"
          :key="98"
          prop="unit"
          label="单位"
        />
        <j-table-column
          v-if="tabName === 'first' || tabName === 'second' || tabName === 'three'"
          :key="99"
          prop="transactionQuantity"
          label="事务数量"
        />
        <j-table-column
          v-if="tabName !== 'six'"
          :key="1010"
          prop="transactionDate"
          label="事务日期"
        />
        <j-table-column
          v-if="tabName === 'five'"
          :key="101"
          prop="priceType"
          label="价格类型"
        />
        <j-table-column
          v-if="tabName === 'five'"
          :key="102"
          prop="quantity"
          label="接收数量"
        />
        <j-table-column
          v-if="tabName === 'five'"
          :key="103"
          prop="freightPrice"
          label="运费价格"
        />
        <j-table-column
          v-if="tabName === 'five'"
          :key="104"
          prop="freightQuantity"
          label="运费量"
        />
        <j-table-column
          v-if="tabName === 'six'"
          :key="105"
          prop="releaseDate"
          label="发布日期"
        />
        <j-table-column
          v-if="tabName === 'six'"
          :key="106"
          prop="type"
          label="类型"
        />
        <j-table-column
          v-if="tabName === 'six'"
          :key="107"
          prop="occurTime"
          label="发生日期"
        />
        <j-table-column
          v-if="tabName === 'six'"
          :key="108"
          prop="problemDescription"
          label="事项内容"
        />
        <j-table-column :key="111" prop="currency" label="币种" />
        <j-table-column :key="112" prop="taxRate" label="税率%">
          <template slot-scope="scope">
            {{ scope.row.taxRate }}%
          </template>
        </j-table-column>
        <j-table-column
          v-if="tabName === 'second'"
          :key="2"
          prop="invoicePrice"
          label="暂估单价"
        />
        <j-table-column
          v-if="tabName === 'first'"
          :key="3"
          prop="invoicePrice"
          label="开票单价"
        />
        <j-table-column
          v-if="tabName === 'three'"
          :key="4"
          prop="quotationPrice"
          label="报价单价格"
        />
        <j-table-column
          v-if="tabName === 'three'"
          :key="5"
          prop="lastAccountedPrice"
          label="上次核算价格"
          min-width="120"
        />
        <j-table-column
          v-if="tabName === 'three'"
          :key="6"
          prop="unitPriceDiff"
          label="追溯单价价差"
          min-width="120"
        />
        <j-table-column
          v-if="tabName === 'three'"
          :key="7"
          prop="traceAmount"
          label="追溯未税额"
        />
        <j-table-column
          v-if="tabName === 'second' || tabName === 'first' || tabName === 'five' || tabName === 'six'"
          :key="8"
          prop="notaxAmount"
          label="未税额"
        />
        <j-table-column
          v-if="tabName === 'four'"
          :key="82"
          prop="amount"
          label="未税额"
        />
        <j-table-column prop="inventoryOrganizationName" label="库存组织" />
        <j-table-column prop="supplierLocationName" label="供应商地点" />
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
          :page-sizes="[500]"
          :page-size="pagination.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="sizeChange"
          @current-change="pageChange"
        />
        <span class="all-count">
          未税额合计：{{ pagination.total }}
        </span>
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
import { getCodeList } from '@/views/common/dic'
import { clearForm } from '@/utils'
import * as orderRecordApi from '@/api/orderRecord/index'
// import * as baseApi from "@/api/base"
import dayjs from 'dayjs'

export default {
  name: 'NtInterface',
  props: {},
  data () {
    return {
      releaseVisible: false,
      queryList: [],
      // detail: {
      //   billNo: '',
      //   legalName: '',
      //   supplierName: '',
      //   checkDate: '',
      //   netAmount: '',
      //   currency: '',
      //   taxRate: ''
      // },
      aaaa: [1],
      tabName: 'first',
      // tab 标签页
      activeName: 'first',
      firstCount: 0,
      secondCount: 0,
      threeCount: 0,
      tabList: [
        {
          label: '已核价', name: 'first'
        },
        {
          label: '未核价', name: 'second'
        },
        {
          label: '追溯调整', name: 'three'
        },
        {
          label: '资金折扣', name: 'four'
        },
        {
          label: '供应商运费', name: 'five'
        },
        {
          label: '发票调整', name: 'six'
        }
      ],
      queryParams: {},
      selectList: [],
      clearLoading: false,  // 清错按钮 loading
      imptLoading: false,  // 导入按钮 loading
      exptLoading: false,  // 导出按钮 loading
      pagination: {
        pageSize: 500,
        currentPage: 1,
        total: 0
      },
      total: 0,
      loading: false,
      height: null,
      tableData: [],
      status: 0
    }
  },
  computed: {
    endNum () {
      return Math.min(this.pagination.pageSize * this.pagination.currentPage, this.total)
    },
    types () {
      return this.$route.query.type
    },
    id () {
      return this.$route.query.id
    },
    detail () {
      let detail = ''
      if (this.$route.query.detail) {
        detail = JSON.parse(this.$route.query.detail)
      }
      return detail
    }
  },
  watch: {
  },
  mounted () {
    this.getSelectData()
    this.init()
  },
  activated () {
    this.init()
  },
  methods: {
    numInputShow (row, index) {
      row.changing = true
      this.$nextTick(() => {
        this.$refs['numInput' + index].focus()
      })
    },
    inputDone (row) {
      console.log(row)
      row.changing = false
      const params = {
        id: row.id,
        isChecked: row.isChecked
      }
      orderRecordApi.editTransactionOrderDetail(params).then(res => {
        if (res && res.code === '0') {
          this.$message({
            showClose: true,
            message: '编辑成功！',
            type: 'success'
          })
        } else {
          this.$message({
            showClose: true,
            message: res.message,
            type: 'warning'
          })
        }
      })
    },
    returnPriceTypeName (val) {
      if (!val || val.length === 0) {
        return []
      }
      const result = this.typeList.filter(item => item.name === val)
      console.log(result)
      return result[0].attributesOne
    },
    changeTime (time) {
      const newTime = dayjs(time).format('YYYY-MM-DD')
      // console.log(newTime);
      return newTime
    },
    refuseRelease () {
      this.handleRelease()
      this.releaseClose()
    },
    openRelease () {
      this.releaseVisible = true
    },
    releaseClose () {
      this.releaseVisible = false
      this.init()
    },
    /**
     * 确认
    */
    handleRelease () {
      const params = []
      const obj = {
        id: this.detail.deliveryNo,
        status: 3
      }
      params.push(obj)
      orderRecordApi.batchConfirm(params).then(res => {
        if (res && res.code === '0') {
          this.$message({
            showClose: true,
            message: '对账单确认成功！',
            type: 'success'
          })
          this.$store.dispatch('tagsView/delView', this.$route)
          this.$router.go(-1)
        } else {
          this.$message({
            showClose: true,
            message: res.msg,
            type: 'warning'
          })
        }
      })
    },
    getSelectData () {
      getCodeList('code00069').then((list) => {
        this.typeList = list
        const newList = []
        list.forEach(item => {
          newList.push({
            value: item.name,
            label: item.name
          })
        })
        // this.queryForm.priceType.data = newList
      })
    },
    tabClick (tab) {
      this.tabName = tab.name
      this.status = this.activeName === 'first' ? 0 : this.activeName === 'second' ? 1 : this.activeName === 'three' ? 2 : this.activeName === 'four' ? 3 : this.activeName === 'five' ? 4 : 5
      this.pagination.currentPage = 1
      this.init()
    },
    init (isSearch = false) {
      if (isSearch) this.pagination.currentPage = 1
      const params = {
        billNo: this.id,
        queryStatus: this.status
      }
      for (const k in this.queryForm) {
        if (this.queryForm[k].value) params[k] = this.queryForm[k].value
      }
      console.log(params)
      this.queryParams = {
        ...params,
        size: this.pagination.pageSize,
        page: this.pagination.currentPage
      }
      this.loading = true
      // 无票费用
      this.$nextTick(() => {
        orderRecordApi.getBillInfoDetail(this.queryParams).then(res => {
          if (res && res.code === '0') {
            // const dataList = res.data.details
            // this.tableData = dataList
            if (res.data.details.records.length > 0) {
              this.tableData = res.data.details.records.map((row) => {
                row.changing = false
                return row
              })
            } else {
              this.tableData = res.data.details.records
            }
            this.total = res.data.details.total
            this.pagination.total = res.data.sum
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
              message: res.msg,
              type: 'warning'
            })
          }
          this.loading = false
        })
      })
    },
    reset () {
      this.queryForm = clearForm(this.queryForm)
      this.$nextTick(() => {
        this.init()
      })
    },
    handleSelect (val) {
      this.selectList = val
    },

    // 导出
    handleExport () {
      const params = {
        billNo: this.detail.billNo,
        status: 1
      }
      orderRecordApi.exportBillInfoDetail(params)
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
<style scoped lang="less">
.export {
  display: inline-block;
  line-height: 52px;
  margin-left: 10px;
}
.first-btn {
  float: left;
}
.title {
  margin: 25px 0 25px 10px
}
.title span{
  margin-right: 20px;
  font-size: 13px;
}
.span-input {
  width: 100px;
}
.title-two {
  margin-left: 10px;
}
.title-two span{
  margin-right: 20px;
  font-size: 13px;
}
.page {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.all-count {
  margin-left: 50px;
}
.h490 {
  height: 490px;
}
/deep/ .el-table__body-wrapper {
  overflow-y: scroll;
  height: 440px;
}
</style>
