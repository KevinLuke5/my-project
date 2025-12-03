<template>
  <div style="padding: 10px;">
    <div id="printView" style="padding-left: 20px; padding-right: 20px;">
      <div v-for="(item, index) in list" :key="new Date() + index" class="print-div">
        <div style="text-align: right;font-weight:bold">
          {{ item.srmOrderDeliverOrder.deliverGoodsCode }}
        </div>
        <h2 style="text-align: center;margin: 30px 0 10px 0;font-family: SimSun;">
          (九阳SRM){{ item.srmOrderDeliverOrder.inventoryOrganization }}送货单
        </h2>
        <div
          style="font-size: 14px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        font-weight: normal"
        >
          <div>日期：{{ form.time }}</div>
          <!-- <div>供应商地点：</div> -->
          <div>NO：{{ item.srmOrderDeliverOrder.deliverGoodsNo }}</div>
        </div>

        <table
          class="yk-table"
          border="1pm"
          cellspacing="0"
          align="center"
          width="100%"
          style="font-size: 12px;font-family: verdana,arial,helvetica,tahoma,宋体; table-layout:fixed;word-wrap:break-word;word-break:break-all;border-collapse: collapse;"
        >
          <tr align="center">
            <td
              v-if="item.srmOrderDeliverOrder.lineOrderType !== '客直'"
              colspan="4"
              rowspan="2"
            >
              供方名称：{{ item.srmOrderDeliverOrder.supplierName }}
            </td>
            <td v-else colspan="4" rowspan="3">
              供方名称：{{ item.srmOrderDeliverOrder.supplierName }}
            </td>
            <td colspan="3">
              供方编码
            </td>
            <td colspan="2" align="left">
              {{ item.srmOrderDeliverOrder.supplierCode }}
            </td>
            <td>预到</td>
            <td colspan="4">
              {{ item.srmOrderDeliverOrder.estimatedArrivalTime }}
            </td>
            <td>库位</td>
          </tr>
          <tr align="center">
            <td colspan="3">
              配件类别
            </td>
            <td colspan="2">
              {{ item.srmOrderDeliverOrder.lineOrderType }}
            </td>
            <td>发货</td>
            <td colspan="4">
              {{ item.srmOrderDeliverOrder.deliverTime }}
            </td>
            <td />
          </tr>
          <tr
            v-if="item.srmOrderDeliverOrder.lineOrderType === '客直'"
            align="center"
          >
            <td colspan="3">
              收货供应商
            </td>
            <td colspan="2">
              {{ item.srmOrderDeliverOrder.receivingSupplier }}
            </td>
            <td>收货供应商地址</td>
            <td colspan="4">
              {{ item.srmOrderDeliverOrder.receivingSupplierAddress }}
            </td>
            <td />
          </tr>
          <tr
            v-if="item.srmOrderDeliverOrder.lineOrderType !== '客直'"
            align="center"
          >
            <td>卸货码头</td>
            <td colspan="3">
              {{ item.srmOrderDeliverOrder.dischargingQuay }}
            </td>
            <td colspan="3">
              卸货时间段
            </td>
            <td colspan="8">
              {{ item.srmOrderDeliverOrder.demandPlanNo ? item.srmOrderDeliverOrder.demandPlanNo + '/ ' + item.srmOrderDeliverOrder.estimatedArrivalTime + ' 00:00:01/' + item.srmOrderDeliverOrder.estimatedArrivalTime + ' 23:59:59' : item.srmOrderDeliverOrder.estimatedArrivalTime + ' 00:00:01/' + item.srmOrderDeliverOrder.estimatedArrivalTime + ' 23:59:59' }}
            </td>
          </tr>
          <tr
            v-if="item.srmOrderDeliverOrder.lineOrderType !== '客直'"
            align="center"
          >
            <td>收货仓</td>
            <td colspan="3">
              {{ item.srmOrderDeliverOrder.warehouseName }}
            </td>
            <td colspan="3">
              收货地址
            </td>
            <td colspan="8">
              {{ item.srmOrderDeliverOrder.address }}
            </td>
          </tr>
          <tr align="center">
            <td>采购订单</td>
            <td>工单号</td>
            <td>需求日期</td>
            <td>物料编码</td>
            <td colspan="3">
              物料描述
            </td>
            <td>单位</td>
            <td>数量</td>
            <td>件数</td>
            <td>方数</td>
            <td>实收数量</td>
            <td>检验结果</td>
            <td>行备注</td>
            <td>备注</td>
          </tr>
          <tr v-for="(item1, index1) in item.detailList" :key="index1" align="center">
            <td>{{ item1.orderCode + '-' + item1.lineNum }}</td>
            <td>{{ item1.workOrderNo ? item1.workOrderNo : '' }}</td>
            <td>{{ item1.orderDelivery }}</td>
            <td>{{ item1.goodsCode }}</td>
            <td colspan="3">
              {{ item1.goodsName }}
            </td>
            <td>{{ item1.unit }}</td>
            <td>{{ item1.thisDeliveryNum }}</td>
            <td>{{ item1.pieceNum }}</td>
            <td>{{ item1.cubicMeter }}</td>
            <td />
            <td />
            <td>
              {{ item1.lineRemark }}
            </td>
            <td>
              {{ item1.remark }}
            </td>
          </tr>
          <tr align="center">
            <td>物流公司</td>
            <td colspan="6">
              {{ item.srmOrderDeliverOrder.logisticsCompany }}
            </td>
            <td>小计</td>
            <td>{{ getSum(item.detailList, 'thisDeliveryNum') }}</td>
            <td>{{ getPriceNumSum(item.detailList) }}</td>
            <td>{{ getSum(item.detailList, 'cubicMeter') }}</td>
            <td />
            <td />
            <td />
            <td />
          </tr>
        </table>
        <div
          style="font-size: 14px;
        display: flex;
        margin-top: 20px;"
        >
          <div style="width: 140px">
            送货人：
          </div>
          <div style="width: 140px">
            物流商：
          </div>
          <div style="width: 140px">
            收货人：
          </div>
          <div style="width: 140px;">
            接收记账：
          </div>
        </div>
        <div
          style="margin-bottom: 20px;font-size: 14px;
        display: flex;
        margin-top: 20px;"
        >
          <div style="width: 140px">
            IQC：
          </div>
          <div style="width: 140px">
            仓管员：
          </div>
          <div style="width: 140px;">
            入库记账：
          </div>
          <div style="width: 140px;" />
        </div>
        <div style="font-size: 12px;">
          五联单：①存根 白色；②记账 红色；③财务 蓝色；④品管 绿色；⑤供应商回单 黄色
        </div>
        <div
          v-if="item.srmOrderDeliverOrder.lineOrderType !== '客直'"
          style="font-size: 12px;"
        >
          六联单：第①联供应商留存；第②联财务留存；第③联结算留存；第④联物流商留存；第⑤联RDC留存；第⑥联仓库留存
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
export default {
  props: {
    list: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      form: {
        time: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },
  watch: {
    list: {
      handler (val) {
        console.log(val)
      },
      immediate: true,
      deep: true
    }
  },
  created () {
  },
  methods: {
    getSum (val, type) {
      let sum = 0
      val.forEach(item => sum += item[type])
      return sum
    },
    getPriceNumSum (val) {
      let finalResult = ''
      const tempSum = val.reduce((sum, item) => {
        sum = window._plus(sum, item.pieceNum)
        return sum
      }, 0)
      // 整数的话用整数,不是整数的话: 1. 接近整数的视为整数 2. 不接近整数的保持原样
      if (String(tempSum).indexOf('.') > -1) {
        const ceilNum = Math.ceil(tempSum)
        if ((ceilNum - tempSum) <= 0.02) {
          finalResult = ceilNum
        } else {
          finalResult = tempSum.toFixed(2)
        }
      } else {
        finalResult = tempSum
      }
      return finalResult
    }
  }
}
</script>

<style media="print">
  @page {
    size: auto;
    margin: 3mm;
  }
  html {
    background-color: #ffffff;
    margin: 0px;
  }
  body {
    border: solid 1px #ffffff;
  }
</style>
<style lang="less" scoped>
  @media print {
    #printView {
      display: block;
      width: 100%;
      overflow: hidden;
    }
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
  }
  .print-div {
    page-break-after: always; /* 保证下一个单据从下一页开始 */
  }
</style>
