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
        <j-form-item label="供应商">
          <j-input v-model="query.supplierCode" placeholder="供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="物料">
          <j-input v-model="query.goodsCode" placeholder="物料编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="创建日期">
          <j-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
            value-format="yyyy-MM-dd"
          />
        </j-form-item>
        <j-form-item label="库存组织">
          <j-select
            v-model="query.inventoryOrganization"
            filterable
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
        <div style="margin-bottom: 5px">
          <div class="right-btn">
            <j-button
              v-check="'deliveryManage-VmiAccountReport-getVmiPage'"
              type="primary"
              @click="initTable(1)"
            >
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button
              v-check="'deliveryManage-VmiAccountReport-exportVmiStock'"
              @click="handleExport"
            >
              导出
            </j-button>
          </div>
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
import * as allotApi from '@/api/jcSettle/assignList'
import * as baseApi from '@/api/base/personOrg'
// import { getCodeList } from '@/views/common/dic'
import { arrayJoin } from '@/utils/index'
import dayjs from 'dayjs'

export default {
  name: 'AssignList',
  components: {},
  data () {
    return {
      freshTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      query: {
        inventoryOrganization: '',
        supplierCode: '',
        goodsCode: '',
        startCrtTime: '',
        endCrtTime: ''
      },
      timeRange: [],
      height: null,
      tableData: [],
      tableColumns: [
        {
          prop: 'materialCode',
          label: '物料编码',
          width: '100'
        },
        {
          prop: 'materialName',
          label: '物料名称',
          width: '300'
        },
        {
          prop: 'supplierCode',
          label: '供应商编码'
        },
        {
          prop: 'supplierName',
          label: '供应商名称'
        },
        {
          prop: 'alloPercent',
          label: '分配比例'
        },
        {
          prop: 'alloRank',
          label: '等级'
        },
        {
          prop: 'inventoryOrganizationName',
          label: '库存组织'
        },
        {
          prop: 'supplierLocationName',
          label: '供应商地点'
        },
        {
          prop: 'crtTime',
          label: '创建日期'
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
      if (!this.tableData.length) {
        this.$message.warning('列表无数据，无法导出')
        return
      }
      allotApi.exportAllotInventory(this.formatParams(true))
    },
    formatParams (nopage) {
      const params = Object.assign(
        {},
        this.query,
        {
          inventoryOrganization: arrayJoin(this.query.inventoryOrganization)
        },
        nopage
          ? {}
          : { page: this.tablePage.pageNum, size: this.tablePage.pageSize }
      )
      if (this.timeRange && this.timeRange.length === 2) {
        params.startCrtTime = `${this.timeRange[0]} 00:00:00`
        params.endCrtTime = `${this.timeRange[1]} 23:59:59`
      }
      delete params.timeRange
      return params
    },
    // 表格查询
    async initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      try {
        const res = await allotApi.getAllotInventoryPage(this.formatParams())
        if (res && res.code === '0') {
          this.tableData = res.data.records
          this.tablePage.total = res.data.total
        }
      } catch (e) {
        this.showMessage(e)
      } finally {
        this.tableOptions.loading = false
      }
    },
    resetQuery () {
      this.query = {
        inventoryOrganization: '',
        supplierCode: '',
        goodsCode: '',
        startCrtTime: '',
        endCrtTime: ''
      }
      this.timeRange = []
    }
  }
}
</script>
