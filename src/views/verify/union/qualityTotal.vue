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
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'insertOrUpdateRules'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'deleteRule'" @click="handleDel">
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
        <j-form-item label="名称" prop="name">
          <j-input v-model="editForm.name" />
        </j-form-item>
        <j-form-item label="说明" prop="illustrate">
          <j-input v-model="editForm.illustrate" />
        </j-form-item>
        <j-form-item label="优先级" prop="priority">
          <j-input v-model="editForm.priority" />
        </j-form-item>
        <j-form-item label="QPA" prop="qpa">
          <j-input v-model="editForm.qpa" />
        </j-form-item>
        <j-form-item label="QSA" prop="qsa">
          <j-input v-model="editForm.qsa" />
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
import { qualityTotalQuery, qualityTotalUpdate, qualityTotalDeleteId } from '@/api/verify/unionVerify'
import { returnIds } from '@/utils/index'
export default {
  name: 'QualityTotal',
  components: {},
  data () {
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        id: '',
        name: '',
        illustrate: '',
        priority: '',
        qpa: '',
        qsa: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'change' }
        ],
        illustrate: [
          { required: true, message: '请输入说明', trigger: 'change' }
        ],
        priority: [
          { required: true, message: '请输入优先级', trigger: 'change' }
        ],
        qpa: [
          { required: true, message: '请输入QPA', trigger: 'change' }
        ],
        qsa: [
          { required: true, message: '请输入QSA', trigger: 'change' }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'name',
          label: '名称'
        },
        {
          prop: 'illustrate',
          label: '说明'
        },
        {
          prop: 'priority',
          label: '优先级'
        },
        {
          prop: 'qpaCase',
          label: 'QPA'
        },
        {
          prop: 'qsaCase',
          label: 'QSA'
        },
        {
          prop: 'updUserName',
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
                vCheck={'insertOrUpdateRules'}
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
      groupNameDic: {
        0: '品质',
        1: '采购',
        2: '研发'
      },
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      tableOptions: {
        toolbarBottom: true,
        mutiSelect: true,
        index: true,
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
      this.editForm = JSON.parse(JSON.stringify(row))
      this.handleType = '编辑'
      this.editVisible = true
    },
    handleDel () {
      const ids = returnIds(this.tableSelectList).join()
      qualityTotalDeleteId({ ids: ids }).then(res => {
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
      qualityTotalQuery(params)
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
            qualityTotalUpdate(this.editForm).then(res => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            qualityTotalUpdate(this.editForm).then(res => {
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
        groupName: '',
        wholeMachineWeights: '',
        aleiWeight: '',
        bleiWeight: '',
        cleiWeight: ''
      }
    },
    detailClose () {
      this.detailVisible = false
    }
  }
}
</script>