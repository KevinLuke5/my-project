<template>
  <j-dialog
    title="货款往来对账单明细"
    :visible.sync="visible"
    :before-close="close"
    fullscreen
  >
    <div class="dialog-header">
      <j-form
        ref="srmFinancePaymentBill"
        class="submit-form"
        :rules="rules"
        :inline="true"
        label-position="right"
        label-width="120px"
        :model="srmFinancePaymentBill"
        :disabled="handleType === '详情'"
      >
        <j-form-item label="对账单号">
          <span>{{ srmFinancePaymentBill.billNo }}</span>
        </j-form-item>
        <j-form-item label="法人">
          <span>{{ srmFinancePaymentBill.legalName }}</span>
        </j-form-item>
        <j-form-item label="供应商编码">
          <span>{{ srmFinancePaymentBill.supplierCode }}</span>
        </j-form-item>
        <j-form-item label="供应商名称">
          <span>{{ srmFinancePaymentBill.supplierName }}</span>
        </j-form-item>
        <j-form-item label="对账期间">
          <span>{{ srmFinancePaymentBill.period }}</span>
        </j-form-item>
        <j-form-item label="发布日期">
          <span>{{ srmFinancePaymentBill.releaseTime }}</span>
        </j-form-item>
        <j-form-item label="回复日期">
          <span>{{ srmFinancePaymentBill.replyTime }}</span>
        </j-form-item>
        <j-form-item label="填报人" required prop="informantUser">
          <j-input v-model="srmFinancePaymentBill.informantUser" placeholder="请输入" @blur="handleSave" />
        </j-form-item>
        <j-form-item label="联系电话" required prop="linkNumber">
          <j-input v-model="srmFinancePaymentBill.linkNumber" placeholder="请输入" @blur="handleSave" />
        </j-form-item>
        <j-form-item label="九阳余额">
          <span>{{ srmFinancePaymentBill.joyoungBalance }}</span>
        </j-form-item>
        <j-form-item label="供应商余额">
          <span>{{ srmFinancePaymentBill.supplierBalance }}</span>
        </j-form-item>
        <j-form-item label="差异">
          <span>{{ srmFinancePaymentBill.difference }}</span>
        </j-form-item>
        <j-form-item label="供应商上传附件">
          <!-- <span>{{ srmFinancePaymentBill.accessory }}</span> -->
          <all-upload
            ref="fileUpload"
            text="文件上传"
            :can-download="true"
            @getFiles="getFiles"
          />
        </j-form-item>
        <j-form-item label="供应商填差异原因">
          <span>{{ srmFinancePaymentBill.diffReason }}</span>
        </j-form-item>
      </j-form>

      <div>
        <j-button
          v-check="'SRM1-goodsAccount-fill-updatePaymentBillAndDetail'"
          type="primary"
          @click="handleConfirm"
        >
          提交
        </j-button>
      </div>

      <j-tabs v-model="activeName" @tab-click="tabClick">
        <j-tab-pane label="供应商余额" name="supplierBalance">
          <j-form
            ref="supplierBalance"
            class="submit-form"
            :rules="rules"
            :inline="true"
            label-position="right"
            label-width="140px"
            :model="supplierBalance"
            :disabled="handleType === '详情'"
          >
            <j-form-item label="期初余额(+)" required prop="initialBalance">
              <j-input-number
                v-model="supplierBalance.initialBalance"
                :precision="2"
                :controls="false"
                placeholder="请输入"
                style="width: 150px"
                @blur="handleSave"
              />
            </j-form-item>
            <j-form-item label="本期销货发票开具(+)" required prop="thisSalesInvoice">
              <j-input-number
                v-model="supplierBalance.thisSalesInvoice"
                :precision="2"
                :controls="false"
                placeholder="请输入"
                style="width: 150px"
                @blur="handleSave"
              />
            </j-form-item>
            <br>
            <j-form-item label="本期模具发票开具(+)" required prop="thisMouldInvoice">
              <j-input-number
                v-model="supplierBalance.thisMouldInvoice"
                :precision="2"
                :controls="false"
                placeholder="请输入"
                style="width: 150px"
                @blur="handleSave"
              />
            </j-form-item>
            <j-form-item label="本期销货类收款(-)" required prop="thisSalesGathering">
              <j-input-number
                v-model="supplierBalance.thisSalesGathering"
                :precision="2"
                :controls="false"
                placeholder="请输入"
                style="width: 150px"
                @blur="handleSave"
              />
            </j-form-item>
            <br>
            <j-form-item label="本期模具类收款(-)" required prop="thisMouldGathering">
              <j-input-number
                v-model="supplierBalance.thisMouldGathering"
                :precision="2"
                :controls="false"
                placeholder="请输入"
                style="width: 150px"
                @blur="handleSave"
              />
            </j-form-item>
            <j-form-item label="本期扣款入账(-)" required prop="thisWithholdenter">
              <j-input-number
                v-model="supplierBalance.thisWithholdenter"
                :precision="2"
                :controls="false"
                placeholder="请输入"
                style="width: 150px"
                @blur="handleSave"
              />
            </j-form-item>
            <br>
            <j-form-item label="其他">
              <j-input-number
                v-model="supplierBalance.rest"
                :precision="2"
                :controls="false"
                placeholder="请输入"
                style="width: 150px"
                @blur="handleSave"
              />
            </j-form-item>
            <j-form-item label="期末余额">
              <span>{{ supplierBalance.endingBalance }}</span>
            </j-form-item>
            <br>
            <j-form-item label="上期对账单号">
              <span>{{ supplierBalance.lastBillNo }}</span>
            </j-form-item>
            <j-form-item label="上期对账期间">
              <span>{{ supplierBalance.lastPeriod }}</span>
            </j-form-item>
            <br>
            <j-form-item label="上期九阳余额">
              <span>{{ supplierBalance.lastJoyoungBalance }}</span>
            </j-form-item>
            <j-form-item label="上期供应商余额">
              <span>{{ supplierBalance.lastSupplierBalance }}</span>
            </j-form-item>
            <br>
            <j-form-item label="上期差异">
              <span>{{ supplierBalance.lastDiff }}</span>
            </j-form-item>
            <j-form-item label="上期差异原因">
              <span>{{ supplierBalance.lastDiffReason }}</span>
            </j-form-item>
          </j-form>
        </j-tab-pane>
        <j-tab-pane label="九阳余额" name="joyoungBalances">
          <j-table-with-page
            :columns="jyColumns"
            :data-source="joyoungBalances"
            :options="{
              toolbarBottom: false,
              mutiSelect: false,
              index: false,
              loading: false,
              initTable: false,
            }"
          />
        </j-tab-pane>
        <j-tab-pane label="潜在差异项" name="potentialDifferences">
          <j-form :disabled="handleType === '详情'">
            <j-table
              stripe
              header-bold
              size="small"
              :data="potentialDifferences"
              tooltip-effect="dark"
            >
              <j-table-column prop="type" label="类型" width="160" />
              <j-table-column label="金额" width="160">
                <template slot-scope="scope">
                  <span>{{ scope.row.money }}</span>
                  <!-- <j-input-number
                    v-if="scope.row.type === '其他'"
                    v-model="scope.row.money"
                    :precision="2"
                    :controls="false"
                    style="width: 150px"
                    @blur="handleSave"
                  />
                  <span v-else>{{ scope.row.money }}</span> -->
                </template>
              </j-table-column>
              <j-table-column label="备注" width="300">
                <template slot-scope="scope">
                  <span>{{ scope.row.remark }}</span>
                  <!-- <j-input v-model="scope.row.remark" @blur="handleSave" /> -->
                </template>
              </j-table-column>
            </j-table>
          </j-form>
        </j-tab-pane>
        <j-tab-pane label="当期往来明细" name="currentDetails">
          <j-table-with-page
            :columns="detailColumns"
            :data-source="currentDetails"
            :options="{
              toolbarBottom: false,
              mutiSelect: false,
              index: false,
              loading: false,
              initTable: false,
            }"
          />
        </j-tab-pane>
      </j-tabs>
    </div>
  </j-dialog>
</template>

<script>
import * as payBillApi from '@/api/goodsAccount/index'
import { plus, subtract } from '@base/utils'

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
        return '详情'
      }
    }
  },
  data () {
    return {
      loading: false,
      activeName: 'supplierBalance',
      rules: {
        informantUser: [
          { required: true, message: '请输入填报人', trigger: 'blur' }
        ],
        linkNumber: [
          { required: true, message: '请输入联系电话', trigger: 'blur ' }
        ],
        initialBalance: [
          { required: true, message: '请输入期初余额', trigger: 'change' }
        ],
        thisSalesInvoice: [
          {
            required: true,
            message: '请输入本期销货发票开具',
            trigger: 'change'
          }
        ],
        thisMouldInvoice: [
          {
            required: true,
            message: '请输入本期模具发票开具',
            trigger: 'change'
          }
        ],
        thisSalesGathering: [
          {
            required: true,
            message: '请输入本期销货类收款',
            trigger: 'change'
          }
        ],
        thisMouldGathering: [
          {
            required: true,
            message: '请输入本期模具类收款',
            trigger: 'change'
          }
        ],
        thisWithholdenter: [
          { required: true, message: '请输入本期扣款入账', trigger: 'change' }
        ]
      },
      srmFinancePaymentBill: {},
      joyoungBalances: [],
      jyColumns: [
        {
          prop: 'lineName',
          label: '产品线'
        },
        {
          prop: 'invoicePayable',
          label: '发票应付'
        },
        {
          prop: 'qualityGuaranteeDeposit',
          label: '质保金'
        },
        {
          prop: 'mouldModel',
          label: '模具款'
        },
        {
          prop: 'subtotal',
          label: '小计'
        }
      ],
      supplierBalance: {},
      potentialDifferences: [],
      currentDetails: [],
      detailColumns: [
        {
          prop: 'period',
          label: '期间'
        },
        {
          prop: 'paymentTime',
          label: '付款日期'
        },
        {
          prop: 'type',
          label: '类别'
        },
        {
          prop: 'debitAmount',
          label: '借项金额'
        },
        {
          prop: 'creditAmount',
          label: '贷项金额'
        }
      ]
    }
  },
  created () {},
  mounted () {},
  methods: {
    init (row) {
      if (row) this.srmFinancePaymentBill = JSON.parse(JSON.stringify(row))
      this.$nextTick(() => {
        this.$refs.fileUpload.fileList = this.srmFinancePaymentBill.accessory
      })
      payBillApi.getPaymentBillDetail({ id: row.id }).then((res) => {
        if (res.code === '0' && res.data) {
          // this.srmFinancePaymentBill = res.data.srmFinancePaymentBill
          const totalRow = {
            lineName: '总计',
            invoicePayable: 0,
            qualityGuaranteeDeposit: 0,
            mouldModel: 0,
            subtotal: 0
          }
          res.data.joyoungBalances.forEach((row) => {
            totalRow.invoicePayable += row.invoicePayable
            totalRow.qualityGuaranteeDeposit += row.qualityGuaranteeDeposit
            totalRow.mouldModel += row.mouldModel
            totalRow.subtotal += row.subtotal
          })
          res.data.joyoungBalances.push(totalRow)
          this.joyoungBalances = res.data.joyoungBalances
          this.supplierBalance = res.data.supplierBalance
          this.potentialDifferences = res.data.potentialDifferences
          this.currentDetails = res.data.currentDetails
        }
      })
    },
    tabClick (tab) {},
    computeNum () {
      // 期末余额=期初余额+本期销货发票开具+本期模具发票开具-本期销货类收款-本期模具类收款-本期扣款入账
      this.supplierBalance.endingBalance = subtract(
        plus(
          this.supplierBalance.initialBalance,
          this.supplierBalance.thisSalesInvoice,
          this.supplierBalance.thisMouldInvoice
        ),
        this.supplierBalance.thisSalesGathering,
        this.supplierBalance.thisMouldGathering,
        this.supplierBalance.thisWithholdenter
      )
      // 供应商余额=期末余额
      this.srmFinancePaymentBill.supplierBalance =
        this.supplierBalance.endingBalance || 0
      // 差异=九阳余额-供应商余额
      this.srmFinancePaymentBill.difference = subtract(
        this.srmFinancePaymentBill.joyoungBalance,
        this.srmFinancePaymentBill.supplierBalance
      )
    },
    getFiles (type, fileList, file, handle) {
      this.srmFinancePaymentBill.accessory = fileList
    },
    // 保存
    handleSave () {
      this.computeNum()
      this.updateDetail('保存')
    },
    // 提交
    handleConfirm () {
      this.$refs.srmFinancePaymentBill.validate((valid) => {
        if (valid) {
          this.$refs.supplierBalance.validate((valid1) => {
            if (valid1) {
              this.updateDetail('提交')
            } else {
              return false
            }
          })
        } else {
          return false
        }
      })
    },
    updateDetail (type) {
      payBillApi
        .updatePaymentBillAndDetail({
          supplierBalance: this.supplierBalance,
          potentialDifferences: this.potentialDifferences,
          srmFinancePaymentBill: Object.assign({}, this.srmFinancePaymentBill, {
            status: type === '提交' ? 1 : 0
          })
        })
        .then((res) => {
          if (res.code === '0' && res.data) {
            this.$message.success(`${type}成功！`)
            if (type === '提交') this.close()
          } else {
            this.$message.warning(res.message)
          }
        })
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
</style>