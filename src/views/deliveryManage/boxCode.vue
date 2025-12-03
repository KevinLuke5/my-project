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
        <j-form-item label="送货单号">
          <j-input v-model="query.deliverGoodsNo" placeholder="请输入送货单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="箱码">
          <j-input v-model="query.boxCode" placeholder="请输入箱码" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="库存组织">
          <j-select
            v-model="query.inventoryOrganization"
            clearable
            multiple
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
        <j-form-item label="创建日期">
          <j-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            value-format="yyyy-MM-dd"
          />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getBoxCodeList'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'boxCodeSearch-export1'" @click="handleExport">
            导出
          </j-button>
        </j-form-item>
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
import * as baseApi from '@/api/base/personOrg'
import { getBoxCodeList, exportBoxCode } from '@/api/deliveryManage/boxCode'

export default {
  name: 'BoxCode',
  components: {},
  data () {
    return {
      query: {
        deliverGoodsNo: '',
        boxCode: '',
        inventoryOrganization: ''
      },
      timeRange: [],
      height: null,
      tableData: [],
      tableColumns: [
        {
          prop: 'deliverGoodsNo',
          label: '送货单号'
        },
        {
          prop: 'crtTime',
          label: '创建时间'
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
          prop: 'boxCode',
          label: '箱码'
        },
        {
          prop: 'boxNum',
          label: '数量'
        },
        {
          prop: 'inventoryOrganization',
          label: '库存组织',
          width: '150'
        }
      ],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      tableOptions: {
        toolbarBottom: true,
        mutiSelect: false,
        index: false,
        loading: false,
        initTable: false
      },
      orgList: []
    }
  },
  activated () {
    // 接参送货单号进行查询
    console.log('送货单号', this.$route.query.orderNo)
    const deliverGoodsNo = this.$route.query.orderNo
    if (deliverGoodsNo) {
      this.query.deliverGoodsNo = deliverGoodsNo
      this.initTable(1)
    }
  },
  created () {
    this.initTable()
  },
  mounted () {
    this.height = this.getHeight()
    this.getOrgList()
  },
  methods: {
    /**
     * 获取库存组织下拉框
     */
    getOrgList () {
      baseApi.getQuery({ page: 1, size: 500 }).then((res) => {
        this.orgList = res.data.records
      })
    },
    handleExport () {
      exportBoxCode(this.formatParams(true))
    },
    formatParams (nopage) {
      const params = Object.assign(
        {},
        this.query,
        {
          inventoryOrganization: this.query.inventoryOrganization.length
            ? this.query.inventoryOrganization.join(',')
            : null
        },
        nopage
          ? {}
          : { page: this.tablePage.pageNum, size: this.tablePage.pageSize }
      )
      if (this.timeRange && this.timeRange.length === 2) {
        params.startTime = `${this.timeRange[0]} 00:00:00`
        params.endTime = `${this.timeRange[1]} 23:59:59`
      }
      return params
    },
    // 表格查询
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      getBoxCodeList(this.formatParams())
        .then((res) => {
          res.data.records = res.data.records || []
          this.tableData = this.handleTableData(res.data.records)
          this.tablePage.total = res.data.total
          this.loading = false
        })
        .finally(() => {
          this.tableOptions.loading = false
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
        deliverGoodsNo: '',
        boxCode: '',
        inventoryOrganization: ''
      }
      this.timeRange = null
    }
  }
}
</script>