<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'operate_update'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'operate_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'operate_save'" type="primary" @click="handleSubmit">
        保存
      </j-button> -->
    </div>
    <j-table-with-page
      :columns="tableColumns"
      :data-source="tableData"
      :options="tableOptions"
      :fetch="initTable"
      :pagination="tablePage"
      :height="height"
      @selection-change="selectTable"
    />
    <!-- 新增、编辑 -->
    <j-dialog
      :title="handleType"
      :visible.sync="editVisible"
      :modal="false"
      :before-close="editClose"
      width="500px"
    >
      <j-form
        ref="editForm"
        size="mini"
        label-position="left"
        label-width="130px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="客户名称" prop="customerName">
          <j-input v-model="editForm.customerName" />
        </j-form-item>
        <j-form-item label="供应产品" prop="product">
          <j-input v-model="editForm.product" />
        </j-form-item>
        <j-form-item label="开始时间" prop="startTime">
          <j-date-picker
            v-model="editForm.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
          />
        </j-form-item>
        <j-form-item label="合作年限" prop="cooperationYear">
          <j-input v-model.number="editForm.cooperationYear" />
        </j-form-item>
        <j-form-item label="上年度业务额(万元)" prop="lastYearTurnover">
          <j-input v-model.number="editForm.lastYearTurnover" />
        </j-form-item>
        <j-form-item label="业务占比" prop="businessProportion">
          <j-input v-model="editForm.businessProportion" />
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
import * as poolApi from '@/api/supplier/pool'
const urlType = 'operate'

export default {
  data () {
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        customerName: '',
        startTime: '',
        cooperationYear: '',
        lastYearTurnover: '',
        businessProportion: '',
        product: ''
      },
      rules: {
        customerName: [{ required: true, message: '请输入客户名称', trigger: 'blur' }],
        product: [{ required: true, message: '请输入供应产品', trigger: 'blur' }],
        startTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'blur'
          }
        ],
        cooperationYear: [
          {
            required: true,
            message: '请输入合作年限',
            trigger: 'blur'
          },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        lastYearTurnover: [
          {
            required: true,
            message: '请输入上年度业务额(万元)',
            trigger: 'blur'
          },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        businessProportion: [
          {
            required: true,
            message: '请输入业务占比',
            trigger: 'blur'
          }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        // {
        //   label: '原材料', 
        //   render: (h, row) => <span>{this.matDic[row.rawMaterial]}</span>
        // },
        {
          prop: 'customerName',
          label: '客户名称'
        },
        {
          prop: 'product',
          label: '产品',
          width: '300px'
        },
        {
          prop: 'startTime',
          label: '开始时间'
        },
        {
          prop: 'cooperationYear',
          label: '合作年限'
          // width: '135'
        },
        {
          prop: 'lastYearTurnover',
          label: '上年度业务额(万元)'
          // width: '135'
        },
        {
          prop: 'businessProportion',
          label: '业务占比'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        },
        {
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vAuth={'operate_update'}
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
        toolbarBottom: false,
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
    this.height = this.calHeight(150).toString()
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
      if (this.tableSelectList.length) {
        poolApi
          .deleteBatchSrmHandle({
            type: urlType,
            ids: this.tableSelectList.map((row) => row.id)
          })
          .then((res) => {
            if (res.code === '0') {
              this.showMessage('删除成功!', 'success')
              this.initTable()
            } else {
              this.showMessage(res.message)
            }
          })
      } else {
        this.showMessage('请先选择要删除的行!')
      }
    },
    initTable () {
      poolApi
        .getSrmHandle({
          type: urlType,
          supplierId: this.$route.query.supplierId
        })
        .then((res) => {
          if (res.code === '0') {
            if (res.data) this.tableData = res.data
          }
        })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          poolApi
            .saveSrmHandle(
              Object.assign(
                { type: urlType, supplierId: this.$route.query.supplierId },
                this.editForm
              )
            )
            .then((res) => {
              if (res.code === '0') {
                this.editClose()
                this.showMessage('保存成功!', 'success')
                this.initTable()
              } else {
                this.showMessage(res.message)
              }
            })
        } else {
          return false
        }
      })
    },
    handleSubmit () {},
    editClose () {
      this.editVisible = false
      this.editForm = {
        customerName: '',
        startTime: '',
        cooperationYear: '',
        lastYearTurnover: '',
        businessProportion: '',
        product: ''
      }
    }
  }
}
</script>