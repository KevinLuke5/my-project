<template>
  <j-dialog
    :visible.sync="mainVisible"
    :modal="false"
    :before-close="mainClose"
    :fullscreen="true"
  >
    <j-form
      class="head-container"
      size="mini"
      :inline="true"
      label-position="left"
      label-width="76px"
      :model="mainForm"
    >
      <j-form-item label="供应商">
        <j-input v-model="mainForm.supplierName" @keyup.enter.native="initTable(1)" />
      </j-form-item>
      <j-form-item label="业务类型">
        <j-input v-model="mainForm.businessType" @keyup.enter.native="initTable(1)" />
      </j-form-item>
      <j-form-item label="打分人">
        <j-input v-model="mainForm.gradeUserName" @keyup.enter.native="initTable(1)" />
      </j-form-item>
      <j-form-item label="审核人">
        <j-input v-model="mainForm.checkUserName" @keyup.enter.native="initTable(1)" />
      </j-form-item>
      <j-form-item class="btn-group" style="margin-bottom: 0">
        <j-button v-check="'index-detail-select'" type="primary" @click="initTable(1)">
          查询
        </j-button>
        <j-button @click="resetQuery">
          重置
        </j-button>
        <j-button v-check="'index-detail-insertOrUpdate'" @click="handleAdd">
          新增
        </j-button>
        <j-button v-check="'index-detail-delete'" @click="handleDel">
          删除
        </j-button>
        <j-button v-check="'modelDownloadIndexDetail'" @click="importTemplate">
          下载模板
        </j-button>
        <j-button v-check="'uploadIndexDetailExcelFile'" @click="handleImport">
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
    <!-- <span slot="footer">
      <j-button @click="mainClose">取消</j-button>
      <j-button type="primary" @click="editSave">保存</j-button>
    </span> -->
    <!-- 新增、编辑 -->
    <j-dialog
      :title="handleType"
      :visible.sync="changeVisible"
      :modal="false"
      :before-close="changeClose"
      width="400px"
    >
      <j-form
        ref="mainDetailForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="mainDetailForm"
        :rules="rules"
      >
        <j-form-item label="供应商" prop="supplierName">
          <!-- <j-input v-model="mainDetailForm.supplierName" /> -->
          <j-select
            v-model="mainDetailForm.supplierName"
            value-key="id"
            filterable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="searchSupplier"
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
          <!-- <j-select v-model="mainDetailForm.businessType" clearable>
            <j-option label="常规" :value="0" />
            <j-option label="加分" :value="1" />
            <j-option label="扣分" :value="2" />
          </j-select> -->
          <j-select
            v-model="mainDetailForm.businessType"
            value-key="smallTypeCode"
            filterable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="getSmallType"
          >
            <j-option
              v-for="item in smallTypeList"
              :key="item.smallTypeCode"
              :label="item.smallTypeName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="权重" prop="ratio">
          <!-- <j-select v-model="mainDetailForm.ratio" clearable>
            <j-option label="百分数" :value="0" />
            <j-option label="数值" :value="1" />
          </j-select> -->
          <j-input v-model="mainDetailForm.ratio" />
        </j-form-item>
        <j-form-item label="打分人" prop="gradeUserName">
          <!-- <j-input v-model="mainDetailForm.gradeUserName" /> -->
          <j-autocomplete
            v-model="mainDetailForm.gradeUserName"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchName"
            :trigger-on-focus="false"
            placeholder="输入编号或名称搜索"
            @select="selectName"
          >
            <template slot-scope="{ item }">
              <div class="name">
                {{ item.name }}
              </div>
            </template>
          </j-autocomplete>
        </j-form-item>
        <j-form-item label="审核人" prop="checkUserName">
          <!-- <j-input v-model="mainDetailForm.checkUserName" /> -->
          <!-- <j-autocomplete
            v-model="mainDetailForm.checkUserName"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchName"
            :trigger-on-focus="false"
            placeholder="输入编号或名称搜索"
            @select="checkName"
          >
            <template slot-scope="{ item }">
              <div class="name">
                {{ item.name }}
              </div>
            </template>
          </j-autocomplete> -->
          <j-select
            v-model="mainDetailForm.checkUserName"
            filterable
            clearable
            multiple
            value-key="id"
            placeholder="请输入关键词搜索"
            remote
            :remote-method="getCheckNameList"
          >
            <j-option
              v-for="item in checkNameList"
              :key="item.id"
              :label="item.checkUserName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="备注">
          <j-input v-model="mainDetailForm.remark" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="changeClose">取消</j-button>
        <j-button type="primary" @click="editSave">保存</j-button>
      </span>
    </j-dialog>

    <!-- 导入 -->
    <j-dialog
      title="导入"
      :visible.sync="uploadVisible"
      width="400px"
      :modal-append-to-body="false"
    >
      <j-upload
        ref="upload"
        :limit="10"
        :show-file-list="true"
        :accept="'.xls, .xlsx'"
        :auto-upload="false"
        :action="uploadUrl"
        :data="{id:currentId}"
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
        <div slot="tip" class="j-upload__tip" style="margin-top:6px">
          只能上传Excel文件
        </div>
      </j-upload>
    </j-dialog>
  </j-dialog>
</template>
<script>
import { getExpertList  } from '@/api/base/professorPool'
import * as assessmentIndicatorsApi from '@/api/kpi/procure'
import { returnIds, tagDeltData } from '@/utils/index'
import * as assessApi from '@/api/kpi/assess'
import _ from 'lodash'
import { getToken } from '@/utils/auth'

export default {
  props: {
    mainVisible: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentId: '',
      changeVisible: false,
      mainForm: {
        supplierName: '',
        businessType: '',
        gradeUserName: '',
        checkUserName: ''
      },
      mainDetailForm: {
        id: '',
        indexId: '',
        supplierId: '',
        supplierName: '',
        businessTypeCode: '',
        businessType: '',
        ratio: '',
        gradeUserId: '',
        gradeUserName: '',
        remark: '',
        list: {
          checkUserId: '',
          checkUserName: '',
          indexDetailId: '',
          delFlag: '',
          id: ''
        },
        checkUserName: []
      },
      handleType: '',
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'supplierName',
          label: '供应商',
          width: '200px'
        },
        {
          prop: 'businessType',
          label: '业务类型'
        },
        {
          prop: 'ratioCase',
          label: '权重'
        },
        {
          prop: 'gradeUserName',
          label: '打分人'
        },
        {
          prop: 'checkUserName',
          label: '审核人'
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vCheck={'index-detail-insertOrUpdate'}
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
      },
      rules: {
        supplierName: [
          { required: true, message: '请选择供应商', trigger: 'change' }
        ],
        businessType: [
          { required: true, message: '请选择业务类型', trigger: 'change' }
        ],
        ratio: [
          { required: true, message: '请选择权重', trigger: 'change' }
        ],
        gradeUserName: [
          { required: true, message: '请选择打分人', trigger: 'change' }
        ],
        checkUserName: [
          { required: true, message: '请选择审核人', trigger: 'change' }
        ]
      },
      supplierList: [],
      smallTypeList: [],
      checkNameList: [],
      oldList: [],
      businessTypeCode: '',
      businessType: '',
      supplierId: '',
      supplierName: '',
      checkUserNameData: [],
      uploadVisible: false,
      uploadUrl: assessmentIndicatorsApi.importUrlMentIndicatorsDetail
    }
  },
  methods: {
    importTemplate () {
      assessmentIndicatorsApi.importTemMentIndicatorsDetail()
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
    searchSupplier (name) {
      if (name) {
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
      this.mainDetailForm.supplierId = suppliers.id
      this.mainDetailForm.supplierName = suppliers.name
    },
    searchName (name, cb) {
      getExpertList({ name, type: 0, page: 1, size: 10 })
        .then((res) => {
          if (res.code === '0') {
            this.supplierList = res.data.records
          }
        })
        .finally(() => {
          cb(this.supplierList)
        })
    },
    selectName (item) {
      // this.editForm.supplierid = item.id
      this.mainDetailForm.gradeUserId = item.accountId
      this.mainDetailForm.gradeUserName = item.name
    },
    getCheckNameList (name) {
      if (name) {
        getExpertList({ name, type: 0, page: 1, size: 10 })
          .then((res) => {
            if (res.code === '0') {
              this.checkNameList = res.data.records
              this.checkNameList = this.checkNameList.map((item) => ({
                checkUserId: item.accountId,
                checkUserName: item.name,
                indexDetailId: '',
                id: item.id
              }))
            }
          })
      } else {
        this.checkNameList = []
      }
    },
    checkName (item) {
      this.mainDetailForm.checkUserName = item.name
    },
    getInitTable (id) {
      this.currentId = id
      this.initTable(1)
    },
    handleAdd () {
      this.handleType = '新增'
      this.changeVisible = true
    },
    handleEdit (row) {
      if (!row.list) {
        row.list = []
      }
      this.oldList = row.list
      // this.getCheckNameList()
      this.mainDetailForm = JSON.parse(JSON.stringify(row))
      this.checkUserNameData = row.list.map((item) => ({
        checkUserId: item.checkUserId,
        checkUserName: item.checkUserName,
        indexDetailId: item.indexDetailId,
        id: item.id
      }))
      this.checkNameList = this.checkUserNameData
      this.$set(this.mainDetailForm, 'checkUserName', this.checkUserNameData)
      this.handleType = '编辑'
      this.changeVisible = true
      this.businessTypeCode = row.businessTypeCode
      this.businessType = row.businessType
      this.supplierId = row.supplierId
      this.supplierName = row.supplierName
    },
    handleDel () {
      const ids = returnIds(this.tableSelectList).join()
      assessmentIndicatorsApi.deleteIdMentIndicatorsDetail({ ids: ids }).then(res => {
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
      const params = Object.assign({}, this.mainForm, {
        id: this.currentId,
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum
      })
      assessmentIndicatorsApi.getMentIndicatorsDetail(params)
        .then((res) => {
          this.tableData = res.data.records
          this.tablePage.total = res.data.total
          this.loading = false
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    mainClose () {
      this.$emit('mainClose')
    },
    resetQuery () {
      this.mainForm = {
        id: '',
        standardCode: '',
        standardName: '',
        standardAttributes: '',
        projectName: '',
        remark: ''
      }
    },
    changeClose () {
      this.changeVisible = false
      this.mainDetailForm = {
        id: '',
        indexId: '',
        supplierId: '',
        supplierName: '',
        businessTypeCode: '',
        businessType: '',
        ratio: '',
        gradeUserId: '',
        gradeUserName: '',
        remark: '',
        list: {
          checkUserId: '',
          checkUserName: '',
          indexDetailId: '',
          delFlag: '',
          id: ''
        },
        checkUserName: []
      }
      this.changeVisible = false
      this.supplierList = []
      this.smallTypeList = []
    },
    editSave () {
      this.$refs.mainDetailForm.validate((valid) => {
        if (valid) {
          // this.mainDetailForm.list = this.mainDetailForm.checkUserName.map((item) => ({
          //   checkUserId: item.userId,
          //   checkUserName: item.name,
          //   indexDetailId: '',
          //   id: ''
          // }))
          this.mainDetailForm.list = tagDeltData(this.oldList, this.mainDetailForm.checkUserName, 'id')
          delete this.mainDetailForm.checkUserName
          this.mainDetailForm.businessTypeCode = this.mainDetailForm.businessType.smallTypeCode
          this.mainDetailForm.businessType = this.mainDetailForm.businessType.smallTypeName
          if (this.handleType === '新增') {
            // this.mainDetailForm.supplierId = this.mainDetailForm.supplierName.id
            // this.mainDetailForm.supplierName = this.mainDetailForm.supplierName.name
            delete this.mainDetailForm.id
            this.mainDetailForm.indexId = this.currentId
            assessmentIndicatorsApi.insertMentIndicatorsDetail(this.mainDetailForm).then(res => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.changeClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
                this.changeClose()
              }
            })
          } else {
            if (this.mainDetailForm.businessTypeCode || this.mainDetailForm.businessType) {
              assessmentIndicatorsApi.insertMentIndicatorsDetail(this.mainDetailForm).then(res => {
                if (res.code === '0') {
                  this.showMessage('修改成功！', 'success')
                  this.changeClose()
                  this.initTable()
                } else {
                  this.showMessage(res.message, 'error')
                  this.changeClose()
                }
              })
            } else if (this.mainDetailForm.supplierId || this.mainDetailForm.supplierName) {
              this.mainDetailForm.businessTypeCode = this.businessTypeCode
              this.mainDetailForm.businessType = this.businessType
              assessmentIndicatorsApi.insertMentIndicatorsDetail(this.mainDetailForm).then(res => {
                if (res.code === '0') {
                  this.showMessage('修改成功！', 'success')
                  this.changeClose()
                  this.initTable()
                } else {
                  this.showMessage(res.message, 'error')
                  this.changeClose()
                }
              })
            } else {
              this.mainDetailForm.businessTypeCode = this.businessTypeCode
              this.mainDetailForm.businessType = this.businessType
              this.mainDetailForm.supplierId = this.supplierId
              this.mainDetailForm.supplierName = this.supplierName
              assessmentIndicatorsApi.insertMentIndicatorsDetail(this.mainDetailForm).then(res => {
                if (res.code === '0') {
                  this.showMessage('修改成功！', 'success')
                  this.changeClose()
                  this.initTable()
                } else {
                  this.showMessage(res.message, 'error')
                  this.changeClose()
                }
              })

            }
          }
        }
      })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    submitUpload () {
      this.$refs.upload.headers['Authorization'] = getToken()
      this.$refs.upload.submit()
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