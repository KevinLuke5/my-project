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
        <j-form-item label="退货单号">
          <j-input v-model="query.returnGoodsNo" placeholder="退货单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="退货供应商">
          <j-input v-model="query.returnSupplierName" placeholder="退货供应商模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="收货供应商">
          <j-input v-model="query.receivingSupplier" placeholder="收货供应商模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="创建日期">
          <j-date-picker
            v-model="query.timeRange"
            type="daterange"
            range-separator="~"
            start-placeholder="选择开始时间"
            end-placeholder="选择结束时间"
            value-format="yyyy-MM-dd"
          />
        </j-form-item>
        <j-form-item label="状态">
          <j-select
            v-model="query.returnStatus"
            clearable
            multiple
            collapse-tags
          >
            <j-option
              v-for="(value, index) in statusDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="备注">
          <j-input v-model="query.remark" placeholder="备注模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <div class="btn">
          <div>
            <j-button v-check="'insertOrUpdateReturnApply'" type="primary" @click="handleAdd">
              新增
            </j-button>
          </div>
          <j-form-item class="btn-group" style="margin-bottom: 0">
            <j-button v-check="'getGoodsReturnList'" type="primary" @click="initTable(1)">
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button v-check="'custom-apply-export'" @click="handleExport">
              导出
            </j-button>
          </j-form-item>
        </div>
      </j-form>

      <j-table :data="tableData" :height="height">
        <j-table-column label="退货单号" width="120">
          <template slot-scope="scope">
            <j-link size="mini" @click="handleEdit(scope.row,'查看')">
              {{ scope.row.returnGoodsNo }}
            </j-link>
          </template>
        </j-table-column>
        <j-table-column width="150" prop="returnSupplierName" label="退货供应商" />
        <j-table-column width="150" prop="receivingSupplier" label="收货供应商" />
        <j-table-column width="300" prop="receivingSupplierAddress" label="收货供应商地址" />
        <j-table-column prop="returnNum" label="退货数量" />
        <j-table-column label="状态">
          <template slot-scope="scope">
            {{ statusDic[scope.row.returnStatus] }}
          </template>
        </j-table-column>
        <j-table-column prop="crtUserName" label="创建人" />
        <j-table-column prop="crtTime" label="创建日期" />
        <j-table-column width="300" prop="remark" label="备注" />
        <j-table-column label="操作" width="115" fixed="right">
          <template slot-scope="scope">
            <j-popconfirm title="确定要提交退货申请吗？" @confirm="handleSubmit(scope.row.id, 1)">
              <j-button
                slot="reference"
                v-check="'commitOrCancel'"
                type="text"
                size="mini"
                :disabled="![0,3,5,7,9].includes(scope.row.returnStatus)"
              >
                提交
              </j-button>
            </j-popconfirm>
            <j-button
              v-check="'insertOrUpdateReturnApply'"
              type="text"
              size="mini"
              :disabled="![0,3,5,7,9].includes(scope.row.returnStatus)"
              @click="handleEdit(scope.row,'编辑')"
            >
              修改
            </j-button>
            <j-button
              v-check="'commitOrCancel'"
              type="text"
              size="mini"
              :disabled="[8,10].includes(scope.row.returnStatus)"
              @click="handleSubmit(scope.row.id, 11)"
            >
              取消
            </j-button>
          </template>
        </j-table-column>
      </j-table>
      <j-pagination
        class="page"
        style="margin: 20px auto 0"
        :current-page="tablePage.pageNum"
        :page-sizes="[15, 50, 100]"
        :page-size="tablePage.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tablePage.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </j-card>
    <edit-dialog
      ref="applyEdit"
      :edit-visible="editVisible"
      :handle-type="handleType"
      @close="editClose"
    />
  </div>
</template>

<script>
import * as applyApi from '@/api/customMat/apply'
import { getOrderDetil } from '@/api/customMat/check'
const editDialog = () => import('./components/editDialog')

export default {
  name: 'CustomApply',
  components: { editDialog },
  data () {
    return {
      loading: false,
      query: {
        returnGoodsNo: '',
        returnSupplierName: '',
        receivingSupplier: '',
        returnStatus: '',
        timeRange: [],
        startTime: '',
        endTime: ''
      },
      statusDic: {
        0: '草稿',
        1: '已发布',
        2: '供应商已确认',
        3: '供应商已拒绝',
        4: '计划已确认',
        5: '计划已拒绝',
        6: '采购已确认',
        7: '采购已拒绝',
        8: '已收货',
        9: '收货差异',
        10: '已入账',
        11: '已取消'
      },
      height: null,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      handleType: '新增',
      editVisible: false
    }
  },
  created () {
    this.initTable(1)
  },
  mounted () {
    this.height = this.calHeight(6).toString()
  },
  methods: {
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row, handleType) {
      this.handleType = handleType
      getOrderDetil({ id: row.id })
        .then((res) => {
          if (res && res.code === '0') {
            this.$refs.applyEdit.apply = JSON.parse(JSON.stringify(row))
            this.$refs.applyEdit.details = res.data.list
            this.editVisible = true
          } else {
            this.showMessage(res.message)
          }
        })
    },
    editClose () {
      this.editVisible = false
      this.initTable()
    },
    handleExport () {
      applyApi.returnApplyExport(this.formatParams(true))
    },
    // 提交申请
    handleSubmit (id, returnStatus) {
      applyApi
        .commitOrCancel({ id, returnStatus })
        .then((res) => {
          if (res && res.code === '0') {
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
    },
    formatParams (nopage) {
      const params = Object.assign(
        {
          returnGoodsNo: this.query.returnGoodsNo,
          returnSupplierName: this.query.returnSupplierName,
          receivingSupplier: this.query.receivingSupplier,
          remark: this.query.remark,
          returnStatus: this.query.returnStatus.length
            ? this.query.returnStatus.join(',')
            : null,
          startTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[0] + ' 00:00:00'
            : '',
          endTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[1] + ' 23:59:59'
            : ''
        },
        nopage
          ? {}
          : { page: this.tablePage.pageNum, size: this.tablePage.pageSize }
      )
      return params
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.loading = true
      applyApi
        .getGoodsReturnList(this.formatParams())
        .then((res) => {
          if (res && res.code === '0') {
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    resetQuery () {
      this.query = {
        returnGoodsNo: '',
        returnSupplierName: '',
        receivingSupplier: '',
        returnStatus: '',
        timeRange: [],
        startTime: '',
        endTime: ''
      }
    },
    handleSizeChange (val) {
      this.tablePage.pageNum = 1
      this.tablePage.pageSize = val
      this.initTable()
    },
    handleCurrentChange (val) {
      this.tablePage.pageNum = val
      this.initTable()
    }
  }
}
</script>
<style lang="less" scoped>
.btn {
  display: flex;
  justify-content: space-between;
}
</style>
