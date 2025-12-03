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
        <j-form-item label="时间维度">
          <j-select v-model="query.timeDimension" clearable>
            <!-- <j-option
              v-for="(value, index) in timeDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            /> -->
            <j-option
              v-for="item in timeDimensionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="考核维度">
          <j-input v-model="query.accessDimensionName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="简称">
          <j-input v-model="query.shortName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getDimensionList'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'insertOrUpdateDimension'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'deleteBatchDimension'" @click="handleDel">
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
        <j-form-item label="时间维度" prop="timeDimension">
          <j-select v-model="editForm.timeDimension" clearable>
            <!-- <j-option
              v-for="(value, index) in timeDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            /> -->
            <j-option
              v-for="item in timeDimensionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="考核维度" prop="accessDimensionName">
          <j-input v-model="editForm.accessDimensionName" />
        </j-form-item>
        <j-form-item label="简称" prop="shortName">
          <j-input v-model="editForm.shortName" />
        </j-form-item>
        <j-form-item label="维度权重" prop="dimensionRatio">
          <j-input-number v-model.number="editForm.dimensionRatio" :controls="false" />&nbsp;&nbsp;%
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
import {
  getDimensionList,
  insertOrUpdateDimension,
  deleteBatchDimension
} from '@/api/kpi/dimension'
import { returnIds } from '@/utils/index'
import { timeDimensionList } from '@/views/common/dic'
export default {
  name: 'AssessModuleManage',
  data () {
    return {
      query: {
        timeDimension: '',
        accessDimensionName: '',
        shortName: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        timeDimension: '',
        accessDimensionName: '',
        shortName: '',
        dimensionRatio: ''
      },
      rules: {
        timeDimension: [
          { required: true, message: '请选择时间维度', trigger: 'change' }
        ],
        accessDimensionName: [
          { required: true, message: '请输入考核维度', trigger: 'blur' }
        ],
        shortName: [{ required: true, message: '请输入简称', trigger: 'blur' }],
        dimensionRatio: [
          { required: true, message: '请输入维度权重', trigger: 'blur' }
        ]
      },
      // timeDic: {
      //   0: '周',
      //   1: '半月度',
      //   2: '月度',
      //   3: '季度',
      //   4: '半年度',
      //   5: '年度'
      // },
      timeDimensionList: [],
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'timeDimension',
          label: '时间维度',
          // render: (h, row) => <span>{this.timeDic[row.timeDimension]}</span>
          render: (h, row) => (
            <span>
              {row.timeDimension !== undefined && row.timeDimension !== null
                ? this.timeDimensionList[row.timeDimension].label
                : ''}
            </span>
          )
        },
        {
          prop: 'accessDimensionName',
          label: '考核维度'
        },
        {
          prop: 'shortName',
          label: '简称'
        },
        {
          prop: 'dimensionRatioCase',
          label: '维度权重'
          // render: (h, row) => (
          //   <span>{Number(row.dimensionRatio) * 100 + '%'}</span>
          // )
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
                vCheck={'insertOrUpdateDimension'}
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
    this.timeDimensionList = timeDimensionList
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
      deleteBatchDimension({ ids }).then((res) => {
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
      getDimensionList(params)
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
    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const {
            timeDimension,
            accessDimensionName,
            shortName,
            dimensionRatio
          } = this.editForm
          const params = Object.assign(
            { timeDimension, accessDimensionName, shortName, dimensionRatio },
            this.handleType === '编辑'
              ? {
                id: this.editForm.id,
                timeDimensionId: this.editForm.timeDimensionId
              }
              : {}
          )
          insertOrUpdateDimension(params).then((res) => {
            if (res && res.code === '0') {
              this.showMessage('操作成功！', 'success')
              this.editClose()
              this.initTable()
            } else {
              this.showMessage(res.message, 'error')
            }
          })
        }
      })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        timeDimension: '',
        accessDimensionName: '',
        shortName: '',
        dimensionRatio: ''
      }
    },
    resetQuery () {
      this.query = {
        timeDimension: '',
        accessDimensionName: '',
        shortName: ''
      }
    }
  }
}
</script>