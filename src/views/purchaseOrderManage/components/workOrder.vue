<template>
  <j-dialog
    :visible.sync="detailVisible"
    :modal="false"
    :before-close="close"
    :fullscreen="true"
  >
    <div class="title font14">
      工单号：{{ detailForm.workOrderNo }}
    </div>
    <div class="manage font14">
      <div class="left">
        物料编码：{{ detailForm.goodsCode }}
      </div>
      <div>物料名称：{{ detailForm.goodsName }}</div>
      <div class="details-button">
        <j-button v-check="'purchaseOrderDetailsQuery-exportBom'" size="small" @click="exportBom()">
          导出
        </j-button>
      </div>
    </div>
    <!-- 表格 -->
    <j-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      size="small"
      style="width: 100%"
      tooltip-effect="dark"
      highlight-current-row
    >
      <j-table-column type="index" label="序号" />
      <j-table-column prop="compItemCode" label="物料编码" />
      <j-table-column prop="compItemName" width="360" label="物料描述" />
      <j-table-column prop="perQty" label="单机用量" />
      <j-table-column prop="needQty" label="必需量" />
      <!-- <j-table-column prop="orgCode" label="单位" /> -->
      <j-table-column prop="wipSupplyType" label="供应方式" />
      <j-table-column prop="supplySubinventory" label="子库编码" />
      <j-table-column prop="supplySubinventoryName" width="200" label="子库名称" />
    </j-table>
    <div class="block">
      <j-pagination
        :current-page="currentPage"
        :page-sizes="[200, 500, 1000]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </j-dialog>
</template>

<script>
import { getBOM } from '@/api/purchaseOrder/bom.js'
import * as deductionLetterApi from '@/api/deductionLetter/index'

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
      total: 0,
      pageSize: 200,
      currentPage: 1,
      loading: false,
      height: null,
      tableData: []
    }
  },
  watch: {
    detailForm (val) {
      if (val.id) {
        this.getDetailTable()
      }
    }
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    exportBom () {
      const params = {
        wipNumber: this.detailForm.workOrderNo
      }
      deductionLetterApi.exportBom(params)
    },
    getDetailTable (val) {
      const params = {
        wipNumber: this.detailForm.workOrderNo || val.workOrderNo,
        size: this.pageSize,
        page: this.currentPage
      }
      getBOM(params).then((res) => {
        if (res.code === '0') {
          console.log(res.data.content)
          this.total = res.data.totalElements
          this.tableData = res.data.content
        }
      })
    },
    close () {
      this.$emit('detailClose')
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getDetailTable()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getDetailTable()
    }
  }
}
</script>
<style lang="less" scoped>
.block {
  text-align: center;
  margin-top: 30px;
}
.title {
  margin-bottom: 10px;
}
.font14 {
  font-size: 14px;
}
.manage {
  width: 100%;
  height: 100%;
  margin-bottom: 30px;
  display: flex;
  .left {
    margin-right: 300px;
  }
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
    right: 40px;
    margin-top: -10px;
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
</style>
