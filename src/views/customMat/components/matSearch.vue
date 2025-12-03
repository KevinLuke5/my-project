<template>
  <j-dialog
    title="物料查询"
    :visible.sync="matVisible"
    :modal="false"
    :before-close="close"
    width="800px"
  >
    <j-form
      inline
      size="mini"
      class="head-container"
      label-position="left"
      label-width="93px"
    >
      <j-form-item label="物料编码">
        <j-input v-model="goodsCode" @keyup.enter.native="dataSearch()" />
      </j-form-item>
      <j-form-item>
        <j-button @click="dataSearch()">
          查询
        </j-button>
      </j-form-item>
    </j-form>
    <j-table
      ref="searchTable"
      v-loading="loading"
      :data="searchTableData"
      size="mini"
      height="300"
      highlight-current-row
      @selection-change="handleSelection"
    >
      <j-table-column type="selection" width="55" />
      <j-table-column prop="inventoryOrganization" label="库存组织" width="150" />
      <j-table-column prop="deliverGoodsNo" label="送货单号" />
      <j-table-column prop="orderCode" label="订单号" />
      <j-table-column prop="lineNum" label="行号" />
      <j-table-column prop="purchaseGoodsCode" label="物料编码" width="150" />
      <j-table-column prop="goodsName" label="物料名称" />
      <j-table-column prop="bareReceiveNum" label="净接收量" />
    </j-table>
    <!-- <j-pagination
      :current-page="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next, jumper"
      :total="total"
      @current-change="pageChange"
    /> -->
    <span slot="footer" class="dialog-footer">
      <j-button @click="close">取消</j-button>
      <j-button type="primary" @click="dataConfirm">确定</j-button>
    </span>
  </j-dialog>
</template>

<script>
import { getDeliverOrderInfo } from '@/api/customMat/apply'

export default {
  props: {
    matVisible: Boolean
  },
  data () {
    return {
      goodsCode: '',
      supplierCode: '',
      searchTableData: [],
      selectList: {},
      pageSize: 15,
      currentPage: 1,
      total: 0,
      loading: false
    }
  },

  methods: {
    dataConfirm () {
      if (this.selectList.length === 1) {
        this.$emit('selectMat', this.selectList[0])
        this.$refs.searchTable.clearSelection()
        this.close()
      } else {
        this.$message({
          type: 'warning',
          message: '有且仅能选择一项！'
        })
      }
    },
    handleSelection (val) {
      this.selectList = val
    },
    dataSearch (supplierCode) {
      if (supplierCode) this.supplierCode = supplierCode
      this.loading = true
      getDeliverOrderInfo({
        goodsCode: this.goodsCode,
        supplierCode: this.supplierCode
      })
        .then((res) => {
          if (res && res.code === '0') {
            this.searchTableData = res.data
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    pageChange (e) {
      this.currentPage = e
      this.dataSearch()
    },
    close () {
      this.goodsCode = ''
      this.supplierCode = ''
      this.$emit('close')
    }
  }
}
</script>
