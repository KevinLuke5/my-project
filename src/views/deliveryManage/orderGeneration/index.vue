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
            filterable
            clearable
            multiple
            :collapse-tags="true"
          >
            <j-option
              v-for="item in pdtLineList"
              :key="item.id"
              :label="item.name"
              :value="item.code"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="订单行类型">
          <j-select v-model="query.orderType" clearable>
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
        <j-form-item label="物料">
          <j-input v-model="query.goodsName" placeholder="请输入物料编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="订单号">
          <j-input v-model="query.orderCode" placeholder="输入订单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="订单行">
          <j-input v-model="query.lineNumBegin" placeholder="订单行自" @keyup.enter.native="initTable(1)" />
          <j-input v-model="query.lineNumEnd" placeholder="订单行至" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="收货供应商">
          <j-input v-model="query.receivingSupplier" placeholder="请输入供应商名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="行备注">
          <j-input v-model="query.lineRemark" placeholder="请输入行备注模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="库存组织">
          <j-select
            v-model="query.inventoryOrganizationCode"
            filterable
            clearable
            multiple
            :collapse-tags="true"
          >
            <j-option
              v-for="item in queryList"
              :key="item.id"
              :label="item.orgName"
              :value="item.orgCode"
            />
          </j-select>
        </j-form-item>
        <div class="btn">
          <div>
            <j-button v-check="'purchaseCreateDeliver'" type="primary" @click="generateDeliveryPreview">
              生成送货单预览
            </j-button>
          </div>
          <j-form-item class="btn-group" style="margin-bottom: 0">
            <j-button v-check="'getPurchaseOrderList'" type="primary" @click="initTable(1)">
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
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <j-table-column type="selection" fixed width="55" />
        <j-table-column prop="lineName" label="产品线" />
        <j-table-column prop="orderCode" label="订单号" sortable />
        <j-table-column prop="lineNum" label="行号" sortable />
        <j-table-column prop="orderType" label="订单行类型" />
        <j-table-column prop="lineRemark" label="行备注" width="120" />
        <j-table-column prop="purchaseGoodsCode" label="物料编码" width="100" />
        <j-table-column prop="goodsName" label="物料名称" width="300" />
        <j-table-column prop="unit" label="单位" width="50" />
        <j-table-column
          prop="orderDelivery"
          label="订单交期"
          align="center"
          width="100"
          sortable
        />
        <j-table-column prop="orderNum" label="订单量" align="center" />
        <j-table-column
          prop="waitDeliveryNum"
          label="待发货量"
          align="center"
          width="100"
        >
          <template slot="header" slot-scope="{}">
            <span>待发货量</span>
            <j-tooltip effect="dark" placement="top">
              <i class="el-icon-question" />
              <div slot="content">
                <p>待发货量=订单量-在途量-净接收量</p>
              </div>
            </j-tooltip>
          </template>
        </j-table-column>
        <j-table-column label="本次发货量" align="center">
          <template slot-scope="scope">
            <j-link v-show="!scope.row.changing" @click="numInputShow(scope.row, scope.$index)">
              {{ scope.row.thisDeliveryNum }}
            </j-link>
            <j-input-number
              v-show="scope.row.changing"
              :ref="'numInput' + scope.$index"
              v-model="scope.row.thisDeliveryNum"
              style="width: 80px"
              :controls="false"
              :precision="0"
              :min="0"
              :max="scope.row.waitDeliveryNum"
              size="mini"
              @blur="inputDone(scope.row)"
              @change="inputDone(scope.row)"
            />
          </template>
        </j-table-column>
        <j-table-column prop="transitNum" label="在途量" align="center" />
        <j-table-column prop="bareReceiveNum" label="净接收量" align="center" />
        <j-table-column prop="waitRetreatNum" label="退回量" align="center" />
        <j-table-column prop="receivingSupplier" label="收货供应商" width="120" />
        <j-table-column prop="receivingSupplierAddress" label="收货供应商地址" width="180" />
        <j-table-column prop="supplierLocation" label="供应商地点" width="120" />
        <j-table-column prop="inventoryOrganization" label="库存组织" width="120" />
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
    <!-- 生成送货单预览 -->
    <!-- <generateDelivery
      ref="generateDelivery"
      :detail-visible="generateDeliveryVisible"
      :detail-form="generateDeliveryForm"
      @detailClose="generateDeliveryClose"
    /> -->
  </div>
</template>

<script>
import { changeTime } from '../../../utils/timeStyle'
import * as purchaseOrderApi from '@/api/purchaseOrder/Confirmation'
import * as deliveryApi from '@/api/deliveryManage/generation'
import * as supplierApi from '@/api/supplier/pool'
import * as baseApi from '@/api/base/personOrg'
import { getCodeList } from '@/views/common/dic'
// import generateDelivery from '@/views/deliveryManage/components/generateDelivery'

export default {
  // components: { generateDelivery },
  name: 'OrderGenerationDeliveryOrder',
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
      currentPage: 1,
      queryList: [],
      pdtLineList: [],
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
      orderDelivery: [],
      // generateDeliveryVisible: false,
      deliverySchedylingVisible: false,
      detailVisible: false,
      rules: {
        rejectReason: [
          { required: true, message: '请输入拒绝原因', trigger: 'change' }
        ]
      },
      query: {
        orderDeliveryBegin: '',
        orderDeliveryBeginEnd: '',
        lineCode: '',
        orderType: '',
        goodsName: '',
        orderCode: '',
        lineNumBegin: '',
        lineNumEnd: '',
        receivingSupplier: '',
        lineRemark: '',
        inventoryOrganizationCode: ''
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      categoryList: [],
      typeList: [],
      checkVisible: false,
      checkForm: {
        rejectReason: ''
      },
      generateDeliveryForm: {},
      multipleSelection: []
    }
  },
  watch: {
    orderDelivery (val) {
      if (val && val.length > 0) {
        this.query = Object.assign(this.query, changeTime(val, 'orderDeliveryBegin', 'orderDeliveryBeginEnd'))
      }
    }
  },
  created () {
    this.initTable(1)
    // this.getSelectData()
    this.getQuery()
    this.getPdtLineList()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    numInputShow (row, index) {
      // 设定更改的最大值
      // if (!row.maxNum) {
      //   row.maxNum = row.thisDeliveryNum
      // }
      row.changing = true
      this.$nextTick(() => {
        this.$refs['numInput' + index].focus()
      })
    },
    inputDone (row) {
      console.log(row)
      row.changing = false
    },
    /**
     * 发货量改变
    */
    changeThisDeliveryNum (e) {
      const id = e.id
      const key = e.thisDeliveryNum - 0
      deliveryApi.updatePurchaseOrder({
        [id]: key
      }).then(res => {
        if (res.code === '0') {
          this.$message.success('编辑成功！')
        }
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
      baseApi.getQuery(params).then(res => {
        this.queryList = res.data.records
      })
    },
    /**
     * 获取产品线下拉
    */
    getPdtLineList () {
      supplierApi.getPdtLineList().then(res => {
        this.pdtLineList = res.data.records
      })
    },
    //  // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.tablePage.pageSize = size
      this.currentPage = 1
      this.initTable(1)
    },
    handleCurrentChange: function (currentPage) {
      this.tablePage.pageNum = currentPage
      this.initTable(currentPage)
    },
    generateDeliveryPreview () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('订单不能为空，请选择订单')
      } else {
        const params = {}
        this.multipleSelection.forEach(item => {
          params[item.id] = item.thisDeliveryNum
        })
        deliveryApi.purchaseCreateDeliver(params).then(res => {
          if (res && res.code === '0') {
            this.initTable(1)
            this.$router.push('/deliveryManage/deliveryNoteQuery/index')
          } else {
            this.showMessage(res.message)
          }
        })
      }
    },
    /**
     * 交货排程
    */
    handleDeliverySchedyling (row) {
      this.deliverySchedylingVisible = true
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    generateDeliveryClose () {
      this.generateDeliveryVisible = false
    },
    detailClose () {
      this.detailVisible = false
    },
    getSelectData () {
      getCodeList('code00023').then((list) => {
        this.categoryList = list
      })
    },
    handleExport () {
      const params = {
        // id: this.ids.join(',')
        exportStatus: 4
      }
      if (this.query.lineCode.length > 0) {
        this.query.lineCode = this.query.lineCode.join(',')
      }
      if (this.query.inventoryOrganizationCode.length > 0) {
        this.query.inventoryOrganizationCode = this.query.inventoryOrganizationCode.join(',')
      }
      const data = Object.assign(this.query, params)
      purchaseOrderApi.exportPurchaseOrder(data)
      if (this.query.lineCode.length > 0) {
        this.query.lineCode = this.query.lineCode.split(',')
      }
      if (this.query.inventoryOrganizationCode.length > 0) {
        this.query.inventoryOrganizationCode = this.query.inventoryOrganizationCode.split(',')
      }
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      if (this.query.lineCode.length > 0) {
        this.query.lineCode = this.query.lineCode.join(',')
      }
      if (this.query.inventoryOrganizationCode.length > 0) {
        this.query.inventoryOrganizationCode = this.query.inventoryOrganizationCode.join(',')
      }
      const params = Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum
      })
      deliveryApi.getPurchaseOrderList(params)
        .then((res) => {
          if (this.query.lineCode.length > 0) {
            this.query.lineCode = this.query.lineCode.split(',')
          }
          if (this.query.inventoryOrganizationCode.length > 0) {
            this.query.inventoryOrganizationCode = this.query.inventoryOrganizationCode.split(',')
          }
          if (res.code === '0' && res.data) {
            this.tableData = res.data.records.map((row) => {
              row.changing = false
              return row
            })
            this.tablePage.total = res.data.total
            this.loading = false
          }
        })
    },
    resetQuery () {
      this.query = {
        orderDeliveryBegin: '',
        orderDeliveryBeginEnd: '',
        lineCode: '',
        orderType: '',
        goodsName: '',
        orderCode: '',
        lineNumBegin: '',
        lineNumEnd: '',
        receivingSupplier: '',
        lineRemark: '',
        inventoryOrganizationCode: ''
      }
      this.orderDelivery = []
    }
  }
}
</script>
<style lang="less" scoped>
  .el-pagination {
    text-align: center;
  }
  .btn {
    display: flex;
    justify-content: space-between;
  }
</style>
