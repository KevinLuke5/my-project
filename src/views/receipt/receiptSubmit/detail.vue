<template>
  <j-dialog
    :title="'发票明细'"
    :visible.sync="visible"
    :before-close="close"
    fullscreen
  >
    <div class="dialog-header">
      <div style="margin-bottom: 10px;">
        <j-popconfirm title="确定要提交发票吗？" @confirm="handleConfirm">
          <j-button v-show="handleType === '0' || handleType === '2'" slot="reference" type="primary">
            提交
          </j-button>
        </j-popconfirm>
        <j-button v-show="handleType === '2'" type="primary" @click="reback">
          复核退回
        </j-button>
        <j-button @click="handleExport">
          导出
        </j-button>
      </div>
      <div v-show="handleType === '2'">
        <!-- 待复核 -->
        <j-form v-show="tab === '2'">
          <j-form-item label="复核退回原因" required style="margin-bottom: 10px;">
            <j-input
              v-model="reason"
              :maxlength="20"
              show-word-limit
              placeholder="20字以内"
              style="width: 310px"
            />
          </j-form-item>
        </j-form>
        <div class="reason-container">
          <div class="reason-head">
            申请复核原因：
          </div>
          <div v-for="item in editForm.reviewReason" :key="item.reason">
            {{ item.reviewTime }} ：{{ item.reason }}
          </div>
        </div>

        <div v-show="handleType !== '0'" class="reason-container">
          <div class="reason-head">
            复核退回原因：
          </div>
          <div v-for="item in editForm.returnReason" :key="item.returnTime">
            {{ item.returnTime }} ：{{ item.reason }}
          </div>
        </div>
      </div>
      <j-form
        ref="editForm"
        class="submit-form"
        :rules="rules"
        :inline="true"
        label-position="right"
        label-width="105px"
        :model="editForm"
        :disabled="handleType !== '0' && handleType !== '2'"
      >
        <div>
          <j-form-item label="法人">
            <span>{{ editForm.legalName }}</span>
          </j-form-item>
          <j-form-item label="发票日期">
            <span>{{ editForm.crtTime }}</span>
          </j-form-item>
        </div>
        <div>
          <j-form-item label="发票编号" required prop="invoiceNo">
            <j-input
              v-model="editForm.invoiceNo"
              placeholder="请输数字或/或-"
              :maxlength="50"
              @input="filterInput"
            />
          </j-form-item>
          <j-form-item label="纸质发票税额" required prop="invoiceTaxAmount">
            <j-input-number
              v-model="editForm.invoiceTaxAmount"
              :precision="2"
              placeholder="请输入"
              style="width:200px"
              :disabled="handleType !== '0' && handleType !== '2'"
            />
          </j-form-item>
          <j-form-item label="纸质发票含税额" required prop="invoiceGrossAmount">
            <j-input-number
              v-model="editForm.invoiceGrossAmount"
              :precision="2"
              placeholder="请输入"
              style="width:200px"
              :disabled="handleType !== '0' && handleType !== '2'"
            />
          </j-form-item>
        </div>
        <div>
          <j-form-item label="    ">
            <j-input v-show="false" />
          </j-form-item>
          <j-form-item label="税额" required>
            <span>{{ editForm.taxAmount }}</span>
          </j-form-item>
          <j-form-item label="含税额" required>
            <span>{{ editForm.grossAmount }}</span>
          </j-form-item>
        </div>
        <j-tabs v-model="activeName" @tab-click="tabClick">
          <j-tab-pane
            v-for="item in tabList"
            :key="item.name"
            :label="item.label"
            :name="item.name"
          />
        </j-tabs>
      </j-form>
    </div>
    <j-table
      ref="table"
      v-loading="loading"
      stripe
      header-bold
      size="small"
      :height="height"
      :data="tableData"
      style="width: 100%"
      tooltip-effect="dark"
    >
      <j-table-column type="index" label="序号" />
      <j-table-column prop="checkAccountRecord" label="对账单号" min-width="90" />
      <j-table-column
        v-if="['0','1','2'].includes(activeName)"
        key="productLineName"
        prop="productLineName"
        label="产品线"
      />
      <j-table-column
        v-if="['0','1','2'].includes(activeName)"
        key="deliveryNo"
        prop="deliveryNo"
        label="送货单号"
      />
      <j-table-column
        v-if="['0','1','2','4'].includes(activeName)"
        key="orderNo"
        prop="orderNo"
        label="订单号"
      />
      <j-table-column
        v-if="['0','1','2','4'].includes(activeName)"
        key="lineNo"
        prop="lineNo"
        label="订单行"
      />
      <j-table-column
        v-if="['0','1','2','4'].includes(activeName)"
        key="materialCode"
        prop="materialCode"
        label="物料编码"
      />
      <j-table-column
        v-if="['0','1','2','4'].includes(activeName)"
        key="materialName"
        prop="materialName"
        label="物料名称"
        width="300"
      />
      <j-table-column
        v-if="['0','1','2'].includes(activeName)"
        key="transactionType"
        prop="transactionType"
        label="事务类型"
      />
      <j-table-column
        v-if="['0','1','2'].includes(activeName)"
        key="transactionQuantity"
        prop="transactionQuantity"
        label="事务数量"
      />
      <!-- 资金折扣 -->
      <j-table-column
        v-if="activeName === '3'"
        key="code"
        prop="code"
        label="单号"
      />

      <j-table-column
        v-if="['0','1','2','3','4'].includes(activeName)"
        key="transactionDate"
        prop="transactionDate"
        label="事务日期"
      />
      <!-- 供应商运费 -->
      <j-table-column
        v-if="activeName === '4'"
        key="priceType"
        prop="priceType"
        label="价格类型"
      />
      <j-table-column
        v-if="activeName === '4'"
        key="quantity"
        prop="quantity"
        label="接收数量"
      />
      <j-table-column
        v-if="activeName === '4'"
        key="freightPrice"
        prop="freightPrice"
        label="运费价格"
      />
      <j-table-column
        v-if="activeName === '4'"
        key="freightQuantity"
        prop="freightQuantity"
        label="运费量"
      />
      <!-- 发票调整 -->
      <j-table-column
        v-if="activeName === '5'"
        key="letterNo"
        prop="letterNo"
        label="单号"
      />
      <j-table-column
        v-if="activeName === '5'"
        key="releaseDate"
        prop="releaseDate"
        label="发布日期"
      />
      <j-table-column
        v-if="activeName === '5'"
        key="type"
        prop="type"
        label="类型"
      />
      <j-table-column
        v-if="activeName === '5'"
        key="occurTime"
        prop="occurTime"
        label="发生日期"
      />
      <j-table-column
        v-if="activeName === '5'"
        key="problemDescription"
        prop="problemDescription"
        label="事项内容"
      />

      <j-table-column key="currency" prop="currency" label="币种" />
      <j-table-column key="taxRateStr" prop="taxRateStr" label="税率%" />
      <!-- 动态加载列有问题 -->
      <!-- <j-table-column key="taxRate" label="税率%">
        <template slot-scope="scope">
          <span>{{ scope.row.taxRate }}%</span>
        </template>
      </j-table-column> -->

      <!-- 已核价 -->
      <j-table-column
        v-if="activeName === '0'"
        key="invoicePrice"
        prop="invoicePrice"
        label="开票单价"
      />
      <j-table-column
        v-if="activeName === '0'"
        key="notaxAmount"
        prop="notaxAmount"
        label="未税额"
      />
      <!-- 未核价 -->
      <j-table-column
        v-if="activeName === '1'"
        key="price"
        prop="price"
        label="暂估单价"
      />
      <j-table-column
        v-if="activeName === '1'"
        key="notaxAmount"
        prop="notaxAmount"
        label="未税额"
      />
      <!-- 追溯调整 -->
      <j-table-column
        v-if="activeName === '2'"
        key="unitPriceDiff"
        prop="unitPriceDiff"
        label="追溯单价价差"
      />
      <j-table-column
        v-if="activeName === '2'"
        key="traceAmount"
        prop="traceAmount"
        label="未税额"
      />

      <!-- 资金折扣 -->
      <j-table-column
        v-if="activeName === '3'"
        key="amount"
        prop="amount"
        label="未税额"
      />
      <!-- 供应商运费 -->
      <j-table-column
        v-if="activeName === '4'"
        key="notaxAmount"
        prop="notaxAmount"
        label="未税额"
      />
      <!-- 发票调整 -->
      <j-table-column
        v-if="activeName === '5'"
        key="notaxAmount"
        prop="notaxAmount"
        label="未税额"
      />

      <j-table-column key="inventoryOrganizationName" prop="inventoryOrganizationName" label="库存组织" />
      <j-table-column key="supplierLocationName" prop="supplierLocationName" label="供应商地点" />
    </j-table>
    <div class="page">
      <j-pagination
        :current-page="currentPage"
        :page-sizes="[500]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="sizeChange"
        @current-change="pageChange"
      />
      <span class="all-count">未税额合计：{{ sum }}</span>
    </div>
  </j-dialog>
</template>

<script>
import * as receiptApi from '@/api/receipt/receipt'
import * as orderRecordApi from '@/api/orderRecord/index'
// import { getCodeList } from '@/views/common/dic'
import dayjs from 'dayjs'

export default {
  props: {
    visible: {
      type: Boolean,
      default () {
        return false
      }
    },
    handleType: {
      type: String,
      default () {
        return '提交'
      }
    },
    tab: {
      type: String,
      default () {
        return '1'
      }
    }
  },
  data () {
    return {
      loading: false,
      activeName: '0',
      tabList: [
        {
          label: '已核价',
          name: '0',
          count: 0
        },
        {
          label: '未核价',
          name: '1',
          count: 0
        },
        {
          label: '追溯调整',
          name: '2',
          count: 0
        },
        {
          label: '资金折扣',
          name: '3',
          count: 0
        },
        {
          label: '供应商运费',
          name: '4',
          count: 0
        },
        {
          label: '发票调整',
          name: '5',
          count: 0
        }
      ],
      statusDic: {
        0: '已核价',
        1: '未核价',
        2: '追溯调整',
        3: '资金折扣',
        4: '供应商运费',
        5: '发票调整'
      },
      height: null,
      tableData: [],
      editForm: {},
      reason: '',
      rules: {
        invoiceNo: [
          { required: true, message: '请输入发票编号', trigger: 'blur' }
        ],
        invoiceTaxAmount: [
          { required: true, message: '请输入纸质发票税额', trigger: 'change' }
        ],
        invoiceGrossAmount: [
          { required: true, message: '请输入纸质发票含税额', trigger: 'change' }
        ]
      },
      sum: 0,
      total: 0,
      currentPage: 1,
      pageSize: 500
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    sizeChange (val) {
      this.currentPage = 1
      this.pageSize = val
      this.init()
    },
    pageChange (e) {
      this.currentPage = e
      this.init()
    },
    filterInput () {
      this.editForm.invoiceNo = this.editForm.invoiceNo.replace(/[^0-9/\\-]/g, '')
    },
    init (row) {
      if (row) this.editForm = JSON.parse(JSON.stringify(row))
      // 计算表格高度
      setTimeout(() => {
        const all = document.documentElement.clientHeight
        const head = document.querySelector('.dialog-header').clientHeight
        this.height = all - head - 120
      }, 500)
      receiptApi.getPurchaseInvoiceDetail({ invoiceId: this.editForm.id, queryStatus: parseInt(this.activeName), size: this.pageSize,
        page: this.currentPage }).then((res) => {
        if (res.code === '0' && res.data) {
          res.data.details.records.forEach((row) => {
            row.taxRateStr = row.taxRate + '%'
          })
          this.total = res.data.details.total
          this.tableData = res.data.details.records
          this.$nextTick(() => {
            this.$refs['table'].doLayout()
          })
          this.sum = res.data.sum
        }
      })
    },
    tabClick (tab) {
      this.currentPage = 1
      this.init()
    },
    handleConfirm () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          delete this.editForm.checkAccountNo
          // this.editForm.status = 1
          receiptApi.submitInvoice(this.editForm).then((res) => {
            if (res.code === '0' && res.data) {
              this.showMessage('提交成功！', 'success')
              this.close()
            } else {
              this.showMessage(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    handleExport () {
      const params = {
        invoiceId: this.editForm.id,
        status: 3
      }
      orderRecordApi.exportBillInfoDetail(params)
    },
    reback () {
      if (this.reason) {
        if (!this.editForm.returnReason) {
          this.editForm.returnReason = []
        }
        this.editForm.returnReason.push({
          reason: this.reason,
          returnTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
        })
        this.editForm = Object.assign(this.editForm, {
          status: 4
        })

        receiptApi.applyReview(this.editForm).then((res) => {
          if (res.code === '0' && res.data) {
            this.showMessage('操作成功！', 'success')
            this.close()
          }
        })
      } else {
        this.showMessage('请填写复核退回原因！')
      }
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="less">
.submit-form {
  margin-top: 10px;
  .el-form-item__content {
    min-width: 210px;
  }
}
.page {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.all-count {
  margin-left: 50px;
}
</style>
