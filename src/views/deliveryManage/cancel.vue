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
        <j-form-item label="送货单号">
          <j-input v-model="query.deliverGoodsNo" placeholder="请输入送货单号" @keyup.enter.native="initTable(1)" />
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
            filterable
            collapse-tags
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
          <j-button v-check="'getDeliverOrderCancelList'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'deliver-cancel-exportCancel'" @click="handleExport">
            导出
          </j-button>
        </j-form-item>
      </j-form>

      <j-table :data="tableData" :height="height">
        <j-table-column width="120" prop="deliverGoodsNo" label="送货单号">
          <template slot-scope="scope">
            <j-link @click="openDeliver(scope.row)">
              {{ scope.row.deliverGoodsNo }}
            </j-link>
          </template>
        </j-table-column>
        <j-table-column prop="estimatedArrivalTime" label="预计到货日期" />
        <j-table-column prop="supplierName" label="供应商" />
        <j-table-column prop="receivingSupplier" label="收货供应商" />
        <j-table-column prop="receivingSupplierAddress" label="收货供应商地址" width="180" />
        <j-table-column prop="lineOrderType" label="订单行类型" width="80">
          <!-- <template slot-scope="scope">
            <span>
              {{ scope.row.lineOrderType }}
            </span>
          </template> -->
        </j-table-column>
        <j-table-column prop="crtTime" label="创建日期" />
        <j-table-column v-check="'cancelDeliverOrder'" label="操作" width="60">
          <template slot-scope="scope">
            <div class="operate-btn-group">
              <j-popconfirm title="取消操作不可恢复，请再次确认是否取消！" @confirm="handleCancel(scope.row)">
                <j-button slot="reference" :disabled="!scope.row.isCancel" type="text">
                  取消
                </j-button>
              </j-popconfirm>
            </div>
          </template>
        </j-table-column>
        <j-table-column prop="takeDeliverSystem" label="收货系统" />
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
    </j-card>
    <!-- 生成送货单预览 -->
    <generateDelivery
      ref="generateDelivery"
      :show-button="false"
      :detail-visible="generateDeliveryVisible"
      :detail-form="generateDeliveryForm"
      @detailClose="generateDeliveryClose"
    />
  </div>
</template>

<script>
import * as docApi from '@/api/deliveryManage/doc'
import * as baseApi from '@/api/base/personOrg'
import { getCodeList } from '@/views/common/dic'
import generateDelivery from '@/views/deliveryManage/components/generateDelivery'
// import { tagDeltData } from '@/utils/index'

export default {
  name: 'DeliveryCancel',
  components: { generateDelivery },
  data () {
    return {
      generateDeliveryForm: {},
      generateDeliveryVisible: false,
      loading: false,
      query: {
        inventoryOrganizationCode: '',
        deliverGoodsNo: '',
        lineOrderType: [],
        timeRange: [],
        startTime: '',
        endTime: ''
      },
      height: null,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      handleType: '新增',
      orderTypeList: [],
      orgList: []
    }
  },
  created () {
    this.initTable(1)
    this.getSelectData()
    this.getOrgList()
  },
  mounted () {
    this.height = this.calHeight(60).toString()
  },
  methods: {
    returnDetail (val) {
      console.log(val)

    },
    generateDeliveryClose () {
      this.generateDeliveryVisible = false
      this.initTable()
    },
    /**
     * 查看送货单
    */
    openDeliver (item) {
      console.log(item)
      this.generateDeliveryForm = item
      this.generateDeliveryVisible = true
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
      getCodeList('code00061').then((list) => {
        this.orderTypeList = list
      })
    },
    handleExport () {
      docApi.exportCancel(this.formatParams(true))
    },
    handleCancel (row) {
      docApi.cancelDeliverOrder(row).then((res) => {
        if (res && res.code === '0') {
          this.showMessage('取消成功', 'success')
          this.initTable()
        } else {
          this.showMessage(res.message)
        }
      })
    },
    formatParams (nopage) {
      const params = Object.assign(
        {
          deliverGoodsNo: this.query.deliverGoodsNo,
          lineOrderType: this.query.lineOrderType.length
            ? this.query.lineOrderType.join(',')
            : null,
          inventoryOrganizationCode: this.query.inventoryOrganizationCode.length
            ? this.query.inventoryOrganizationCode.join(',')
            : null,
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
      return params
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.loading = true
      docApi
        .getDeliverOrderCancelList(this.formatParams())
        .then((res) => {
          if (res && res.code === '0') {
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    resetQuery () {
      this.query = {
        inventoryOrganizationCode: '',
        deliverGoodsNo: '',
        lineOrderType: [],
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
