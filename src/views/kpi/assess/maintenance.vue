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
        <j-form-item label="供应商">
          <j-input v-model="query.supplierCode" @keyup.enter.native="initTable(1)" placeholder="供应商编码/名称模糊查询" />
        </j-form-item>
        <j-form-item label="年份">
          <j-date-picker
            v-model="query.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年份">
          </j-date-picker>
        </j-form-item>
        <j-form-item label="时间维度">
          <j-cascader
            :key="keyValue"
            v-model="query.timeList"
            :props="{ expandTrigger: 'hover' }"
            :options="timeOptions"
            @change="handleTimeChange"
          />
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
          <j-button v-check="'insertOrUpdateSupPurchase'" @click="handleDel">
            删除
          </j-button>
          <j-button v-check="'modelDownloadPurchase'" @click="importTemplate">
            模板下载
          </j-button>
          <j-button v-check="'uploadPurchaseExcelFile'" @click="handleImport">
            导入
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
        label-position="right"
        label-width="95px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="供应商名称" prop="supplierName">
          <j-select
            v-model="editForm.supplierName"
            value-key="id"
            filterable
            class="w180"
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
        <j-form-item label="供应商编码" prop="supplierName">
          <j-input class="w180" v-model="editForm.supplierCode" :disabled="true" />
        </j-form-item>
        <j-form-item label="年份" prop="businessType">
          <j-date-picker
            v-model="editForm.year"
            type="year"
            class="w180"
            value-format="yyyy"
            placeholder="选择年份">
          </j-date-picker>
        </j-form-item>
        <j-form-item label="时间维度" prop="businessType">
          <j-cascader
            :key="keyValue"
            class="w180"
            v-model="editForm.timeType"
            :props="{ expandTrigger: 'hover' }"
            :options="timeOptions"
            @change="handleTimeChanges"
          />
        </j-form-item>
        <j-form-item label="产品线难度系数" prop="businessType" label-width="140">
          <j-input-number class="w180" v-model="editForm.lineDifficultyCoefficient" :precision="2" :step="0.01" :max="100" :min="0"></j-input-number>
        </j-form-item>
        <j-form-item label="SKU难度系数" prop="businessType">
          <j-input-number class="w180" v-model="editForm.skuDifficultyCoefficient" :precision="2" :step="0.01" :max="100" :min="0"></j-input-number>
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
import { getTemplateNameList } from '../../../api/kpi/assess'

export default {
  name: 'DutyerManage',
  data () {
    return {
      query: {
        supplierCode: '',
        year: '',
        timeList: [],
        timeDimension: '',
        timeDimensionValue: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        id: '',
        supplierCode: '',
        supplierName: '',
        timeDimension: '',
        timeDimensionValue: '',
        lineDifficultyCoefficient: '',
        skuDifficultyCoefficient: '',
        timeType: []
      },
      keyValue: 0,
      timeOptions: [
        {
          value: 2,
          label: '月度',
          children: [
            {
              value: '1月',
              label: '1月'
            },
            {
              value: '2月',
              label: '2月'
            },
            {
              value: '3月',
              label: '3月'
            },
            {
              value: '4月',
              label: '4月'
            },
            {
              value: '5月',
              label: '5月'
            },
            {
              value: '6月',
              label: '6月'
            },
            {
              value: '7月',
              label: '7月'
            },
            {
              value: '8月',
              label: '8月'
            },
            {
              value: '9月',
              label: '9月'
            },
            {
              value: '10月',
              label: '10月'
            },
            {
              value: '11月',
              label: '11月'
            },
            {
              value: '12月',
              label: '12月'
            }
          ]
        },
        {
          value: 3,
          label: '季度',
          children: [
            {
              value: '一季度',
              label: '一季度'
            },
            {
              value: '二季度',
              label: '二季度'
            },
            {
              value: '三季度',
              label: '三季度'
            },
            {
              value: '四季度',
              label: '四季度'
            }
          ]
        },
        {
          value: 4,
          label: '半年度',
          children: [
            {
              value: '上半年',
              label: '上半年'
            },
            {
              value: '下半年',
              label: '下半年'
            }
          ]
        },
        {
          value: 5,
          label: '年度',
          children: [
            {
              value: '2022年',
              label: '2022年'
            },
            {
              value: '2023年',
              label: '2023年'
            },
            {
              value: '2024年',
              label: '2024年'
            },
            {
              value: '2025年',
              label: '2025年'
            }
          ]
        }
      ],
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
          prop: 'year',
          label: '年份'
        },
        {
          prop: 'timeDimension',
          label: '时间维度',
          render: (h, row) => (
            <div>
              { this.getName(row.timeDimension)}
            </div>
          )
        },
        {
          prop: 'timeDimensionValue',
          label: '时间维度值'
        },
        {
          prop: 'lineDifficultyCoefficient',
          label: '产品线难度系数'
        },
        {
          prop: 'skuDifficultyCoefficient',
          label: 'SKU难度系数'
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
      uploadUrl: assessApi.uploadCoefficientExcelFile
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
    getName(item) {
      let label = ''
      this.timeOptions.forEach(val => {
        if (val.value === item) {
          label = val.label
        }
      })
      return label
    },
    handleTimeChange(timeType) {
      console.log(timeType);
      if (timeType && timeType.length) {
        this.query.timeDimension = timeType[0]
        this.query.timeDimensionValue = timeType[1]
        console.log(this.query);
      }
    },
    handleTimeChanges(timeType) {
      if (timeType && timeType.length) {
        this.editForm.timeDimension = timeType[0]
        this.editForm.timeDimensionValue = timeType[1]
      }
    },
    importTemplate () {
      assessApi.modelDownloadCoefficient()
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
    setSupplier(suppliers) {
      this.editForm.supplierCode = suppliers.code
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
    handleEdit(row) {

      this.editForm = JSON.parse(JSON.stringify(row))
      this.editForm.timeType = []
      this.editForm.timeType.push(this.editForm.timeDimension, this.editForm.timeDimensionValue)
      console.log(this.editForm);
      this.handleType = '编辑'
      this.editVisible = true
    },
    handleDel () {
      const ids = returnIds(this.tableSelectList).join()
      assessApi.deleteBatchByIds({ ids: ids }).then(res => {
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
      delete this.query.timeList
      const params = Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum
      })
      assessApi.getCoefficientPage(params)
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
          delete this.editForm.timeType
          console.log(this.editForm);
          if (typeof this.editForm.supplierName === 'object') {
            this.editForm.supplierName = this.editForm.supplierName.name
          }
          if (this.handleType === '新增') {
            delete this.editForm.id
            assessApi.saveOrUpdateCoefficient(this.editForm).then(res => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            assessApi.saveOrUpdateCoefficient(this.editForm).then(res => {
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
<style scoped>
.w180 {
  width: 180px;
}
</style>
