<template>
  <j-dialog
    title="交货排程新增"
    :visible.sync="detailVisible"
    :modal="false"
    :before-close="close"
    :fullscreen="false"
  >
    <!-- 表格 -->
    <j-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData1"
      border
      size="small"
      style="width: 100%"
      tooltip-effect="dark"
      highlight-current-row
    >
      <j-table-column prop="index" label="操作" width="60">
        <template slot-scope="scope">
          <j-button type="primary" class="primary" @click="addOrReduce(scope.$index, scope.row)">
            {{ scope.$index === 0 ? '+' : '-' }}
          </j-button>
        </template>
      </j-table-column>
      <j-table-column type="index" label="序号" />
      <j-table-column prop="goodsCode" label="物料编码" />
      <j-table-column prop="goodsName" label="物料描述" />
      <j-table-column prop="orderNum" label="订单量" />
      <j-table-column prop="deliveryScheduleNum" label="交货排程量">
        <template slot-scope="scope">
          <j-input v-model="scope.row.deliveryScheduleNum" />
        </template>
      </j-table-column>
      <j-table-column prop="orderDelivery" label="交货日期" width="200">
        <template slot-scope="scope">
          <j-date-picker
            v-model="scope.row.orderDelivery"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 180px;"
            placeholder="选择日期时间"
            :picker-options="dateOptions"
          />
        </template>
      </j-table-column>
    </j-table>
    <j-button
      type="primary"
      class="button-save"
      size="medium"
      @click="save()"
    >
      保存
    </j-button>
  </j-dialog>
</template>

<script>
import * as purchaseOrderApi from '@/api/purchaseOrder/Confirmation'

export default {
  props: {
    detailVisible: Boolean,
    detailForm: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      loading: false,
      height: null,
      tableData: [],
      dateOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 1 * 24 * 3600 * 1000
        }
      }
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    tableData1 () {
      if (this.tableData.length > 0) {
        const arr =  this.tableData.filter(data => {
          return data.delFlag !== 1
        })
        return arr
      }
    }
  },
  watch: {
    detailForm (val) {
      if (val.planId) {
        this.getDetailTable(val.planId, val.id, val)
      }
    }
  },
  mounted () {
    // this.height = this.getHeight()
  },
  methods: {
    addOrReduce (index, row) {
      if (index === 0) {
        const newData = {
          goodsCode: this.tableData[0].goodsCode,
          goodsName: this.tableData[0].goodsName,
          orderNum: this.tableData[0].orderNum,
          unit: this.tableData[0].unit,
          pid: this.tableData[0].pid,
          orderCode: this.tableData[0].orderCode,
          lineNum: this.tableData[0].lineNum,
          lineName: this.tableData[0].lineName,
          lineCode: this.tableData[0].lineCode,
          deliveryScheduleNum: '',
          orderDelivery: '',
          px: 'xh' + this.tableData.length
        }
        this.tableData.push(newData)
      } else {
        // if (row.id) {
        //   // row.delFlag = 1
        //   let oldIndex = this.tableData.indexOf(row)
        //   this.$set(this.tableData[oldIndex], 'delFlag', 1)
        // } else {
        //   let oldIndex = this.tableData.indexOf(row)
        //   this.tableData.splice(oldIndex, 1)
        // }
        const index = this.tableData.indexOf(row)
        this.tableData.splice(index, 1)
      }
    },
    save () {
      console.log(this.tableData1)
      const deliveryScheduleNum = []
      const orderDelivery = []
      let isHasNum = true
      let isHasDelivery = true
      this.tableData1.forEach(item => {
        deliveryScheduleNum.push(item.deliveryScheduleNum)
        orderDelivery.push(item.orderDelivery)
      })
      deliveryScheduleNum.forEach(item => {
        if (item === '') {
          isHasNum = false
        }
      })
      orderDelivery.forEach(item => {
        if (item === '' || item === null) {
          isHasDelivery = false
        }
      })

      if (!isHasNum || !isHasDelivery) {
        this.$message({
          showClose: true,
          message: '交货排程量和交货日期不能有空项',
          type: 'warning'
        })
        return
      }
      // console.log(this.tableData);
      purchaseOrderApi.deliverySchedule(this.tableData).then(res => {
        if (res.code === '0' && res.data) {
          console.log(res.data)
          this.$message.success('交货排程新增成功')
          this.$emit('deliveryVisible', false)
        } else {
          this.$message.warning(res.message)
        }
      })
    },
    getDetailTable (planId, id, val) {
      this.tableData = []
      const params = {
        id: planId
      }
      purchaseOrderApi.getPurchaseOrderSon(params).then(res => {
        if (res.code === '0' && res.data) {
          const data = res.data
          data.forEach(item => {
            const items = {
              goodsCode: item.goodsCode,
              goodsName: item.goodsName,
              unit: item.unit,
              orderNum: item.orderNum,
              deliveryScheduleNum: item.deliveryScheduleNum,
              orderDelivery: item.orderDelivery,
              pid: id,
              id: item.id,
              orderCode: val.orderCode,
              lineNum: val.lineNum,
              lineName: val.lineName,
              lineCode: val.lineCode
            }
            this.tableData.push(items)
          })
          console.log(this.tableData)
        }
      })
    },
    close () {
      this.$emit('detailClose')
    }
  }
}
</script>
<style lang="less" scoped>
.primary {
  color: #FF6D36;
  /deep/ span {
    color: #fff !important;
  }
}
/deep/ .el-dialog__body {
  position: relative;
  padding-bottom: 75px !important;
  .button-save {
    margin-top: 20px;
    position: absolute;
    right: 20px;
  }
}
</style>
