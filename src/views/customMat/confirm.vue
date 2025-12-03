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
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'custom-confirm-queryPage'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'custom-confirm-queryExport'" @click="handleExport">
            导出
          </j-button>
        </j-form-item>
      </j-form>

      <j-table :data="tableData" :height="height">
        <j-table-column width="140" label="退货单号">
          <template slot-scope="scope">
            <j-link v-check="'custom-confirm-queryDetil'" size="mini" @click="handleEdit(scope.row, '编辑')">
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
            <span>
              {{ statusDic[scope.row.returnStatus] }}
            </span>
          </template>
        </j-table-column>
        <j-table-column prop="crtTime" label="创建日期" />
        <j-table-column prop="crtUserName" label="创建人" />
        <j-table-column width="300" prop="remark" label="备注" />
      </j-table>
      <j-pagination
        class="page"
        style="margin:20px auto 0;"
        :current-page="tablePage.pageNum"
        :page-sizes="[15, 50, 100]"
        :page-size="tablePage.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tablePage.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <edit-dialogs
        ref="applyEdit"
        :edit-visible="editVisible"
        :handle-type="handleType"
        @close="editClose"
      />
    </j-card>
  </div>
</template>

<script>
import * as confirmApi from '@/api/customMat/confirm'
// import { getCodeList } from '@/views/common/dic'
// import { tagDeltData } from '@/utils/index'
const editDialogs = () => import('./components/editDialogs')

export default {
  name: 'CustomConfirm',
  components: { editDialogs },
  data () {
    return {
      loading: false,
      query: {
        returnGoodsNo: '',
        returnSupplierName: '',
        receivingSupplier: '',
        returnStatus: '',
        remark: '',
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
      countA: 0,
      countB: 0,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      handleType: '新增',
      editVisible: false,
      typeList: [],
      peopleList: []
    }
  },
  created () {
    this.initTable(1)
  },
  mounted () {
    this.height = this.calHeight(60).toString()
  },
  methods: {
    handleExport () {
      const params = {
        returnGoodsNo: this.query.returnGoodsNo,
        returnSupplierName: this.query.returnSupplierName,
        receivingSupplier: this.query.receivingSupplier,
        returnStatus: this.query.returnStatus && this.query.returnStatus.length
          ? this.query.returnStatus.join(',')
          : '',
        remark: this.query.remark,
        startTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[0] + ' 00:00:00'
            : '',
        endTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[1] + ' 23:59:59'
            : '',
        page: this.tablePage.pageNum,
        size: this.tablePage.pageSize
      }
      confirmApi.queryExport(params)
    },
    handleEdit (row, handleType) {
      const that = this
      const list = []
      this.handleType = handleType
      confirmApi.queryDetil({ id: row.id })
        .then((res) => {
          if (res && res.code === '0') {
            this.$refs.applyEdit.apply = JSON.parse(JSON.stringify(row))
            res.data.list.forEach(item => {
              item.affirmTakeNum = item.returnNum
              list.push(item)
            })
            this.$refs.applyEdit.details = list
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
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      const params = {
        returnGoodsNo: this.query.returnGoodsNo,
        returnSupplierName: this.query.returnSupplierName,
        receivingSupplier: this.query.receivingSupplier,
        returnStatus: this.query.returnStatus && this.query.returnStatus.length
          ? this.query.returnStatus.join(',')
          : '',
        remark: this.query.remark,
        startTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[0] + ' 00:00:00'
            : '',
        endTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[1] + ' 23:59:59'
            : '',
        page: this.tablePage.pageNum,
        size: this.tablePage.pageSize
      }
      confirmApi
        .queryPage(params)
        .then((res) => {
          if (res && res.code === '0') {
            this.countA = res.data.count
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
          }
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
        remark: '',
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
