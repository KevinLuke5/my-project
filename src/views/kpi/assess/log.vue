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
        <j-form-item label="日志标题">
          <j-input v-model="query.title" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="处理时间">
          <j-date-picker
            v-model="query.timeRange"
            type="datetimerange"
            range-separator="~"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getBill'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
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
import { getBillLog, exportLogDetail } from '@/api/kpi/assess'

export default {
  name: 'AssessLog',
  data () {
    return {
      query: {
        title: '',
        timeRange: [],
        startTime: '',
        endTime: ''
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'title',
          label: '日志标题'
        },
        {
          prop: 'startTime',
          label: '开始处理时间'
        },
        {
          prop: 'endTime',
          label: '结束处理时间'
        },
        {
          label: '记录详情',
          render: (h, row) => (
            <j-button
              type="text"
              size="mini"
              onClick={() => {
                this.download(row.id)
              }}
            >
                下载
            </j-button>
          )
        },
        {
          prop: 'totalCount',
          label: '总条数'
        },
        {
          prop: 'failCount',
          label: '失败条数'
        }
      ],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      tableOptions: {
        toolbarBottom: true,
        mutiSelect: true,
        index: false,
        loading: false,
        initTable: false
      }
    }
  },
  created () {
    this.initTable(1)
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum,
        title: this.query.title,
        startTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[0]
            : '',
        endTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[1]
            : ''
      }
      getBillLog(params)
        .then((res) => {
          if (res && res.code === '0') {
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
          }
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    download (logId) {
      if (logId) exportLogDetail({ logId })
    },
    resetQuery () {
      this.query = {
        title: '',
        timeRange: [],
        startTime: '',
        endTime: ''
      }
    }
  }
}
</script>