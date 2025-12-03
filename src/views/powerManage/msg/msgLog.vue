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
        <j-form-item label="类型">
          <j-select v-model="query.type" clearable multiple>
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="用户">
          <j-input v-model="query.userName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="账号类型">
          <j-select v-model="query.accountType" clearable>
            <j-option label="九阳" value="0" />
            <j-option label="供应商" value="5" />
          </j-select>
        </j-form-item>
        <j-form-item label="状态">
          <j-select v-model="query.status" clearable>
            <j-option label="发送成功" :value="0" />
            <j-option label="发送失败" :value="1" />
          </j-select>
        </j-form-item>
        <j-form-item label="所属公司">
          <j-input v-model="query.companyName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="发送日期">
          <j-date-picker
            v-model="query.timeRange"
            type="datetimerange"
            range-separator="~"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getLogByPage'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'getLogByPage'" @click="handleExport">
            导出
          </j-button>
        </j-form-item>
      </j-form>

      <j-table-with-page
        :columns="tableColumns"
        :data-source="tableData"
        :options="tableOptions"
        :fetch="initTable"
        :pagination="tablePage"
        :height="height"
      />
    </j-card>
  </div>
</template>

<script>
import * as msgApi from '@/api/msg'
import { getCodeList } from '@/views/common/dic'

export default {
  name: 'MsgLog',
  data () {
    return {
      query: {
        userName: '',
        companyName: '',
        type: [],
        accountType: '',
        status: '',
        timeRange: [],
        startSendTime: '',
        endSendTime: ''
      },
      height: null,
      tableData: [],
      tableColumns: [
        {
          label: '类型',
          render: (h, row) => (
            <span>
              {this.typeList.length
                ? (
                  this.typeList.find((dic) => dic.lineNumber === row.type) || {
                    name: ''
                  }
                ).name
                : ''}
            </span>
          )
        },
        {
          prop: 'userName',
          label: '账号',
          width: '200px'
        },
        {
          prop: 'companyName',
          label: '所属公司',
          width: '180px'
        },
        {
          label: '账号类型',
          render: (h, row) => (
            <span>
              {row.accountType === '0'
                ? '九阳'
                : row.accountType === '5'
                  ? '供应商'
                  : '其他'}
            </span>
          )
        },
        {
          prop: 'sendTime',
          label: '发送时间',
          width: '180px'
        },
        {
          label: '状态',
          render: (h, row) => (
            <span>
              {row.status === 0
                ? '成功'
                : row.status === 1
                  ? '失败'
                  : ''}
            </span>
          )
        },
        {
          prop: 'sendContent',
          label: '发送内容',
          width: '180px'
        },
        {
          prop: 'errorReason',
          label: '失败原因',
          width: '180px'
        }
      ],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      tableOptions: {
        toolbarBottom: true,
        mutiSelect: false,
        index: false,
        loading: false,
        initTable: false
      },
      typeList: []
    }
  },
  created () {
    this.initTable(1)
    this.getSelectData()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    getSelectData () {
      getCodeList('code00067').then((list) => {
        this.typeList = list
      })
    },
    handleExport (row) {},
    formatParams (nopage) {
      const params = Object.assign(
        {}, this.query,
        {
          type: this.query.type.length ? this.query.type.join(',') : null,
          startSendTime:
            this.query.timeRange && this.query.timeRange.length
              ? this.query.timeRange[0]
              : '',
          endSendTime:
            this.query.timeRange && this.query.timeRange.length
              ? this.query.timeRange[1]
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
      this.tableOptions.loading = true
      msgApi
        .getLogByPage(this.formatParams())
        .then((res) => {
          if (res.code === '0' && res.data) {
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
          }
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    resetQuery () {
      this.query = {
        userName: '',
        companyName: '',
        type: [],
        accountType: '',
        status: '',
        timeRange: [],
        startSendTime: '',
        endSendTime: ''
      }
    }
  }
}
</script>