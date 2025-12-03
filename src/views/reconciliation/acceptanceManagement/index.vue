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
        <j-form-item label="法人">
          <j-select
            v-model="query.legalCodes"
            multiple
            clearable
            collapse-tags
            filterable
          >
            <j-option
              v-for="item in legalNamesList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="供应商">
          <j-input v-model="query.supplierName" placeholder="供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="发布日期">
          <j-date-picker
            v-model="query.issueTimeArr"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item label="确认日期">
          <j-date-picker
            v-model="query.confirmTimeArr"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item label="承兑票号">
          <j-input v-model="query.acceptNo" placeholder="发票编号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="创建人">
          <j-input v-model="query.crtName" placeholder="纸质发票号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="出票日期">
          <j-date-picker
            v-model="query.drawTimeArr"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item label="到期日期">
          <j-date-picker
            v-model="query.expireTimeArr"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <div class="btn">
          <div>
            <j-popconfirm title="确定要提交吗？" @confirm="handleSubmit">
              <j-button
                slot="reference"
                v-check="'SRM-receipt-paperUpload-submit'"
                type="primary"
                style="margin-left: 10px"
              >
                确认
              </j-button>
            </j-popconfirm>
          </div>
          <j-form-item class="btn-group" style="margin-bottom: 0">
            <j-button
              v-check="'SRM-receipt-paperUpload-paper-invoice-query'"
              type="primary"
              @click="initTable(1)"
            >
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button @click="handleExport">
              导出
            </j-button>
          </j-form-item>
        </div>
      </j-form>
      <j-tabs v-model="activeName" @tab-click="tabClick">
        <j-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        />
      </j-tabs>
      <!-- 数据表 -->
      <j-table
        ref="table"
        v-loading="loading"
        stripe
        header-bold
        size="small"
        :data="tableData"
        :height="height"
        style="width: 100%"
        tooltip-effect="dark"
        @selection-change="handleSelection"
      >
        <j-table-column type="selection" />
        <j-table-column prop="legalName" label="法人" align="center" />
        <j-table-column prop="supplierCode" label="供应商编码" align="center" />
        <j-table-column prop="supplierName" label="供应商名称" align="center" />
        <j-table-column prop="type" label="承兑类型" align="center" />
        <j-table-column prop="acceptNo" label="承兑票号" align="center" />
        <j-table-column prop="faceAmount" label="票面金额" align="center" />
        <j-table-column prop="source" label="出票来源" align="center" />
        <j-table-column prop="drawName" label="出票人名称" align="center" />
        <j-table-column prop="acceptName" label="承兑人名称" align="center" />
        <j-table-column prop="drawTime" label="出票日期" align="center" />
        <j-table-column prop="expireTime" label="到期日期" align="center" />
        <j-table-column prop="confirmUserName" label="创建人" align="center" />
        <j-table-column prop="confirmTime" label="创建日期" align="center" />
        <j-table-column prop="inventoryOrganizationName" label="库存组织" align="center" />
        <j-table-column prop="supplierLocationName" label="供应商地点" align="center" />
      </j-table>
      <div class="page">
        <j-pagination
          :current-page="tablePage.pageNum"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="tablePage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tablePage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </j-card>
  </div>
</template>

<script>
import * as reconciliationApi from '@/api/reconciliation'
import * as commonApi from '@/api/common'

import dayjs from 'dayjs'

class SearchQuery {
  legalCodes = []
  supplierName = ''
  issueTimeArr = []
  confirmTimeArr = []
  acceptNo = ''
  crtName = ''
  drawTimeArr = []
  expireTimeArr = []
}

const statusValue = { // 承兑票对象状态
  DRAFT: '0',
  SUBMIT: '1',
  CHECKED: '2',
  CANCEL: '3'
}

export default {
  name: 'AcceptanceManagement',
  data () {
    return {
      legalNamesList: [], // 法人
      supplierNameList: [], // 供应商列表
      orgList: [], // 存存组织
      loading: false,
      selectLoading: false,
      fileList: [],
      statusValue,
      activeName: statusValue.SUBMIT,
      tabList: [
        {
          label: '已发布', name: statusValue.SUBMIT, count: 'submitSum'
        },
        {
          label: '已确认', name: statusValue.CHECKED, count: 'checkedSum'
        }
      ],
      typeOptions: [
        {
          code: '1',
          name: '电子承兑'
        },
        {
          code: '2',
          name: '电子银承'
        }
      ],
      statusDic: {
        0: '草稿',
        1: '已提交',
        2: '待复核',
        3: '已校验',
        4: '已取消'
      },
      query: new SearchQuery(),
      height: null,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      selectList: []
    }
  },
  created () {
    this.initTable(1)
    this.getLegalName()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    // 提交
    handleSubmit () {
      if (this.activeName !== statusValue.SUBMIT) {
        this.$message({
          showClose: true,
          message: '只有发布状态可以提交',
          type: 'warning'
        })
        return
      }
      if (!this.selectList.length) {
        this.$message({
          showClose: true,
          message: '请先选择要操作的数据',
          type: 'warning'
        })
        return
      }
      const ids = this.selectList.map(item => item.id)
      this.fetchUpdateStatus(ids, statusValue.CHECKED)
    },
    getLegalName () {
      commonApi.getCorporateNameAndCode().then(res => {
        this.legalNamesList = res.data || []
      })
    },
    tabClick () {
      this.initTable()
    },
    handleSelection (val) {
      this.selectList = val
    },
    handleSizeChange (size) {
      this.tablePage.pageSize = size
      this.tablePage.pageNum = 1
      this.initTable(1)
    },
    handleCurrentChange (currentPage) {
      this.tablePage.pageNum = currentPage
      this.initTable(currentPage)
    },
    formatParams (nopage) {
      const params = {
        status: this.activeName,
        legalCodes: this.query.legalCodes.join(','),
        supplierName: this.query.supplierName,
        acceptNo: this.query.acceptNo,
        crtName: this.query.crtName,
        issueBeginTime: window._get(this, 'query.issueTimeArr[0]') ? dayjs(this.query.issueTimeArr[0]).format('YYYY-MM-DD 00:00:00') : '',
        issueEndTime: window._get(this, 'query.issueTimeArr[1]') ? dayjs(this.query.issueTimeArr[1]).format('YYYY-MM-DD 23:59:59') : '',
        confirmBeginTime: window._get(this, 'query.confirmTimeArr[0]') ? dayjs(this.query.confirmTimeArr[0]).format('YYYY-MM-DD 00:00:00') : '',
        confirmEndTime: window._get(this, 'query.confirmTimeArr[1]') ? dayjs(this.query.confirmTimeArr[1]).format('YYYY-MM-DD 23:59:59') : '',
        drawBeginTime: window._get(this, 'query.drawTimeArr[0]') ? dayjs(this.query.drawTimeArr[0]).format('YYYY-MM-DD 00:00:00') : '',
        drawEndTime: window._get(this, 'query.drawTimeArr[1]')  ? dayjs(this.query.drawTimeArr[1]).format('YYYY-MM-DD 23:59:59') : '',
        expireBeginTime: window._get(this, 'query.expireTimeArr[0]')  ? dayjs(this.query.expireTimeArr[0]).format('YYYY-MM-DD 00:00:00') : '',
        expireEndTime: window._get(this, 'query.expireTimeArr[1]') ? dayjs(this.query.expireTimeArr[1]).format('YYYY-MM-DD 23:59:59') : ''
      }
      if (!nopage) {
        params.page = this.tablePage.pageNum
        params.size = this.tablePage.pageSize
      }
      return params
    },
    async fetchUpdateStatus (ids, status) {
      const params = {
        status,
        ids
      }
      const res = await reconciliationApi.updateStatus(params)
      if (res.code === '0') {
        this.$message({
          showClose: true,
          message: '操作成功！',
          type: 'success'
        })
        this.initTable()
      }
    },
    handleExport () {
      reconciliationApi.exportSrmFinanceAcceptBill(this.formatParams(true))
    },
    initTable (page) {
      this.loading = true
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.query.status = this.activeName
      reconciliationApi.getSrmFinanceAcceptBillPage(this.formatParams())
        .then((res) => {
          this.loading = false
          if (res.code === '0') {
            res.data = res.data || {}
            const dataList = this.handleTableData(res.data.records)
            this.tableData = dataList
            this.tablePage.total = res.data.total
          }
        })
    },
    handleTableData (tableData) {
      tableData.forEach(tableItem => {
        Object.keys(tableItem).forEach(tableItemKey => {
          tableItem[tableItemKey] = (tableItem[tableItemKey] || tableItem[tableItemKey] === 0) ? tableItem[tableItemKey] : '-'
        })
      })
      return tableData
    },
    resetQuery () {
      this.query = new SearchQuery()
      this.initTable()
    }
  }
}
</script>
<style lang="less" scoped>
  .el-pagination {
    text-align: center;
  }
  .btn {
    display: flex;
    justify-content: space-between;
  }
  .w200 {
    width: 200px;
    /deep/ .el-input {
      width: 200px;
    }
  }
.downloadLink {
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  color: #f66500;
}
.downloadLink:hover {
  color: #f88433;
  transition: color 1s ease;
}
</style>
