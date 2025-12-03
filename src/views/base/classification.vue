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
        <j-form-item label="分类维度">
          <j-input v-model="query.dimension" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="分类级别">
          <j-input v-model="query.level" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'classList'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'classSaveOrUpdate'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'classDelete'" @click="handleDel">
            删除
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
    <!-- 新增、编辑 -->
    <j-dialog
      :title="handleType"
      :visible.sync="editVisible"
      :modal="false"
      :before-close="editClose"
      width="400px"
    >
      <j-form
        ref="editForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="分类维度" prop="dimension">
          <j-input v-model="editForm.dimension" />
        </j-form-item>
        <j-form-item label="分类级别" prop="level">
          <j-input v-model="editForm.level" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="editSave">保存</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import { getQuery, update, deleteId } from '@/api/base/classification'
import { returnIds } from '@/utils/index'

export default {
  name: 'classification',
  components: {},
  data () {
    return {
      query: {
        dimension: '',
        level: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        dimension: '',
        level: ''
      },
      rules: {
        dimension: [
          { required: true, message: '请输入分类维度', trigger: 'change' }
        ],
        level: [
          { required: true, message: '请输入分类级别', trigger: 'change' }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'dimension',
          label: '分类维度'
        },
        {
          prop: 'level',
          label: '分类级别 '
        },
        {
          label: '操作',
          render: (h, row) => (
            <j-button
              type="text"
              size="mini"
              vCheck={'classSaveOrUpdate'}
              onClick={() => {
                this.handleEdit(row)
              }}
            >
              编辑
            </j-button>
          )
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
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.handleType = '编辑'
      this.editForm.id = row.id
      this.editForm.dimension = row.dimension
      this.editForm.level = row.level
      this.editVisible = true
    },
    handleDel () {
      const ids = returnIds(this.tableSelectList).join()
      deleteId({ ids: ids }).then((res) => {
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

    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.handleType === '新增') {
            delete this.editForm.id
            update(this.editForm).then((res) => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            update(this.editForm).then((res) => {
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
        dimension: '',
        level: ''
      }
    },
    resetQuery () {
      this.query = {
        dimension: '',
        level: ''
      }
    }
  }
}
</script>
