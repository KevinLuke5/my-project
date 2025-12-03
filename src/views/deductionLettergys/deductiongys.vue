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
            v-model="query.legalNames"
            multiple
            clearable
            :collapse-tags="true"
            filterable
          >
            <j-option
              v-for="item in legalNamesList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="库存组织">
          <j-select
            v-model="query.inventoryOrganizationCodes"
            clearable
            multiple
            :collapse-tags="true"
            filterable
          >
            <j-option
              v-for="item in queryList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="类型">
          <j-select v-model="query.types" clearable multiple>
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.label"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="发生日期">
          <j-date-picker
            v-model="query.occurTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item label="扣款函单号">
          <j-input v-model="query.letterNo" placeholder="扣款函单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="对账单号">
          <j-input v-model="query.checkAccountNo" placeholder="对账单号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="发票编号">
          <j-input v-model="query.invoiceNo" placeholder="发票编号" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="发布日期">
          <j-date-picker
            v-model="query.releaseDate"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          />
        </j-form-item>
        <j-form-item label="公文标题">
          <j-input v-model="query.officialTitle" placeholder="模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="问题描述">
          <j-input v-model="query.problemDescription" placeholder="模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="备注">
          <j-input v-model="query.remark" placeholder="模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'deductiongys-selectPage'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-if="status === 1" v-check="'deductiongys-exportRelease'" @click="handleExport">
            导出
          </j-button>
          <j-button v-if="status === 2" v-check="'deductiongys-exportAccount'" @click="handleExport">
            导出
          </j-button>
          <j-button v-if="status === 3" v-check="'deductiongys-exportDraw'" @click="handleExport">
            导出
          </j-button>
        </j-form-item>
      </j-form>
      <j-tabs v-model="activeName" @tab-click="tabClick">
        <j-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.label + '（' + item.count + '）'"
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
        @selection-change="handleSelect"
      >
        <j-table-column prop="legalName" width="120" label="法人" />
        <j-table-column prop="letterNo" label="扣款函单号" min-width="90" />
        <j-table-column prop="officialTitle" label="公文标题" />
        <j-table-column prop="type" label="类型" />
        <j-table-column prop="problemDescription" label="问题描述" />
        <j-table-column prop="currency" label="币种" />
        <j-table-column prop="money" width="160">
          <template slot="header" slot-scope="{}">
            <span>扣款金额（含税）</span>
            <j-tooltip effect="dark" placement="top">
              <i class="el-icon-question" />
              <div slot="content">
                <p>负金额：供应商低开，正金额：供应商高开</p>
              </div>
            </j-tooltip>
          </template>
        </j-table-column>
        <j-table-column prop="occurTime" label="发生日期" />
        <j-table-column prop="applicant" label="申请人" />
        <j-table-column prop="remark" label="备注" />
        <j-table-column prop="attachment" width="180" label="附件">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.attachment" :key="index">
              <j-button type="text" @click="downloadFile(item.url)">
                {{ item.name }}
              </j-button>
            </div>
          </template>
        </j-table-column>
        <j-table-column prop="releaseDate" label="发布日期" />
        <j-table-column prop="releaseUser" label="发布人" />
        <j-table-column
          v-if="tabName === 'three' || tabName === 'second'"
          :key="33"
          prop="checkAccountNo"
          width="90"
          label="对账单号"
        />
        <j-table-column
          v-if="tabName === 'three'"
          :key="44"
          prop="invoiceNo"
          label="发票编号"
        />
        <j-table-column prop="status" label="状态" width="120">
          <template slot-scope="scope">
            {{ scope.row.status === 1 ? '已发布' : scope.row.status === 2 ? '已对账' : '已开票' }}
          </template>
        </j-table-column>
        <j-table-column prop="inventoryOrganizationName" label="库存组织" />
        <j-table-column prop="supplierLocationName" label="供应商地点" />
      </j-table>
      <div class="page">
        <j-pagination
          :current-page="currentPage"
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
import * as deductionLetterApi from '@/api/deductionLetter/index'
import { changeTime } from '@/utils/timeStyle'
import { filesView } from '@/api/upload'
import * as supplierApi from '@/api/supplier/pool'
import * as baseApi from '@/api/base/deductionLetter'
import { getCodeList } from '@/views/common/dic'
// import generateDelivery from '@/views/deliveryManage/components/generateDelivery'

export default {
  name: 'Deductiongys',
  props: {
    type: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      legalNamesList: [],
      firstCount: 0,
      secondCount: 0,
      threeCount: 0,
      loading: false,
      tabName: '',
      orderTypeList: [],
      status: 1,
      activeName: '1',
      tabList: [
        {
          label: '已发布', name: '1', count: 0
        },
        {
          label: '已对账', name: '2', count: 0
        },
        {
          label: '已开票', name: '3', count: 0
        }
      ],
      queryList: [],
      pdtLineList: [],
      deliverySchedylingVisible: false,
      detailVisible: false,
      rules: {
        rejectReason: [
          { required: true, message: '请输入拒绝原因', trigger: 'change' }
        ]
      },
      query: {
        types: '',
        occurTime: [],
        releaseDate: [],
        inventoryOrganizationCodes: '',
        legalNames: '',
        letterNo: '',
        invoiceNo: '',
        checkAccountNo: '',
        officialTitle: '',
        problemDescription: '',
        remark: ''
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      categoryList: [],
      typeList: [],
      checkVisible: false,
      checkForm: {
        rejectReason: ''
      },
      generateDeliveryForm: {},
      multipleSelection: [],
      currentPage: 1
    }
  },
  created () {
    this.initTable(1)
    this.getSelectData()
    this.getLegalName()
    this.getOrg()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    downloadFile (item) {
      filesView({
        bucket: 'jy-srm',
        region: 'oss-cn-hangzhou',
        account: 'ramoss',
        objectName: item
      }).then((result) => {
        if (result.code === '0' && result.data.fileUrl) {
          console.log(result.data.fileUrl)
          window.open(result.data.fileUrl)
        } else {
          this.showMessage(result.message)
        }
      })
    },
    getLegalName () {
      baseApi.getLegalName().then(res => {
        const list = []
        res.data.forEach(item => {
          list.push({
            value: item.legalName,
            label: item.legalName
          })
        })
        this.legalNamesList = list
      })
    },
    getOrg () {
      baseApi.getOrg().then(res => {
        const list = []
        res.data.forEach(item => {
          list.push({
            value: item.orgCode,
            label: item.orgName
          })
        })
        this.queryList = list
      })
    },
    handleSelect (val) {
      this.selectList = val
    },
    tabClick (tab) {
      console.log(tab.name)
      console.log(this.activeName)
      this.status = parseInt(this.activeName)
      this.initTable()
    },
    //  // 初始页currentPage、初始每页数据数pagesize和数据data
    handleSizeChange: function (size) {
      this.tablePage.pageSize = size
      this.currentPage = 1
      this.initTable(1)
    },
    handleCurrentChange: function (currentPage) {
      this.tablePage.pageNum = currentPage
      this.initTable(currentPage)
    },
    getSelectData () {
      getCodeList('code00064').then((list) => {
        const newList = []
        list.forEach(item => {
          newList.push({
            value: item.name,
            label: item.name
          })
        })
        console.log(newList)
        this.typeList = newList
      })
    },
    handleExport () {
      if (!this.tableData.length) {
        this.$message.warning('列表无数据，无法导出')
        return
      }
      const params = {
        status: this.status
      }
      for (const k in this.query) {
        if (this.query[k].value) params[k] = this.query[k].value
      }
      if (!params.inventoryOrganizationCodes) {
        params.inventoryOrganizationCodes = []
      }
      if (!params.legalNames) {
        params.legalNames = []
      }
      if (!params.types) {
        params.types = []
      }
      params.inventoryOrganizationCodes = params.inventoryOrganizationCodes.join(',')
      params.legalNames = params.legalNames.join(',')
      params.types = params.types.join(',')
      this.queryParams = {
        ...params,
        size: this.tablePage.pageSize,
        current: this.tablePage.pageNum
      }
      if (this.status === 1) {
        deductionLetterApi.exportRelease(this.queryParams)
      }
      if (this.status === 2) {
        deductionLetterApi.exportAccount(this.queryParams)
      }
      if (this.status === 3) {
        deductionLetterApi.exportDraw(this.queryParams)
      }
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      let query = JSON.parse(JSON.stringify(this.query))
      if (query.types instanceof Array) {
        query.types = query.types.join(',')
      }
      if (query.inventoryOrganizationCodes instanceof Array) {
        query.inventoryOrganizationCodes = query.inventoryOrganizationCodes.join(',')
      }
      if (query.legalNames instanceof Array) {
        query.legalNames = query.legalNames.join(',')
      }
      if (query.occurTime && query.occurTime.length > 0) {
        query = Object.assign(query, changeTime(query.occurTime, 'startOccurTime', 'endOccurTime'))
      }
      if (query.releaseDate && query.releaseDate.length > 0) {
        query = Object.assign(query, changeTime(query.releaseDate, 'startReleaseDate', 'endReleaseDate'))
      }
      delete query.occurTime
      delete query.releaseDate
      query.status = this.status
      const params = Object.assign({}, query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum
      })
      console.log(params)
      deductionLetterApi.selectPage(params)
        .then((res) => {
          console.log(this.status)
          if (this.query.legalNames.length > 0) {
            this.query.legalNames = this.query.legalNames.split(',')
          }
          if (this.query.types.length > 0) {
            this.query.types = this.query.types.split(',')
          }
          if (this.query.inventoryOrganizationCodes.length > 0) {
            this.query.inventoryOrganizationCodes = this.query.inventoryOrganizationCodes.split(',')
          }
          if (res.code === '0' && res.data) {
            this.tableData = res.data.srmFinanceDeductMoneyLetterIPage.records
            this.tablePage.total = res.data.srmFinanceDeductMoneyLetterIPage.total
            // 更新tab label数字
            this.tabList[0].count = res.data.publishedSum
            this.tabList[1].count = res.data.checkAccountCount
            this.tabList[2].count = res.data.invoiceSum
            this.loading = false
          }
        })
    },
    resetQuery () {
      this.query = {
        types: '',
        inventoryOrganizationCodes: '',
        legalNames: '',
        letterNo: '',
        invoiceNo: '',
        checkAccountNo: '',
        officialTitle: '',
        problemDescription: '',
        remark: '',
        releaseDate: [],
        occurTime: []
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
</style>
