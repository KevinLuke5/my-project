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
            multiple
            clearable
            collapse-tags
            filterable
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
          <j-input v-model="query.supplierCode" placeholder="供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="创建日期">
          <j-date-picker
            v-model="query.timeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            value-format="yyyy-MM-dd"
          />
        </j-form-item>
        <j-form-item label="送货单号">
          <j-input v-model="query.deliverGoodsNo" placeholder="送货单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="要货计划单号">
          <j-input v-model="query.purchasePlanNo" placeholder="要货计划单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="订单号">
          <j-input v-model="query.orderCode" placeholder="订单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="订单行">
          <j-input v-model="query.lineNum" placeholder="订单行" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="物料">
          <j-input v-model="query.goodsCode" placeholder="物料编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="单据类型">
          <j-select
            v-model="query.documentType"
            clearable
            multiple
            collapse-tags
          >
            <j-option
              v-for="(value, index) in typeDicList"
              :key="index"
              :label="value.name"
              :value="value.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="订单行类型">
          <j-select
            v-model="query.lineOrderType"
            multiple
            clearable
            collapse-tags
          >
            <j-option
              v-for="item in orderTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="库存组织">
          <j-select
            v-model="query.inventoryOrganizationCode"
            clearable
            multiple
            collapse-tags
            filterable
          >
            <j-option
              v-for="item in orgList"
              :key="item.id"
              :label="item.orgName"
              :value="item.orgCode"
            />
          </j-select>
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getDeliverOnPassageList'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'intransit-export'" @click="handleExport">
            导出
          </j-button>
        </j-form-item>
      </j-form>
      <j-tabs v-model="activeName" style="font-size: 12px" @tab-click="tabChange">
        <j-tab-pane label="到货在途" name="first" />
        <j-tab-pane label="送货排程" name="second" />
      </j-tabs>
      <j-table v-loading="loading" :data="tableData" :height="height">
        <j-table-column prop="lineName" label="产品线" align="center" />
        <j-table-column prop="crtTime" label="创建日期" align="center" />
        <j-table-column
          prop="demandPlanNo"
          label="要货计划单号"
          width="100"
          align="center"
        />
        <j-table-column prop="documentType" label="单据类型" align="center" />
        <j-table-column prop="supplierCode" label="供应商编码" align="center" />
        <j-table-column
          prop="supplierName"
          label="供应商名称"
          width="120"
          align="center"
        />
        <j-table-column prop="deliverGoodsNo" label="送货单号" align="center" />
        <j-table-column prop="orderCode" label="采购订单号" align="center" />
        <j-table-column
          prop="lineNum"
          label="行号"
          width="50"
          align="center"
        />
        <j-table-column label="订单行类型" align="center">
          <template slot-scope="scope">
            {{ scope.row.lineOrderType }}
          </template>
        </j-table-column>
        <j-table-column
          prop="purchaseGoodsCode"
          label="物料编码"
          width="100"
          align="center"
        />
        <j-table-column
          prop="goodsName"
          label="物料名称"
          width="300"
          align="center"
        />
        <j-table-column prop="unit" label="单位" align="center" />
        <j-table-column prop="thisDeliveryNum" label="本次送货量" align="center" />
        <j-table-column prop="receiveNum" label="实际接收量" align="center" />
        <j-table-column
          prop="estimatedArrivalTime"
          label="预计到货日期"
          width="100"
          align="center"
        />
        <j-table-column label="BOM查看">
          <template slot-scope="scope">
            <j-button :disabled="!scope.row.workOrderNo" type="text" @click="handleBom(scope.row)">
              BOM查看
            </j-button>
          </template>
        </j-table-column>
        <j-table-column
          prop="deliverGoodsCode"
          label="送货条码"
          width="110"
          align="center"
        />
        <j-table-column
          prop="receivingSupplier"
          label="收货供应商"
          width="130"
          align="center"
        />
        <j-table-column
          prop="receivingSupplierAddress"
          label="收货供应商地址"
          width="180"
          align="center"
        />
        <j-table-column prop="lineRemark" label="行备注" align="center" />
        <j-table-column prop="inventoryOrganization" label="库存组织" align="center" />
      </j-table>
      <j-pagination
        class="page"
        style="margin:20px auto 0;"
        :current-page="tablePage.pageNum"
        :page-sizes="[15, 50, 100]"
        :page-size="tablePage.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tablePage.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!-- BOM查看 -->
      <workOrder
        ref="workOrder"
        :detail-visible="workOrderVisible"
        :detail-form="workOrderForm"
        @detailClose="workOrderVisible = false"
      />
    </j-card>
  </div>
</template>

<script>
import * as docApi from '@/api/deliveryManage/doc'
import * as baseApi from '@/api/base/personOrg'
import * as supplierApi from '@/api/supplier/pool'
import { getCodeList } from '@/views/common/dic'
// import { tagDeltData } from '@/utils/index'
import workOrder from '@/views/purchaseOrderManage/components/workOrder'

export default {
  name: 'Intransit',
  components: { workOrder },
  data () {
    return {
      loading: false,
      query: {
        lineCode: '',
        supplierCode: '',
        deliverGoodsNo: '',
        purchasePlanNo: '',
        orderCode: '',
        lineNum: '',
        goodsCode: '',
        documentType: [],
        lineOrderType: [],
        inventoryOrganizationCode: '',
        timeRange: [],
        startTime: '',
        endTime: ''
      },
      typeDicList: [],
      height: null,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      workOrderVisible: false,
      workOrderForm: {},
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
      pdtLineList: [],
      orgList: [],
      activeName: 'first'
    }
  },
  created () {
    this.initTable(1)
    this.getSelectData()
    this.getPdtLineList()
    this.getOrgList()
  },
  mounted () {
    this.height = this.calHeight(60).toString()
  },
  methods: {
    tabChange () {
      this.initTable(1)
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
     * 获取库存组织下拉框
     */
    getOrgList () {
      baseApi.getQuery({ page: 1, size: 500 }).then((res) => {
        this.orgList = res.data.records
      })
    },
    getSelectData () {
      // getCodeList('code00061').then((list) => {
      //   this.orderTypeList = list
      // })
      getCodeList('code00072').then((list) => {
        this.typeDicList = list
      })
    },
    handleBom (row) {
      console.log(row)
      this.workOrderForm = row
      this.$refs.workOrder.getDetailTable(row)
      this.workOrderVisible = true
    },
    handleExport () {
      docApi.exportOnPassage(this.formatParams(true))
    },
    formatParams (nopage) {
      const params = Object.assign(
        {},
        this.query,
        {
          lineCode: this.query.lineCode.length ? this.query.lineCode.join(',') : null,
          documentType: this.query.documentType.length ? this.query.documentType.join(',') : null,
          lineOrderType: this.query.lineOrderType.length ? this.query.lineOrderType.join(',') : null,
          inventoryOrganizationCode: this.query.inventoryOrganizationCode.length ? this.query.inventoryOrganizationCode.join(',') : null,
          startTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[0] + ' 00:00:00'
            : '',
          endTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[1] + ' 23:59:59'
            : ''
        },
        nopage
          ? {}
          : { page: this.tablePage.pageNum, size: this.tablePage.pageSize }
      )
      if (this.activeName === 'first') {
        params.queryStatus = 1
      }
      if (this.activeName === 'second') {
        params.queryStatus = 2
      }
      delete params.timeRange
      return params
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.loading = true
      docApi
        .getDeliverOnPassageList(this.formatParams())
        .then((res) => {
          if (res && res.code === '0') {
            res.data.records = res.data.records || []
            this.tableData = this.handleTableData(res.data.records)
            this.tablePage.total = res.data.total
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    handleTableData (tableData) {
      tableData.forEach(tableItem => {
        Object.keys(tableItem).forEach(tableItemKey => {
          tableItem[tableItemKey] = (tableItem[tableItemKey] || tableItem[tableItemKey] === 0) ? tableItem[tableItemKey] : '-'
        })
      })
      return tableData
    },
    resetQuery () {
      this.query = {
        lineCode: '',
        supplierCode: '',
        deliverGoodsNo: '',
        purchasePlanNo: '',
        orderCode: '',
        lineNum: '',
        goodsCode: '',
        documentType: [],
        lineOrderType: [],
        inventoryOrganizationCode: '',
        timeRange: [],
        startTime: '',
        endTime: ''
      }
    },
    handleSizeChange (val) {
      this.tablePage.pageNum = 1
      this.tablePage.pageSize = val
      this.initTable()
    },
    handleCurrentChange (val) {
      this.tablePage.pageNum = val
      this.initTable()
    }
  }
}
</script>
