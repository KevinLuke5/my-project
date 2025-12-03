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
          <j-button v-check="'custom-check-pageList'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'custom-check-export'" @click="handleExport">
            导出
          </j-button>
        </j-form-item>
      </j-form>

      <j-table :data="tableData" :height="height">
        <j-table-column width="140" label="退货单号">
          <template slot-scope="scope">
            <j-link size="mini" @click="handleEdit(scope.row, '查看')">
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
        <j-table-column prop="crtTime" label="创建日期" />
        <j-table-column prop="crtUserName" label="创建人" />
        <j-table-column width="300" prop="remark" label="备注" />
        <j-table-column fixed="right" label="操作" width="110">
          <template slot-scope="scope">
            <!-- 供应商 -->
            <j-popconfirm title="确定要确认退货申请吗？" @confirm="handleSubmit(scope.row.id, 2)">
              <j-button
                slot="reference"
                v-check="'custom-check-audit-supplier'"
                type="text"
                size="mini"
                :disabled="scope.row.returnStatus !== 1"
              >
                供应商 确认
              </j-button>
            </j-popconfirm>
            <j-button
              v-check="'custom-check-audit-supplier'"
              type="text"
              size="mini"
              :disabled="scope.row.returnStatus !== 1"
              @click="refuseShow(scope.row.id, 3, 'supplier')"
            >
              供应商 拒绝
            </j-button>
            <!-- PMC -->
            <j-popconfirm title="确定要确认退货申请吗？" @confirm="handleSubmit(scope.row.id, 4)">
              <j-button
                slot="reference"
                v-check="'custom-check-audit-pmc'"
                type="text"
                size="mini"
                :disabled="scope.row.returnStatus !== 2"
              >
                PMC 确认
              </j-button>
            </j-popconfirm>
            <j-button
              v-check="'custom-check-audit-pmc'"
              type="text"
              size="mini"
              :disabled="scope.row.returnStatus !== 2"
              @click="refuseShow(scope.row.id, 5, 'pmc')"
            >
              PMC 拒绝
            </j-button>
            <!-- 采购 -->
            <j-popconfirm title="确定要确认退货申请吗？" @confirm="handleSubmit(scope.row.id, 6)">
              <j-button
                slot="reference"
                v-check="'custom-check-audit-purchase'"
                type="text"
                size="mini"
                :disabled="scope.row.returnStatus !== 4"
              >
                采购 确认
              </j-button>
            </j-popconfirm>
            <j-button
              v-check="'custom-check-audit-purchase'"
              type="text"
              size="mini"
              :disabled="scope.row.returnStatus !== 4"
              @click="refuseShow(scope.row.id, 7, 'proc')"
            >
              采购 拒绝
            </j-button>
          </template>
        </j-table-column>
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
    </j-card>

    <edit-dialog
      ref="applyEdit"
      :edit-visible="editVisible"
      :handle-type="handleType"
      @close="editVisible = false"
    />

    <j-dialog :visible.sync="refuseVisible" width="400px" :before-close="refuseClose">
      <j-form>
        <j-form-item label="拒绝原因：">
          <j-input
            v-model="refuseText"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </j-form-item>
      </j-form>
      <span slot="footer" class="dialog-footer">
        <j-button @click="refuseClose">取 消</j-button>
        <j-button type="primary" @click="handleSubmit(curId, curStatus, curRole)">拒 绝</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import * as checkApi from '@/api/customMat/check'
const editDialog = () => import('./components/editDialog')

export default {
  name: 'CustomCheck',
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
      handleType: '查看',
      editVisible: false,
      refuseVisible: false,
      refuseText: '',
      curId: '',
      curStatus: '',
      curRole: ''
    }
  },
  created () {
    this.initTable(1)
  },
  mounted () {
    this.height = this.calHeight(6).toString()
  },
  methods: {
    handleExport () {
      checkApi.exportReturnApply(this.formatParams(true))
    },
    refuseShow (id, status, role) {
      this.curId = id
      this.curStatus = status
      this.curRole = role
      this.refuseVisible = true
    },
    refuseClose () {
      this.curId = ''
      this.curStatus = ''
      this.curRole = ''
      this.refuseText = ''
      this.refuseVisible = false
    },
    handleSubmit (id, status, role) {
      const params = {
        id: id || this.curId,
        returnStatus: status || this.curStatus
      }
      // 如果有role证明是点了拒绝，需要拼接对应拒绝原因字段
      if (role) {
        if (this.refuseText.trim()) {
          params[role + 'RefuseRemark'] = this.refuseText
        } else {
          this.showMessage('请先填写拒绝原因！')
          return
        }
      }
      checkApi.returnApplyAudit(params).then((res) => {
        if (res && res.code === '0') {
          this.refuseClose()
          this.initTable()
        } else {
          this.showMessage(res.message)
        }
      })
    },
    handleEdit (row, handleType) {
      this.handleType = handleType
      checkApi.getOrderDetil({ id: row.id })
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
      checkApi
        .getReturnApplyList(this.formatParams())
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
