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
        <j-form-item label="对账日期">
          <j-date-picker
            v-model="timeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            value-format="yyyy-MM-DD"
          />
        </j-form-item>
        <j-form-item label="收货供应商">
          <j-input v-model="query.receiveSupplier" placeholder="供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="供应商">
          <j-input v-model="query.supplier" placeholder="供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <div style="margin-bottom: 5px">
          <j-button
            v-check="'deliveryManage-VmiAccountReport-syncVmiStock'"
            type="primary"
            @click="refresh"
          >
            数据同步
          </j-button>
          <span style="font-size: 12px; color: #ff6d36">数据更新时间：{{ freshTime }}</span>
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

      <j-tabs v-model="activeName" @tab-click="tabClick">
        <j-tab-pane label="对账单汇总表" name="1">
          <j-table-with-page
            :columns="allTableColumns"
            :data-source="allTableData"
            :options="tableOptions"
            :fetch="initTable"
            :pagination="allTablePage"
            :height="height"
          />
        </j-tab-pane>
        <j-tab-pane label="对账单明细表" name="2">
          <j-table-with-page
            :columns="detailTableColumns"
            :data-source="detailTableData"
            :options="tableOptions"
            :fetch="initTable"
            :pagination="detailTablePage"
            :height="height"
          />
        </j-tab-pane>
      </j-tabs>
    </j-card>
  </div>
</template>

<script>
import * as baseApi from '@/api/base/personOrg'
import * as assignListApi from '@/api/jcSettle/assignList'
import dayjs from 'dayjs'

const defaultValue = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3
}

const statusToCN = {
  [defaultValue.ZERO]: '待回款',
  [defaultValue.ONE]: '已逾期',
  [defaultValue.TWO]: '部分回款',
  [defaultValue.THREE]: '已回款'
}

export default {
  name: 'VerifyBill',
  components: {},
  data () {
    return {
      activeName: '1',
      freshTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      query: {
        supplier: '',
        receiveSupplier: '',
        checkBeginTime: '',
        checkEndTime: ''
      },
      timeRange: [],
      height: null,
      allTableData: [],
      detailTableData: [],
      allTableColumns: [
        {
          prop: 'crtTime',
          label: '对账日期'
        },
        {
          prop: 'checkDate',
          label: '期间'
        },
        {
          prop: 'receiveSupplierCode',
          label: '收货供应商编码',
          width: '100'
        },
        {
          prop: 'receiveSupplierName',
          label: '收货供应商名称',
          width: '300'
        },
        {
          prop: 'firstMoney',
          label: '月初余额'
        },
        {
          prop: 'marketMoney',
          label: '当月销售额'
        },
        {
          prop: 'rollbackMoney',
          label: '当月回款额'
        },
        {
          prop: 'differenceMoney',
          label: '金额差异调整'
        },
        {
          prop: 'balanceMoney',
          label: '月末余额'
        },
        {
          prop: 'returnedMoney',
          label: '逾期待回款额'
        },
        {
          prop: 'supplierCode',
          label: '供应商编码',
          width: 120
        },
        {
          prop: 'supplierName',
          label: '供应商名称'
        }
      ],
      detailTableColumns: [
        {
          prop: 'receiveSupplierCode',
          label: '收货供应商编码',
          width: '100'
        },
        {
          prop: 'receiveSupplierName',
          label: '收货供应商名称',
          width: '300'
        },
        {
          prop: 'paymentDays',
          label: '账期（天数）'
        },
        {
          prop: 'classify',
          label: '分类'
        },
        {
          prop: 'deliveryCode',
          label: '送货单号',
          width: '100'
        },
        {
          prop: 'orderCode',
          label: '订单号',
          width: '300'
        },
        {
          prop: 'lineNum',
          label: '行号'
        },
        {
          prop: 'materialCode',
          label: '物料编码'
        },
        {
          prop: 'materialName',
          label: '物料名称'
        },
        {
          prop: 'affairDate',
          label: '日期'
        },
        {
          prop: 'thisDeliveryNum',
          label: '本次送货量'
        },
        {
          prop: 'practicalReceiveNum',
          label: '实际接收量',
          width: 120
        },
        {
          prop: 'receiveMoney',
          label: '接收金额',
          render: (h, row) => {
            return (
              <div>
                <j-popover placement="right" width="400" trigger="click">
                  <j-table data={row.logData}>
                    <j-table-column
                      width="100"
                      prop="classify"
                      label="分类"
                    />
                    <j-table-column
                      width="150"
                      prop="bankCode"
                      label="银行流水号"
                    />
                    <j-table-column
                      width="100"
                      prop="affairDate"
                      label="收款日期"
                    />
                    <j-table-column
                      width="100"
                      prop="payeeMoney"
                      label="收款金额/差异调整金额"
                    />
                    <j-table-column
                      width="100"
                      prop="receiptCancelMoney"
                      label="收款核销额"
                    />
                  </j-table>
                  <j-link
                    slot="reference"
                    vCheck={'pdtLineSaveOrUpdate'}
                    onClick={() => {
                      this.handleEdit(row)
                    }}
                  >
                    {row.num}
                  </j-link>
                </j-popover>
              </div>
            )
          }
        },
        {
          prop: 'receiptCancelMoney',
          label: '收款核销额'
        },
        {
          prop: 'payeeMoney',
          label: '收款金额'
        },
        {
          prop: 'differenceMoney',
          label: '差异调整金额'
        },
        {
          prop: 'bankCode',
          label: '银行流水号'
        },
        {
          prop: 'returnedMoney',
          label: '待回款额'
        },
        {
          prop: 'overdueDays',
          label: '逾期天数'
        },
        {
          prop: 'statusStr',
          label: '状态'
        },
        {
          prop: 'supplierCode',
          label: '供应商编码'
        },
        {
          prop: 'supplierName',
          label: '供应商名称'
        }
      ],
      allTablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      detailTablePage: {
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
    async refresh () {
      this.tableOptions.loading = true
      try {
        const res = await assignListApi.createSrmFinanceGroupPurchaseBill({})
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
      if (this.activeName === '2') {
        assignListApi.exportSrmFinanceGroupPurchaseBillDetail(this.formatParams(true))
      } else {
        assignListApi.exportSrmFinanceGroupPurchaseBill(this.formatParams(true))
      }
    },
    tabClick (tab) {
      this.query.status = parseInt(tab.name)
      this.initTable()
    },
    formatParams (nopage) {
      const params = Object.assign(
        {},
        this.query,
        nopage
          ? {}
          : { page: this.allTablePage.pageNum, size: this.allTablePage.pageSize }
      )
      if (this.timeRange && this.timeRange.length === 2) {
        params.checkBeginTime = `${this.timeRange[0]} 00:00:00`
        params.checkEndTime = `${this.timeRange[1]} 23:59:59`
      }
      if (this.activeName === '2') {
        params.status = 2
        params.page = this.detailTablePage.pageNum
        params.size = this.detailTablePage.pageSize
      } else {
        params.status = 1
        params.page = this.allTablePage.pageNum
        params.size = this.allTablePage.pageSize
      }
      delete params.timeRange
      return params
    },
    // 表格查询
    async initTable (page) {
      if (page) {
        if (this.activeName === '2') {
          this.detailTablePage.pageNum = page || 1
        } else {
          this.allTablePage.pageNum = page || 1
        }
      }
      this.tableOptions.loading = true
      try {

        if (this.activeName === '2') {
          const res = await assignListApi.getSrmFinanceGroupPurchaseBillDetailPage(this.formatParams())
          if (res && res.code === '0') {
            this.detailTableData = res.data.records
            this.detailTableData.forEach(item => {
              console.log(item)
              item.statusStr = statusToCN[item.status]
            })
            this.detailTablePage.total = res.data.total
          }
        } else {
          const res = await assignListApi.getSrmFinanceGroupPurchaseBillPage(this.formatParams())
          if (res && res.code === '0') {
            this.allTableData = res.data.records
            this.allTablePage.total = res.data.total
          }
        }
      } catch (e) {
        this.showMessage(e)
      } finally {
        this.tableOptions.loading = false
      }
    },
    resetQuery () {
      this.query = {
        receiveSupplier: '',
        supplier: '',
        checkBeginTime: '',
        checkEndTime: ''
      }
      this.timeRange = []
    }
  }
}
</script>
