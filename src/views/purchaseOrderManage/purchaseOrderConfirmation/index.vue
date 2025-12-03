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
        <j-form-item label="库存组织">
          <j-select
            v-model="query.inventoryOrganizationCode"
            filterable
            clearable
            :collapse-tags="true"
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
        <j-form-item label="订单号">
          <j-input v-model="query.orderCode" placeholder="输入订单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="订单行">
          <j-input v-model="query.lineNumBegin" placeholder="订单行自" @keyup.enter.native="initTable(1)" />
          <j-input v-model="query.lineNumEnd" placeholder="订单行至" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="订单行类型">
          <j-select
            v-model="query.orderType"
            :collapse-tags="true"
            multiple
            clearable
          >
            <j-option
              v-for="item in orderTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="物料编码">
          <j-input v-model="query.goodsCode" placeholder="请输入物料编码模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="物料名称">
          <j-input v-model="query.goodsName" placeholder="请输入物料名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="收货供应商">
          <j-input v-model="query.receivingSupplier" placeholder="请输入供应商名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="行备注">
          <j-input v-model="query.lineRemark" placeholder="请输入行备注模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="发布日期">
          <j-date-picker
            v-model="releaseTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <div class="btn">
          <div>
            <j-button v-check="'batchConfirmation'" type="primary" @click="batchConfirmation()">
              确认
            </j-button>
          </div>
          <j-form-item class="btn-group" style="margin-bottom: 0">
            <j-button type="primary" @click="initTable(1)">
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button v-check="'exportPurchaseOrder'" @click="handleExport">
              导出
            </j-button>
          </j-form-item>
        </div>
      </j-form>

      <j-table
        :data="tableData"
        style="width: 100%"
        :height="height"
        size="mini"
        row-key="id"
        highlight-current-row
        :cell-style="columnStyle"
        @selection-change="handleSelectionChange"
        @expand-change="handleExpandChange"
        @sort-change="sortChange"
      >
        <j-table-column type="selection" fixed width="55" />
        <j-table-column
          prop="lineName"
          label="产品线"
          sortable="custom"
          width="90"
        />
        <j-table-column prop="lineStatus" label="行状态" width="80">
          <template slot-scope="scope">
            {{ returnLineStatus(scope.row.lineStatus) }}
          </template>
        </j-table-column>
        <j-table-column type="expand" width="55">
          <template slot-scope="scope">
            <div v-if="scope.row.childrens && scope.row.childrens.length > 0">
              <j-table
                :data="scope.row.childrens"
                :row-key="scope.row.childrens.id"
                :cell-style="columnSonStyle(scope.row)"
                :show-header="false"
                style="width: 100%"
              >
                <j-table-column width="230" />
                <j-table-column prop="orderCode" label="订单号" width="80" />
                <j-table-column prop="lineNum" label="行号" width="50" />
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
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.lastOrderNum">
                      <j-tooltip
                        class="item"
                        effect="dark"
                        :content="
                          '修改前：' +
                            (scope.row.lastOrderNum ? scope.row.lastOrderNum : '')
                        "
                        placement="top"
                      >
                        <div class="font-color">
                          {{ scope.row.orderNum }}
                        </div>
                      </j-tooltip>
                    </div>
                    <div v-else>
                      <div>{{ scope.row.orderNum }}</div>
                    </div>
                  </template>
                </j-table-column>
                <j-table-column
                  prop="deliveryScheduleNum"
                  label="交货排程量"
                  align="center"
                  width="120"
                />
                <j-table-column
                  prop="receiveNum"
                  label="已接收量"
                  align="center"
                  width="120"
                />
                <j-table-column
                  prop="orderDelivery"
                  label="订单交期"
                  align="center"
                  width="150"
                >
                  <template slot-scope="scope">
                    <div v-if="scope.row.lastOrderDelivery">
                      <j-tooltip
                        class="item"
                        effect="dark"
                        :content="
                          '修改前：' +
                            (scope.row.lastOrderDelivery
                              ? scope.row.lastOrderDelivery
                              : '')
                        "
                        placement="top"
                      >
                        <div class="font-color">
                          {{ scope.row.orderDelivery }}
                        </div>
                      </j-tooltip>
                    </div>
                    <div v-else>
                      <div>{{ scope.row.orderDelivery }}</div>
                    </div>
                  </template>
                </j-table-column>
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
        <j-table-column prop="lineNum" label="行号" width="50" />
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
        >
          <template slot-scope="scope">
            <div v-if="scope.row.lastOrderNum">
              <j-tooltip
                class="item"
                effect="dark"
                :content="
                  '修改前：' +
                    (scope.row.lastOrderNum ? scope.row.lastOrderNum : '')
                "
                placement="top"
              >
                <div class="font-color">
                  {{ scope.row.orderNum }}
                </div>
              </j-tooltip>
            </div>
            <div v-else>
              <div>{{ scope.row.orderNum }}</div>
            </div>
          </template>
        </j-table-column>
        <j-table-column
          prop="deliveryScheduleNum"
          label="交货排程量"
          align="center"
          width="120"
        />
        <j-table-column
          prop="receiveNum"
          label="已接收量"
          align="center"
          width="120"
        />
        <j-table-column
          prop="orderDelivery"
          label="订单交期"
          sortable="custom"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.lastOrderDelivery">
              <j-tooltip
                class="item"
                effect="dark"
                :content="
                  '修改前：' +
                    (scope.row.lastOrderDelivery
                      ? scope.row.lastOrderDelivery
                      : '')
                "
                placement="top"
              >
                <div class="font-color">
                  {{ scope.row.orderDelivery }}
                </div>
              </j-tooltip>
            </div>
            <div v-else>
              <div>{{ scope.row.orderDelivery }}</div>
            </div>
          </template>
        </j-table-column>
        <j-table-column
          label="操作"
          align="center"
          fixed="right"
          width="160"
        >
          <template slot-scope="scope">
            <j-button
              v-check="'deliverySchedule'"
              type="text"
              size="mini"
              @click="handleDeliverySchedyling(scope.row)"
            >
              交货排程
            </j-button>
            <j-button
              v-check="'getPurchaseOrder'"
              type="text"
              size="mini"
              @click="batchConfirmation(scope.row.id)"
            >
              确认
            </j-button>
            <j-button
              v-check="'reject'"
              type="text"
              size="mini"
              @click="handleReject(scope.row)"
            >
              拒绝
            </j-button>
          </template>
        </j-table-column>
        <j-table-column prop="lineRemark" label="行备注" width="120" />
        <j-table-column prop="orderType" label="行单行类型" width="120" />
        <j-table-column prop="isBlack" label="黑名单" width="120" />
        <j-table-column prop="name" label="BOM查看" width="120">
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
        <j-table-column
          prop="releaseTime"
          sortable="custom"
          label="发布时间"
          width="140"
        />

        <j-table-column prop="receivingSupplier" label="收货供应商" width="120" />
        <j-table-column prop="receivingSupplierAddress" label="收货供应商地址" width="200" />
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
        <j-table-column prop="inventoryOrganization" label="库存组织" width="120" />
        <j-table-column prop="supplierLocation" label="供应商地点" width="120" />
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
    <!-- 拒绝 -->
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
        <j-button type="primary" @click="refuseReason">拒 绝</j-button>
      </span>
    </j-dialog>
    <!-- 确认 -->
    <j-dialog
      title="确认"
      :visible.sync="confirmDialog"
      width="400px"
      :before-close="confirmClose"
    >
      <div>确定要确认采购订单吗？</div>
      <span slot="footer" class="dialog-footer">
        <j-button @click="confirmClose">取 消</j-button>
        <j-button type="primary" @click="refuseConfirm">确 认</j-button>
      </span>
    </j-dialog>
    <!-- 日志 -->
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
        <j-button type="primary" @click="detailClose">确 认</j-button>
      </span> -->
    </j-dialog>
    <!-- 详情 -->
    <workOrder
      ref="workOrder"
      :detail-visible="workOrderVisible"
      :detail-form="workOrderForm"
      @detailClose="workOrderClose"
    />
    <!-- 交货排程 -->
    <deliveryScheduling
      ref="deliveryScheduling"
      :detail-visible="deliverySchedylingVisible"
      :detail-form="deliverySchedylingForm"
      @deliveryVisible="deliveryVisible($event)"
      @detailClose="deliverySchedylingClose"
    />
  </div>
</template>

<script>
import { changeTime } from '../../../utils/timeStyle'
import * as purchaseOrderApi from '@/api/purchaseOrder/Confirmation'
import * as supplierApi from '@/api/supplier/pool'
import * as baseApi from '@/api/base/personOrg'
import { getCodeList } from '@/views/common/dic'
import { arrayJoin } from '@/utils/index'
import { compare } from '@/utils/tableSort'
import workOrder from '@/views/purchaseOrderManage/components/workOrder'
import deliveryScheduling from '@/views/purchaseOrderManage/components/deliveryScheduling'

export default {
  name: 'PurchaseOrderConfirmation',
  components: { workOrder, deliveryScheduling },
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
      confirmDialog: false,
      releaseTime: [],
      dailyRecordData: [],
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
        // planId: '',
        lineCode: '',
        releaseTimeBegin: '',
        releaseTimeEnd: '',
        inventoryOrganizationCode: '',
        orderCode: '',
        lineNumBegin: '',
        lineNumEnd: '',
        goodsCode: '',
        goodsName: '',
        lineRemark: '',
        orderType: '',
        receivingSupplier: ''
      },
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
  computed: {
    columnStyle () {
      return function (row) {
        const style = {
          warning: { backgroundColor: '#ffff00' },
          error: { backgroundColor: '#fe9aa1' }
        }
        if (
          row.column.property === 'orderDelivery' &&
          row.row.colorChange === true
        ) {
          return style['warning']
        }
        if (row.row.orderNum !== row.row.deliveryScheduleNum) {
          if (
            row.column.property === 'orderNum' ||
            row.column.property === 'deliveryScheduleNum'
          ) {
            return style['error']
          } else {
            return
          }
        }
      }
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
    }
  },
  created () {
    this.initTable(1)
    // this.getSelectData()
    this.getPdtLineList()
    this.getQuery()
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
        case 0:
          return '未发布'
        case 1:
          return '已发布'
        case 2:
          return '已确认'
        case 3:
          return '已拒绝'
      }
    },
    columnSonStyle (item) {
      const that = this
      return function (row) {
        const style = {
          warning: { backgroundColor: '#ffff00' }
        }
        if (row.column.property === 'orderDelivery') {
          const fatherTime = new Date(item.orderDelivery)
          const sonTime = new Date(row.row.orderDelivery)
          if (sonTime.getTime() > fatherTime.getTime()) {
            that.$set(item, 'colorChange', true)
            return style['warning']
          }
        }
      }
    },
    /**
     * 根据不同的值进行表格排序
     */
    sortChange ({ prop, order }) {
      console.log(prop, order)
      this.tableData.sort(compare(prop, order))
    },

    /**
     * 展开行
     */
    handleExpandChange (row) {
      const that = this
      // console.log(this.tableData);
      const params = {
        id: row.planId
      }
      purchaseOrderApi.getPurchaseOrderSon(params).then((res) => {
        // row.childrens = res.data
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
      if (this.ids.length === 0) {
        this.$message.warning('请选择需要确认的订单')
        return
      }
      this.confirmDialog = true
      console.log(this.ids)
    },
    refuseConfirm () {
      purchaseOrderApi.batchConfirmation(this.ids).then((res) => {
        if (res.code === '0' && res.data) {
          console.log(res.data)
          this.confirmClose()
          this.$message.success('订单确认成功！')
        } else {
          this.showMessage(res.message)
        }
      })
    },
    // 取消确认
    confirmClose () {
      this.confirmDialog = false
      this.initTable()
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
      console.log(this.ids)
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
    handleReject (row) {
      this.rejectItem = row
      this.checkVisible = true
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
        } else {
          this.showMessage(res.message)
        }
      })
    },
    handleDetail (row) {
      this.workOrderForm = row
      this.workOrderVisible = true
    },
    handleExport () {
      const params = Object.assign({ exportStatus: 1 }, this.formatParams())
      purchaseOrderApi.exportPurchaseOrder(params)
    },
    formatParams () {
      const params = Object.assign({}, this.query, {
        lineCode: arrayJoin(this.query.lineCode),
        inventoryOrganizationCode: arrayJoin(
          this.query.inventoryOrganizationCode
        ),
        orderType: arrayJoin(this.query.orderType),
        lineStatus: 1,
        queryStatus: 1
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
        } else {
          this.showMessage(res.message)
        }
      })
    },
    refuseReason () {
      if (this.checkForm.rejectReason) {
        const params = {
          id: this.rejectItem.id,
          planId: this.rejectItem.planId,
          orderType: this.rejectItem.type,
          lineStatus: 3,
          refuseReason: this.checkForm.rejectReason
        }
        purchaseOrderApi.rejectPurchaseOrder(params).then((res) => {
          if (res && res.code === '0') {
            this.showMessage('订单拒绝成功!', 'success')
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
        // planId: '',
        lineCode: '',
        releaseTimeBegin: '',
        releaseTimeEnd: '',
        inventoryOrganizationCode: '',
        orderCode: '',
        lineNumBegin: '',
        lineNumEnd: '',
        goodsCode: '',
        goodsName: '',
        lineRemark: '',
        orderType: '',
        receivingSupplier: ''
      }
      this.releaseTime = []
    }
  }
}
</script>
<style lang="less" scoped>
.el-pagination {
  text-align: center;
}
.el-table /deep/.warning-row {
  background: #ffff00;
}

.el-table /deep/.error-row {
  background: #fe9aa1;
}
.el-table /deep/.el-table__expanded-cell {
  border-bottom: none;
  padding: 0px 50px;
}
.font-color {
  color: #e16022;
  font-weight: bold;
}
.btn {
  display: flex;
  justify-content: space-between;
}
</style>
