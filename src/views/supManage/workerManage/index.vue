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
        <j-form-item label="指标编码">
          <j-input v-model="query.projectName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="指标名称">
          <j-input v-model="query.projectName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="状态">
          <j-select v-model="query.standardAttributes" clearable>
            <j-option label="有效" :value="0" />
            <j-option label="无效" :value="1" />
          </j-select>
        </j-form-item>
        <j-form-item label="专业维度">
          <j-select v-model="query.standardAttributes" clearable>
            <j-option label="质量" :value="0" />
            <j-option label="成本" :value="1" />
            <j-option label="交期" :value="2" />
            <j-option label="服务" :value="3" />
            <j-option label="技术创新" :value="4" />
          </j-select>
        </j-form-item>
        <j-form-item label="审核维度">
          <j-select v-model="query.standardAttributes" clearable>
            <j-option label="品质" :value="0" />
            <j-option label="采购" :value="1" />
            <j-option label="PMC" :value="2" />
            <j-option label="研发" :value="3" />
            <j-option label="制造技术" :value="4" />
          </j-select>
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <!-- <j-button @click="handleAdd">
            新增
          </j-button>
          <j-button @click="handleDel">
            删除
          </j-button> -->
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button @click="initTable(1)">
            查询
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
        @selection-change="selectTable"
      />
    </j-card>
    <eidtDialog :edit-visible="editVisible" :edit-form="editForm" @editClose="editClose" />
  </div>
</template>

<script>
import { getStandardQuery, standardUpdate, standardDeleteId } from '@/api/verify/unionVerify'
import { returnIds } from '@/utils/index'
import eidtDialog from './editDialog'
export default {
  name: 'WorkerManage',
  components: { eidtDialog },
  data () {
    return {
      query: {
        orgName: '',
        corporateName: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        id: '',
        standardCode: '',
        standardName: '',
        standardAttributes: '',
        projectName: '',
        remark: ''
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'standardCode',
          label: '指标编码'
        },
        {
          prop: 'standardCode',
          label: '指标名称'
        },
        {
          prop: 'standardCode',
          label: '状态'
        },
        {
          prop: 'standardName',
          label: '考核维度'
        },
        {
          prop: 'remark',
          label: '审核维度'
        },
        {
          prop: 'updUserName',
          label: '来源'
        },
        {
          prop: 'updTime',
          label: '更新人'
        },
        {
          prop: 'updTime',
          label: '更新时间'
        },
        {
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
              编辑
              </j-button>
            </div>
          )
        }
      ],
      standardAttributesDic: {
        0: 'QSA',
        1: 'QPA',
        2: '采购',
        3: '研发'
      },
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
      },
      detailVisible: false,
      detailForm: {
        standardCode: '',
        standardName: '',
        standardAttributes: '',
        projectName: '',
        remark: ''
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
    // handleDetail (row) {
    //   this.detailForm = row
    //   this.detailVisible = true
    //   this.$refs.standardManageDetail.getDetailTable(row.id)
    // },
    handleImport () {},
    handleLoad () {},
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.handleType = '编辑'
      this.editVisible = true
    },
    handleDel () {
      const ids = returnIds(this.tableSelectList).join()
      standardDeleteId({ ids: ids }).then(res => {
        if (res.code === '0') {
          this.showMessage('删除成功！', 'success')
          this.initTable()
        } else {
          this.showMessage(res.message, 'error')
        }
      })
    },
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
      getStandardQuery(params)
        .then((res) => {
          this.tableData = res.data.records
          this.tablePage.total = res.data.total
          this.loading = false
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.handleType === '新增') {
            delete this.editForm.id
            standardUpdate(this.editForm).then(res => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            standardUpdate(this.editForm).then(res => {
              if (res.code === '0') {
                this.showMessage('修改成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          }
        }
      })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        id: '',
        standardCode: '',
        standardName: '',
        standardAttributes: '',
        projectName: '',
        remark: ''
      }
    },
    resetQuery () {
      this.query = {
        id: '',
        standardCode: '',
        standardName: '',
        standardAttributes: '',
        projectName: '',
        remark: ''
      }
    },
    detailClose () {
      this.detailVisible = false
    }
  }
}
</script>