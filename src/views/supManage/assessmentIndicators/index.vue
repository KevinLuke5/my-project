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
        <j-form-item label="指标编码">
          <j-input v-model="query.code" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="指标名称">
          <j-input v-model="query.name" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="状态">
          <j-select v-model="query.status" clearable>
            <j-option label="启用" :value="0" />
            <j-option label="停用" :value="1" />
          </j-select>
        </j-form-item>
        <j-form-item label="考核维度">
          <j-select v-model="query.accessDimensionName" clearable @focus="getAccessDimensionList">
            <!-- <j-option label="质量" :value="0" />
            <j-option label="成本" :value="1" />
            <j-option label="交期" :value="2" />
            <j-option label="服务" :value="3" />
            <j-option label="技术创新" :value="4" /> -->
            <j-option
              v-for="item in accessDimensionList"
              :key="item.accessDimensionCode"
              :label="item.accessDimensionName"
              :value="item.accessDimensionName"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="审核维度">
          <j-select v-model="query.checkDimension" clearable>
            <!-- <j-option label="品质" :value="0" />
            <j-option label="采购" :value="1" />
            <j-option label="PMC" :value="2" />
            <j-option label="研发" :value="3" />
            <j-option label="制造技术" :value="4" /> -->
            <j-option
              v-for="item in checkDimensionList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'index-select'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'index-insertOrUpdate'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'index-delete'" @click="handleDel">
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
        <j-form-item label="指标名称" prop="name">
          <j-input v-model="editForm.name" />
        </j-form-item>
        <j-form-item label="状态" prop="status">
          <j-select v-model="editForm.status" clearable>
            <j-option label="启用" :value="0" />
            <j-option label="停用" :value="1" />
          </j-select>
        </j-form-item>
        <j-form-item label="考核维度" prop="accessDimensionName">
          <j-select
            v-model="editForm.accessDimensionName"
            clearable
            value-key="accessDimensionCode"
            @focus="getAccessDimensionList"
          >
            <!-- <j-option label="质量" :value="0" />
            <j-option label="成本" :value="1" />
            <j-option label="交期" :value="2" />
            <j-option label="服务" :value="3" />
            <j-option label="技术创新" :value="4" /> -->
            <j-option
              v-for="item in accessDimensionList"
              :key="item.accessDimensionCode"
              :label="item.accessDimensionName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="审核维度" prop="checkDimension">
          <j-select v-model="editForm.checkDimension" clearable>
            <!-- <j-option label="品质" :value="0" />
            <j-option label="采购" :value="1" />
            <j-option label="PMC" :value="2" />
            <j-option label="研发" :value="3" />
            <j-option label="制造技术" :value="4" /> -->
            <j-option
              v-for="item in checkDimensionList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="来源" prop="source">
          <j-select v-model="editForm.source" clearable>
            <!-- <j-option label="质量-市场" :value="0" />
            <j-option label="PMC" :value="1" />
            <j-option label="PMC" :value="2" />
            <j-option label="研发" :value="3" /> -->
            <j-option
              v-for="item in sourceList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="指标类型" prop="type">
          <j-select v-model="editForm.type" clearable>
            <!-- <j-option label="常规" :value="0" />
            <j-option label="加分" :value="1" />
            <j-option label="扣分" :value="2" /> -->
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="属性" prop="property">
          <j-select v-model="editForm.property" clearable>
            <!-- <j-option label="百分数" :value="0" />
            <j-option label="数值" :value="1" />
            <j-option label="布尔型" :value="2" /> -->
            <j-option
              v-for="item in propertyList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="核算公式" prop="computeFormula">
          <j-input v-model="editForm.computeFormula" />
        </j-form-item>
        <j-form-item label="考核逻辑" prop="accessLogicDesc">
          <j-input v-model="editForm.accessLogicDesc" />
        </j-form-item>
        <j-form-item label="评判标准" prop="judgeCriterion">
          <j-input v-model="editForm.judgeCriterion" />
        </j-form-item>
        <j-form-item label="考核结果" prop="accessResult">
          <j-input v-model="editForm.accessResult" />
        </j-form-item>
        <j-form-item label="考核措施" prop="accessMeasure">
          <j-input v-model="editForm.accessMeasure" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="editSave">保存</j-button>
      </span>
    </j-dialog>

    <mainDialog ref="mainDialog" :main-visible="mainVisible" @mainClose="mainClose" />
  </div>
</template>

<script>
import * as assessmentIndicatorsApi from '@/api/kpi/procure'
// import { getStandardQuery, standardUpdate, standardDeleteId } from '@/api/verify/unionVerify'
import { returnIds } from '@/utils/index'
import mainDialog from '@/views/supManage/workerManage/editDialog'
import { getCodeList } from '@/views/common/dic'
import {
  getDimensionList
} from '@/api/kpi/dimension'
export default {
  name: 'AssessmentIndicators',
  components: { mainDialog },
  data () {
    return {
      query: {
        code: '',
        name: '',
        status: '',
        accessDimensionName: '',
        checkDimension: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        id: '',
        name: '',
        status: '',
        accessDimensionCode: '',
        accessDimensionName: '',
        checkDimension: '',
        source: '',
        type: '',
        property: '',
        computeFormula: '',
        accessLogicDesc: '',
        judgeCriterion: '',
        accessResult: '',
        accessMeasure: ''
      },
      mainVisible: false,
      mainForm: {},
      rules: {
        name: [
          { required: true, message: '请输入指标名称', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        accessDimensionName: [
          { required: true, message: '请选择考核维度', trigger: 'change' }
        ],
        checkDimension: [
          { required: true, message: '请选择审核维度', trigger: 'change' }
        ],
        source: [
          { required: true, message: '请输入来源', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请输入指标类型', trigger: 'change' }
        ],
        property: [
          { required: true, message: '请输入属性', trigger: 'change' }
        ],
        computeFormula: [
          { required: true, message: '请输入核算公式', trigger: 'change' }
        ],
        accessLogicDesc: [
          { required: true, message: '请输入考核逻辑', trigger: 'change' }
        ],
        judgeCriterion: [
          { required: true, message: '请输入评判标准', trigger: 'change' }
        ],
        accessResult: [
          { required: true, message: '请输入考核结果', trigger: 'change' }
        ],
        accessMeasure: [
          { required: true, message: '请输入考核措施', trigger: 'change' }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'code',
          label: '指标编码'
        },
        {
          prop: 'name',
          label: '指标名称',
          width: '150px'
        },
        {
          prop: 'status',
          label: '状态',
          render: (h, row) => <span>{this.statusDic[row.status]}</span>
        },
        {
          prop: 'accessDimensionName',
          label: '考核维度'
        },
        {
          label: '审核维度',
          render: (h, row) => (
            <span>
              {this.checkDimensionList.length
                ? (this.checkDimensionList.find((dic) => dic.lineNumber === row.checkDimension) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          // prop: 'source',
          label: '来源',
          render: (h, row) => (
            <span>
              {this.sourceList.length
                ? (this.sourceList.find((dic) => dic.lineNumber === row.source) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          // prop: 'type',
          label: '指标类型',
          render: (h, row) => (
            <span>
              {this.typeList.length
                ? (this.typeList.find((dic) => dic.lineNumber === row.type) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          // prop: 'property',
          label: '属性',
          render: (h, row) => (
            <span>
              {this.propertyList.length
                ? (this.propertyList.find((dic) => dic.lineNumber === row.property) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          prop: 'computeFormula',
          label: '核算公式',
          width: '400px'
        },
        {
          prop: 'accessLogicDesc',
          label: '考核逻辑',
          width: '400px'
        },
        {
          prop: 'judgeCriterion',
          label: '评判准则',
          width: '400px'
        },
        {
          prop: 'accessResult',
          label: '考核结果',
          width: '400px'
        },
        {
          prop: 'accessMeasure',
          label: '考核措施',
          width: '400px'
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
          fixed: 'right',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
              编辑
              </j-button>
              <j-button
                type="text"
                size="mini"
                onClick={() => {
                  this.handleMain(row)
                }}
              >
              维护打分人审核人
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
      statusDic: {
        0: '启用',
        1: '停用'
      },
      accessDimensionList: [],
      checkDimensionList: [],
      sourceList: [],
      typeList: [],
      propertyList: []
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
    getSelectData () {
      getCodeList('code00035').then((list) => {
        this.checkDimensionList = list
      })
      getCodeList('code00037').then((list) => {
        this.sourceList = list
      })
      getCodeList('code00038').then((list) => {
        this.typeList = list
      })
      getCodeList('code00039').then((list) => {
        this.propertyList = list
      })
    },
    getAccessDimensionList () {
      assessmentIndicatorsApi.getMentIndicatorsDimensionName().then(res => {
        if (res.code === '0') {
          this.accessDimensionList = res.data
        }
      })
    },
    handleMain (row) {
      this.$refs.mainDialog.getInitTable(row.id)
      this.mainVisible = true
    },
    mainClose () {
      this.mainVisible = false
    },
    // handleDetail (row) {
    //   this.detailForm = row
    //   this.detailVisible = true
    //   this.$refs.standardManageDetail.getDetailTable(row.id)
    // },
    handleImport () {},
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
      assessmentIndicatorsApi.deleteIdMentIndicators({ ids: ids }).then(res => {
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
      assessmentIndicatorsApi.getMentIndicators(params)
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
          this.editForm.accessDimensionCode = this.editForm.accessDimensionName.accessDimensionCode
          this.editForm.accessDimensionName = this.editForm.accessDimensionName.accessDimensionName
          if (this.handleType === '新增') {
            delete this.editForm.id
            assessmentIndicatorsApi.insertMentIndicators(this.editForm).then(res => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            assessmentIndicatorsApi.insertMentIndicators(this.editForm).then(res => {
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
        name: '',
        status: '',
        accessDimensionCode: '',
        accessDimensionName: '',
        checkDimension: '',
        source: '',
        type: '',
        property: '',
        computeFormula: '',
        accessLogicDesc: '',
        judgeCriterion: '',
        accessResult: '',
        accessMeasure: ''
      }
    },
    resetQuery () {
      this.query = {
        code: '',
        name: '',
        status: '',
        accessDimensionName: '',
        checkDimension: ''
      }
    },
    detailClose () {
      this.detailVisible = false
    }
  }
}
</script>