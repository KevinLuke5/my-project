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
          <j-input v-model="query.deliverGoodsNo" placeholder="送货单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="送货单条码">
          <j-input v-model="query.deliverGoodsCode" placeholder="送货单条码" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <div class="btn">
          <div>
            <j-button type="primary" v-check="'batchDeliverReceive'" @click="handleReceive">
              接收
            </j-button>
          </div>
          <j-form-item class="btn-group" style="margin-bottom: 0">
            <j-button v-check="'getDeliverReceiveList'" type="primary" @click="initTable(1)">
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
          </j-form-item>
        </div>
      </j-form>

      <j-table :data="tableData" :height="height" @selection-change="selectTable">
        <j-table-column type="selection" width="55" fixed />
        <j-table-column prop="lineName" label="产品线" />
        <j-table-column prop="deliverGoodsNo" label="送货单号" />
        <j-table-column prop="deliverGoodsCode" label="送货单条码" width="100" />
        <j-table-column prop="orderCode" label="订单号" />
        <j-table-column prop="lineNum" label="订单行" />
        <j-table-column prop="supplierName" label="供应商" width="120" />
        <j-table-column prop="purchaseGoodsCode" label="物料编码" />
        <j-table-column prop="goodsName" label="物料名称" width="300" />
        <j-table-column prop="unit" label="单位" />
        <j-table-column prop="thisDeliveryNum" label="本次发货量" />
        <j-table-column prop="receiveNum" label="已接收量" />
        <j-table-column label="本次接收量">
          <template slot-scope="scope">
            <j-link v-show="!scope.row.changing" @click="numInputShow(scope.row, scope.$index)">
              {{ scope.row.thisReceiveNum }}
            </j-link>
            <j-input-number
              v-show="scope.row.changing"
              :ref="'numInput' + scope.$index"
              v-model="scope.row.thisReceiveNum"
              style="width: 80px"
              :controls="false"
              :precision="0"
              :min="0"
              :max="scope.row.thisDeliveryNum - scope.row.receiveNum"
              size="mini"
              @blur="inputDone(scope.row)"
              @change="inputDone(scope.row)"
            />
          </template>
        </j-table-column>
        <j-table-column label="是否完成">
          <template slot-scope="scope">
            <j-select v-model="scope.row.isFinish">
              <j-option label="Y" :value="1" />
              <j-option label="N" :value="0" />
            </j-select>
          </template>
        </j-table-column>
        <j-table-column prop="lineRemark" label="行备注" width="200" />
        <j-table-column prop="remark" label="备注" width="200" />
        <j-table-column prop="estimatedArrivalTime" label="预计到货日期" width="100" />
        <j-table-column label="订单行类别">
          <template slot-scope="scope">
            {{ scope.row.lineOrderType }}
          </template>
        </j-table-column>
        <j-table-column prop="receivingSupplier" label="收货供应商" width="150" />
        <j-table-column prop="receivingSupplierAddress" label="收货供应商地址" width="200" />
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
  </div>
</template>

<script>
import * as docApi from '@/api/deliveryManage/doc'
// import { getCodeList } from '@/views/common/dic'
// import { tagDeltData } from '@/utils/index'

export default {
  name: 'OrderReceive',
  data () {
    return {
      loading: false,
      query: {
        deliverGoodsNo: '',
        deliverGoodsCode: ''
      },
      height: null,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      tableSelectList: []
    }
  },
  created () {
    this.initTable(1)
  },
  mounted () {
    this.height = this.calHeight(60).toString()
  },
  methods: {
    numInputShow (row, index) {
      // 设定更改的最大值
      // if (!row.maxNum) {
      //   row.maxNum = row.thisDeliveryNum
      // }
      row.changing = true
      this.$nextTick(() => {
        this.$refs['numInput' + index].focus()
      })
    },
    inputDone (row) {
      // docApi.updateDeliverOrderDetail({
      //   id: row.id,
      //   thisReceiveNum: row.thisReceiveNum
      // }).then((res) => {
      //   if (res && res.code === '0') {
      //     this.showMessage('修改成功', 'success')
      row.changing = false
      //   } else {
      //     this.showMessage(res.message)
      //   }
      // })
    },
    handleReceive () {
      if (this.tableSelectList.length) {
        docApi.batchDeliverReceive(this.tableSelectList).then((res) => {
          if (res && res.code === '0') {
            this.showMessage('接收成功', 'success')
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
      } else {
        this.showMessage('请选择至少一条数据！')
      }
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.loading = true
      const params = Object.assign({}, this.query, {
        page: this.tablePage.pageNum,
        size: this.tablePage.pageSize
      })
      docApi
        .getDeliverReceiveList(params)
        .then((res) => {
          if (res && res.code === '0') {
            this.tableData = res.data.records.map((row) => {
              row.changing = false
              return row
            })
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
        deliverGoodsNo: '',
        deliverGoodsCode: ''
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
<style lang="less" scoped>
.btn {
  display: flex;
  justify-content: space-between;
}
</style>
