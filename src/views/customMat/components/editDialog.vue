<template>
  <div>
    <j-dialog
      :title="handleType"
      :visible.sync="editVisible"
      :modal="false"
      :before-close="close"
      width="80%"
    >
      <j-form
        ref="editForm"
        :rules="rules"
        class="dialog-form"
        size="mini"
        :inline="true"
        label-position="left"
        label-width="96px"
        :model="apply"
        :disabled="handleType === '查看'"
      >
        <j-form-item label="退货单号">
          <j-input v-model="apply.returnGoodsNo" placeholder="自动生成" disabled />
        </j-form-item>
        <j-form-item label="收货供应商" prop="receivingSupplier" required>
          <j-autocomplete
            v-model="apply.receivingSupplier"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchSupplier"
            :trigger-on-focus="true"
            placeholder="输入供应商名称搜索"
            :disabled="handleType !== '新增'"
            @select="selectSupplier"
          >
            <template slot-scope="{ item }">
              <div class="name">
                {{ item.supplierName }}
              </div>
              <!-- <span class="code">{{ item.supplierCode }}</span> -->
              <div class="code">{{ item.addressShort }}</div>
              <div class="code">{{ item.address }}</div>
              <div class="code">{{ item.confirmName }}</div>
            </template>
          </j-autocomplete>
        </j-form-item>
        <j-form-item label="收货供应商地址">
          <j-input v-model="apply.receivingSupplierAddress" placeholder="选择供应商带出" disabled />
        </j-form-item>
        <j-form-item label="收货审核人">
          <j-input v-model="apply.receivingAuditName" placeholder="选择供应商带出" disabled />
        </j-form-item>
        <j-form-item label="备注">
          <j-input v-model="apply.remark" />
        </j-form-item>
        <div>
          <j-button v-show="['新增','编辑'].includes(handleType)" style="margin-bottom: 5px" @click="addTableLine">
            添加行
          </j-button>
        </div>
        <j-table :data="details" border width="100%">
          <j-table-column label="操作" width="100">
            <template slot-scope="scope">
              <j-button
                v-if="details.length > 1"
                type="danger"
                icon="el-icon-minus"
                size="mini"
                circle
                @click="deleteTableLine(scope.$index, scope.row)"
              />
            </template>
          </j-table-column>
          <j-table-column prop="inventoryOrganization" label="库存组织" />
          <j-table-column label="物料编码" width="212">
            <template slot="header">
              <span style="color: red">*</span>
              <span>物料编码</span>
            </template>
            <template slot-scope="scope">
              <j-input v-model="scope.row.goodsCode" disabled>
                <j-button slot="append" @click="showMatSearch(scope.row, scope.$index)">
                  选择
                </j-button>
              </j-input>
            </template>
          </j-table-column>
          <j-table-column prop="goodsName" label="物料名称" />
          <j-table-column prop="deliverGoodsNo" label="送货单号" />
          <j-table-column prop="orderCode" label="退货订单号" />
          <j-table-column prop="lineNum" label="退货订单行" />
          <j-table-column label="申请退货数量" width="160">
            <template slot="header">
              <span style="color: red">*</span>
              <span>申请退货数量</span>
            </template>
            <template slot-scope="scope">
              <j-input-number v-model="scope.row.returnNum" :min="1" :disabled="handleType === '查看'" />
            </template>
          </j-table-column>
          <j-table-column v-show="handleType !== '新增'" prop="realityOutNum" label="实际出库量" />
          <j-table-column v-show="handleType !== '新增'" prop="affirmTakeNum" label="确认收货量" />
          <j-table-column v-show="handleType !== '新增'" prop="differenceNum" label="差异" />
        </j-table>
      </j-form>
      <div v-show="handleType !== '新增'" class="refuse-card">
        <!-- 拒绝原因 -->
        <div v-show="apply.procRefuseRemark">
          采购拒绝原因：{{ apply.procRefuseRemark }}
        </div>
        <div v-show="apply.pmcRefuseRemark">
          PMC拒绝原因：{{ apply.pmcRefuseRemark }}
        </div>
        <div v-show="apply.supplierRefuseRemark">
          收货供应商拒绝原因：{{ apply.supplierRefuseRemark }}
        </div>
      </div>
      <span v-show="handleType !== '查看'" slot="footer">
        <j-button @click="close">取消</j-button>
        <j-button type="primary" @click="delEmptyRow">保存</j-button>
      </span>
    </j-dialog>

    <mat-search
      ref="matSearch"
      :mat-visible="matVisible"
      @selectMat="selectMat"
      @close="matClose"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { handleMessage } from '@/utils/index'
import * as applyApi from '@/api/customMat/apply'
const matSearch = () => import('./matSearch')

export default {
  components: { matSearch },
  props: {
    editVisible: Boolean,
    handleType: {
      type: String,
      default () {
        return '新增'
      }
    }
  },
  data () {
    return {
      errMessage: '',
      matVisible: false,
      curRow: {},
      curIndex: 0,
      supplierList: [],
      apply: {
        returnGoodsNo: '',
        receivingSupplier: '',
        receivingSupplierId: '',
        receivingSupplierCode: '',
        receivingSupplierAddress: '',
        receivingAuditId: '',
        receivingAuditName: '',
        remark: ''
      },
      details: [],
      rules: {
        receivingSupplier: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    searchSupplier (keyword, cb) {
      applyApi.getAddrInfo({ name: keyword })
        .then((res) => {
          if (res.code === '0') {
            this.supplierList = res.data
            console.log(this.supplierList);
          }
        })
        .finally(() => {
          cb(this.supplierList)
        })
    },
    selectSupplier (item) {
      this.apply.receivingSupplier = item.supplierName
      this.apply.receivingSupplierId = item.supplierId
      this.apply.receivingSupplierCode = item.supplierCode
      this.apply.receivingSupplierAddress = item.address
      this.apply.receivingAuditId = item.confirmAccountId
      this.apply.receivingAuditName = item.confirmName
    },
    showMatSearch (row, index) {
      this.curRow = row
      this.curIndex = index
      this.matVisible = true
      this.$refs.matSearch.dataSearch(this.apply.receivingSupplierCode)
    },
    selectMat (item) {
      const newRow = Object.assign(JSON.parse(JSON.stringify(item)), { returnNum: 0, goodsCode: item.purchaseGoodsCode })
      Vue.set(this.details, this.curIndex, newRow)
    },
    matClose () {
      this.matVisible = false
    },
    close () {
      this.apply = {
        returnGoodsNo: '',
        receivingSupplier: '',
        receivingSupplierId: '',
        receivingSupplierCode: '',
        receivingSupplierAddress: '',
        receivingAuditId: '',
        receivingAuditName: '',
        remark: ''
      }
      this.details = []
      this.$emit('close')
    },
    // 清除空表格行
    delEmptyRow () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const list = JSON.parse(JSON.stringify(this.details))
          list.forEach((item, index) => {
            if (!item.goodsName && !item.id) {
              list.splice(index, 1)
            }
          })
          if (list.length) {
            this.checkDataRules(list)
          } else {
            this.showMessage('请填写表格内容!')
          }
        } else {
          return false
        }
      })
    },
    // 数据校验
    checkDataRules (list) {
      for (let k = 0; k < list.length; k++) {
        if (!list[k].goodsName) {
          this.errMessage = '物料必选！'
          break
        }
      }
      if (this.errMessage) {
        this.showMessage(this.errMessage)
        this.errMessage = ''
      } else {
        this.saveData(list)
      }
    },
    // 保存
    saveData(list) {
      let data = []
      // 如果是新增状态要传0
      if (!this.apply.returnGoodsNo) this.apply.returnStatus = 0
      list.forEach(item => {
        delete item.id
        data.push(item)
      })
      applyApi
        .insertOrUpdateReturnApply({
          apply: this.apply,
          details: data
        }).then((res) => {
          handleMessage(res, '保存成功').then((res) => {
            // 刷新数据，但是不关闭
            if (res && res.code === '0') {
              this.apply = res.data.apply
              this.details = res.data.details
            } else {
              this.showMessage(res.message)
            }
          })
        })
    },
    // 添加表格行
    addTableLine () {
      if (this.apply.receivingSupplier) {
        var newRow = {
          inventoryOrganization: '',
          goodsCode: '',
          goodsName: '',
          deliverGoodsNo: '',
          orderCode: '',
          lineNum: '',
          returnNum: ''
        }
        this.details.push(newRow)
      } else {
        this.showMessage('请先选择供应商！')
      }
    },
    // 删除表格行
    deleteTableLine (index) {
      this.details.splice(index, 1)
    }
  }
}
</script>
<style lang="less" scoped>
.refuse-card {
  padding-top: 20px;
  div {
    margin-bottom: 10px;
  }
}
</style>
