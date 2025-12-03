<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-form
        class="head-container"
        size="mini"
        :inline="true"
        label-position="left"
        label-width="76px"
        :model="query"
      >
        <j-form-item label="产品线">
          <j-input v-model="query.prodlineName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="物料类型">
          <j-input v-model="query.itemType" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="物料编码">
          <j-input v-model="query.itemCode" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="物料描述">
          <j-input v-model="query.itemName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'materialList'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <!-- <j-button>
            导出
          </j-button> -->
        </j-form-item>
      </j-form>

      <j-table-with-page
        :columns="tableColumns"
        :data-source="tableData"
        :options="tableOptions"
        :fetch="initTable"
        :pagination="tablePage"
        :height="height"
        @selection-change="selectTable"
      />
    </j-card>
  </div>
</template>

<script>
import { getQuery } from '@/api/base/materialManage'
export default {
  name: 'MaterialManage',
  components: {},
  data () {
    return {
      query: {
        code: '',
        name: '',
        status: '',
        important: '',
        linename: '',
        bigType: '',
        smallType: '',
        profession: ''
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'itemCode',
          label: '物料编码',
          width: 150
        },
        {
          prop: 'itemName',
          label: '物料描述',
          width: 250
        },
        {
          prop: 'brandName',
          label: '品牌'
        },
        {
          prop: 'prodGroupName',
          label: '产品组'
        },
        {
          prop: 'prodlineName',
          label: '产品线'
        },
        {
          prop: 'itemSeries',
          label: '系列'
        },
        {
          prop: 'itemModel',
          label: '型号'
        },
        {
          prop: 'itemType',
          label: '物料类型'
        },
        {
          prop: 'ipBigCode',
          label: '大类编码'
        },
        {
          prop: 'ipBigName',
          label: '大类'
        },
        {
          prop: 'ipSmallCode',
          label: '小类编码'
        },
        {
          prop: 'ipSmallName',
          label: '小类'
        },
        {
          prop: 'box',
          label: '装箱台数'
        },
        {
          prop: 'm3',
          label: '体积'
        },
        {
          prop: 'kg',
          label: '重量'
        },
        {
          prop: 'cdtime',
          label: '关键件标识'
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
    this.initTable()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    // 表格查询
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum
      })
      getQuery(params)
        .then((res) => {
          this.tableData = res.data.records
          this.tablePage.total = res.data.total
          this.loading = false
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    resetQuery () {
      this.query = {
        code: '',
        name: '',
        status: '',
        important: '',
        linename: '',
        bigType: '',
        smallType: '',
        profession: ''
      }
    }
  }
}
</script>
