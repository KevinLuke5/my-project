<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-tabs v-model="activeName" @tab-click="tabClick">
        <j-tab-pane label="订单数据预警" name="a">
          <div style="margin-bottom: 10px">
            <j-button type="primary" @click="initTable(1, 1)">
              在途量核查
              <j-tooltip placement="top">
                <div slot="content">
                  <div v-html="tooltip.one" />
                </div>
                <i class="el-icon-question" />
              </j-tooltip>
            </j-button>
            <j-button type="primary" @click="initTable(1, 2)">
              已接收量核查
              <j-tooltip placement="top">
                <div slot="content">
                  <div v-html="tooltip.two" />
                </div>
                <i class="el-icon-question" />
              </j-tooltip>
            </j-button>
            <j-button type="primary" @click="initTable(1, 3)">
              退回量核查
              <j-tooltip placement="top">
                <div slot="content">
                  <div v-html="tooltip.three" />
                </div>
                <i class="el-icon-question" />
              </j-tooltip>
            </j-button>
            <j-button type="primary" @click="initTable(1, 4)">
              ERP入库量核查
              <j-tooltip placement="top">
                <div slot="content">
                  <div v-html="tooltip.four" />
                </div>
                <i class="el-icon-question" />
              </j-tooltip>
            </j-button>
            <j-button style="float: right" @click="handleExport">
              导出
            </j-button>
          </div>
        </j-tab-pane>
        <j-tab-pane label="订单未交量预警" name="b">
          <div style="margin-bottom: 10px">
            <j-button type="primary" @click="initTable(1, 5)">
              未交量核查
              <j-tooltip placement="top">
                <div slot="content">
                  <div v-html="tooltip.five" />
                </div>
                <i class="el-icon-question" />
              </j-tooltip>
            </j-button>
            <j-button style="float: right" @click="handleExport">
              导出
            </j-button>
          </div>
        </j-tab-pane>
        <j-tab-pane label="送货单状态预警" name="c">
          <div style="margin-bottom: 10px">
            <j-button type="primary" @click="initTable(1, 6)">
              送货单状态核查
              <j-tooltip placement="top">
                <div slot="content">
                  <div v-html="tooltip.six" />
                </div>
                <i class="el-icon-question" />
              </j-tooltip>
            </j-button>
            <j-button style="float: right" @click="handleExport">
              导出
            </j-button>
          </div>
        </j-tab-pane>
        <j-tab-pane label="要货计划单预警" name="d">
          <div style="margin-bottom: 10px">
            <j-button type="primary" @click="initTable(1, 7)">
              要货计划单“超量发货”核查
              <j-tooltip placement="top">
                <div slot="content">
                  <div v-html="tooltip.seven" />
                </div>
                <i class="el-icon-question" />
              </j-tooltip>
            </j-button>
            <j-button style="float: right" @click="handleExport">
              导出
            </j-button>
          </div>
        </j-tab-pane>
      </j-tabs>

      <!-- 数据表 -->
      <j-table
        ref="table"
        v-loading="loading"
        stripe
        header-bold
        size="small"
        :data="tableData"
        :height="height"
        style="width: 100%"
        tooltip-effect="dark"
      >
        <j-table-column
          v-if="['a','b'].includes(activeName)"
          key="id"
          prop="id"
          label="id"
        />
        <j-table-column
          v-if="['a','b'].includes(activeName)"
          key="planId"
          prop="planId"
          label="plan_id"
        />

        <!-- 送货单状态预警 -->
        <j-table-column
          v-if="['a','b'].includes(activeName)"
          key="id2"
          prop="id"
          label="送货单id"
        />

        <j-table-column
          v-if="activeName === 'd'"
          key="id3"
          prop="id"
          label="要货计划单id"
        />

        <j-table-column key="supplierCode" prop="supplierCode" label="供应商编码" />
        <j-table-column key="supplierName" prop="supplierName" label="供应商名称" />
        <j-table-column
          v-if="['a','b'].includes(activeName)"
          key="orderCode"
          prop="orderCode"
          label="订单号"
        />
        <j-table-column
          v-if="['a','b'].includes(activeName)"
          key="lineNum"
          prop="lineNum"
          label="行号"
        />
        <!-- 要货计划 -->
        <j-table-column
          v-if="status === 7"
          key="demandPlanNo"
          prop="demandPlanNo"
          label="要货计划单号"
        />
        <j-table-column
          v-if="status === 7"
          key="documentType"
          prop="documentType"
          label="单据类型"
        >
          <template slot-scope="scope">
            {{ typeDic[scope.row.documentType] }}
          </template>
        </j-table-column>
        <j-table-column
          v-if="status === 7"
          key="status1"
          prop="status"
          label="要货计划单状态"
        >
          <template slot-scope="scope">
            {{ sta7Dic[scope.row.status] }}
          </template>
        </j-table-column>

        <j-table-column
          v-if="['a','b','d'].includes(activeName)"
          key="goodsCode"
          prop="goodsCode"
          label="物料编码"
        />
        <j-table-column
          v-if="['a','b'].includes(activeName)"
          key="goodsName"
          prop="goodsName"
          label="物料名称"
        />

        <!-- 要货计划 -->
        <j-table-column
          v-if="status === 7"
          key="demandNum"
          prop="demandNum"
          label="要货数量"
        />

        <!-- 在途量 -->
        <j-table-column
          v-if="status === 1"
          key="transitNum"
          prop="transitNum"
          label="采购订单在途量"
        />
        <!-- 已接收量 -->
        <j-table-column
          v-if="status === 2"
          key="receiveNum"
          prop="receiveNum"
          label="采购订单已接收量"
        />
        <!-- 退回量 -->
        <j-table-column
          v-if="status === 3"
          key="waitRetreatNum"
          prop="waitRetreatNum"
          label="采购订单退回量"
        />
        <!-- ERP入库量 -->
        <j-table-column
          v-if="status === 4"
          key="erpStorageNum"
          prop="erpStorageNum"
          label="采购订单erp入库量"
        />
        <!-- status为1到4，7公用的字段 -->
        <j-table-column key="calculateNum" prop="calculateNum" :label="columnDic.calculateNum[status]" />
        <j-table-column key="beginNum" prop="beginNum" :label="columnDic.beginNum[status]" />

        <j-table-column
          v-if="activeName === 'a'"
          key="differenceNum"
          prop="differenceNum"
          label="差异量"
        />

        <j-table-column
          v-if="activeName === 'b'"
          key="unpaidNum"
          prop="unpaidNum"
          label="未交量"
        />

        <!-- 送货单状态预警 -->
        <j-table-column
          v-if="activeName === 'c'"
          key="deliverGoodsNo"
          prop="deliverGoodsNo"
          label="送货单号"
        />
        <j-table-column
          v-if="activeName === 'c'"
          key="status"
          prop="status"
          label="送货单状态"
        >
          <template slot-scope="scope">
            {{ staDic[scope.row.status] }}
          </template>
        </j-table-column>
        <j-table-column
          v-if="activeName === 'c'"
          key="waitDeliveryNum"
          prop="waitDeliveryNum"
          label="发货数量"
        />
        <j-table-column
          v-if="activeName === 'c'"
          key="receiveNum2"
          prop="receiveNum"
          label="接收数量"
        />

        <j-table-column key="inventoryOrganizationCode" prop="inventoryOrganizationCode" label="组织编码" />
        <j-table-column key="inventoryOrganization" prop="inventoryOrganization" label="组织名称" />
      </j-table>
      <div class="page">
        <j-pagination
          :current-page="tablePage.pageNum"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="tablePage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tablePage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </j-card>
  </div>
</template>

<script>
import { getOrderDataInspectPage, exportOrderDataInspect } from '@/api/purchaseOrder/report'
// import { arrayJoin } from '@/utils/index'

export default {
  name: 'WarnReport',
  data () {
    return {
      loading: false,
      activeName: 'a',
      typeDic: {
        'OEM': '直调',
        'JIT': 'JIT',
        'SY': '越库',
        'SYJ': '中转越库',
        'XT': '协同'
      },
      staDic: {
        0: '待发货',
        1: '已发货',
        2: '已完成',
        3: '已取消'
      },
      sta7Dic: {
        0: '待发货',
        1: '已完成'
      },
      // 点击tab初始化要查的状态
      tabToStatus: {
        a: 1,
        b: 5,
        c: 6,
        d: 7
      },
      // 按钮状态
      status: 1,
      // 公用字段的列名
      columnDic: {
        calculateNum: {
          1: '在途表数量',
          2: '接收明细已接收量',
          3: '事务明细退回量',
          4: '事务明细erp入库量',
          7: '发货数量'
        },
        beginNum: {
          1: '期初在途量',
          2: '期初已接收量',
          3: '期初退回量',
          4: '期初erp入库量'
        }
      },
      height: null,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      tooltip: {
        one: '在途量核查逻辑：<br/>1、组织+订单号+行号+采购物料编码，取唯一进行数据量汇总比较<br/>2、业务明细表的在途量=在途报表（本次送货量-实际接收量） + 待发货送货单（本次送货量）<br/>3、订单表的在途量=在途量<br/>4、比较算差异：差异量=订单表上“在途量”-业务明细表的“在途量”，不等于0的为异常，异常的数据展示出来<br/>',
        two: '已接收量核查逻辑：<br/>1、组织编码+订单号+行号+采购物料编码，取唯一进行数据量汇总比较<br/>2、期初数据：建表导入期初订单数据：plan_id、组织编码、订单号、行号、采购物料编码、已接收量、ERP入库量、退回量<br/>3、过程数据：已接收量=“送货单接收明细”表里的的“实际接收量”之和<br/>4、比较算差异：差异量=订单表上“已接收量”-期初数据的“已接收量”-过程数据的“已接收量”，不等于0的为异常，异常的数据展示出来<br/>',
        three:
          '退回量核查逻辑：<br/>1、组织编码+订单号+行号+采购物料编码，取唯一进行数据量汇总比较<br/>2、期初数据：建表导入期初订单数据：plan_id、组织编码、订单号、行号、采购物料编码、已接收量、ERP入库量、退回量<br/>3、过程数据：退回量=“采购订单事务明细查询”表里的“事务类型=退货”事务数量之和（不管送货单号的位数）<br/>4、比较算差异：差异量=订单表上“退回量”-期初数据的“退回量”-过程数据里的“退回量”，不等于0的为异常，异常的数据展示出来<br/>',
        four: 'ERP入库量核查逻辑：<br/>1、组织编码+订单号+行号+采购物料编码，取唯一进行数据量汇总比较<br/>2、期初数据：建表导入期初订单数据：plan_id、组织编码、订单号、行号、采购物料编码、已接收量、ERP入库量、退回量<br/>3、过程数据：ERP入库量=“采购订单事务明细查询”表里的“事务类型=入库”且送货单号位数为12位事务数量之和<br/>4、比较算差异：差异量=订单表上“ERP入库量”-期初数据的“ERP入库量”-过程数据里的“ERP入库量”，不等于0的为异常，异常的数据展示出来<br/>',
        five: '未交量核查逻辑：<br/>1、采购订单表：未交量=订单量-（已接收-退回量）-在途量<0的为异常，异常的数据展示出来',
        six: '送货单状态核查逻辑：找出已经完成收货，但状态还未更新成“已完成”的送货单<br/>1、送货单明细表：同一个送货单的明细行发货数量之和<br/>2、送货单接收明细表：同一个送货单的明细行接收数量和关闭数量之和',
        seven: '要货计划单“超量发货”核查逻辑：找出超量发货的要货计划（发货数量>要货数量）<br/>1、要货计划单查询（要货量）：要货计划单号+物料编码<br/>2、送货单查询与打印（本次送货数量）：要货计划单号关联的所有“送货单，送货单明细”+物料编码'
      }
    }
  },
  created () {
    this.initTable(1, 1)
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    tabClick (tab) {
      this.initTable(1, this.tabToStatus[tab.name])
    },
    handleSizeChange (size) {
      this.tablePage.pageSize = size
      this.tablePage.pageNum = 1
      this.initTable(1)
    },
    handleCurrentChange (currentPage) {
      this.tablePage.pageNum = currentPage
      this.initTable(currentPage)
    },
    formatParams (nopage) {
      const params = Object.assign(
        {
          dataInspectStatus: parseInt(this.status)
        },
        nopage
          ? {}
          : { page: this.tablePage.pageNum, size: this.tablePage.pageSize }
      )
      return params
    },
    handleExport () {
      if (!this.tableData.length) {
        this.$message.warning('列表无数据，无法导出')
        return
      }
      exportOrderDataInspect(this.formatParams(true))
    },
    initTable (page, status) {
      this.loading = true
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.status = status
      getOrderDataInspectPage(this.formatParams())
        .then((res) => {
          if (res.code === '0' && res.data) {
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
          }
        })
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="less" scoped>
.el-pagination {
  text-align: center;
}
</style>
