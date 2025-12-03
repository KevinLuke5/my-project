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
        <j-form-item label="供应商">
          <j-input v-model="query.supplierCode" placeholder="请输入供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="创建日期">
          <j-date-picker
            v-model="mdTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item label="送货单状态">
          <j-select v-model="query.status" clearable>
            <j-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.lable"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="送货单号">
          <j-input v-model="query.deliverGoodsNo" placeholder="输入送货单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="订单行类型">
          <j-select v-model="query.orderType" clearable>
            <j-option
              v-for="item in orderTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="要货计划单号">
          <j-input v-model="query.demandPlanNo" placeholder="输入要货计划单号模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="收货仓">
          <j-input v-model="query.warehouseName" placeholder="输入收货仓模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <div class="btn">
          <div>
            <button
              v-show="false"
              ref="printBtn"
              v-print="print"
              type="primary"
            >
              打印
            </button>
            <j-button type="primary" @click="detailAdd">
              送货单打印
            </j-button>
            <j-button v-check="'deliveryNoteQuery-deliverGoodsBatch'" type="primary" @click="batchSend">
              批量发货
            </j-button>
          </div>
          <j-form-item class="btn-group" style="margin-bottom: 0">
            <j-button v-check="'getOrderDeliver'" type="primary" @click="initTable(1)">
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button v-check="'deliveryNoteQuery-export'" @click="handleExport">
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
        <j-table-column type="selection" width="55" :selectable="selectable" />
        <j-table-column prop="inventoryOrganization" label="库存组织" />
        <j-table-column prop="deliverGoodsNo" width="110" label="送货单号">
          <template slot-scope="scope">
            <j-link @click="openDeliver(scope.row)">
              {{ scope.row.deliverGoodsNo }}
            </j-link>
          </template>
        </j-table-column>
        <j-table-column prop="status" label="状态">
          <template slot-scope="scope">
            {{ scope.row.status === 0 ? '待发货' : scope.row.status === 1 ? '已发货' : scope.row.status === 2 ? '已完成' : '已取消' }}
          </template>
        </j-table-column>
        <j-table-column prop="deliverGoodsCode" label="送货单条码" width="120" />
        <j-table-column prop="supplierCode" label="供应商编码" />
        <j-table-column prop="supplierName" label="供应商名称" width="160" />
        <j-table-column prop="thisDeliverSum" label="本次发货总量" width="120" />
        <j-table-column prop="lineOrderType" label="订单行类型" />
        <j-table-column prop="demandPlanNo" label="要货计划单号" />
        <j-table-column prop="warehouseName" label="收货仓" />
        <j-table-column prop="receivingSupplier" label="收货供应商" width="130" />
        <j-table-column prop="receivingSupplierAddress" label="收货供应商地址" width="180" />
        <j-table-column prop="count" align="center" label="打印次数">
          <template slot-scope="scope">
            <div class="finger" @click="openTable(scope.row.prints)">
              {{ scope.row.count }}
            </div>
          </template>
        </j-table-column>
        <j-table-column prop="estimatedArrivalTime" label="预计到货日期" width="100" />
        <j-table-column prop="crtTime" label="创建时间" />
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
    <generateDelivery
      ref="generateDelivery"
      :detail-visible="generateDeliveryVisible"
      :detail-form="generateDeliveryForm"
      @detailClose="generateDeliveryClose"
    />
    <j-dialog :visible.sync="table" width="40%">
      <j-table :data="prints">
        <j-table-column label="打印人">
          <template slot-scope="scope">
            {{ (scope.row.printUser + ':' + scope.row.printCompany) }}
          </template>
        </j-table-column>
        <j-table-column property="crtTime" label="打印时间" />
      </j-table>
    </j-dialog>
    <!-- 打印 -->
    <div v-show="print.isPrint" id="printAreas" ref="printss">
      <print :list="printList" />
    </div>
    <!-- 批量发货 -->
    <j-dialog
      title="编辑"
      :visible.sync="sendVisible"
      :modal="false"
      :close-on-click-modal="false"
      :before-close="sendClose"
      width="500px"
    >
      <j-form
        ref="sendForm"
        :model="sendForm"
        class="form-inline"
        :rules="rules"
        label-width="120px"
      >
        <j-form-item label="预计到货日期" prop="estimatedArrivalTime">
          <j-date-picker
            v-model="sendForm.estimatedArrivalTime"
            type="date"
            :picker-options="pickerDate"
            value-format="yyyy-MM-dd"
            placeholder="选择日期时间"
          />
        </j-form-item>
        <j-form-item label="物流公司" prop="logisticsCompany">
          <j-input v-model="sendForm.logisticsCompany" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="sendClose">取消</j-button>
        <j-button type="primary" @click="sendSave">保存</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import { changeTime } from '../../../utils/timeStyle'
import * as deliveryApi from '@/api/deliveryManage/noteQuery'
import * as baseApi from '@/api/base/personOrg'
import generateDelivery from '@/views/deliveryManage/components/generateDelivery'
import print from '@/views/deliveryManage/components/print'
import Axios from 'axios'


export default {
  name: 'DeliveryNoteQuery',
  components: { generateDelivery, print },
  props: {
    type: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      printList: [],
      table: false,
      prints: [],
      generateDeliveryForm: {},
      generateDeliveryVisible: false,
      statusList: [
        {
          id: 0,
          lable: '待发货',
          value: 0
        },
        {
          id: 1,
          lable: '已发货',
          value: 1
        },
        {
          id: 2,
          lable: '已完成',
          value: 2
        },
        {
          id: 3,
          lable: '已取消',
          value: 3
        }
      ],
      print: {
        isPrint: false,
        id: 'printAreas',
        popTitle: '打印', // 打印配置页上方标题
        extraHead: '', // 最上方的头部文字，附加在head标签上的额外标签,使用逗号分隔
        preview: '', // 是否启动预览模式，默认是false（开启预览模式，可以先预览后打印）
        previewTitle: '', // 打印预览的标题（开启预览模式后出现）,
        previewPrintBtnLabel: '', // 打印预览的标题的下方按钮文本，点击可进入打印（开启预览模式后出现）
        zIndex: '', // 预览的窗口的z-index，默认是 20002（此值要高一些，这涉及到预览模式是否显示在最上面）
        previewBeforeOpenCallback () {
        }, // 预览窗口打开之前的callback（开启预览模式调用）
        previewOpenCallback () {}, // 预览窗口打开之后的callback（开启预览模式调用）
        beforeOpenCallback () {}, // 开启打印前的回调事件
        openCallback () {}, // 调用打印之后的回调事件
        closeCallback () {
          this.isPrint = false
        }, // 关闭打印的回调事件（无法确定点击的是确认还是取消）
        clickMounted () {
        },
        url: '',
        standard: '',
        extraCss: ''
      },
      queryList: [],
      mdTime: [],
      orderTypeList: [
        {
          id: 1,
          name: '客直',
          lineNumber: '1'
        },
        {
          id: 2,
          name: '维修',
          lineNumber: '2'
        },
        {
          id: 3,
          name: '常规',
          lineNumber: '3'
        },
        {
          id: 4,
          name: 'RDC',
          lineNumber: '4'
        },
        {
          id: 5,
          name: '出口',
          lineNumber: '5'
        },
        {
          id: 6,
          name: '试产',
          lineNumber: '6'
        }
      ],
      query: {
        inventoryOrganizationCode: '',
        status: '',
        deliverGoodsNo: '',
        orderType: '',
        supplierCode: '',
        startTime: '',
        endTime: '',
        demandPlanNo: '',
        warehouseName: ''
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      checkForm: {
        rejectReason: ''
      },
      multipleSelection: [],
      currentPage: 1,
      sendVisible: false,
      sendList: [],
      sendForm: {
        estimatedArrivalTime: '',
        logisticsCompany: ''
      },
      pickerDate: {
        disabledDate: time => {
          return time.getTime() < new Date().getTime() - 60 * 60 * 24 * 1000
        }
      },
      rules: {
        estimatedArrivalTime: [
          { required: true, message: '请输入预计到货日期', trigger: 'change' }
        ],
        logisticsCompany: [
          { required: true, message: '请输入物流公司', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    mdTime (val) {
      if (val && val.length > 0) {
        this.query = Object.assign(this.query, changeTime(val, 'startTime', 'endTime'))
      }
    }
  },
  created () {
    this.initTable(1)
    // this.getSelectData()
    this.getQuery()
  },
  activated () {
    this.initTable(1)
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    // 复选框禁用
    selectable (row, rowIndex) {
      // if (row.status === 0) {
      //   return false  // 禁用
      // } else {
      //   return true  // 不禁用
      // }
      return true
    },
    // 批量发货
    batchSend () {
      // 待发货状态不能打印
      const noSend = this.multipleSelection.some(item => item.status !== 0)
      if (noSend) {
        this.$message.warning('请选择待发货状态的送货单！')
        return
      }
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请选择需要发货的数据！')
        return
      } else {
        this.sendList = this.multipleSelection.map(item => ({
          id: item.id,
          estimatedArrivalTime: item.estimatedArrivalTime,
          logisticsCompany: item.logisticsCompany
        }))
        this.sendVisible = true
      }
    },
    sendSave () {
      this.$refs.sendForm.validate((valid) => {
        if (valid) {
          console.log(this.sendForm)
          this.sendList.forEach(item => {
            item.estimatedArrivalTime = this.sendForm.estimatedArrivalTime
            item.logisticsCompany = this.sendForm.logisticsCompany
          })
          console.log(this.sendList)
          deliveryApi.deliverGoodsBatch(this.sendList).then(res => {
            if (res.code === '0') {
              this.$message.success('发货成功!')
              this.sendClose()
              this.initTable()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    sendClose () {
      this.sendList = []
      this.sendForm = {
        estimatedArrivalTime: '',
        logisticsCompany: ''
      }
      this.sendVisible = false
    },
    /**
     * 打印
    */
    detailAdd () {
      this.printList = []
      console.log(this.multipleSelection)
      // 待发货状态不能打印
      const noPrint = this.multipleSelection.some(item => item.status === 0)
      if (noPrint) {
        this.$message.warning('有待发货送货单，请先发货再打印送货单！')
        return
      }
      const codes = this.multipleSelection.map(item => item.id)
      const params = this.multipleSelection.map(item => item.deliverGoodsNo)
      if (codes.length === 0) {
        this.$message.warning('请选择需要打印的数据！')
        console.log(this.print)
        return
      } else if (codes.length > 50) {
        this.$message.warning('同时打印数据不能大于50条！')
        return
      }
      console.log(codes)
      deliveryApi.printCount(codes).then((res) => {
        if (res.code === '0') {
          // console.log(res)
        }
      })
      const questList = []
      for (const item of params) {
        if (item) {
          const data = {
            deliverGoodsNo: item,
            status: 1
          }
          questList.push(deliveryApi.getDeliverOrderDetail(data))
        }
      }
      // 循环同一个接口拿到最后的参数进行处理
      Axios.all(questList).then(
        Axios.spread((...item) => {
          Array.from([...item]).forEach(item => {
            this.printList.push(item.data)
          })
          this.print.isPrint = true
          this.$refs.printBtn.click()
        })
      ).catch(err => {
        console.log(err.response)
      })

    },
    openTable (row) {
      this.prints = row
      this.table = true
    },
    generateDeliveryClose () {
      this.generateDeliveryVisible = false
      this.initTable()
    },
    generateDeliveryPreview () {
      this.generateDeliveryVisible = true
    },
    /**
     * 查看送货单
    */
    openDeliver (item) {
      this.printList = []
      console.log(item)
      this.generateDeliveryForm = item
      this.generateDeliveryVisible = true
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
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    getSelectData () {
      // getCodeList('code00023').then((list) => {
      //   this.categoryList = list
      // })
    },
    handleExport () {
      if (this.query.inventoryOrganizationCode.length > 0) {
        this.query.inventoryOrganizationCode = this.query.inventoryOrganizationCode.join(',')
      }
      deliveryApi.exportOrder(this.query)
      if (this.query.inventoryOrganizationCode.length > 0) {
        this.query.inventoryOrganizationCode = this.query.inventoryOrganizationCode.split(',')
      }
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      if (this.query.inventoryOrganizationCode.length > 0) {
        this.query.inventoryOrganizationCode = this.query.inventoryOrganizationCode.join(',')
      }
      const params = Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum
      })
      deliveryApi
        .getOrderDeliver(params)
        .then((res) => {
          if (this.query.inventoryOrganizationCode.length > 0) {
            this.query.inventoryOrganizationCode = this.query.inventoryOrganizationCode.split(',')
          }
          if (res.code === '0' && res.data) {
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
            this.loading = false
          }
        })
    },
    resetQuery () {
      this.query = {
        inventoryOrganizationCode: '',
        status: '',
        deliverGoodsNo: '',
        orderType: '',
        supplierCode: '',
        startTime: '',
        endTime: '',
        demandPlanNo: '',
        warehouseName: ''
      }
      this.mdTime = []
    }
  }
}
</script>
<style lang="less" scoped>
  .el-pagination {
    text-align: center;
  }
  #prints {
    display: none;
  }
  .finger {
    cursor: pointer;
  }
  .btn {
    display: flex;
    justify-content: space-between;
  }
</style>
