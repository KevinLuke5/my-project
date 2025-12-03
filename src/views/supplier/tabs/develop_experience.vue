<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'develop_experience_update'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'develop_experience_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'develop_experience_save'" type="primary" @click="handleSubmit">
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
        label-width="95px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="名称" prop="productName">
          <j-input v-model="editForm.productName" />
        </j-form-item>
        <j-form-item label="类型" prop="productType">
          <j-select v-model="editForm.productType" @change="changeVaild">
            <j-option label="整机" :value="0" />
            <j-option label="配件" :value="1" />
          </j-select>
        </j-form-item>
        <j-form-item label="产品线" prop="productLineName">
          <j-select
            v-model="editForm.productLineName"
            value-key="name"
            filterable
            allow-create
            default-first-option
            @change="setProductLine"
          >
            <j-option
              v-for="item in lineList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="大类" prop="generalCategoryName">
          <j-select
            v-model="editForm.generalCategoryName"
            value-key="bigTypeName"
            filterable
            allow-create
            default-first-option
            @change="getSmallType"
          >
            <j-option
              v-for="item in bigTypeList"
              :key="item.id"
              :label="item.bigTypeName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="小类" prop="subclassCategoryName">
          <j-select
            v-model="editForm.subclassCategoryName"
            value-key="name"
            filterable
            allow-create
            default-first-option
            @change="setSmallType"
          >
            <j-option
              v-for="item in smallTypeList"
              :key="item.id"
              :label="item.smallTypeName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="开始时间" prop="startTime">
          <j-date-picker
            v-model="editForm.startTime"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
          />
        </j-form-item>
        <j-form-item label="研发年限" prop="developeYears">
          <j-input-number
            v-model="editForm.developeYears"
            :precision="0"
            :min="0"
            :controls="false"
          />
        </j-form-item>
        <j-form-item label="研发产品数量" prop="developeQty">
          <j-input-number
            v-model="editForm.developeQty"
            :precision="0"
            :min="0"
            :controls="false"
          />
        </j-form-item>
        <j-form-item label="说明" prop="remark">
          <j-input v-model="editForm.remark" :rows="3" type="textarea" />
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
const urlType = 'develop_experience'

export default {
  data () {
    const checkBigType = (rule, value, callback) => {
      if (this.editForm.productType === 1) {
        if (value) {
          callback()
        } else {
          callback(new Error('请选择大类'))
        }
      } else {
        callback()
      }
    }
    const checkSmallType = (rule, value, callback) => {
      if (this.editForm.productType === 1) {
        if (value) {
          callback()
        } else {
          callback(new Error('请选择小类'))
        }
      } else {
        callback()
      }
    }
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        productName: '',
        productType: '',
        startTime: '',
        developeYears: '',
        developeQty: '',
        remark: '',
        productLineId: '',
        productLineName: '',
        generalCategoryId: '',
        generalCategoryName: '',
        subclassCategoryId: '',
        subclassCategoryName: ''
      },
      rules: {
        productName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        productType: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        productLineName: [
          { required: true, message: '请选择产品线', trigger: 'change' }
        ],
        generalCategoryName: [
          { required: true, validator: checkBigType, trigger: 'blur' }
        ],
        subclassCategoryName: [
          { required: true, validator: checkSmallType, trigger: 'blur' }
        ],
        startTime: [
          {
            required: true,
            message: '请选择开始时间',
            trigger: 'change'
          }
        ],
        developeYears: [
          {
            required: true,
            message: '请输入研发年限',
            trigger: 'change'
          }
        ],
        developeQty: [
          {
            required: true,
            message: '请输入研发产品数量',
            trigger: 'change'
          }
        ],
        remark: [{ required: true, message: '请输入说明', trigger: 'change' }]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'productName',
          label: '产品名称'
        },
        {
          label: '类型',
          render: (h, row) => <span>{row.productType ? '配件' : '整机'}</span>
        },
        {
          prop: 'productLineName',
          label: '产品线'
        },
        {
          prop: 'generalCategoryName',
          label: '大类'
        },
        {
          prop: 'subclassCategoryName',
          label: '小类'
        },
        {
          prop: 'startTime',
          label: '开始时间'
        },
        {
          prop: 'developeYears',
          label: '研发年限'
        },
        {
          prop: 'developeQty',
          label: '研发产品数量'
        },
        {
          prop: 'remark',
          label: '说明'
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
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vAuth={'develop_experience_update'}
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
      lineList: [],
      bigTypeList: [],
      smallTypeList: []
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
      poolApi.getPdtLineList().then((res) => {
        if (res.code === '0' && res.data) this.lineList = res.data.records
      })
      poolApi.getBigCategoryList().then((res) => {
        if (res.code === '0' && res.data) this.bigTypeList = res.data
      })
    },
    getSmallType (item) {
      this.setBigType(item)
      poolApi
        .getSmallCategoryList({
          page: 1,
          size: 500,
          bigTypeName: item.bigTypeName
        })
        .then((res) => {
          if (res.code === '0' && res.data)
            this.smallTypeList = res.data.records
        })
    },
    setProductLine (item) {
      if (typeof item === 'string') {
        this.editForm.productLineId = ''
        this.editForm.productLineName = item
      } else {
        this.editForm.productLineId = item.id
        this.editForm.productLineName = item.name
      }
    },
    setBigType (item) {
      if (typeof item === 'string') {
        this.editForm.generalCategoryId = ''
        this.editForm.generalCategoryName = item
      } else {
        this.editForm.generalCategoryId = item.id
        this.editForm.generalCategoryName = item.bigTypeName
      }
    },
    setSmallType (item) {
      if (typeof item === 'string') {
        this.editForm.subclassCategoryId = ''
        this.editForm.subclassCategoryName = item
      } else {
        this.editForm.subclassCategoryId = item.id
        this.editForm.subclassCategoryName = item.smallTypeName
      }
    },
    changeVaild (type) {
      // this.$refs.editForm.clearValidate()
      this.$refs.editForm.validate()
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
    showViewer (url) {
      this.$refs.imgViewer.show(url)
    },
    showPdf (url) {
      this.$refs.pdfViewer.show(url)
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
        productName: '',
        productType: '',
        startTime: '',
        developeYears: '',
        developeQty: '',
        remark: '',
        productLineId: '',
        productLineName: '',
        generalCategoryId: '',
        generalCategoryName: '',
        subclassCategoryId: '',
        subclassCategoryName: ''
      }
    }
  }
}
</script>