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
        <j-form-item label="月度">
          <j-select
            v-model="query.month"
            clearable
            multiple
            collapse-tags
          >
            <j-option
              v-for="item in monthList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <!-- <j-form-item label="月度">
          <j-date-picker v-model="query.month" type="month" value-format="MM月" />
        </j-form-item> -->
        <j-form-item label="收货供应商">
          <j-input v-model="query.receivingSupplierCode" placeholder="供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="物料">
          <j-input v-model="query.goodsCode" placeholder="物料编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
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

      <j-table :data="tableData" :height="height">
        <j-table-column prop="month" label="月度" />
        <j-table-column prop="receivingSupplierCode" label="收货供应商编码" />
        <j-table-column prop="receivingSupplierName" label="收货供应商名称" width="100" />
        <j-table-column prop="goodsCode" label="物料编码" />
        <j-table-column prop="goodsName" label="物料名称" />
        <j-table-column prop="firstStockNum" label="月初库存量" width="120" />
        <j-table-column prop="monthStorageNum" label="当月入库量" />
        <j-table-column prop="monthConsumptionNum" label="当月消耗量" width="300" />
        <j-table-column label="库存调整">
          <template slot="header">
            <span>库存调整</span>
            <j-tooltip effect="dark" placement="top">
              <i class="el-icon-question" />
              <div slot="content">
                <p>库存调整增加录入正数，库存调整减少录入负数</p>
              </div>
            </j-tooltip>
          </template>
          <template slot-scope="scope">
            <j-link v-if="scope.row.isEdit" @click="numInputShow(scope.row, scope.$index)">
              {{ scope.row.stockNum }}
            </j-link>
            <div v-else>
              {{ scope.row.stockNum }}
            </div>
          </template>
        </j-table-column>
        <j-table-column prop="reason" label="库存调整原因" />
        <j-table-column label="月末库存量">
          <template slot="header">
            <span>月末库存量</span>
            <j-tooltip effect="dark" placement="top">
              <i class="el-icon-question" />
              <div slot="content">
                <p>月末库存量=月初库存量+当月入库量-当月消耗量+库存调整</p>
              </div>
            </j-tooltip>
          </template>
          <template slot-scope="scope">
            {{ scope.row.endingInventory }}
          </template>
        </j-table-column>
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
    <!-- 编辑 -->
    <j-dialog
      title="编辑"
      :visible.sync="dialogShow"
      :modal="false"
      width="500px"
    >
      <j-form
        ref="tableForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="tableFormObj"
      >
        <j-form-item label="库存调整">
          <j-input-number
            v-model="tableFormObj.stockNum"
            :precision="2"
            :controls="false"
            class="money-sum-inp no-margin-top"
          />
        </j-form-item>
        <j-form-item label="库存调整原因">
          <j-input v-model="tableFormObj.reason" placeholder="请输入备注" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="dialogShow = false">取消</j-button>
        <j-button type="primary" @click="tableFormSave">保存</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import * as vmiApi from '@/api/deliveryManage/report'
import { arrayJoin } from '@/utils/index'
import dayjs from 'dayjs'

export default {
  name: 'Inventory',
  components: {},
  data () {
    return {
      freshTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      query: {
        month: '',
        receivingSupplierCode: '',
        goodsCode: ''
      },
      height: null,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      tableFormObj: {
        id: '',
        stockNum: undefined,
        reason: ''
      },
      dialogShow: false,
      loading: false,
      monthList: [
        { label: '1月', value: 1 },
        { label: '2月', value: 2 },
        { label: '3月', value: 3 },
        { label: '4月', value: 4 },
        { label: '5月', value: 5 },
        { label: '6月', value: 6 },
        { label: '7月', value: 7 },
        { label: '8月', value: 8 },
        { label: '9月', value: 9 },
        { label: '10月', value: 10 },
        { label: '11月', value: 11 },
        { label: '12月', value: 12 }
      ]
    }
  },
  created () {
    this.initTable()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    tableFormSave () {
      if ((this.tableFormObj.stockNum && this.tableFormObj.reason) || (!this.tableFormObj.stockNum && !this.tableFormObj.reason)) {
        if (this.tableFormObj.stockNum === undefined) {
          this.tableFormObj.stockNum = 0
        }
        vmiApi.updateStockTransceiver({
          id: this.tableFormObj.id,
          stockNum: this.tableFormObj.stockNum,
          reason: this.tableFormObj.reason
        }).then((res) => {
          if (res && res.code === '0') {
            this.showMessage('修改成功', 'success')
            this.dialogShow = false
            this.tableFormObj = {
              id: '',
              stockNum: '',
              reason: ''
            }
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
      } else {
        this.showMessage('请填写完整')
      }

    },
    async refresh () {
      this.loading = true
      try {
        const res = await vmiApi.syncStockTransceiver({})
        if (res && res.code === '0') {
          await this.initTable(1)
          this.showMessage('同步成功！', 'success')
          this.freshTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
        }
      } catch (e) {
        this.showMessage(e)
      } finally {
        this.loading = false
      }
    },
    handleExport () {
      if (!this.tableData.length) {
        this.$message.warning('列表无数据，无法导出')
        return
      }
      vmiApi.exportStockTransceiver(this.formatParams(true))
    },
    formatParams (nopage) {
      const params = Object.assign(
        {},
        this.query,
        {
          month: arrayJoin(this.query.month)
        },
        nopage
          ? {}
          : { page: this.tablePage.pageNum, size: this.tablePage.pageSize }
      )
      return params
    },
    // 表格查询
    async initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.loading = true
      try {
        const res = await vmiApi.getStockTransceiverPage(this.formatParams())
        if (res && res.code === '0') {
          const month = dayjs(new Date()).format('YYYY-MM')
          this.tableData = res.data.records.map((row) => {
            row.changing = false
            row.isEdit = row.month === month ? true : false
            return row
          })
          this.tablePage.total = res.data.total
        }
      } catch (e) {
        this.showMessage(e)
      } finally {
        this.loading = false
      }
    },
    numInputShow (row, index) {
      this.tableFormObj = {
        id: row.id,
        stockNum: row.stockNum ? row.stockNum : undefined,
        reason: row.reason
      }
      this.dialogShow = true
    },
    handleSizeChange (size) {
      this.tablePage.pageSize = size
      this.currentPage = 1
      this.initTable(1)
    },
    handleCurrentChange (currentPage) {
      this.tablePage.pageNum = currentPage
      this.initTable(currentPage)
    },
    resetQuery () {
      this.query = {
        month: '',
        supplierCode: '',
        goodsCode: ''
      }
    }
  }
}
</script>
