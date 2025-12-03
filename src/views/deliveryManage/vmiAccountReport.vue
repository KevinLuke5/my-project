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
        <j-form-item label="供应商">
          <j-input v-model="query.supplierCode" placeholder="供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="物料">
          <j-input v-model="query.goodsCode" placeholder="物料编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="分类">
          <j-select
            v-model="query.type"
            filterable
            clearable
            multiple
            collapse-tags
          >
            <j-option
              v-for="(value, index) in typeDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="事务类型">
          <j-select
            v-model="query.transactionType"
            filterable
            clearable
            multiple
            collapse-tags
          >
            <j-option
              v-for="item in buinessTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="事务日期">
          <j-date-picker
            v-model="timeRange"
            type="datetimerange"
            range-separator="~"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </j-form-item>
        <div style="margin-bottom: 5px">
          <j-button
            v-check="'deliveryManage-VmiAccountReport-syncVmiStock'" 
            type="primary"
            @click="refresh"
          >
            数据同步
          </j-button>
          <span style="font-size:12px;color:#FF6D36;">数据更新时间：{{ freshTime }}</span>
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
import * as baseApi from '@/api/base/personOrg'
import * as vmiApi from '@/api/deliveryManage/report'
import { getCodeList } from '@/views/common/dic'
import { arrayJoin } from '@/utils/index'
import dayjs from 'dayjs'

export default {
  name: 'WmiAccountReport',
  components: {},
  data () {
    return {
      freshTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      query: {
        inventoryOrganization: '',
        supplierCode: '',
        goodsCode: '',
        type: '',
        transactionType: '',
        startTime: '',
        endTime: ''
      },
      timeRange: [],
      height: null,
      tableData: [],
      tableColumns: [
        {
          prop: 'supplierCode',
          label: '供应商编码'
        },
        {
          prop: 'supplierName',
          label: '供应商名称'
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
          prop: 'transactionType',
          label: '事务类型'
          // render: (h, row) => (
          //   <span>
          //     {this.buinessTypeList.length
          //       ? (
          //         this.buinessTypeList.find(
          //           (dic) => dic.lineNumber === row.transactionType
          //         ) || { name: '' }
          //       ).name
          //       : ''}
          //   </span>
          // )
        },
        {
          prop: 'unit',
          label: '单位'
        },
        {
          prop: 'transactionNum',
          label: '事务数量'
        },
        {
          prop: 'openingNum',
          label: '期初数量'
        },
        {
          prop: 'endingNum',
          label: '期末数量'
        },
        {
          prop: 'transactionDate',
          label: '事务日期',
          width: 120
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
        mutiSelect: false,
        index: false,
        loading: false,
        initTable: false
      },
      orgList: [],
      typeDic: {
        0: '工厂VMI',
        1: '委外VMI',
        2: '委托加工'
      },
      buinessTypeList: []
    }
  },
  // activated () {
  //   // 接参送货单号进行查询
  //   console.log('送货单号', this.$route.query.orderNo)
  //   const deliverGoodsNo = this.$route.query.orderNo
  //   if (deliverGoodsNo) {
  //     this.query.deliverGoodsNo = deliverGoodsNo
  //     this.initTable(1)
  //   }
  // },
  created () {
    const now = dayjs().format('YYYY-MM-DD HH:mm:ss')
    const lastyear = dayjs().subtract(1, 'year').format('YYYY-MM-DD HH:mm:ss')
    this.timeRange = [lastyear, now]
    // this.initTable()
  },
  mounted () {
    this.height = this.getHeight()
    this.getOrgList()
    this.getSelectData()
  },
  methods: {
    getSelectData () {
      getCodeList('code00073').then((list) => {
        this.buinessTypeList = list
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
    async refresh () {
      this.tableOptions.loading = true
      try {
        const res = await vmiApi.syncVmiStock({})
        if (res && res.code === '0') {
          await this.initTable(1)
          this.showMessage('同步成功！', 'success')
          this.freshTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
      } catch (e) {
        this.showMessage(e)
      } finally {
        this.tableOptions.loading = false
      }
    },
    handleExport () {
      vmiApi.exportVmiStock(this.formatParams(true))
    },
    formatParams (nopage) {
      const params = Object.assign(
        {},
        this.query,
        {
          inventoryOrganization: arrayJoin(this.query.inventoryOrganization),
          type: arrayJoin(this.query.type),
          transactionType: arrayJoin(this.query.transactionType)
        },
        nopage
          ? {}
          : { page: this.tablePage.pageNum, size: this.tablePage.pageSize }
      )
      if (this.timeRange && this.timeRange.length === 2) {
        params.startTime = `${this.timeRange[0]} 00:00:00`
        params.endTime = `${this.timeRange[1]} 23:59:59`
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
        const res = await vmiApi.getVmiPage(this.formatParams())
        if (res && res.code === '0') {
          // this.tableData = this.handleTableData(res.data.records)
          this.tableData = res.data.records
          this.tablePage.total = res.data.total
        }
      } catch (e) {
        this.showMessage(e)
      } finally {
        this.tableOptions.loading = false
      }
      // vmiApi
      //   .getVmiPage(this.formatParams())
      //   .then((res) => {
      //     if (res && res.code === '0') {
      //       // this.tableData = this.handleTableData(res.data.records)
      //       this.tableData = res.data.records
      //       this.tablePage.total = res.data.total
      //     }
      //   })
      //   .finally(() => {
      //     this.tableOptions.loading = false
      //   })
    },
    handleTableData (tableData) {
      tableData.forEach((tableItem) => {
        Object.keys(tableItem).forEach((tableItemKey) => {
          tableItem[tableItemKey] =
            tableItem[tableItemKey] || tableItem[tableItemKey] === 0
              ? tableItem[tableItemKey]
              : '-'
        })
      })
      return tableData
    },
    resetQuery () {
      this.query = {
        inventoryOrganization: '',
        supplierCode: '',
        goodsCode: '',
        type: '',
        transactionType: '',
        startTime: '',
        endTime: ''
      }
      this.timeRange = []
    }
  }
}
</script>