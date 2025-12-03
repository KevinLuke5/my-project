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
        <j-form-item label="供应商编码">
          <j-input v-model="query.supplierCode" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="供应商名称">
          <j-input v-model="query.supplierName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="业务类型">
          <j-input v-model="query.businessType" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="BU">
          <!-- <j-input v-model="query.department" @keyup.enter.native="initTable(1)" /> -->
          <j-select v-model="query.department" value-key="lineNumber">
            <j-option
              v-for="item in buList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="采购负责人">
          <j-input v-model="query.purchaseUserName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getSupPurchaseList'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'insertOrUpdateSupPurchase'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'deleteBatchSupurchase'" @click="handleDel">
            删除
          </j-button>
          <j-button v-check="'modelDownloadPurchase'" @click="importTemplate">
            下载模板
          </j-button>
          <j-button v-check="'uploadPurchaseExcelFile'" @click="handleImport">
            导入模板
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

      <!-- 导入 -->
      <j-dialog title="导入" :visible.sync="uploadVisible" width="400px">
        <j-upload
          ref="upload"
          :limit="10"
          :show-file-list="true"
          :auto-upload="false"
          :action="uploadUrl"
          :on-exceed="exceedWarn"
          :on-success="uploadSuccess"
        >
          <j-button slot="trigger" size="mini" type="info">
            选取文件
          </j-button>
          <j-button
            style="margin-left: 10px"
            size="mini"
            type="primary"
            @click="submitUpload"
          >
            提交
          </j-button>
          <div slot="tip" class="j-upload__tip">
            只能上传Excel文件
          </div>
        </j-upload>
      </j-dialog>
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
        <j-form-item label="供应商" prop="supplierName">
          <j-select
            v-model="editForm.supplierName"
            value-key="id"
            filterable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="searchSupplier"
            :loading="loading"
            @change="setSupplier"
          >
            <j-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="业务类型" prop="businessType">
          <j-select
            v-model="editForm.businessType"
            value-key="smallTypeCode"
            filterable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="getSmallType"
            :loading="loading"
          >
            <j-option
              v-for="item in smallTypeList"
              :key="item.smallTypeCode"
              :label="item.smallTypeName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <!-- todo接口拿 -->
        <j-form-item label="BU" prop="department">
          <!-- <j-select v-model="editForm.standardAttributes" clearable>
            <j-option label="西式BU" :value="0" />
            <j-option label="成本" :value="1" />
            <j-option label="交期" :value="2" />
            <j-option label="服务" :value="3" />
            <j-option label="技术创新" :value="4" />
          </j-select> -->
          <j-select v-model="editForm.department" value-key="lineNumber">
            <j-option
              v-for="item in buList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="采购负责人" prop="purchaseUserName">
          <j-autocomplete
            v-model="editForm.purchaseUserName"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchName"
            :trigger-on-focus="false"
            placeholder="输入编号或名称搜索"
            @select="selectName($event, editForm)"
          >
            <template slot-scope="{ item }">
              <div class="name">
                {{ item.name }}
              </div>
            </template>
          </j-autocomplete>
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
import { getDutyerManage, insertDutyerManage, deleteIdDutyerManage, importTem, importUrl } from '@/api/kpi/procure'
import { returnIds } from '@/utils/index'
import * as assessApi from '@/api/kpi/assess'
import { getCodeList } from '@/views/common/dic'
import { getExpertList  } from '@/api/base/professorPool'
import _ from 'lodash'
import { getToken } from '@/utils/auth'

export default {
  name: 'DutyerManage',
  data () {
    return {
      query: {
        supplierCode: '',
        supplierName: '',
        businessType: '',
        department: '',
        purchaseUserName: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        id: '',
        supplierId: '',
        supplierCode: '',
        supplierName: '',
        businessType: '',
        businessTypeCode: '',
        department: '',
        purchaseUserId: '',
        purchaseUserName: ''
      },
      rules: {
        standardCode: [
          { required: true, message: '请输入标准编码', trigger: 'change' }
        ],
        standardName: [
          { required: true, message: '请输入标准名称', trigger: 'change' }
        ],
        standardAttributes: [
          { required: true, message: '请选择标准属性', trigger: 'change' }
        ],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'supplierCode',
          label: '供应商编码'
        },
        {
          prop: 'supplierName',
          label: '供应商名称'
        },
        {
          prop: 'businessType',
          label: '业务类型'
        },
        {
          // prop: 'department',
          label: 'BU',
          render: (h, row) => (
            <span>
              {this.buList.length
                ? (this.buList.find((dic) => dic.lineNumber === row.department) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          prop: 'purchaseUserName',
          label: '采购负责人'
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
                vCheck={'insertOrUpdateSupPurchase'}
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
      },
      supplierList: [],
      loading: false,
      smallTypeList: [],
      buList: [],
      purchaseList: [],
      uploadVisible: false,
      uploadUrl: importUrl
    }
  },
  created () {
    this.initTable()
    this.getSelectData()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    importTemplate () {
      importTem()
    },
    handleImport () {
      this.uploadVisible = true
    },
    getSmallType: _.debounce(function (keyword) {
      if (keyword) {
        this.loading = true
        assessApi
          .getSmallClassByName({ name: keyword })
          .then((res) => {
            if (res && res.code === '0') {
              this.smallTypeList = res.data.map((item) => ({
                smallTypeCode: item.smallTypeCode,
                smallTypeName: item.smallTypeName
              }))
            }
          })
          .finally(() => {
            this.loading = false
          })
      }
    }, 500),
    searchName (name, cb) {
      getExpertList({ name, type: 0, size: 200, page: 1 })
        .then((res) => {
          if (res.code === '0') {
            this.purchaseList = res.data.records
          }
        })
        .finally(() => {
          cb(this.purchaseList)
        })
    },
    selectName (item) {
      this.editForm.purchaseUserId = item.id
      this.editForm.purchaseUserName = item.name
    },
    getSelectData () {
      assessApi.getTemplateNameList().then((res) => {
        if (res && res.code === '0') {
          this.nameList = res.data
        }
      })
      getCodeList('code00034').then((list) => {
        this.buList = list
      })
    },
    searchSupplier (name) {
      if (name) {
        this.loading = true
        assessApi
          .getSupplierByName({ name })
          .then((res) => {
            if (res && res.code === '0') {
              this.supplierList = res.data
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.supplierList = []
      }
    },
    setSupplier (suppliers) {
      this.editForm.supplierId = suppliers.map((item) => item.id)
    },
    // handleDetail (row) {
    //   this.detailForm = row
    //   this.detailVisible = true
    //   this.$refs.standardManageDetail.getDetailTable(row.id)
    // },
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
      deleteIdDutyerManage({ ids: ids }).then(res => {
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
      getDutyerManage(params)
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
          this.editForm.businessTypeCode = this.editForm.businessType.smallTypeCode
          this.editForm.businessType = this.editForm.businessType.smallTypeName
          this.editForm.supplierId = this.editForm.supplierName.id
          this.editForm.supplierCode = this.editForm.supplierName.code
          this.editForm.supplierName = this.editForm.supplierName.name
          if (this.handleType === '新增') {
            delete this.editForm.id
            insertDutyerManage(this.editForm).then(res => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            insertDutyerManage(this.editForm).then(res => {
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
        supplierId: '',
        supplierCode: '',
        supplierName: '',
        businessType: '',
        businessTypeCode: '',
        department: '',
        purchaseUserId: '',
        purchaseUserName: ''
      }
      this.supplierList = [],
      this.smallTypeList = [],
      this.purchaseList = []
    },
    resetQuery () {
      this.query = {
        supplierCode: '',
        supplierName: '',
        businessType: '',
        department: '',
        purchaseUserName: ''
      }
    },
    detailClose () {
      this.detailVisible = false
    },
    submitUpload () {
      this.$refs.upload.headers['Authorization'] = getToken()
      this.$refs.upload.submit()
      this.uploadVisible = false
    },
    uploadSuccess (res) {
      if (res.code === '0') {
        this.$message({
          message: '导入成功',
          type: 'success'
        })
        this.initTable()
        this.$refs.upload.clearFiles()
        this.uploadVisible = false
      } else {
        this.$refs.upload.clearFiles()
        this.$message({
          message: res.message,
          type: 'warning'
        })
      }
    },
    exceedWarn () {
      this.$message({
        message: '只能选择一个文件上传',
        type: 'warning'
      })
    }
  }
}
</script>