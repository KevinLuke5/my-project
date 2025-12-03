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
        style="margin-bottom: 10px"
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
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="库存组织">
          <j-select
            v-model="query.inventoryOrganizationCodeList"
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
        <j-form-item label="物料">
          <j-input v-model="query.goods" placeholder="物料编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="发货供应商">
          <j-input v-model="query.supplier" placeholder="发货供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="收货供应商">
          <j-input v-model="query.rejectSupplier" placeholder="收货供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <div class="btn">
          <div>
            <j-button type="primary" v-check="'stockInquiry-synchronous'" @click="handleRefresh">
              数据同步
            </j-button>
            <span>数据更新时间：{{ renewTime }}</span>
          </div>
          <j-form-item class="btn-group">
            <j-button v-check="'stockInquiry-pageList'" type="primary" @click="initTable(1)">
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button v-check="'stockInquiry-export'" @click="handleExport">
              导出
            </j-button>
          </j-form-item>
        </div>
      </j-form>

      <j-table-with-page
        :columns="tableColumns"
        :data-source="tableData"
        :options="tableOptions"
        :fetch="initTable"
        :pagination="tablePage"
        :height="height"
      />
    </j-card>
  </div>
</template>

<script>
import * as stockApi from '@/api/deliveryManage/stock'
import * as baseApi from '@/api/base/personOrg'
import * as supplierApi from '@/api/supplier/pool'
import loginVue from '../login/login.vue'
export default {
  name: 'stockInquiry',
  components: {},
  data () {
    return {
      query: {
        lineCode: [],
        inventoryOrganizationCodeList: [],
        goods: '',
        supplier: '',
        rejectSupplier: ''
      },
      renewTime: '',
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'lineName',
          label: '产品线'
        },
        {
          prop: 'supplierCode',
          label: '发货供应商编码',
          width: '130'
        },
        {
          prop: 'supplierName',
          label: '发货供应商名称',
          width: '130'
        },
        {
          prop: 'receiptVendorCode',
          label: '收货供应商编码',
          width: '130'
        },
        {
          prop: 'receiptVendorName',
          label: '收货供应商名称',
          width: '130'
        },
        {
          prop: 'goodsCode',
          label: '物料编码',
          width: '100'
        },
        {
          prop: 'goodsName',
          label: '物料名称',
          width: '300'
        },
        {
          prop: 'unit',
          label: '单位'
        },
        {
          prop: 'customerStockNum',
          label: '客供库存量'
        },
        {
          prop: 'vimStockNum',
          label: '工厂VMI库存量'
        },
        {
          prop: 'vimOutStockNum',
          label: '委外VMI库存量'
        },
        {
          prop: 'amount',
          label: '合计'
        },
        {
          prop: 'inventoryOrganization',
          label: '库存组织'
        }
      ],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      tableOptions: {
        toolbarBottom: true,
        mutiSelect: true,
        index: false,
        loading: false,
        initTable: false
      },
      pdtLineList: [],
      orgList: []
    }
  },
  created () {
    this.initTable()
    this.getPdtLineList()
    this.getOrgList()
  },
  mounted () {
    this.height = this.getHeight()
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
    handleRefresh () {
      this.tableOptions.loading = true
      stockApi
        .srmOrderStockSynchronous({})
        .then((res) => {
          if (res.code === '0') {
            this.initTable(1)
          }
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    handleExport () {
      stockApi.srmOrderStockExport(this.formatParams(true))
    },
    getSelectData () {
      // getCodeList('code00017').then((list) => {
      //   this.statusList = list
      // })
    },
    formatParams (nopage) {
      const params = Object.assign(
        {
          lineCode: this.query.lineCode.length
            ? this.query.lineCode.join(',')
            : null,
          inventoryOrganizationCodeList: this.query
            .inventoryOrganizationCodeList.length
            ? this.query.inventoryOrganizationCodeList.join(',')
            : null,
          goods: this.query.goods,
          supplier: this.query.supplier,
          rejectSupplier: this.query.rejectSupplier
        },
        nopage
          ? {}
          : { page: this.tablePage.pageNum, size: this.tablePage.pageSize }
      )
      return params
    },
    // 表格查询
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      stockApi
        .srmOrderStockList(this.formatParams())
        .then((res) => {
          if (res.code === '0') {
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
            this.loading = false
            this.renewTime = this.tableData[0].crtTime
          }
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    resetQuery () {
      this.query = {
        lineCode: [],
        inventoryOrganizationCodeList: [],
        goods: '',
        supplier: ''
      }
    }
  }
}
</script>
<style lang="less" scoped>
.btn {
  display: flex;
  justify-content: space-between;
  span {
    color: #f09068;
    font-size: 14px;
    font-weight: 500;
  }
}

</style>
