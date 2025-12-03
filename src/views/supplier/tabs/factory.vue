<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'factory_update'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'factory_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'factory_save'" type="primary" @click="handleSubmit">
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
        label-width="125px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="工厂名称" prop="factoryName">
          <j-input v-model="editForm.factoryName" />
        </j-form-item>
        <j-form-item label="工厂编码">
          <j-input v-model="editForm.factoryCode" disabled />
        </j-form-item>
        <j-form-item label="地址名称" prop="addressName">
          <j-select v-model="editForm.addressName" value-key="id" @change="setAddress">
            <j-option
              v-for="item in addressList"
              :key="item.id"
              :label="item.addressName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="主要产品" prop="majorProduct">
          <j-input v-model="editForm.majorProduct" />
        </j-form-item>
        <j-form-item label="开始时间" prop="startTime">
          <j-date-picker
            v-model="editForm.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
          />
        </j-form-item>
        <j-form-item label="占地面积(平方米)" prop="floorArea">
          <j-input-number
            v-model="editForm.floorArea"
            :precision="0"
            :min="0"
            :controls="false"
          />
        </j-form-item>
        <j-form-item label="厂房面积(平方米)" prop="plantArea">
          <j-input-number
            v-model="editForm.plantArea"
            :precision="0"
            :min="0"
            :controls="false"
          />
        </j-form-item>
        <j-form-item label="实验室面积(平方米)" prop="laboratoryArea">
          <j-input-number
            v-model="editForm.laboratoryArea"
            :precision="0"
            :min="0"
            :controls="false"
          />
        </j-form-item>
        <j-form-item label="验货室面积(平方米)" prop="inspectionArea">
          <j-input-number
            v-model="editForm.inspectionArea"
            :precision="0"
            :min="0"
            :controls="false"
          />
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
const urlType = 'factory'

export default {
  data () {
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        factoryName: '',
        factoryCode: '',
        addressId: '',
        addressName: '',
        majorProduct: '',
        startTime: '',
        floorArea: '',
        plantArea: '',
        laboratoryArea: '',
        inspectionArea: ''
      },
      rules: {
        factoryName: [{ required: true, message: '请输入工厂名称', trigger: 'blur' }],
        addressName: [{ required: true, message: '请选择地址', trigger: 'blur' }],
        majorProduct: [{ required: true, message: '请输入主要产品', trigger: 'blur' }],
        startTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }
        ],
        floorArea: [
          {
            required: true,
            message: '请输入占地面积',
            trigger: 'change'
          }
        ],
        plantArea: [
          {
            required: true,
            message: '请输入厂房面积',
            trigger: 'change'
          }
        ],
        laboratoryArea: [
          {
            required: true,
            message: '请输入实验室面积',
            trigger: 'change'
          }
        ],
        inspectionArea: [
          {
            required: true,
            message: '请输入验货室面积',
            trigger: 'change'
          }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'factoryCode',
          label: '工厂编码'
        },
        {
          prop: 'factoryName',
          label: '工厂名称'
        },
        {
          prop: 'addressName',
          label: '地址名称'
        },
        {
          prop: 'majorProduct',
          label: '主要产品'
        },
        {
          prop: 'startTime',
          label: '开始时间'
        },
        {
          prop: 'floorArea',
          label: '占地面积(平方米)'
        },
        {
          prop: 'plantArea',
          label: '厂房面积(平方米)'
        },
        {
          prop: 'laboratoryArea',
          label: '实验室面积(平方米)'
        },
        {
          prop: 'inspectionArea',
          label: '验货室面积(平方米)'
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        },
        {
          prop: 'code',
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vAuth={'factory_update'}
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
      },
      addressList: []
    }
  },
  created () {
    this.initTable()
    this.getSelectData()
  },
  mounted () {
    this.height = this.calHeight(150).toString()
  },
  methods: {
    getSelectData () {
      poolApi.getAddressNameList({ id: this.$route.query.supplierId }).then((res) => {
        if (res.code === '0' && res.data) this.addressList = res.data
      })
    },
    setAddress (item) {
      this.editForm.addressId = item.id
      this.editForm.addressName = item.addressName
    },
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
        factoryName: '',
        factoryCode: '',
        addressId: '',
        addressName: '',
        majorProduct: '',
        startTime: '',
        floorArea: '',
        plantArea: '',
        laboratoryArea: '',
        inspectionArea: ''
      }
    }
  }
}
</script>