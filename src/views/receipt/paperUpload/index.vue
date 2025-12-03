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
            v-model="query.legalCode"
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
        <j-form-item label="发票编号">
          <j-input v-model="query.invoiceNo" placeholder="发票编号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="纸质发票号">
          <j-input v-model="query.paperInvoiceNo" placeholder="纸质发票号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="发票类型">
          <j-select
            v-model="query.invoiceType"
            clearable
            multiple
            collapse-tags
          >
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="发票日期">
          <j-date-picker
            v-model="query.timeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <div class="btn">
          <div>
            <j-button
              v-check="'SRM-receipt-paperUpload-save-paper-invoice'"
              type="primary"
              @click="handleAdd"
            >
              新增
            </j-button>
            <j-popconfirm title="确定要提交吗？" @confirm="handleSubmit(selectList,1)">
              <j-button
                slot="reference"
                v-check="'SRM-receipt-paperUpload-submit'"
                type="primary"
                style="margin-left: 10px"
              >
                提交
              </j-button>
            </j-popconfirm>
            <j-button
              v-check="'SRM-receipt-paperUpload-downloadModePaper'"
              style="margin-left: 10px"
              @click="downTemplate"
            >
              模板下载
            </j-button>
            <j-button
              v-check="'SRM-receipt-paperUpload-paperInvoiceUpload'"
              type="primary"
              @click="uploadVisible=true"
            >
              模板导入
            </j-button>
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
          :label="item.label+'（'+sum[item.count]+'）'"
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
        <j-table-column prop="legalName" label="法人" sortable />
        <j-table-column v-if="activeName === '0'" label="操作" width="105px">
          <template slot-scope="scope">
            <j-popconfirm title="确定要提交吗？" @confirm="handleSubmit([scope.row],1)">
              <j-button slot="reference" v-check="'SRM-receipt-paperUpload-submit'" type="text">
                提交
              </j-button>
            </j-popconfirm>
            <j-button
              v-check="'SRM-receipt-paperUpload-save-paper-invoice'"
              type="text"
              @click="handleEdit(scope.row)"
            >
              修改
            </j-button>
            <j-popconfirm title="确定要删除吗？" @confirm="handleDel([scope.row],4)">
              <j-button slot="reference" v-check="'SRM-receipt-paperUpload-submit'" type="text">
                删除
              </j-button>
            </j-popconfirm>
          </template>
        </j-table-column>
        <j-table-column prop="invoiceType" label="发票类型" />
        <j-table-column prop="invoiceNo" label="发票编号" />
        <j-table-column prop="paperInvoiceNo" width="120">
          <template slot="header" slot-scope="{}">
            <span>纸质发票号</span>
            <j-tooltip effect="dark" placement="top">
              <i class="el-icon-question" />
              <div slot="content">
                <p>发票提交界面的发票编号</p>
              </div>
            </j-tooltip>
          </template>
        </j-table-column>
        <j-table-column prop="taxRate" label="税率%" sortable>
          <template slot-scope="scope">
            {{ scope.row.taxRate }}%
          </template>
        </j-table-column>
        <j-table-column prop="notaxAmount" label="未税额" />
        <j-table-column prop="taxAmount" label="税额" sortable />
        <j-table-column prop="grossAmount" label="含税额" />
        <j-table-column prop="invoiceTime" label="开票日期" />
        <j-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            {{ statusDic[scope.row.status] }}
          </template>
        </j-table-column>
        <j-table-column prop="crtUserName" label="创建人" sortable />
        <j-table-column prop="crtTime" label="创建日期" sortable />
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

    <j-dialog :title="handleType" :visible.sync="editVisible">
      <j-form
        ref="editForm"
        :rules="rules"
        :inline="false"
        label-position="right"
        label-width="105px"
        :model="editForm"
        class="dialog-form"
      >
        <j-form-item label="法人" required prop="legalName">
          <j-select
            v-model="editForm.legalName"
            value-key="code"
            filterable
            @change="legalChange"
          >
            <j-option
              v-for="item in legalNamesList"
              :key="item.code"
              :label="item.name"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="发票类型" required prop="invoiceType">
          <j-select v-model="editForm.invoiceType">
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="发票编号" required prop="invoiceNo">
          <j-select v-model="editForm.invoiceNo" value-key="invoiceNo" @change="invoiceChange">
            <j-option
              v-for="item in invoiceNoList"
              :key="item.id"
              :label="item.invoiceNo"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="纸质发票号" required prop="paperInvoiceNo">
          <j-input v-model="editForm.paperInvoiceNo" />
        </j-form-item>
        <j-form-item label="税率%" required prop="taxRate">
          <j-input-number
            v-model="editForm.taxRate"
            :min="0"
            :precision="0"
            class="w200"
            placeholder="请输入"
          />
        </j-form-item>
        <j-form-item label="未税额" required prop="notaxAmount">
          <j-input-number
            v-model="editForm.notaxAmount"
            :precision="2"
            class="w200"
            placeholder="请输入"
          />
        </j-form-item>
        <j-form-item label="税额" required prop="taxAmount">
          <j-input-number
            v-model="editForm.taxAmount"
            :precision="2"
            class="w200"
            placeholder="请输入"
          />
        </j-form-item>
        <j-form-item label="含税额" required prop="grossAmount">
          <j-input-number
            v-model="editForm.grossAmount"
            :precision="2"
            class="w200"
            placeholder="请输入"
          />
        </j-form-item>
        <j-form-item label="开票日期" required prop="invoiceTime">
          <j-date-picker v-model="editForm.invoiceTime" type="date" value-format="yyyy-MM-dd" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="editSave">保存</j-button>
      </span>
    </j-dialog>
    <upload :visible="uploadVisible" :upload-url="importUrl" @close="closeUpload" />
  </div>
</template>

<script>
import * as receiptApi from '@/api/receipt/receipt'
import { getCodeList } from '@/views/common/dic'
import { arrayJoin } from '@/utils/index'
const upload = () => import('@/views/upload')

export default {
  name: 'PaperUpload',
  components: { upload },
  data () {
    return {
      legalNamesList: [],
      typeList: [],
      taxList: [],
      loading: false,
      status: 1,
      activeName: '0',
      tabList: [
        {
          label: '草稿', name: '0', count: 'draftSum'
        },
        {
          label: '已提交', name: '1', count: 'submitSum'
        },
        {
          label: '已校验', name: '2', count: 'checkedSum'
        }
      ],
      sum: {
        draftSum: 0,
        submitSum: 0,
        checkedSum: 0
      },
      statusDic: {
        0: '草稿',
        1: '已提交',
        2: '待复核',
        3: '已校验',
        4: '已取消'
      },
      rules: {
        legalName: [
          { required: true, message: '请选择法人', trigger: 'change' }
        ],
        legalinvoiceTypeName: [
          { required: true, message: '请选择发票类型', trigger: 'change' }
        ],
        invoiceNo: [
          { required: true, message: '请选择发票编号', trigger: 'change' }
        ],
        paperInvoiceNo: [
          { required: true, message: '请输入纸质发票号', trigger: 'blur' }
        ],
        invoiceType: [
          { required: true, message: '请选择发票类型', trigger: 'change' }
        ],
        taxRate: [
          { required: true, message: '请输入税率', trigger: 'change' }
        ],
        notaxAmount: [
          { required: true, message: '请输入未税额', trigger: 'change' }
        ],
        taxAmount: [
          { required: true, message: '请输入税额', trigger: 'change' }
        ],
        grossAmount: [
          { required: true, message: '请输入含税额', trigger: 'change' }
        ],
        invoiceTime: [
          { required: true, message: '请输入发票日期', trigger: 'change' }
        ]
      },
      query: {
        legalCode: [],
        invoiceType: [],
        invoiceNo: '',
        paperInvoiceNo: '',
        timeRange: [],
        startInvoiceTime: '',
        endInvoiceTime: '',
        queryStatus: null
      },
      height: null,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      selectList: [],
      taxForm: {
        rejectReason: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        legalName: '',
        legalCode: '',
        invoiceType: '',
        invoiceNo: '',
        paperInvoiceNo: '',
        taxRate: 0,
        taxAmount: 0,
        grossAmount: 0,
        notaxAmount: 0,
        invoiceTime: ''
      },
      invoiceNoList: [],
      uploadVisible: false,
      importUrl: receiptApi.uploadUrl
    }
  },
  created () {
    this.initTable(1)
    this.getSelectData()
    this.getLegalName()
    this.getinvoiceNoList()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    closeUpload () {
      this.uploadVisible = false
      this.initTable(1)
    },
    handleDetail (row, handleType) {
      this.handleType = handleType
      this.detailVisible = true
    },
    getLegalName () {
      receiptApi.getCorporateNameAndCode().then(res => {
        this.legalNamesList = res.data
      })
    },
    legalChange (item) {
      this.editForm.legalName = item.name
      this.editForm.legalCode = item.code
    },
    getinvoiceNoList () {
      receiptApi.getPurchaseInvoicePage({
        queryStatus: 5,
        page: 1,
        size: 200
      }).then((res) => {
        if (res.code === '0' && res.data) {
          this.invoiceNoList = res.data.srmFinancePurchaseInvoicePages.records
        }
      })
    },
    invoiceChange (item) {
      this.editForm.invoiceNo = item.invoiceNo
      this.editForm.invoiceId = item.id
    },
    tabClick (tab) {
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
    getSelectData () {
      getCodeList('code00071').then((list) => {
        this.typeList = list
      })
    },
    formatParams (nopage) {
      const params = Object.assign(
        {
          legalCode: arrayJoin(this.query.legalCode),
          invoiceNo: this.query.invoiceNo,
          paperInvoiceNo: this.query.paperInvoiceNo,
          invoiceType: arrayJoin(this.query.invoiceType),
          startInvoiceTime:
            this.query.timeRange && this.query.timeRange.length
              ? this.query.timeRange[0] + ' 00:00:00'
              : '',
          endInvoiceTime:
            this.query.timeRange && this.query.timeRange.length
              ? this.query.timeRange[1] + ' 23:59:59'
              : '',
          queryStatus: parseInt(this.activeName)
        },
        nopage
          ? {}
          : { page: this.tablePage.pageNum, size: this.tablePage.pageSize }
      )
      return params
    },
    handleAdd () {
      this.handleType = '新增'
      this.getinvoiceNoList()
      this.editVisible = true
    },
    handleEdit (row) {
      this.handleType = '编辑'
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editVisible = true
    },
    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          receiptApi.insertOrUpdatePaperInvoice(Object.assign({}, this.editForm, { status: 0 })).then((res) => {
            if (res.code === '0' && res.data) {
              this.showMessage('保存成功！', 'success')
              this.initTable()
              this.editClose()
            } else {
              this.showMessage(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        legalName: '',
        legalCode: '',
        invoiceType: '',
        invoiceNo: '',
        paperInvoiceNo: '',
        taxRate: 0,
        taxAmount: 0,
        grossAmount: 0,
        notaxAmount: 0,
        invoiceTime: ''
      }
    },
    handleDel (arr, status) {
      arr.map(item => item.status = status)
      receiptApi.submit(arr).then((res) => {
        if (res.code === '0' && res.data) {
          this.showMessage('操作成功！', 'success')
          this.initTable()
        }
      })
    },
    handleSubmit (arr, status) {
      if (arr.length) {
        arr.map(item => item.status = status)
        receiptApi.submit(arr).then((res) => {
          if (res.code === '0' && res.data) {
            this.showMessage('操作成功！', 'success')
            this.initTable()
          }
        })
      } else {
        this.showMessage('请选择至少一条数据提交！')
      }
    },
    downTemplate () {
      receiptApi.modelDownloadPaperInvoice()
    },
    handleExport () {
      if (!this.tableData.length) {
        this.$message.warning('列表无数据，无法导出')
        return
      }
      receiptApi.exportPaperInvoice(this.formatParams(true))
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.query.status = this.status
      receiptApi.getPaperInvoicePage(this.formatParams())
        .then((res) => {
          if (res.code === '0' && res.data) {
            const dataList = res.data.srmFinancePaperInvoiceDetailPage.records
            this.tableData = dataList
            this.tablePage.total = res.data.srmFinancePaperInvoiceDetailPage.total
            // 更新tab label数字
            // const curtab = this.tabList.filter(
            //   (tab) => tab.name === this.activeName
            // )[0]
            // curtab.count = res.data.total
            this.sum.draftSum = res.data.draftSum
            this.sum.submitSum = res.data.submitSum
            this.sum.checkedSum = res.data.checkedSum
            this.loading = false
          }
        })
    },
    resetQuery () {
      this.query = {
        legalCode: [],
        invoiceType: [],
        invoiceNo: '',
        paperInvoiceNo: '',
        timeRange: [],
        startInvoiceTime: '',
        endInvoiceTime: '',
        queryStatus: null
      }
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
</style>
