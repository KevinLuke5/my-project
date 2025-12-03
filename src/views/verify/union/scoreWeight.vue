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
          <j-button v-check="'weightsInsert'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'weightsDelete'" @click="handleDel">
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
        <j-form-item label="审厂模块" prop="groupName">
          <j-select v-model="editForm.groupName" clearable>
            <j-option label="品质" :value="0" />
            <j-option label="采购" :value="1" />
            <j-option label="研发" :value="2" />
          </j-select>
        </j-form-item>
        <j-form-item label="整机权重" prop="wholeMachineWeights">
          <j-input v-model="editForm.wholeMachineWeights" suffix-icon="%" />
        </j-form-item>
        <j-form-item label="A类权重" prop="aleiWeight">
          <j-input v-model="editForm.aleiWeight" />
        </j-form-item>
        <j-form-item label="B类权重" prop="bleiWeight">
          <j-input v-model="editForm.bleiWeight" />
        </j-form-item>
        <j-form-item label="C类权重" prop="cleiWeight">
          <j-input v-model="editForm.cleiWeight" />
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
import { scoreWeightQuery, scoreWeightUpdate, scoreWeightDeleteId } from '@/api/verify/unionVerify'
import { returnIds } from '@/utils/index'
export default {
  name: 'StandardManage',
  components: { },
  data () {
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        id: '',
        groupName: '',
        wholeMachineWeights: '',
        aleiWeight: '',
        bleiWeight: '',
        cleiWeight: ''
      },
      rules: {
        groupName: [
          { required: true, message: '请选择审厂模块', trigger: 'change' }
        ],
        wholeMachineWeights: [
          { required: true, message: '请输入整机权重', trigger: 'change' }
        ],
        aleiWeight: [
          { required: true, message: '请输入A类权重', trigger: 'change' }
        ],
        bleiWeight: [
          { required: true, message: '请输入B类权重', trigger: 'change' }
        ],
        cleiWeight: [
          { required: true, message: '请输入C类权重', trigger: 'change' }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'groupName',
          label: '审厂模块',
          render: (h, row) => <span>{this.groupNameDic[row.groupName]}</span>
        },
        {
          prop: 'wholeMachineWeightsCase',
          label: '整机权重'
        },
        {
          prop: 'aleiWeightCase',
          label: 'A类权重'
        },
        {
          prop: 'bleiWeightCase',
          label: 'B类权重'
        },
        {
          prop: 'cleiWeightCase',
          label: 'C类权重'
        },
        {
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vCheck={'weightsInsert'}
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
      scoreWeightDeleteId({ ids: ids }).then(res => {
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
      scoreWeightQuery(params)
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
            scoreWeightUpdate(this.editForm).then(res => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            scoreWeightUpdate(this.editForm).then(res => {
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