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
        <j-form-item label="调查表名称">
          <j-input v-model="query.questionnaireName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="供应商">
          <j-input v-model="query.supplierName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="状态">
          <j-select v-model="query.status" clearable>
            <j-option
              v-for="(value, index) in statusDic"
              :key="index"
              :label="value"
              :value="index"
            />
            <!-- <j-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            /> -->
          </j-select>
        </j-form-item>
        <j-form-item label="产品线">
          <j-select v-model="query.productLineName" filterable clearable>
            <j-option
              v-for="item in lineList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="大类">
          <j-select
            v-model="query.generalCategoryName"
            filterable
            clearable
            @change="getSmallType"
          >
            <j-option
              v-for="item in bigTypeList"
              :key="item.id"
              :label="item.bigTypeName"
              :value="item.bigTypeName"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="小类">
          <j-select v-model="query.subclassCategoryName" filterable clearable>
            <j-option
              v-for="item in smallTypeList"
              :key="item.id"
              :label="item.smallTypeName"
              :value="item.smallTypeName"
            />
          </j-select>
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'questionnaire_get'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'questionnaire_insert_update'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'questionnaire_delete'" @click="handleDel">
            删除
          </j-button>
          <j-button v-check="'questionnaire_check'" @click="handleCheck">
            送审
          </j-button>
          <j-button v-check="'questionnaire_leader_check'" @click="handleVerify">
            审核
          </j-button>
          <!-- <j-button @click="keepRecord">
            存档
          </j-button> -->
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
    <!-- 审核 -->
    <j-dialog
      title="审核"
      :visible.sync="checkVisible"
      width="400px"
      :before-close="checkClose"
    >
      <j-radio-group v-model="checkForm.status">
        <j-radio :label="3">
          通过
        </j-radio>
        <j-radio :label="4">
          不通过
        </j-radio>
      </j-radio-group>
      <j-input
        v-model="checkForm.advice"
        type="textarea"
        style="margin-top: 20px"
        :rows="3"
        placeholder="请输入内容"
      />
      <span slot="footer" class="dialog-footer">
        <j-button @click="checkClose">取 消</j-button>
        <j-button type="primary" @click="checkSave">确 定</j-button>
      </span>
    </j-dialog>
    <!-- 新增、编辑 -->
    <j-dialog
      :title="handleType"
      :visible.sync="editVisible"
      :modal="false"
      :close-on-click-modal="false"
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
        <j-form-item label="调查表名称" prop="questionnaireName">
          <j-input v-model="editForm.questionnaireName" />
        </j-form-item>
        <j-form-item label="调查表编码">
          <j-input v-model="editForm.id" placeholder="自动生成" disabled />
        </j-form-item>
        <j-form-item label="供应商" prop="supplierName">
          <j-autocomplete
            v-model="editForm.supplierName"
            style="width: 300px"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchSupplier"
            :trigger-on-focus="false"
            :debounce="800"
            placeholder="请输入搜索"
            @select="setSupplier"
          >
            <template slot-scope="{ item }">
              <div class="name">
                {{ item.name }}
              </div>
              <!-- <span class="code">{{ item.id }}</span> -->
            </template>
          </j-autocomplete>
        </j-form-item>
        <j-form-item label="附件" prop="accessory">
          <file-upload
            ref="fileUpload"
            type="excel"
            text="上传Excel"
            :can-download="false"
            @getFiles="getFiles"
          />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="handleSave">保存</j-button>
      </span>
    </j-dialog>
    <file-viewer ref="fileViewer" :can-download="false" />
  </div>
</template>

<script>
import * as poolApi from '@/api/supplier/pool'
import * as checkApi from '@/api/supplier/check'
import { getSupplierName } from '@/api/verify/typeVerify'
// import { getCodeList } from '@/views/common/dic'
import { handleTabs } from '../tabAuth'

export default {
  name: 'CheckIndex',
  data () {
    return {
      query: {
        questionnaireName: '',
        supplierName: '',
        status: '',
        productLineName: '',
        generalCategoryName: '',
        subclassCategoryName: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        questionnaireName: '',
        supplierName: '',
        id: '',
        accessory: []
      },
      rules: {
        questionnaireName: [
          { required: true, message: '请输入调查表名称', trigger: 'blur' }
        ],
        supplierName: [
          { required: true, message: '请输入供应商', trigger: 'blur' }
        ]
      },
      checkVisible: false,
      checkForm: {
        id: '',
        status: '',
        advice: ''
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'id',
          label: '调查表编码'
        },
        {
          prop: 'questionnaireName',
          label: '调查表名称'
        },
        {
          prop: 'supplierName',
          label: '供应商'
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
        // {
        //   label: '产品线',
        //   render: (h, row) => (
        //     <span>
        //       {row.srmSupplierDetails.map((item) => item.productLineName)}
        //     </span>
        //   )
        // },
        // {
        //   label: '大类',
        //   render: (h, row) => (
        //     <span>
        //       {row.srmSupplierDetails.map((item) => item.generalCategoryName)}
        //     </span>
        //   )
        // },
        // {
        //   label: '小类',
        //   render: (h, row) => (
        //     <span>
        //       {row.srmSupplierDetails.map((item) => item.subclassCategoryName)}
        //     </span>
        //   )
        // },
        {
          label: '状态',
          render: (h, row) => <span>{this.statusDic[row.status]}</span>
          // render: (h, row) => (
          //   <span>
          //     {this.statusList.length
          //       ? (this.statusList.find((dic) => dic.lineNumber === row.status) || { name: '' }).name
          //       : ''}
          //   </span>
          // )
        },
        {
          prop: 'questionnaireUser',
          label: '调查人'
        },
        {
          prop: 'releaseTime',
          label: '发布时间'
        },
        {
          prop: 'auditTime',
          label: '送审时间'
        },
        // {
        //   label: '反馈综合评价',
        //   render: (h, row) => (
        //     <j-switch
        //       value={row.isFeedback}
        //       active-value={1}
        //       inactive-value={0}
        //       onChange={() => {
        //         this.handleFeedback(row)
        //       }}
        //     />
        //   )
        // },
        {
          label: '附件',
          width: '200',
          render: (h, row) => (
            <div>
              {row.accessory && row.accessory.length
                ? row.accessory.map((file) => (
                  <j-link
                    type="primary"
                    onClick={() => {
                      this.downExcel(file)
                    }}
                  >
                    {file.name}
                  </j-link>
                ))
                : ''}
            </div>
          )
        },
        {
          label: '操作',
          fixed: 'right',
          render: (h, row) => (
            <div class="operate-btn-group">
              <j-button
                type="text"
                size="mini"
                vCheck={'questionnaire_insert_update'}
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
                编辑
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'questionnaire_submit'}
                onClick={() => {
                  this.handleSubmit(row)
                }}
              >
                提交
              </j-button>
              <j-button
                type="text"
                size="mini"
                onClick={() => {
                  this.handleDetail(row)
                }}
              >
                查看详情
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'questionnaire_get_record'}
                disabled={row.status !== 5}
                onClick={() => {
                  this.handleRecord(row)
                }}
              >
                查看存档
              </j-button>
            </div>
          )
        }
        // {
        //   prop: 'status',
        //   label: '操作',
        //   render: (h, row) => (
        //     <j-button type="text" vCheck={'transfer-update'}>
        //       修改
        //     </j-button>
        //   )
        // },
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
      statusDic: {
        0: '待提交',
        1: '已提交',
        2: '待审核',
        3: '审核通过',
        4: '审核不通过',
        5: '已归档',
        6: '已作废'
      },
      statusList: [],
      lineList: [],
      bigTypeList: [],
      smallTypeList: []
    }
  },
  activated () {
    // 跳转到指定供应商
    if (this.$route.query && this.$route.query.supplierName) {
      this.query.supplierName = this.$route.query.supplierName
      this.initTable(1)
    }
  },
  // deactivated () {
  //   console.log('离开了')
  // },
  created () {
    this.initTable(1)
    this.getSelectData()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    getSelectData () {
      poolApi.getPdtLineList().then((res) => {
        if (res && res.code === '0' && res.data) this.lineList = res.data.records
      })
      poolApi.getBigCategoryList().then((res) => {
        if (res && res.code === '0' && res.data) this.bigTypeList = res.data
      })
      // getCodeList('code00017').then((list) => {
      //   this.statusList = list
      // })
    },
    getSmallType () {
      poolApi
        .getSmallCategoryList({
          page: 1,
          size: 500,
          bigTypeName: this.query.generalCategoryName
        })
        .then((res) => {
          if (res.code === '0' && res.data)
            this.smallTypeList = res.data.records
        })
    },
    searchSupplier (queryString, cb) {
      getSupplierName({ name: queryString }).then((res) => {
        if (res.code === '0' && res.data) cb(res.data)
      })
    },
    setSupplier (item) {
      this.editForm.supplierId = item.id
      this.editForm.supplierName = item.name
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.editForm = row
      this.handleType = '编辑'
      this.editVisible = true
      // 初始化附件
      this.$nextTick(() => {
        this.$refs.fileUpload.fileList = row.accessory && row.accessory.length ? row.accessory : []
      })
    },
    handleFeedback (row) {
      checkApi
        .insertOrUpdateSrmSupplierQuestionnaire(
          Object.assign({}, row, { isFeedback: Number(!row.isFeedback) })
        )
        .then((res) => {
          if (res.code === '0') {
            this.showMessage('操作成功!', 'success')
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
    },
    handleDel () {
      if (this.tableSelectList.length) {
        if (this.tableSelectList.some((item) => item.status !== 0)) {
          this.showMessage('只能删除待提交的调查表!')
        } else {
          checkApi
            .deleteSrmSupplierQuestionnaire({
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
        }
      } else {
        this.showMessage('请先选择要删除的数据!')
      }
    },
    handleDetail (row) {
      handleTabs(true).then(() => {
        this.$router.push({
          path: '/supplier/check/checkDetail',
          query: {
            supplierId: row.supplierId,
            questionnaireId: row.id,
            name: row.name,
            code: row.code
          }
        })
      })
    },
    handleRecord (row) {
      this.$router.push({
        path: '/supplier/check/record',
        query: { supplierId: row.supplierId, questionnaireId: row.id }
      })
    },
    getFiles (type, fileList, file, handle) {
      if (type === 'file') {
        this.editForm.accessory = fileList
      }
    },
    downExcel (file) {
      this.$refs.fileViewer.show(file)
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum
      })
      checkApi
        .getSrmSupplierQuestionnaire(params)
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
    selectTable (val) {
      this.tableSelectList = val
    },
    resetQuery () {
      this.query = {
        questionnaireName: '',
        supplierName: '',
        status: '',
        productLineName: '',
        generalCategoryName: '',
        subclassCategoryName: ''
      }
    },
    handleSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          checkApi
            .insertOrUpdateSrmSupplierQuestionnaire(this.editForm)
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
    // 提交
    handleSubmit (row) {
      if (row.status !== 0) {
        this.showMessage('待提交状态才能进行提交!')
      } else {
        checkApi
          .submitSrmSupplierQuestionnaire({
            id: row.id,
            supplierId: row.supplierId,
            status: 1
          })
          .then((res) => {
            if (res.code === '0') {
              this.showMessage('操作成功!', 'success')
              this.initTable()
            } else {
              this.showMessage(res.message)
            }
          })
      }
    },
    // 送审
    handleCheck () {
      if (this.tableSelectList.length) {
        if (this.tableSelectList.some((item) => item.status !== 1)) {
          this.showMessage('已提交状态才能进行送审!')
        } else {
          checkApi
            .toCheck(
              this.tableSelectList.map((row) => ({
                id: row.id,
                supplierId: row.supplierId,
                status: 2
              }))
            )
            .then((res) => {
              if (res.code === '0') {
                this.showMessage('操作成功!', 'success')
                this.initTable()
              } else {
                this.showMessage(res.message)
              }
            })
        }
      } else {
        this.showMessage('请选择要送审的数据!')
      }
    },
    // 审核
    handleVerify () {
      if (this.tableSelectList.length) {
        if (this.tableSelectList.some((item) => item.status !== 2)) {
          this.showMessage('待审核状态才能进行审核!')
        } else {
          this.checkVisible = true
        }
      } else {
        this.showMessage('请先选择要审核的数据!')
      }
    },
    checkSave () {
      if (this.checkForm.status) {
        const params = this.tableSelectList.map((item) => ({
          id: item.id,
          status: this.checkForm.status,
          advice: this.checkForm.advice
        }))
        checkApi.leaderCheck(params).then((res) => {
          if (res.code === '0') {
            this.showMessage('操作成功!', 'success')
            this.checkVisible = false
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
      } else {
        this.showMessage('请选择是否通过!')
      }
    },
    checkClose () {
      this.checkVisible = false
      this.checkForm = {
        id: '',
        status: '',
        advice: ''
      }
    },
    // 存档
    keepRecord () {},
    editClose () {
      this.editVisible = false
      this.editForm = {
        questionnaireName: '',
        supplierName: '',
        id: '',
        accessory: []
      }
      this.$refs.fileUpload.fileList = []
    }
  }
}
</script>