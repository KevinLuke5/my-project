<template>
  <div>
    <j-dialog
      title="送货单"
      :visible.sync="detailVisible"
      :modal="false"
      :before-close="close"
      :fullscreen="true"
    >
      <j-form
        ref="form"
        :model="detailForm"
        :disabled="true"
        label-width="120px"
      >
        <j-form-item label="送货单号">
          <j-input v-model="detailForm.deliverGoodsNo" />
        </j-form-item>
        <j-form-item label="送货单条码">
          <j-input v-model="detailForm.deliverGoodsCode" />
        </j-form-item>
        <j-form-item label="要货计划单号">
          <j-input v-model="detailForm.demandPlanNo" />
        </j-form-item>
        <j-form-item label="提货日期">
          <j-date-picker v-model="detailForm.pickUpTime" type="datetime" value-format="yyyy-MM-dd" />
        </j-form-item>
        <j-form-item label="供应商编码">
          <j-input v-model="detailForm.supplierCode" />
        </j-form-item>
        <j-form-item label="供应商名称">
          <j-input v-model="detailForm.supplierName" />
        </j-form-item>
        <j-form-item label="产品线">
          <j-input v-model="detailForm.lineName" />
        </j-form-item>
        <j-form-item label="供应商地点">
          <j-input v-model="detailForm.supplierLocation" />
        </j-form-item>
        <j-form-item label="本次发货总量">
          <j-input v-model="detailForm.thisDeliverSum" />
        </j-form-item>
        <j-form-item label="订单行类型">
          <j-input v-model="detailForm.lineOrderType" />
        </j-form-item>
        <j-form-item label="库存组织">
          <j-input v-model="detailForm.inventoryOrganization" />
        </j-form-item>
        <j-form-item label="收货供应商">
          <j-input v-model="detailForm.receivingSupplier" />
        </j-form-item>
        <j-form-item label="收货供应商地址">
          <j-input v-model="detailForm.receivingSupplierAddress" />
        </j-form-item>
        <j-form
          ref="estimatedArrivalTimeForm"
          :model="detailForm"
          class="form-inline"
          :rules="rules"
          :disabled="detailForm.status !== 0"
          label-width="120px"
        >
          <j-form-item label="预计到货日期" prop="estimatedArrivalTime">
            <j-date-picker
              v-model="detailForm.estimatedArrivalTime"
              type="date"
              :picker-options="pickerDate"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
            />
          </j-form-item>
        </j-form>
        <j-form-item label="创建时间">
          <j-date-picker v-model="detailForm.crtTime" type="datetime" placeholder="选择日期时间" />
        </j-form-item>
        <j-form
          ref="logisticsCompanyForm"
          :model="detailForm"
          class="form-inline"
          :rules="rules"
          :disabled="detailForm.status !== 0"
          label-width="120px"
        >
          <j-form-item label="物流公司" prop="logisticsCompany">
            <j-input v-model="detailForm.logisticsCompany" />
          </j-form-item>
        </j-form>
        <j-form-item label="状态">
          <j-input v-model="formStatus" />
        </j-form-item>
        <j-form-item label="" />
      </j-form>
      <div v-if="detailForm.status === 0" class="manage">
        <div class="details-button box-button">
          <j-button v-check="'deliverGoods'" size="small" @click="delivery()">
            发货
          </j-button>
        </div>
      </div>
      <div v-else-if="detailForm.status === 3 && showButton">
        <div class="manage">
          <div class="details-button box-button">
            <j-button
              v-print="print"
              v-check="'print'"
              size="small"
              @click="detailAdd()"
            >
              送货单打印
            </j-button>
          </div>
        </div>
      </div>
      <div v-else>
        <div v-if="userPermissions && showButton" class="manage">
          <div class="details-button">
            <j-button
              v-print="print"
              v-check="'print'"
              size="small"
              type="primary"
              @click="detailAdd()"
            >
              送货单打印
            </j-button>
          </div>
          <div class="details-button box-button">
            <j-button
              v-check="'batchCreatBoxCode'"
              size="small"
              :disabled="isClick"
              @click="boxCodeApplication()"
            >
              箱码申请
            </j-button>
          </div>
        </div>
        <div v-else class="manage">
          <div v-if="showButton" class="details-button box-button">
            <j-button
              v-check="'print'"
              v-print="print"
              size="small"
              @click="detailAdd()"
            >
              送货单打印
            </j-button>
          </div>
        </div>
      </div>
      <!-- 表格 -->
      <j-table
        ref="multipleTable"
        :data="tableData"
        size="small"
        :height="height"
        style="width: 100%"
        tooltip-effect="dark"
        highlight-current-row
      >
        <j-table-column prop="orderCode" label="订单号" />
        <j-table-column prop="lineNum" label="订单行" />
        <j-table-column prop="workOrderNo" label="工单号" />
        <j-table-column prop="lineRemark" label="行备注" />
        <j-table-column prop="purchaseGoodsCode" label="物料编码" />
        <j-table-column prop="goodsName" label="物料名称" />
        <j-table-column prop="unit" label="单位" />
        <j-table-column prop="orderNum" label="订单数量" />
        <j-table-column prop="orderDelivery" label="订单交期" />
        <j-table-column prop="thisDeliveryNum" label="本次送货数量" />
        <j-table-column prop="cubicMeter" label="方数" />
        <j-table-column prop="pieceNum" label="件数" />
        <j-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            <j-input v-model="scope.row.remark" :disabled="detailForm.status !== 0" @blur="changeRemark(scope.row)" />
          </template>
        </j-table-column>
        <j-table-column prop="receiveNum" label="已接收量" />
      </j-table>
      <div class="page">
        <j-pagination
          :current-page="currentPage"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tablePage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </j-dialog>
    <!-- 箱码申请 -->
    <j-dialog :visible.sync="boxVisible" width="800px" :before-close="boxClose">
      <div class="title">
        送货单号：{{ detailForm.deliverGoodsNo }}
      </div>
      <div class="button">
        <j-button
          class="boxapply"
          type="primary"
          size="medium"
          @click="boxApply"
        >
          箱码申请
        </j-button>
        <j-button class="boxsearch" size="medium" @click="gotobox">
          箱码查询
        </j-button>
      </div>
      <j-table
        ref="multipleTable"
        :data="boxData"
        size="small"
        @selection-change="handleSelectionChange"
      >
        <j-table-column
          type="selection"
          fixed
          :selectable="selectable"
          width="55"
        />
        <j-table-column prop="purchaseGoodsCode" label="物料编码" />
        <j-table-column prop="goodsName" label="物料名称" />
        <j-table-column prop="thisDeliveryNum" label="本次送货量" />
        <j-table-column prop="isGenerate" label="箱码生成">
          <template slot-scope="scope">
            {{ scope.row.isGenerate === 0 ? 'N' : 'Y' }}
          </template>
        </j-table-column>
        <j-table-column
          prop="generateTime"
          width="200"
          label="生产日期"
          :render-header="renderHeader"
        >
          <template slot-scope="scope">
            <j-date-picker
              v-model="scope.row.generateTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期时间"
            />
          </template>
        </j-table-column>
        <j-table-column prop="box" label="单箱容量" :render-header="renderHeader">
          <template slot-scope="scope">
            <j-input
              v-model="scope.row.box"
              @input="scope.row.box=scope.row.box.replace(/^(0+)|[^\d]+/g,'')"
            />
          </template>
        </j-table-column>
        <j-table-column prop="generateType" label="生产线别" :render-header="renderHeader">
          <template slot-scope="scope">
            <j-input
              v-model="scope.row.generateType"
              @input="scope.row.generateType=scope.row.generateType.replace(/^(0+)|[^\d]+/g,'')"
            />
          </template>
        </j-table-column>
      </j-table>
    </j-dialog>
    <!-- 打印 -->
    <div v-show="print.isPrint" id="printArea" ref="prints">
      <print :list="printList" />
    </div>
  </div>
</template>

<script>
import { getDeliverOrderDetail, printCount, deliverGoods, batchCreatBoxCode, updateDeliverOrderDetail } from '@/api/deliveryManage/noteQuery'
import print from '@/views/deliveryManage/components/print'

export default {
  components: {
    print
  },
  props: {
    showButton: {
      type: Boolean,
      default () {
        return true
      }
    },
    detailVisible: Boolean,
    detailForm: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    const fields = {
      code: '代码',
      codeName: '代码名称',
      status: '状态'
    }
    return {
      pickerDate: {
        disabledDate: time => {
          return time.getTime() < new Date().getTime() - 60 * 60 * 24 * 1000
        }
      },
      rules: {
        estimatedArrivalTime: [
          { required: true, message: '请输入预计到货日期', trigger: 'blur' }
        ],
        logisticsCompany: [
          { required: true, message: '请输入物流公司', trigger: 'blur' }
        ]
      },
      print: {
        isPrint: false,
        id: 'printArea',
        popTitle: '打印', // 打印配置页上方标题
        extraHead: '', // 最上方的头部文字，附加在head标签上的额外标签,使用逗号分隔
        preview: '', // 是否启动预览模式，默认是false（开启预览模式，可以先预览后打印）
        previewTitle: '', // 打印预览的标题（开启预览模式后出现）,
        previewPrintBtnLabel: '', // 打印预览的标题的下方按钮文本，点击可进入打印（开启预览模式后出现）
        zIndex: '', // 预览的窗口的z-index，默认是 20002（此值要高一些，这涉及到预览模式是否显示在最上面）
        previewBeforeOpenCallback () {}, // 预览窗口打开之前的callback（开启预览模式调用）
        previewOpenCallback () {}, // 预览窗口打开之后的callback（开启预览模式调用）
        beforeOpenCallback () {}, // 开启打印前的回调事件
        openCallback () {}, // 调用打印之后的回调事件
        closeCallback () {
          this.isPrint = false
        }, // 关闭打印的回调事件（无法确定点击的是确认还是取消）
        url: '',
        standard: '',
        extraCss: ''
      },
      data: [],
      boxData: [],
      boxVisible: false,
      userPermissions: false,
      total: 0,
      fields,
      height: null,
      tableData: [],
      selectList: [],
      codeId: '',
      pageSize: 15,
      currentPage: 1,
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      status: '',
      formStatus: '',
      multipleSelection: [],
      isClick: false,
      printList: []
    }
  },
  watch: {
    detailForm (val) {
      if (val.deliverGoodsNo) {
        // this.detailForm.status = 1
        this.getDetailTable(val.deliverGoodsNo)
      }
      this.status = val.status
    },
    status (val) {
      if (val || val === 0) {
        val === 0 ? this.formStatus = '待发货' : val === 1 ? this.formStatus = '已发货' : val === 2 ? this.formStatus = '已完成' : this.formStatus = '已取消'
      }
    }
  },
  mounted () {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    const userType = userInfo.userType
    if (userType === 'E') {
      this.userPermissions = false
      // this.userPermissions = true
    } else {
      this.userPermissions = true
    }
    this.height = this.getHeight()
  },
  methods: {
    // 复选框禁用
    selectable (row, rowIndex) {
      if (row.isGenerate === 1) {
        return false  // 禁用
      } else {
        return true  // 不禁用
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    renderHeader (h, { column }) {
      return h('div', [
        h('div', {
          style: 'color: red; display: inline-block;'
        }, [
          h('span', '*')
        ]),
        h('span', column.label)
      ])
    },
    /**
     * 修改备注
    */
    changeRemark (row) {
      updateDeliverOrderDetail({ id: row.id, remark: row.remark }).then(res => {
        if (res.code === '0') {
          this.$message.success('编辑成功！')
        }
      })
    },
    /**
     * 补零
    */
    createZero (n) {
      if (n.length === 2) {
        return '0' + n
      } else if (n.length === 1) {
        return '00' + n
      }
      return n
    },
    /**
     * 发货
    */
    delivery () {
      if (!this.detailForm.estimatedArrivalTime) {
        this.$message.warning('预计到货日期必填')
        return
      }
      if (!this.detailForm.logisticsCompany) {
        this.$message.warning('物流公司必填')
        return
      }
      this.detailForm.estimatedArrivalTime = this.detailForm.estimatedArrivalTime + ' 23:59:59'
      deliverGoods(this.detailForm).then(res => {
        if (res.code === '0') {
          this.$message.success('发货成功!')
          this.detailVisible = false
          this.$emit('detailClose')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    /**
     * 箱码申请
    */
    boxApply () {
      if (this.multipleSelection.length) {
        const that = this
        const boxData = []
        this.multipleSelection.forEach(item => {
          if (item.generateTime && item.generateTime.length < 19) {
            item.generateTime = item.generateTime + ' 23:59:59'
          }
          if (item.generateType) {
            item.generateType = that.createZero(item.generateType + '')
            this.$set(this.multipleSelection, 'generateType', item.generateType)
          }
          boxData.push(item)
        })
        const generateTime = []
        const box = []
        const generateType = []
        let generateTimeNum = 0
        let boxNum = 0
        let generateTypeNum = 0
        boxData.forEach(item => {
          generateTime.push(item.generateTime)
          box.push(item.box)
          generateType.push(item.generateType)
        })
        generateTime.forEach(item => {
          if (item === '' || item === null) {
            generateTimeNum++
          }
        })
        box.forEach(item => {
          if (item === '' || item === null) {
            boxNum++
          }
        })
        generateType.forEach(item => {
          if (item === '' || item === null) {
            generateTypeNum++
          }
        })
        // eslint-disable-next-line no-empty
        if (boxNum === 0 && generateTimeNum === 0 && generateTypeNum === 0) {

        } else {
          this.$message({
            showClose: true,
            message: '箱码申请不能有空项',
            type: 'warning'
          })
          return
        }
        const params = {
          srmOrderDeliverOrder: this.detailForm,
          detailList: boxData
        }
        batchCreatBoxCode(params).then(res => {
          if (res.code === '0') {
            this.$message.success('箱码申请成功，请在箱码查询中查看与打印!')
            const param = {
              deliverGoodsNo: this.detailForm.deliverGoodsNo,
              status: 2
            }
            getDeliverOrderDetail(param).then((res) => {
              if (res.code === '0') {
                this.boxData = res.data.detailList
              }
            })
          } else {
            this.$message.warning(res.message)
          }
        })
      } else {
        this.$message.warning('请选择需要箱码申请的数据')
      }
    },
    /**
     * 箱码查询跳转
    */
    gotobox () {
      const orderNo = this.detailForm.deliverGoodsNo
      this.$router.push(`/deliveryManage/boxCode?orderNo=${orderNo}`)
    },
    /**
     * 打印
    */
    detailAdd () {
      this.print.isPrint = true
      const params = []
      params.push(this.detailForm.id)
      printCount(params).then((res) => {
        if (res.code === '0') {
          console.log(res)
        }
      })
    },
    boxCodeApplication () {
      const params = {
        deliverGoodsNo: this.detailForm.deliverGoodsNo,
        status: 2
      }
      getDeliverOrderDetail(params).then((res) => {
        if (res.code === '0') {
          this.boxData = res.data.detailList
        }
      })
      this.boxVisible = true
    },
    boxClose () {
      this.boxVisible = false
    },
    handleSizeChange: function (size) {
      this.tablePage.pageSize = size
      this.currentPage = 1
      this.initTable(1)
    },
    handleCurrentChange: function (currentPage) {
      this.tablePage.pageNum = currentPage
      this.initTable(currentPage)
    },
    getDetailTable (id) {
      this.printList = []
      const params = {
        deliverGoodsNo: id,
        status: 1
      }
      getDeliverOrderDetail(params).then((res) => {
        if (res.code === '0') {
          this.printList.push(res.data)
          this.tableData = res.data.detailList
          this.tablePage.total = res.data.detailList.length
          const code = this.tableData.map(item => item.purchaseGoodsCode.toString().substr(0, 1))
          let num = 0
          code.forEach(item => {
            if (item === '1') {
              num++
            }
          })
          if (num === code.length) {
            this.isClick = true
          } else {
            this.isClick = false
          }
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
.manage {
  width: 100%;
  height: 100%;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  .manage-form {
    width: 100%;
    margin: 5px 15px;
    height: auto;
    .content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .content-item {
        width: 33%;
        display: flex;
        margin: 8px 0;
        span:first-child {
          width: auto;
          margin-right: 8px;
        }
        span:last-child {
          flex: 1;
        }
      }
    }
  }
  .details-button {
    position: absolute;
    right: 145px;
    margin-top: -5px;
  }
  .box-button {
    right: 40px;
  }
  .manage-table-btn {
    width: 100%;
    padding: 0 12px;
    span {
      display: inline-block;
      width: auto;
      height: 34px;
      line-height: 34px;
      margin-right: 16px;
      font-style: 16px;
      font-weight: 600;
    }
  }
}
.page {
  margin-top: 40px;
}
.el-form {
  text-align: center;
}
.el-form-item {
  width: 34%;
  display: inline-block;
  margin-bottom: 10px;
}
.el-date-editor {
  width: 100%;
}
.button {
  text-align: right;
  margin-bottom: 30px;
}
.form-inline {
  display: inline;
}


/deep/ input::-webkit-outer-spin-button,
/deep/ input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
/deep/ input[type='number'] {
  -moz-appearance: textfield !important;
}
</style>
