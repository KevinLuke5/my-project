<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-form
        class="head-container"
        size="mini"
        :inline="true"
        label-position="left"
        label-width="5.3125rem"
        :model="query"
      >
        <j-form-item label="产品线">
          <j-select
            v-model="query.lineCode"
            filterable
            clearable
            multiple
            :collapse-tags="true"
          >
            <j-option
              v-for="item in pdtLineList"
              :key="item.id"
              :label="item.name"
              :value="item.lineId"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="要货计划单号">
          <j-input v-model="query.purchasePlanNo" placeholder="输入要货计划单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="发布日期">
          <j-date-picker
            v-model="releaseTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item label="物料">
          <j-input v-model="query.goodsCode" placeholder="请输入物料编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="库存组织">
          <j-select
            v-model="query.inventoryOrganizationCode"
            filterable
            clearable
            multiple
            :collapse-tags="true"
          >
            <j-option
              v-for="item in queryList"
              :key="item.id"
              :label="item.orgName"
              :value="item.orgCode"
            />
          </j-select>
        </j-form-item>
        <div class="btn">
          <div>
            <j-button v-check="'demandCreateDeliver'" type="primary" @click="generateDeliveryPreview">
              生成送货单预览
            </j-button>
          </div>
          <j-form-item class="btn-group" style="margin-bottom: 0">
            <j-button v-check="'getDemandList'" type="primary" @click="initTable(1)">
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button v-check="'exportDemandList'" @click="handleExport">
              导出
            </j-button>
          </j-form-item>
        </div>
      </j-form>

      <j-table
        :data="tableData"
        style="width: 100%"
        :height="height"
        size="mini"
        highlight-current-row
        @selection-change="handleSelectionChange"
      >
        <j-table-column
          type="selection"
          width="55"
          :selectable="selectable"
          fixed
        />
        <j-table-column prop="lineName" label="产品线" />
        <j-table-column prop="documentType" label="单据类型" />
        <j-table-column prop="demandPlanNo" label="要货计划单号" width="120" />
        <j-table-column prop="goodsCode" label="物料编码" width="120" />
        <j-table-column prop="goodsName" label="物料名称" width="300" />
        <j-table-column prop="unit" label="单位" width="50" />
        <j-table-column
          prop="pickUpTime"
          label="提货日期"
          align="center"
          width="120"
        />
        <j-table-column prop="demandNum" label="要货量" align="center" />
        <j-table-column prop="receiveNum" label="接收量" align="center" />
        <j-table-column prop="transitNum" label="在途量" align="center" />
        <j-table-column prop="closeNum" label="关闭量" align="center" />
        <j-table-column prop="waitDeliveryNum" width="100">
          <template slot="header" slot-scope="{}">
            <span>待发货量</span>
            <j-tooltip effect="dark" placement="top">
              <i class="el-icon-question" />
              <div slot="content">
                <p>待发货量=订单量-在途量-净接收量-关闭量</p>
              </div>
            </j-tooltip>
          </template>
        </j-table-column>
        <j-table-column prop="thisRetreatNum" label="本次发货量">
          <template slot-scope="scope">
            <j-link v-show="!scope.row.changing" @click="numInputShow(scope.row, scope.$index)">
              {{ scope.row.thisRetreatNum }}
            </j-link>
            <j-input-number
              v-show="scope.row.changing"
              :ref="'numInput' + scope.$index"
              v-model="scope.row.thisRetreatNum"
              style="width: 80px"
              :controls="false"
              :precision="0"
              :min="0"
              :max="scope.row.waitDeliveryNum"
              size="mini"
              @blur="inputDone(scope.row)"
              @change="inputDone(scope.row)"
            />
          </template>
        </j-table-column>
        <j-table-column prop="orderNum" label="订单量" />
        <j-table-column prop="releaseTime" label="发布日期" width="90" />
        <j-table-column prop="inventoryOrganization" label="库存组织" width="120" />
      </j-table>
      <div class="page">
        <j-pagination
          :current-page="currentPage"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="tablePage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tablePage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </j-card>
    <!-- 生成送货单预览 -->
    <!-- <generateDelivery
      ref="generateDelivery"
      :detail-visible="generateDeliveryVisible"
      :detail-form="generateDeliveryForm"
      @detailClose="generateDeliveryClose"
    /> -->
  </div>
</template>

<script>
import { changeTime } from '../../../utils/timeStyle'
import * as deliveryApi from '@/api/deliveryManage/plan'
import * as supplierApi from '@/api/supplier/pool'
import * as baseApi from '@/api/base/personOrg'
import { getCodeList } from '@/views/common/dic'
// import generateDelivery from '@/views/deliveryManage/components/generateDelivery'

export default {
  // components: { generateDelivery },
  name: 'GenerateDeliveryOrder',
  props: {
  },
  data () {
    return {
      currentPage: 1,
      queryList: [],
      pdtLineList: [],
      // generateDeliveryVisible: false,
      detailVisible: false,
      releaseTime: [],
      query: {
        lineCode: '',
        purchasePlanNo: '',
        goodsCode: '',
        inventoryOrganizationCode: '',
        startReleaseTime: '',
        endReleaseTime: ''
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      aimList: [],
      checkVisible: false,
      checkForm: {
        rejectReason: ''
      },
      generateDeliveryForm: {
        code: '',
        codeName: '',
        status: ''
      },
      multipleSelection: [],
      newSelection: []
    }
  },
  watch: {
    releaseTime (val) {
      if (val && val.length > 0) {
        this.query = Object.assign(this.query, changeTime(val, 'startReleaseTime', 'endReleaseTime'))
      }
    }
  },
  created () {
    this.getQuery()
    this.initTable(1)
    this.getPdtLineList()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    // 复选框禁用
    selectable (row, rowIndex) {
      if (row.documentType === 'SY' || row.documentType === 'SYJ') {
        return false  // 禁用
      } else {
        return true  // 不禁用
      }
    },
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
      console.log(row)
      row.changing = false
    },
    /**
     * 发货量改变
    */
    changeThisRetreatNum (e) {
      const id = e.id
      const key = e.thisRetreatNum - 0
      deliveryApi.updateDemandOrder({
        [id]: key
      }).then(res => {
        if (res.code === '0') {
          this.$message.success('编辑成功！')
        }
      })
    },
    // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.tablePage.pageSize = size
      this.currentPage = 1
      this.initTable(1)
    },
    handleCurrentChange: function (currentPage) {
      this.tablePage.pageNum = currentPage
      this.initTable(currentPage)
    },
    /**
     * 获取库存组织下拉框
    */
    getQuery () {
      const params = {
        page: 1,
        size: 500
      }
      baseApi.getQuery(params).then(res => {
        this.queryList = res.data.records
      })
    },
    /**
     * 获取产品线下拉
    */
    getPdtLineList () {
      supplierApi.getPdtLineList().then(res => {
        this.pdtLineList = res.data.records
      })
    },
    generateDeliveryPreview () {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('要货计划不能为空，请选择要货计划')
      } else {
        const params = {}
        let isReturn = false
        // 将物料编码一致的数据的本次发货量相加变成新数据
        const list = this.multipleSelection.reduce((obj, item) => {
          const find = obj.find(i => i.goodsCode === item.goodsCode)
          const _d = {
            ...item
          }
          find ? find.thisRetreatNum += item.thisRetreatNum : obj.push(_d)
          return obj
        }, [])
        console.log(list)
        list.every(item => {
          if (item.thisRetreatNum > item.orderNum) {
            this.$message.warning(`物料编码：${item.goodsCode},本次发货量>订单量,请检查订单是否没确认！`)
            isReturn = true
            return false
          } else {
            return true
          }
        })
        if (!isReturn) {
          this.multipleSelection.forEach(item => {
            params[item.id] = item.thisRetreatNum
          })
          deliveryApi.demandCreateDeliver(params).then(res => {
            if (res && res.code === '0') {
              this.initTable(1)
              this.$router.push('/deliveryManage/deliveryNoteQuery/index')
            } else {
              this.showMessage(res.message)
            }
          })
        }
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    generateDeliveryClose () {
      this.generateDeliveryVisible = false
    },
    detailClose () {
      this.detailVisible = false
    },
    getSelectData () {
      getCodeList('code00022').then((list) => {
        this.aimList = list
      })
    },
    handleExport () {
      if (this.query.lineCode.length > 0) {
        this.query.lineCode = this.query.lineCode.join(',')
      }
      if (this.query.inventoryOrganizationCode.length > 0) {
        this.query.inventoryOrganizationCode = this.query.inventoryOrganizationCode.join(',')
      }
      // let params = {
      //   // id: this.ids.join(',')
      //   exportStatus: 1
      // }
      // let data = Object.assign(this.query, params)
      deliveryApi.exportDemandList(this.query)
      if (this.query.lineCode.length > 0) {
        this.query.lineCode = this.query.lineCode.split(',')
      }
      if (this.query.inventoryOrganizationCode.length > 0) {
        this.query.inventoryOrganizationCode = this.query.inventoryOrganizationCode.split(',')
      }
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      if (this.query.lineCode.length > 0) {
        this.query.lineCode = this.query.lineCode.join(',')
      }
      if (this.query.inventoryOrganizationCode.length > 0) {
        this.query.inventoryOrganizationCode = this.query.inventoryOrganizationCode.join(',')
      }
      const params = Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum
      })
      deliveryApi.getDemandList(params)
        .then((res) => {
          if (this.query.lineCode.length > 0) {
            this.query.lineCode = this.query.lineCode.split(',')
          }
          if (this.query.inventoryOrganizationCode.length > 0) {
            this.query.inventoryOrganizationCode = this.query.inventoryOrganizationCode.split(',')
          }
          if (res.code === '0' && res.data) {
            this.tableData = res.data.records.map((row) => {
              row.changing = false
              return row
            })
            this.tablePage.total = res.data.total
            this.loading = false
          } else {
            this.showMessage(res.message)
          }
        })
    },
    resetQuery () {
      this.query = {
        lineCode: '',
        purchasePlanNo: '',
        goodsCode: '',
        inventoryOrganizationCode: '',
        startReleaseTime: '',
        endReleaseTime: ''
      }
      this.releaseTime = []
    }
  }
}
</script>
<style lang="less" scoped>
  .el-pagination {
    text-align: center;
  }
  .btn {
    display: flex;
    justify-content: space-between;
  }
</style>
