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
        <j-form-item label="任务编码">
          <j-input v-model="query.factoryCode" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="任务名称">
          <j-input v-model="query.factoryName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="状态">
          <!-- <j-select v-model="query.status" clearable>
            <j-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select> -->
          <j-select v-model="query.status" clearable>
            <j-option label="暂存" :value="1" />
            <j-option label="待预审" :value="2" />
            <j-option label="预审通过" :value="3" />
            <j-option label="预审不通过" :value="4" />
            <j-option label="待审厂打分" :value="5" />
            <j-option label="待审核" :value="6" />
            <j-option label="已完成" :value="7" />
          </j-select>
        </j-form-item>
        <j-form-item label="审厂目的">
          <j-select v-model="query.factoryPurpose" clearable>
            <j-option
              v-for="item in aimList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="审厂类别">
          <j-select v-model="query.factoryType" clearable>
            <j-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="类型">
          <j-select v-model="query.type" clearable>
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="供应商编码">
          <j-input v-model="query.supplierCode" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="供应商名称">
          <j-input v-model="query.supplierName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="产品线">
          <j-input v-model="query.lineName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="大类">
          <j-input v-model="query.bigTypeName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="小类">
          <j-input v-model="query.smallTypeName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="发起人">
          <j-input v-model="query.name" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="发起时间">
          <j-date-picker
            v-model="query.mdTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'task-list'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'task-insert'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'task-delete'" @click="handleDel">
            删除
          </j-button>
          <!-- <j-button @click="handleImport">
            导入
          </j-button>
          <j-button @click="handleExport">
            导出
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
    <!-- 新增/编辑 -->
    <uniteFactoryExaminEdit
      ref="uniteFactoryExaminEdit"
      :edit-visible="editVisible"
      :handle-type="handleType"
      @editClose="editClose"
    />

    <!-- 添加审厂专家 -->
    <addExpertsDialog
      ref="addExpertsDialog"
      :add-experts-visible="addExpertsVisible"
      :add-experts-form="addExpertsForm"
      @addExpertsClose="addExpertsClose"
    />

    <!-- 整改 -->
    <rectificationDialog
      ref="rectificationDialog"
      :rectification-visible="rectificationVisible"
      :rectification-form="rectificationForm"
      @rectificationClose="rectificationClose"
    />
    <!-- 预审 -->
    <j-dialog
      title="预审"
      :visible.sync="preTrialVisible"
      width="400px"
      :before-close="preTrialClose"
    >
      <j-radio-group v-model="preTrialForm.status">
        <j-radio :label="3">
          同意发起
        </j-radio>
        <j-radio :label="4">
          不同意发起
        </j-radio>
      </j-radio-group>
      <j-input
        v-model="preTrialForm.auditReason"
        type="textarea"
        style="margin-top: 20px"
        :rows="3"
        placeholder="请输入内容"
      />
      <span slot="footer" class="dialog-footer">
        <j-button @click="preTrialClose">取 消</j-button>
        <j-button type="primary" @click="preTrialSave">确 定</j-button>
      </span>
    </j-dialog>
    <!-- 审核 -->
    <j-dialog
      title="审核"
      :visible.sync="checkVisible"
      width="400px"
      :before-close="checkClose"
    >
      <j-radio-group v-model="checkForm.results">
        <j-radio :label="1">
          同意
        </j-radio>
        <j-radio :label="2">
          不同意
        </j-radio>
      </j-radio-group>
      <j-input
        v-model="checkForm.remark"
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
  </div>
</template>

<script>
import * as unionVerifyApi from '@/api/verify/unionVerify'
import { getCodeList } from '@/views/common/dic'
import uniteFactoryExaminEdit from './components/uniteFactoryExaminEdit'
import addExpertsDialog from './components/addExpertsDialog'
import rectificationDialog from './components/rectificationDialog'
import {  departTime, returnIds } from '@/utils/index'
export default {
  name: 'uniteFactoryExamin',
  components: { uniteFactoryExaminEdit, addExpertsDialog, rectificationDialog },
  data () {
    return {
      checkType: '预审',
      query: {
        factoryCode: '',
        factoryName: '',
        status: '',
        factoryPurpose: '',
        factoryType: '',
        type: '',
        supplierCode: '',
        supplierName: '',
        lineName: '',
        bigTypeName: '',
        smallTypeName: '',
        name: '',
        mdTime: []
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
      },
      addExpertsVisible: false,
      addExpertsForm: {},
      rules: {
        name: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ],
        lineList: [
          { required: true, message: '请选择产品线', trigger: 'blur' }
        ],
        bigTypeList: [
          { required: true, message: '请选择大类', trigger: 'blur' }
        ],
        smallTypeList: [
          { required: true, message: '请选择小类', trigger: 'blur' }
        ],
        linkPerson: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        linkPhone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      checkVisible: false,
      checkForm: {
        taskId: '',
        results: '',
        remark: ''
      },
      preTrialVisible: false,
      preTrialForm: {
        id: '',
        status: '',
        auditReason: ''
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'factoryCode',
          label: '审厂任务编码',
          width: '120px'
        },
        {
          prop: 'factoryName',
          label: '审厂任务名称',
          width: '200px'
        },
        {
          label: '审厂目的',
          render: (h, row) => (
            <span>
              {this.aimList.length
                ? (this.aimList.find((dic) => dic.lineNumber === row.factoryPurpose) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          label: '审厂类别',
          render: (h, row) => (
            <span>
              {this.categoryList.length
                ? (this.categoryList.find((dic) => dic.lineNumber === row.factoryType) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          label: '流转状态',
          // render: (h, row) => <span>{this.statusList.length ? this.statusList.find(dic => dic.lineNumber === row.status).name : ''}</span>
          render: (h, row) => <span>{this.statusDic[row.status]}</span>
        },
        {
          prop: 'supplierCode',
          label: '供应商编码',
          width: '100px'
        },
        {
          prop: 'supplierName',
          label: '供应商名称',
          width: '180px'
        },
        {
          label: '类型',
          render: (h, row) => (
            <span>
              {this.typeList.length
                ? (this.typeList.find((dic) => dic.lineNumber === row.type) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          prop: 'lineName',
          label: '产品线',
          width: '200px'
        },
        {
          prop: 'bigTypeName',
          label: '大类',
          width: '200px'
        },
        {
          prop: 'smallTypeName',
          label: '小类',
          width: '200px'
        },
        {
          prop: 'overallRatings',
          label: '综合得分'
        },
        {
          prop: 'factoryReason',
          label: '审厂原因',
          width: '300px'
        },
        {
          prop: 'startName',
          label: '发起人'
        },
        {
          prop: 'startTime',
          label: '发起时间',
          width: '140px'
        },
        {
          prop: 'status',
          label: '审厂结果',
          render: (h, row) => (
            <j-button type="text" vCheck={'result-audit'} onClick={() => {
              this.handleRectification(row.id)
            }}>
              查看审厂结果
            </j-button>
          )
        },
        {
          label: '操作',
          fixed: 'right',
          width: '200px',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vCheck={'task-insert'}
                disabled={row.status === 5 || row.status === 6 || row.status === 7}
                onClick={() => {
                  this.handleEdit(row.id)
                }}
              >
                编辑
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'task-detail'}
                onClick={() => {
                  this.handleDetail(row.id)
                }}
              >
                详情
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'pre-trial'}
                onClick={() => {
                  this.handlePretrial(row.id)
                }}
              >
                预审
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'insertExpert'}
                onClick={() => {
                  this.handleAddExperts(row)
                }}
              >
                添加审厂专家
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'temporary_storage'}
                onClick={() => {
                  this.handleInitiate(row)
                }}
              >
                发起
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'audit'}
                onClick={() => {
                  this.handleAudit(row.id)
                }}
              >
                审核
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
      statusDic: {
        1: '暂存',
        2: '待预审',
        3: '预审通过',
        4: '预审不通过',
        5: '待审厂打分',
        6: '待审核',
        7: '已完成'
      },
      signDic: {
        1: '战略级供应商',
        2: '优选级供应商',
        3: '合格供应商',
        4: '拟淘汰供应商'
      },
      professDic: {
        1: '专业供应商',
        2: '综合供应商',
        3: '超级供应商'
      },
      leanDic: {
        1: '1星',
        2: '2星',
        3: '3星',
        4: '4星',
        5: '5星'
      },
      qualityDic: {
        1: '1级',
        2: '2级',
        3: '3级',
        4: '4级',
        5: '5级'
      },
      lineList: [],
      bigTypeList: [],
      smallTypeList: [],
      statusList: [],
      aimList: [],
      categoryList: [],
      typeList: [],
      rectificationVisible: false,
      rectificationForm: {}
    }
  },
  created () {
    this.initTable(1)
    this.getSelectData()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    handleRectification (id) {
      this.$refs.rectificationDialog.getrectificationTable(id)
      this.rectificationVisible = true
    },
    rectificationClose () {
      this.rectificationVisible = false
    },
    handlePretrial (id) {
      this.preTrialForm.id = id
      this.preTrialVisible = true
    },
    preTrialClose () {
      this.preTrialVisible = false
      this.preTrialForm = {
        id: '',
        status: '',
        auditReason: ''
      }
    },
    handleAudit (id) {
      this.checkForm.taskId = id
      this.checkVisible = true
    },
    preTrialSave () {
      unionVerifyApi.preTrialSave(this.preTrialForm).then(res => {
        if (res.code === '0') {
          this.showMessage('预审成功！', 'success')
        } else {
          this.showMessage(res.message, 'error')
        }
        this.initTable()
        this.preTrialClose()
      })
    },
    checkSave () {
      unionVerifyApi.auditSave(this.checkForm).then(res => {
        if (res.code === '0') {
          this.showMessage('审核成功！', 'success')
        } else {
          this.showMessage(res.message, 'error')
        }
        this.initTable()
        this.checkClose()
      })
    },
    handleInitiate (row) {
      unionVerifyApi.uniteFactoryExaminDetail({ id: row.id }).then(res => {
        if (res.code === '0') {
          const arr = res.data
          Object.assign(arr[0], { insertStatus: 3 })
          unionVerifyApi.uniteFactoryExaminUpdate(arr[0]).then(res => {
            if (res.code === '0') {
              this.showMessage('发起成功！', 'success')
              this.initTable()
            } else {
              this.showMessage(res.message, 'error')
            }
          })
        }
      })
    },
    handleAddExperts (row) {
      this.$refs.addExpertsDialog.getAddExpertsDialogQuery(row.id)
      this.addExpertsVisible = true
    },
    addExpertsClose () {
      this.addExpertsVisible = false
    },
    getSelectData () {
      getCodeList('code00022').then((list) => {
        this.aimList = list
      })
      getCodeList('code00023').then((list) => {
        this.categoryList = list
      })
      getCodeList('code00024').then((list) => {
        this.typeList = list
      })
      getCodeList('code00017').then(list => {
        this.statusList = list
      })
      // unionVerifyApi.getPdtLineList().then((res) => {
      //   if (res.code === '0' && res.data) this.lineList = res.data.records
      // })
      // unionVerifyApi.getBigCategoryList().then((res) => {
      //   if (res.code === '0' && res.data) this.bigTypeList = res.data
      // })
      // getCodeList('code00001').then(list => {
      //   this.statusList = list
      // })
    },
    getSmallType () {
      unionVerifyApi
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

    handleAdd () {
      this.$refs.uniteFactoryExaminEdit.getSelectData()
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (id) {
      // this.$refs.uniteFactoryExaminEdit.getUniteFactoryExaminDetail(id)
      this.$refs.uniteFactoryExaminEdit.getSelectData()
      this.$refs.uniteFactoryExaminEdit.initEveryList(id)
      this.handleType = '编辑'
      this.editVisible = true
    },
    handleImport () {},
    handleExport () {},
    handleDel () {
      const ids = returnIds(this.tableSelectList).join()
      if (this.tableSelectList.length) {
        unionVerifyApi
          .deleteIdUniteFactoryExamin({ ids: ids })
          .then((res) => {
            if (res.code === '0') {
              this.showMessage('删除成功!', 'success')
              this.initTable()
            } else {
              this.showMessage(res.message)
            }
          })
      } else {
        this.showMessage('请先选择要删除的数据!')
      }
    },
    handleDetail (id) {
      this.$refs.uniteFactoryExaminEdit.getSelectData()
      this.$refs.uniteFactoryExaminEdit.initEveryList(id)
      // this.$refs.uniteFactoryExaminEdit.getUniteFactoryExaminDetail(id)
      this.handleType = '详情'
      this.editVisible = true
      // this.$router.push({
      //   path: '/supplier/pool/poolDetail',
      //   query: { supplierId: row.id }
      // })
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = Object.assign({}, this.query,
        departTime(this.query.mdTime, 'startTime', 'endTime'),
        {
          size: this.tablePage.pageSize,
          page: this.tablePage.pageNum
        })
      delete params.mdTime
      unionVerifyApi
        .uniteFactoryExaminQuery(params)
        .then((res) => {
          this.tableData = res.data.records
          this.tablePage.total = res.data.total
          this.loading = false
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
        factoryCode: '',
        factoryName: '',
        status: '',
        factoryPurpose: '',
        factoryType: '',
        type: '',
        supplierCode: '',
        supplierName: '',
        lineName: '',
        bigTypeName: '',
        smallTypeName: '',
        name: '',
        mdTime: []
      }
    },
    handleSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          unionVerifyApi.updateSrmSupplier(this.editForm).then((res) => {
            if (res.code === '0') {
              this.editClose()
              this.showMessage('保存成功!', 'success')
            } else {
              this.showMessage(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    checkClose () {
      this.checkVisible = false
      this.checkForm = {
        id: '',
        status: '',
        advice: ''
      }
    },
    editClose () {
      this.editVisible = false
      this.initTable(1)
    }
  }
}
</script>
