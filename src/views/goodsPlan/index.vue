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
        style="margin-bottom: 10px"
      >
        <j-form-item label="产品线">
          <j-select
            v-model="query.lineCode"
            multiple
            collapse-tags
            clearable
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
          <j-input v-model="query.supplierName" placeholder="供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="发布日期">
          <j-date-picker
            v-model="query.timeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            value-format="yyyy-MM-dd"
          />
        </j-form-item>
        <j-form-item label="物料">
          <j-input v-model="query.goodsCode" placeholder="物料编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="单据类型">
          <j-select v-model="query.documentType" clearable filterable>
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <!-- <j-form-item label="状态">
          <j-select v-model="query.status" clearable multiple>
            <j-option
              v-for="item in statusList"
              :key="item.lineNumber"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item> -->
        <j-form-item label="状态">
          <j-select v-model="query.status" clearable multiple>
            <j-option
              v-for="(value, index) in statusDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="是否及时">
          <j-select v-model="query.isTimely" clearable>
            <j-option label="Y" :value="1" />
            <j-option label="N" :value="0" />
          </j-select>
        </j-form-item>
        <j-form-item label="要货计划单号">
          <j-input v-model="query.purchasePlanNo" placeholder="要货计划单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="OA单号">
          <j-input v-model="query.soaOrderCode" placeholder="OA单号" @keyup.enter.native="initTable(1)" />
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
        <j-form-item class="btn-group">
          <j-button v-check="'getDemandPlanOrderList'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'exportDemandOrderList'" @click="handleExport">
            导出
          </j-button>
        </j-form-item>
      </j-form>

      <j-table
        v-loading="loading"
        header-bold
        :data="tableData"
        :height="height"
      >
        <j-table-column prop="lineName" label="产品线" />
        <j-table-column prop="documentType" label="单据类型" />
        <j-table-column prop="demandPlanNo" label="要货计划单号" width="100px" />
        <j-table-column prop="goodsCode" label="物料编码" />
        <j-table-column prop="goodsName" label="物料名称" width="300px" />
        <j-table-column prop="unit" label="单位" />
        <j-table-column prop="demandNum" label="要货量" />
        <j-table-column prop="timelyNum" label="及时量" />
        <j-table-column prop="unTimelyNum" label="不及时量" />
        <j-table-column prop="transitNum" label="在途量" />
        <j-table-column prop="closeNum" label="关闭量" />
        <j-table-column prop="differenceNum" label="差异量" />
        <j-table-column prop="isTimely" label="是否及时">
          <template slot-scope="scope">
            {{ scope.row.isTimely === 1 ? 'Y' : scope.row.isTimely === 0 ?'N':'' }}
          </template>
        </j-table-column>
        <j-table-column prop="pickUpTime" label="提货日期" width="90px" />
        <j-table-column prop="supplierCode" label="供应商编码" />
        <j-table-column prop="supplierName" label="供应商名称" width="150px" />
        <j-table-column label="送货单信息">
          <template slot-scope="scope">
            <j-link size="mini" @click="handleDetail(scope.row.demandPlanNo)">
              送货单
            </j-link>
          </template>
        </j-table-column>
        <j-table-column prop="soaOrderCode" label="OA单号">
          <template slot-scope="scope">
            <j-button
              size="mini"
              type="text"
              :disabled="!scope.row.soaOrderCode"
              @click="openSoa(scope.row.soaOrderCode, 'soaOrderCode')"
            >
              OA单号
            </j-button>
          </template>
        </j-table-column>
        <j-table-column prop="soaLineNum" label="OA订单行">
          <template slot-scope="scope">
            <j-button
              size="mini"
              type="text"
              :disabled="!scope.row.soaLineNum"
              @click="openSoa(scope.row.soaLineNum, 'soaLineNum')"
            >
              OA订单行
            </j-button>
          </template>
        </j-table-column>
        <j-table-column prop="releaseTime" label="发布日期" />
        <j-table-column prop="confirmTime" label="完成日期" />
        <j-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ statusDic[scope.row.status] }}
          </template>
        </j-table-column>
        <j-table-column prop="inventoryOrganization" label="库存组织" />
      </j-table>
      <j-pagination
        class="page"
        style="margin: 20px auto 0"
        :current-page="tablePage.pageNum"
        :page-sizes="[15, 50, 100]"
        :page-size="tablePage.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tablePage.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <j-dialog :visible.sync="dialogVisible" width="500px">
        <j-table :data="dialogTableData">
          <j-table-column prop="deliverGoodsNo" label="送货单号" width="120px" />
          <!-- <j-table-column prop="purchasePlanNo" label="要货计划单号" /> -->
          <j-table-column prop="demandPlanNo" label="要货计划单号" width="120px" />
          <j-table-column prop="orderCode" label="订单号" />
          <j-table-column prop="lineNum" label="行号" />
          <j-table-column prop="thisDeliveryNum" label="送货数量" />
          <j-table-column prop="receiveNum" label="接收数量" />
          <j-table-column prop="estimatedArrivalTime" label="送货日期" width="150px" />
        </j-table>
      </j-dialog>
      <j-dialog :visible.sync="soaVisible" width="500px">
        <div class="content">
          <span v-if="soaType === 'soaOrderCode'">OA单号：</span>
          <span v-else>OA订单行：</span>{{ soaData }}
        </div>
      </j-dialog>
    </j-card>
  </div>
</template>

<script>
import * as planApi from '@/api/goodsPlan/goodsPlan'
import * as baseApi from '@/api/base/personOrg'
import * as supplierApi from '@/api/supplier/pool'
import { getCodeList } from '@/views/common/dic'

export default {
  name: 'GoodsPlan',
  data () {
    return {
      loading: false,
      query: {
        lineCode: '',
        inventoryOrganizationCode: '',
        supplierName: '',
        goodsCode: '',
        documentType: '',
        timeRange: [],
        startReleaseTime: '',
        endReleaseTime: '',
        status: '',
        isTimely: '',
        purchasePlanNo: '',
        soaOrderCode: ''
      },
      typeList: [],
      statusDic: {
        0: '待发货',
        1: '已完成'
      },
      height: null,
      countA: 0,
      countB: 0,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      handleType: '新增',
      editVisible: false,
      statusList: [],
      peopleList: [],
      pdtLineList: [],
      orgList: [],
      dialogVisible: false,
      dialogTableData: [],
      soaVisible: false,
      soaType: '',
      soaData: ''
    }
  },
  created () {
    this.initTable(1)
    this.getSelectData()
  },
  mounted () {
    this.height = this.calHeight(10).toString()
    this.getPdtLineList()
    this.getOrgList()
  },
  methods: {
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
      getCodeList('code00072').then((list) => {
        this.typeList = list
      })
    },
    handleExport () {
      planApi.exportDemandList(this.formatParams(true))
    },
    openSoa (data, type) {
      this.soaVisible = true
      this.soaData = data
      this.soaType = type
    },
    handleDetail (demandPlanNo) {
      planApi.getOrderDeliveryDetail({ keyWords: demandPlanNo }).then((res) => {
        if (res && res.code === '0') {
          this.dialogTableData = res.data
          this.dialogVisible = true
        } else {
          this.showMessage(res.message)
        }
      })
    },
    formatParams (nopage) {
      const params = Object.assign(
        {},
        this.query,
        {
          status: this.query.status.length ? this.query.status.join(',') : null,
          lineCode: this.query.lineCode.length
            ? this.query.lineCode.join(',')
            : null,
          inventoryOrganizationCode: this.query.inventoryOrganizationCode.length
            ? this.query.inventoryOrganizationCode.join(',')
            : null,
          startReleaseTime:
            this.query.timeRange && this.query.timeRange.length
              ? this.query.timeRange[0] + ' 00:00:00'
              : '',
          endReleaseTime:
            this.query.timeRange && this.query.timeRange.length
              ? this.query.timeRange[1] + ' 23:59:59'
              : ''
        },
        nopage
          ? {}
          : { page: this.tablePage.pageNum, size: this.tablePage.pageSize }
      )
      delete params.timeRange
      return params
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.loading = true
      planApi
        .getDemandPlanOrderList(this.formatParams())
        .then((res) => {
          if (res && res.code === '0') {
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
          } else {
            this.showMessage(res.message)
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    resetQuery () {
      this.query = {
        lineCode: '',
        inventoryOrganizationCode: '',
        supplierName: '',
        goodsCode: '',
        documentType: '',
        timeRange: [],
        startReleaseTime: '',
        endReleaseTime: '',
        status: '',
        isTimely: '',
        purchasePlanNo: '',
        soaOrderCode: ''
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
