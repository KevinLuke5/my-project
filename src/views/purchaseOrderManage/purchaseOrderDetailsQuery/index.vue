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
        <j-form-item label="产品线">
          <j-select
            v-model="query.lineCode"
            :collapse-tags="true"
            filterable
            multiple
            clearable
          >
            <j-option
              v-for="item in pdtLineList"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="供应商">
          <j-input v-model="query.supplier" placeholder="请输入供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="订单行类型">
          <j-select
            v-model="query.orderType"
            :collapse-tags="true"
            clearable
            multiple
          >
            <j-option
              v-for="item in orderTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="订单交期">
          <j-date-picker
            v-model="orderDelivery"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item label="订单号">
          <j-input v-model="query.orderCode" placeholder="输入订单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>

        <j-form-item label="响应是否延时">
          <j-select v-model="query.delayFeedback" clearable>
            <j-option
              v-for="item in isNY"
              :key="item.id"
              :label="item.lable"
              :value="item.value"
            />
          </j-select>
        </j-form-item>

        <j-form-item label="物料编码">
          <j-input v-model="query.goodsCode" placeholder="请输入物料编码模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="订单行">
          <j-input v-model="query.lineNumBegin" placeholder="订单行自" @keyup.enter.native="initTable(1)" />
          <j-input v-model="query.lineNumEnd" placeholder="订单行至" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="物料名称">
          <j-input v-model="query.goodsName" placeholder="请输入物料名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="是否外协">
          <j-select v-model="query.outsourcing" clearable>
            <j-option
              v-for="item in isNY"
              :key="item.id"
              :label="item.lable"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="是否黑名单">
          <j-select v-model="query.isBlack" clearable>
            <j-option
              v-for="item in isNY"
              :key="item.id"
              :label="item.lable"
              :value="item.value"
            />
          </j-select>
        </j-form-item>

        <j-form-item label="行状态">
          <j-select v-model="query.lineStatus" clearable multiple>
            <j-option
              v-for="item in lineStatusList"
              :key="item.id"
              :label="item.lable"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="收货供应商">
          <j-input v-model="query.receivingSupplier" placeholder="请输入供应商模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="行备注">
          <j-input v-model="query.lineRemark" placeholder="请输入行备注模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="库存组织">
          <j-select
            v-model="query.inventoryOrganizationCode"
            :collapse-tags="true"
            filterable
            clearable
            multiple
          >
            <j-option
              v-for="item in queryList"
              :key="item.id"
              :label="item.orgName"
              :value="item.orgCode"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="发布时间">
          <j-date-picker
            v-model="releaseTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item label="反馈时间">
          <j-date-picker
            v-model="feedbackTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'exportPurchaseOrders'" @click="handleExport">
            导出
          </j-button>
        </j-form-item>
      </j-form>

      <j-table
        :data="tableData"
        style="width: 100%"
        :height="height"
        size="mini"
        row-key="id"
        highlight-current-row
        :row-class-name="tableRowClassName"
        @selection-change="handleSelectionChange"
        @expand-change="handleExpandChange"
        @sort-change="sortChange"
      >
        <j-table-column
          prop="lineName"
          label="产品线"
          sortable="custom"
          width="100"
        />
        <j-table-column prop="lineStatus" label="行状态" width="80">
          <template slot-scope="scope">
            {{ returnLineStatus(scope.row.lineStatus) }}
          </template>
        </j-table-column>
        <j-table-column type="expand" width="55">
          <template slot-scope="scope">
            <div v-if="scope.row.childrens.length > 0">
              <j-table
                :data="scope.row.childrens"
                :row-key="scope.row.childrens.id"
                :show-header="false"
                style="width: 100%"
              >
                <j-table-column width="185" />
                <j-table-column prop="orderCode" label="订单号" width="80" />
                <j-table-column prop="lineNum" label="行号" width="80" />
                <j-table-column prop="purchaseGoodsCode" label="物料编码" width="120" />
                <j-table-column prop="goodsName" label="物料名称" width="300" />
                <j-table-column
                  prop="unit"
                  label="单位"
                  align="center"
                  width="80"
                />
                <j-table-column
                  prop="orderNum"
                  label="订单量"
                  align="center"
                  width="120"
                />
                <j-table-column prop="deliveryScheduleNum" label="交货排程量" width="120" />
                <j-table-column
                  prop="orderDelivery"
                  label="订单交期"
                  align="center"
                  width="150"
                />
                <j-table-column prop="receiveNum" label="已接收量" width="120" />
              </j-table>
            </div>
          </template>
        </j-table-column>
        <j-table-column
          prop="orderCode"
          label="订单号"
          sortable="custom"
          width="80"
        />
        <j-table-column
          prop="lineNum"
          label="行号"
          sortable="custom"
          width="80"
        />

        <j-table-column
          prop="purchaseGoodsCode"
          sortable="custom"
          label="物料编码"
          width="120"
        />
        <j-table-column prop="goodsName" label="物料名称" width="300" />
        <j-table-column
          prop="unit"
          label="单位"
          align="center"
          width="80"
        />
        <j-table-column
          prop="orderNum"
          label="订单量"
          align="center"
          width="120"
        />
        <j-table-column prop="deliveryScheduleNum" label="交货排程量" width="120" />
        <j-table-column
          prop="orderDelivery"
          label="订单交期"
          align="center"
          width="150"
          sortable
        />
        <j-table-column prop="receiveNum" label="已接收量" width="120" />
        <j-table-column prop="waitRetreatNum" label="退回量" width="120" />
        <j-table-column prop="bareReceiveNum" label="净接收量" width="120" />
        <j-table-column prop="transitNum" label="在途量" width="120" />
        <j-table-column prop="unpaidNum" label="未交量" width="120" />
        <j-table-column prop="erpStorageNum" label="ERP入库量" width="120" />
        <j-table-column prop="makeNum" label="开票量" width="120" />
        <j-table-column prop="lineRemark" label="行备注" width="120" />
        <j-table-column prop="orderType" label="行单行类型" width="120" />
        <j-table-column prop="receivingSupplier" label="收货供应商" width="120" />
        <j-table-column prop="receivingSupplierAddress" label="收货供应商地址" width="200" />
        <j-table-column prop="isBlack" label="黑名单" width="120" />
        <j-table-column prop="outsourcing" label="是否外协" width="120" />
        <j-table-column label="BOM查看" width="120">
          <template slot-scope="scope">
            <j-button
              v-check="'bomQuery'"
              type="text"
              size="mini"
              :disabled="!scope.row.workOrderNo"
              @click="handleDetail(scope.row)"
            >
              BOM查看
            </j-button>
          </template>
        </j-table-column>
        <j-table-column prop="releaseTime" label="发布时间" width="120" />
        <j-table-column prop="feedbackTime" label="反馈时间" width="120" />
        <j-table-column prop="delayFeedback" label="是否延时反馈" width="120" />

        <j-table-column prop="supplierCode" label="供应商编码" width="120" />
        <j-table-column prop="supplierName" label="供应商名称" width="120" />
        <j-table-column prop="supplierLocation" label="供应商地点" width="120" />
        <j-table-column prop="inventoryOrganization" label="库存组织" width="120" />
        <j-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <j-button
              v-check="'getOrderOperation'"
              type="text"
              size="mini"
              @click="handleDailyRecord(scope.row)"
            >
              日志
            </j-button>
          </template>
        </j-table-column>
      </j-table>
      <div class="page">
        <j-pagination
          :current-page="currentPage"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="tablePage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tablePage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </j-card>
    <!-- 拒绝 -->
    <j-dialog
      title="拒绝"
      :visible.sync="checkVisible"
      width="400px"
      :before-close="checkClose"
    >
      <j-form
        ref="checkForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="checkForm"
        :rules="rules"
      >
        <j-form-item label="拒绝原因" prop="rejectReason">
          <j-input v-model="checkForm.rejectReason" type="textarea" autosize />
        </j-form-item>
      </j-form>
      <span slot="footer" class="dialog-footer">
        <j-button @click="checkClose">取 消</j-button>
        <j-button type="primary" @click="refuseReason">确 认</j-button>
      </span>
    </j-dialog>
    <!-- 日志 -->
    <j-dialog
      title="日志"
      :visible.sync="detailVisible"
      width="800px"
      :before-close="detailClose"
    >
      <j-table
        ref="multipleTable"
        :data="dailyRecordData"
        size="small"
        border
        :height="height"
        tooltip-effect="dark"
        highlight-current-row
      >
        <j-table-column prop="operationTime" label="操作时间" />
        <j-table-column prop="operationUserName" label="操作人" />
        <j-table-column prop="operationItem" label="操作项">
          <template slot-scope="scope">
            <div v-html="scope.row.operationItem" />
          </template>
        </j-table-column>
      </j-table>
      <!-- <span slot="footer" class="dialog-footer">
        <j-button @click="detailClose">取 消</j-button>
        <j-button type="primary" @click="refuseReason">确 认</j-button>
      </span> -->
    </j-dialog>
    <!-- 导出类型确认弹框 -->
    <j-dialog
      title="导出类型选择"
      :visible.sync="exportVisible"
      width="600px"
      :before-close="exportClose"
    >
      <j-radio-group v-model="radio">
        <j-radio :label="1">
          仅导出订单
        </j-radio>
        <!-- <j-radio :label="2">仅导出排程</j-radio> -->
        <j-radio :label="3">
          导出订单+排程
        </j-radio>
      </j-radio-group>
      <span slot="footer" class="dialog-footer">
        <j-button type="primary" @click="affirm">确 认</j-button>
      </span>
    </j-dialog>
    <!-- 详情 -->
    <workOrder
      ref="workOrder"
      :detail-visible="workOrderVisible"
      :detail-form="workOrderForm"
      @detailClose="workOrderClose"
    />
  </div>
</template>

<script>
import { changeTime } from '../../../utils/timeStyle'
import * as purchaseOrderApi from '@/api/purchaseOrder/Confirmation'
import * as supplierApi from '@/api/supplier/pool'
import * as baseApi from '@/api/base/personOrg'
import { compare } from '@/utils/tableSort'
import { getCodeList } from '@/views/common/dic'
import { arrayJoin } from '@/utils/index'
import workOrder from '@/views/purchaseOrderManage/components/workOrder'
import dayjs from 'dayjs'

export default {
  name: 'PurchaseOrderDetailsQuery',
  components: { workOrder },
  props: {
    type: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      radio: 1,
      exportVisible: false,
      dailyRecordData: [],
      lineStatusList: [
        {
          id: 0,
          lable: '已发布',
          value: '1'
        },
        {
          id: 1,
          lable: '已确认',
          value: '2'
        },
        {
          id: 2,
          lable: '已拒绝',
          value: '3'
        },
        {
          id: 3,
          lable: '已完成',
          value: '4'
        },
        {
          id: 4,
          lable: '已取消',
          value: '5'
        }
      ],
      isNY: [
        {
          id: 0,
          lable: '是',
          value: 'Y'
        },
        {
          id: 1,
          lable: '否',
          value: 'N'
        }
      ],
      orderTypeList: [
        {
          id: 1,
          name: '客直',
          lineNumber: '1'
        },
        {
          id: 2,
          name: '维修',
          lineNumber: '2'
        },
        {
          id: 3,
          name: '常规',
          lineNumber: '3'
        },
        {
          id: 4,
          name: 'RDC',
          lineNumber: '4'
        },
        {
          id: 5,
          name: '出口',
          lineNumber: '5'
        },
        {
          id: 6,
          name: '试产',
          lineNumber: '6'
        }
      ],
      queryList: [],
      rejectItem: {},
      ids: [],
      pdtLineList: [],
      deliverySchedylingVisible: false,
      workOrderVisible: false,
      detailVisible: false,
      rules: {
        rejectReason: [
          { required: true, message: '请输入拒绝原因', trigger: 'change' }
        ]
      },
      query: {
        supplier: '',
        lineCode: '',
        releaseTimeBegin: '',
        releaseTimeEnd: '',
        delayFeedback: '',
        inventoryOrganizationCode: '',
        orderCode: '',
        lineNumBegin: '',
        lineNumEnd: '',
        goodsCode: '',
        goodsName: '',
        lineRemark: '',
        orderType: '',
        receivingSupplier: '',
        outsourcing: '',
        isBlack: '',
        lineStatus: '',
        workOrderNo: '',
        feedbackTimeBegin: '',
        feedbackTimeEnd: '',
        orderDeliveryBegin: '',
        orderDeliveryBeginEnd: ''
      },
      releaseTime: [],
      feedbackTime: [],
      orderDelivery: [],
      height: null,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      checkVisible: false,
      checkForm: {
        rejectReason: ''
      },
      workOrderForm: {},
      deliverySchedylingForm: {},
      multipleSelection: [],
      currentPage: 1
    }
  },
  watch: {
    releaseTime (val) {
      if (val && val.length > 0) {
        this.query = Object.assign(
          this.query,
          changeTime(val, 'releaseTimeBegin', 'releaseTimeEnd')
        )
      } else {
        this.query.releaseTimeBegin = ''
        this.query.releaseTimeEnd = ''
      }
    },
    feedbackTime (val) {
      if (val && val.length > 0) {
        this.query = Object.assign(
          this.query,
          changeTime(val, 'feedbackTimeBegin', 'feedbackTimeEnd')
        )
      } else {
        this.query.feedbackTimeBegin = ''
        this.query.feedbackTimeEnd = ''
      }
    },
    orderDelivery (val) {
      if (val && val.length > 0) {
        this.query = Object.assign(
          this.query,
          changeTime(val, 'orderDeliveryBegin', 'orderDeliveryBeginEnd')
        )
      } else {
        this.query.orderDeliveryBegin = ''
        this.query.orderDeliveryBeginEnd = ''
      }
    }
  },
  created () {
    this.getPdtLineList()
    this.getQuery()
    this.getOrderDelivery()
    this.initTable(1)
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    /**
     * 行状态
     */
    returnLineStatus (val) {
      switch (val) {
        case 1:
          return '已发布'
        case 2:
          return '已确认'
        case 3:
          return '已拒绝'
        case 4:
          return '已完成'
        case 5:
          return '已取消'
      }
    },
    getOrderDelivery () {
      let startTime = new Date().getTime() - 31 * 60 * 60 * 24 * 1000
      startTime = dayjs(startTime).format('YYYY-MM-DD')
      this.query.orderDeliveryBegin = startTime + ' 00:00:00'
      this.orderDelivery.push(startTime)
      let endTime = new Date().getTime() + 62 * 60 * 60 * 24 * 1000
      endTime = dayjs(endTime).format('YYYY-MM-DD')
      this.query.orderDeliveryBeginEnd = endTime + ' 23:59:59'
      this.orderDelivery.push(endTime)
    },
    /**
     * 根据不同的值进行表格排序
     */
    sortChange ({ prop, order }) {
      this.tableData.sort(compare(prop, order))
    },
    exportClose () {
      this.exportVisible = false
    },
    /**
     * 导出类型确认
     */
    affirm () {
      this.exportVisible = false
      const params = Object.assign(
        { exportStatus: this.radio },
        this.formatParams()
      )
      purchaseOrderApi.exportPurchaseOrder(params)
    },
    /**
     * 展开行
     */
    handleExpandChange (row) {
      const that = this
      const params = {
        id: row.planId
      }
      purchaseOrderApi.getPurchaseOrderSon(params).then((res) => {
        that.tableData.forEach((temp, index) => {
          if (temp.id === row.id) {
            that.tableData[index].childrens = res.data
            that.tableData = that.tableData.slice(0)
          }
        })
      })
    },
    /**
     * 获取库存组织下拉框
     */
    getQuery () {
      const params = {
        page: 1,
        size: 500
      }
      baseApi.getQuery(params).then((res) => {
        this.queryList = res.data.records
      })
    },
    /**
     * 批量确认
     */
    batchConfirmation (id) {
      if (id) {
        this.ids = []
        this.ids.push(id)
      }
      this.ids = this.ids.join(',')
      const params = {
        ids: this.ids
      }
      purchaseOrderApi.batchConfirmation(params).then((res) => {
        if (res.code === '0' && res.data) {
          this.$message.success('订单确认成功！')
        }
      })
    },
    /**
     * 获取产品线下拉
     */
    getPdtLineList () {
      supplierApi.getPdtLineList().then((res) => {
        this.pdtLineList = res.data.records
      })
    },

    /**
     * 交货排程
     */
    handleDeliverySchedyling (row) {
      this.deliverySchedylingForm = row
      this.deliverySchedylingVisible = true
    },
    deliveryVisible (e) {
      this.deliverySchedylingVisible = e
      this.initTable(1)
    },
    tableRowClassName ({ row, rowIndex }) {
      if (rowIndex === 1) {
        return 'warning-row'
      } else if (rowIndex === 3) {
        return 'success-row'
      }
      return ''
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.tablePage.pageSize = size
      this.currentPage = 1
      this.initTable(1)
    },
    handleCurrentChange: function (currentPage) {
      this.tablePage.pageNum = currentPage
      this.initTable(currentPage)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
      this.ids = []
      val.forEach((item) => {
        this.ids.push(item.id)
      })
    },
    deliverySchedylingClose () {
      this.deliverySchedylingVisible = false
    },
    workOrderClose () {
      this.workOrderVisible = false
    },
    detailClose () {
      this.detailVisible = false
    },
    getSelectData () {
      getCodeList('code00061').then((list) => {
        this.orderTypeList = list
      })
    },
    /**
     * 打开日志
     */
    handleDailyRecord (row) {
      this.detailVisible = true
      const id = row.id
      const params = {
        id: id
      }
      purchaseOrderApi.getOrderOperation(params).then((res) => {
        if (res.code === '0' && res.data) {
          this.dailyRecordData = res.data
        }
      })
    },
    handleDetail (row) {
      this.workOrderForm = row
      this.workOrderVisible = true
    },
    handleExport () {
      this.exportVisible = true
    },
    formatParams () {
      const params = Object.assign({}, this.query, {
        lineCode: arrayJoin(this.query.lineCode),
        inventoryOrganizationCode: arrayJoin(
          this.query.inventoryOrganizationCode
        ),
        orderType: arrayJoin(this.query.orderType),
        lineStatus: arrayJoin(this.query.lineStatus),
        queryStatus: 2
      })
      return params
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      const params = Object.assign(
        {
          size: this.tablePage.pageSize,
          page: this.tablePage.pageNum
        },
        this.formatParams()
      )
      purchaseOrderApi.getPurchaseOrder(params).then((res) => {
        if (res.code === '0' && res.data) {
          this.tableData = res.data.records
          this.tableData.map((item) => {
            item.childrens = []
          })
          this.tablePage.total = res.data.total
          this.loading = false
        }
      })
    },
    refuseReason () {
      if (this.checkForm.rejectReason) {
        const params = {
          id: this.rejectItem.id,
          refuseReason: this.checkForm.rejectReason
        }
        purchaseOrderApi.rejectPurchaseOrder(params).then((res) => {
          if (res && res.code === '0') {
            this.showMessage('操作成功!', 'success')
            this.checkVisible = false
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
      } else {
        this.showMessage('请输入拒绝原因!')
      }
    },
    checkClose () {
      this.checkVisible = false
      this.checkForm = {
        id: '',
        status: '',
        checkAdvice: ''
      }
    },
    resetQuery () {
      this.query = {
        supplier: '',
        lineCode: '',
        releaseTimeBegin: '',
        releaseTimeEnd: '',
        delayFeedback: '',
        inventoryOrganizationCode: '',
        orderCode: '',
        lineNumBegin: '',
        lineNumEnd: '',
        goodsCode: '',
        goodsName: '',
        lineRemark: '',
        orderType: '',
        receivingSupplier: '',
        outsourcing: '',
        isBlack: '',
        lineStatus: '',
        workOrderNo: '',
        feedbackTimeBegin: '',
        feedbackTimeEnd: '',
        orderDeliveryBegin: '',
        orderDeliveryBeginEnd: ''
      }
      this.releaseTime = []
      this.feedbackTime = []
      this.orderDelivery = []
    }
  }
}
</script>
<style lang="less" scoped>
.el-pagination {
  text-align: center;
}
.el-table /deep/.el-table__expanded-cell {
  border-bottom: none;
  padding: 0px 50px;
}
</style>
