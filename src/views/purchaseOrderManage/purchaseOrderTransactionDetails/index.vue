<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-form
        class="head-container"
        size="mini"
        :inline="true"
        label-position="left"
        label-width="76px"
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
        <j-form-item label="供应商">
          <j-input v-model="query.supplierCode" placeholder="请输入供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="事务日期">
          <j-date-picker
            v-model="transactionDate"
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
        <j-form-item label="订单行">
          <j-input v-model="query.startLineNum" placeholder="订单行自" @keyup.enter.native="initTable(1)" />
          <j-input v-model="query.endLineNum" placeholder="订单行至" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="事务类型">
          <j-select v-model="query.transactionType" clearable>
            <j-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
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
        <j-form-item label="物料">
          <j-input v-model="query.goodsKeyWords" placeholder="请输入物料编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="送货单号">
          <j-input v-model="query.deliveryNoteNo" placeholder="请输入送货单号模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="备注">
          <j-input v-model="query.remark" placeholder="请输入备注模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getPurchaseTran'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'exportTransactionDetail'" @click="importTemplate">
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
        @sort-change="sortChange"
      >
        <j-table-column
          prop="lineName"
          label="产品线"
          sortable="custom"
          width="100"
        />
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
          prop="goodsCode"
          sortable="custom"
          label="物料编码"
          width="120"
        />
        <j-table-column prop="goodsName" label="物料名称" width="300" />
        <j-table-column prop="unit" label="单位" width="80" />
        <j-table-column prop="transactionType" label="事务类型" width="100" />
        <j-table-column prop="transactionNum" label="事务数量" width="100" />
        <j-table-column prop="transactionTime" label="事务时间" width="140" />
        <j-table-column prop="supplierCode" label="供应商编码" width="120" />
        <j-table-column prop="supplierName" label="供应商名称" width="140" />
        <j-table-column prop="remark" label="备注" width="140" />
        <j-table-column label="送货单" width="120">
          <template slot-scope="scope">
            <j-button type="text" size="mini" @click="handleDetail(scope.row)">
              送货单
            </j-button>
          </template>
        </j-table-column>
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

      <!-- 导入 -->
      <j-dialog title="导入" :visible.sync="uploadVisible" width="400px">
        <j-upload
          ref="upload"
          :limit="10"
          :show-file-list="true"
          :auto-upload="false"
          :action="uploadUrl"
          :on-exceed="exceedWarn"
          :on-success="uploadSuccess"
        >
          <j-button slot="trigger" size="mini" type="info">
            选取文件
          </j-button>
          <j-button
            style="margin-left: 10px"
            size="mini"
            type="primary"
            @click="submitUpload"
          >
            提交
          </j-button>
          <div slot="tip" class="j-upload__tip">
            只能上传Excel文件
          </div>
        </j-upload>
      </j-dialog>
      <!-- 送货单 -->
      <j-dialog title="送货单" :visible.sync="deliveryNoteVisible" width="800px">
        <j-table
          ref="multipleTable"
          :data="deliveryNoteData"
          border
          highlight-current-row
        >
          <j-table-column prop="deliverGoodsNo" label="送货单号" />
          <j-table-column prop="purchasePlanNo" label="要货计划单号" />
          <j-table-column prop="orderCode" label="订单号" />
          <j-table-column prop="lineNum" label="行号" />
          <j-table-column prop="thisDeliveryNum" label="送货数量" />
          <j-table-column prop="receiveNum" label="接收数量" />
          <j-table-column prop="estimatedArrivalTime" label="预计到货日期" />
        </j-table>
      </j-dialog>
    </j-card>
  </div>
</template>

<script>
import { changeTime } from '../../../utils/timeStyle'
import { getPurchaseOrder, getOrderDeliveryDetail,    exportTransactionDetail } from '@/api/purchaseOrder/TransactionDetails'
import { getExpertList  } from '@/api/base/professorPool'
import { getCodeList } from '@/views/common/dic'
import { arrayJoin } from '@/utils/index'
import { compare } from '@/utils/tableSort'
import * as baseApi from '@/api/base/personOrg'
import * as supplierApi from '@/api/supplier/pool'
import dayjs from 'dayjs'
import _ from 'lodash'

export default {
  name: 'PurchaseOrderQuery',
  data () {
    return {
      deliveryNoteData: [],
      currentPage: 1,
      transactionDate: [],
      queryList: [],
      deliveryNoteVisible: false,
      categoryList: [],
      query: {
        lineCode: '',
        supplierCode: '',
        startTime: '',
        endTime: '',
        inventoryOrganizationCode: '',
        orderCode: '',
        startLineNum: '',
        endLineNum: '',
        transactionType: '',
        goodsKeyWords: '',
        deliveryNoteNo: '',
        remark: ''
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      uploadVisible: false,
      pdtLineList: [],
      uploadUrl: ''
    }
  },
  watch: {
    transactionDate (val) {
      if (val && val.length > 0) {
        this.query = Object.assign(this.query, changeTime(val, 'startTime', 'endTime'))
      } else {
        this.query.startTime = ''
        this.query.endTime = ''
      }

    }
  },
  created () {
    this.getTransactionDate()
    this.getPdtLineList()
    this.getQuery()
    this.getSelectData()
    this.initTable(1)
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    getOrderDeliveryDetail (keyWords) {
      const params = {
        keyWords: keyWords
      }
      getOrderDeliveryDetail(params).then((res) => {
        this.deliveryNoteData = res.data
      })
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
    /**
     * 根据不同的值进行表格排序
    */
    sortChange ({ prop, order }) {
      this.tableData.sort(compare(prop, order))
    },
    getTransactionDate () {
      this.transactionDate = []
      let startTime = new Date().getTime() - (31 * 60 * 60 * 24 * 1000)
      startTime = dayjs(startTime).format('YYYY-MM-DD')
      this.query.startTime = startTime + ' 00:00:00'
      let endTime = new Date().getTime()
      endTime = dayjs(endTime).format('YYYY-MM-DD')
      this.query.endTime = endTime + ' 23:59:59'
      this.transactionDate.push(startTime, endTime)
    },
    getSelectData () {
      getCodeList('code00062').then((list) => {
        this.categoryList = list
      })
    },
    submitUpload () {},
    exceedWarn () {},
    uploadSuccess () {},
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
    importTemplate () {
      exportTransactionDetail(this.formatParams())
    },
    handleImport () {
      this.uploadVisible = true
    },
    handleDetail (row) {
      this.getOrderDeliveryDetail(row.deliveryNoteNo)
      this.deliveryNoteVisible = true
    },
    formatParams () {
      const params = Object.assign({}, this.query, {
        lineCode: arrayJoin(this.query.lineCode),
        inventoryOrganizationCode: arrayJoin(
          this.query.inventoryOrganizationCode
        )
      })
      return params
    },
    // 表格查询
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
      getPurchaseOrder(params)
        .then((res) => {
          if (this.query.inventoryOrganizationCode.length > 0) {
            this.query.inventoryOrganizationCode = this.query.inventoryOrganizationCode.split(',')
          }
          if (this.query.lineCode.length > 0) {
            this.query.lineCode = this.query.lineCode.split(',')
          }
          this.tableData = res.data.records
          this.tablePage.total = res.data.total
        })
    },
    resetQuery () {
      this.query = {
        lineCode: '',
        supplierCode: '',
        startTime: '',
        endTime: '',
        inventoryOrganizationCode: '',
        orderCode: '',
        startLineNum: '',
        endLineNum: '',
        transactionType: '',
        goodsKeyWords: '',
        deliveryNoteNo: '',
        remark: ''
      }
      this.getTransactionDate()
    }
  }
}
</script>
