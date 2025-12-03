<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-form
        class="head-container"
        size="mini"
        :inline="true"
        label-position="left"
        label-width="85px"
        :model="query"
      >
        <j-form-item label="供应商">
          <j-input v-model="query.supplier" placeholder="供应商编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="年份">
          <j-date-picker
            v-model="query.year"
            type="year"
            value-format="yyyy"
            placeholder="选择年份"
          />
        </j-form-item>
        <j-form-item label="时间维度">
          <j-cascader
            :key="keyValue"
            v-model="timeDimensionTwo"
            collapse-tags
            clearable
            :props="{ expandTrigger: 'hover', multiple: true }"
            :options="timeDimensionList"
            @change="handleTimeChange"
          />
        </j-form-item>
        <j-form-item label="业务类型">
          <j-input v-model="query.businessType" placeholder="业务类型编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="考核单号">
          <j-input v-model="query.code" placeholder="考核单号模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="BU">
          <j-select
            v-model="query.buCode"
            filterable
            clearable
            multiple
            collapse-tags
          >
            <j-option
              v-for="item in buList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="产品线">
          <j-input v-model="query.productLine" placeholder="产品线编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="考核维度">
          <j-select
            v-model="query.accessDimension"
            filterable
            clearable
            multiple
            collapse-tags
            @focus="getIndexTypeList"
          >
            <j-option
              v-for="item in indexTypeList"
              :key="item.accessDimensionCode"
              :label="item.accessDimensionName"
              :value="item.accessDimensionCode"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="指标">
          <j-input v-model="query.index" placeholder="指标编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="打分人">
          <j-input v-model="query.checkUser" placeholder="打分人姓名模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="打分状态">
          <j-select v-model="query.scoreStatus" clearable>
            <j-option label="待打分" :value="0" />
            <j-option label="已打分" :value="1" />
          </j-select>
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'kpi-GatherScore-query-score'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button @click="handleExport">
            导出
          </j-button>
          <j-button
            v-check="'kpi-GatherScore-uploadBillDetailExcelFile'"
            @click="importVisible = true"
          >
            导入
          </j-button>
          <j-button v-check="'kpi-GatherScore-updateGradeCheckUser'" @click="editScorePerson">
            修改打分人
          </j-button>
        </j-form-item>
      </j-form>
      <j-tabs v-model="activeName" @tab-click="tabClick">
        <j-tab-pane label="我的" name="1" />
        <j-tab-pane label="全部" name="2" />
      </j-tabs>
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
    <!-- 修改打分人 -->
    <j-dialog
      title="修改打分人"
      :visible.sync="editPersonVisible"
      width="400px"
      :before-close="editPersonClose"
    >
      <j-form>
        <j-form-item label="打分人" prop="gradeUserName">
          <j-autocomplete
            v-model="editForm.gradeUserName"
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
      </j-form>
      <span slot="footer" class="dialog-footer">
        <j-button @click="editPersonClose">取 消</j-button>
        <j-button type="primary" @click="editPersonSave">确 认</j-button>
      </span>
    </j-dialog>
    <!-- 考核逻辑 -->
    <j-dialog title="考核指标详情" :visible.sync="logicVisible">
      <j-form size="mini" label-position="left" label-width="70px">
        <j-form-item label="核算公式">
          <span>{{ logicForm.computeFormula }}</span>
        </j-form-item>
        <j-form-item label="考核逻辑">
          <span>{{ logicForm.accessLogicDesc }}</span>
        </j-form-item>
        <j-form-item label="评判准则">
          <span>{{ logicForm.judgeCriterion }}</span>
        </j-form-item>
        <j-form-item label="考核结果">
          <span>{{ logicForm.accessResult }}</span>
        </j-form-item>
        <j-form-item label="考核措施">
          <span>{{ logicForm.accessMeasure }}</span>
        </j-form-item>
      </j-form>
    </j-dialog>
    <!-- 日志 -->
    <j-dialog title="考核指标详情" :visible.sync="logVisible">
      <j-table :data="logTableData">
        <j-table-column prop="operateTime" label="操作时间" width="135" />
        <j-table-column prop="operateUser" label="操作人" width="80" />
        <j-table-column label="操作项">
          <template slot-scope="props">
            <div v-html="props.row.operateItem" />
          </template>
        </j-table-column>
      </j-table>
    </j-dialog>
    <!-- 打分 -->
    <j-dialog
      title="打分"
      :visible.sync="scoreVisible"
      :modal="false"
      :close-on-click-modal="false"
      :before-close="scoreClose"
      width="500px"
    >
      <j-form
        ref="scoreForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="scoreForm"
        :rules="rules"
      >
        <j-form-item label="得分" prop="score">
          <j-input-number
            v-model="scoreForm.score"
            :min="0"
            :max="scoreForm.indexType === 0 ? 100 : scoreForm.extremeValue"
          />
          <span>{{ '（' + (scoreForm.indexType === 0 ? 100: scoreForm.extremeValue) + '分制）' }}</span>
        </j-form-item>
        <j-form-item label="指标分母">
          <j-input-number v-model="scoreForm.denominator" :min="0" />
        </j-form-item>
        <j-form-item label="指标分子">
          <j-input-number v-model="scoreForm.molecule" :min="0" />
        </j-form-item>
        <j-form-item label="指标值">
          <j-input-number v-model="scoreForm.indexValue" :min="0" />
        </j-form-item>
        <j-form-item label="备注">
          <j-input v-model="scoreForm.remark" :rows="3" type="textarea" />
        </j-form-item>
        <j-form-item label="附件">
          <file-upload ref="fileUpload" type="excel" @getFiles="getFiles" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="scoreClose">取消</j-button>
        <j-button type="primary" @click="scoreSave">保存</j-button>
      </span>
    </j-dialog>
    <!-- 导入 -->
    <excel-import
      :visible="importVisible"
      :import-url="importUrl"
      @close="importVisible = false"
      @handleTem="handleImportTem"
      @succesImport="importSuccess"
    />
  </div>
</template>

<script>
import * as assessApi from '@/api/kpi/assess'
import * as scoreApi from '@/api/kpi/score'
import * as assessmentIndicatorsApi from '@/api/kpi/procure'
import { getExpertList } from '@/api/base/professorPool'
import { getPartObj } from '@/utils/index'
import { getCodeList, timeDimensionList } from '@/views/common/dic'
const excelImport = () => import('@/components/ExcelImport/excelImport')

export default {
  name: 'GatherScore',
  components: { excelImport },
  data () {
    return {
      query: {
        supplier: '',
        year: '',
        timeDimension: '',
        timeDimensionValues: '',
        businessType: '',
        code: '',
        buCode: [],
        productLine: '',
        accessDimension: [],
        index: '',
        checkUser: '',
        scoreStatus: '',
        queryStatus: 1
      },
      timeDimensionTwo: [],
      editPersonVisible: false,
      editForm: {
        gradeUserName: '',
        gradeUserId: ''
      },
      timeDimensionList: [],
      statusDic: {
        0: '新建',
        1: '待打分&待维度审核',
        2: '待审核',
        3: '变更待审核',
        4: '审核通过',
        5: '审核不通过',
        6: '已批准'
      },
      activeName: '1',
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
          label: '供应商名称',
          width: '120px'
        },
        {
          prop: 'year',
          label: '年份',
          width: '120px'
        },
        {
          label: '时间维度',
          render: (h, row) => (
            <span>
              {
                (
                  this.timeDimensionList.find(
                    (dic) => dic.value === row.timeDimension
                  ) || { label: '' }
                ).label
              }
            </span>
          )
        },
        {
          prop: 'timeDimensionValue',
          label: '时间维度值'
        },
        {
          prop: 'businessType',
          label: '业务类型'
        },
        {
          prop: 'code',
          label: '考核单号'
        },
        {
          label: 'BU',
          render: (h, row) => (
            <span>
              {this.buList.length
                ? (
                  this.buList.find(
                    (dic) => dic.lineNumber === row.groupLine
                  ) || { name: '' }
                ).name
                : ''}
            </span>
          )
        },
        {
          prop: 'lineName',
          label: '产品线'
        },
        {
          prop: 'accessDimensionName',
          label: '考核维度'
        },
        {
          prop: 'indexCode',
          label: '指标编码'
        },
        {
          prop: 'indexName',
          label: '指标名称'
        },
        {
          label: '指标类型',
          render: (h, row) => (
            <span>
              {this.typeList.length
                ? (this.typeList.find((dic) => dic.lineNumber === row.indexType) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          label: '打分状态',
          render: (h, row) => (
            <span>
              {row.scoreStatus === 1 ? '已打分' : row.scoreStatus === 0 ? '待打分' : ''}
            </span>
          )
        },
        {
          prop: 'score',
          label: '得分'
        },
        {
          prop: 'denominator',
          label: '分母'
        },
        {
          prop: 'molecule',
          label: '分子'
        },
        {
          prop: 'indexValue',
          label: '指标值'
        },
        {
          prop: 'remark',
          label: '备注'
        },
        {
          prop: 'gradeUserName',
          label: '打分人'
        },
        {
          prop: 'crtTime',
          label: '创建时间'
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
          prop: 'firstRatio',
          label: '一级权重'
        },
        {
          prop: 'secondaryRatio',
          label: '二级权重'
        },
        {
          prop: 'thirdRatio',
          label: '三级权重'
        },
        {
          prop: 'extremeValue',
          label: '加分减分上限',
          width: '110px'
        },
        {
          prop: 'weightedScore',
          label: '加权得分'
        },
        {
          label: '操作',
          width: '140',
          fixed: 'right',
          render: (h, row) => (
            <div class="operate-btn-group">
              <j-button
                type="text"
                size="mini"
                vCheck={'updateSrmAccessBillDetail'}
                onClick={() => {
                  this.handleScore(row, 'score')
                }}
              >
                打分
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'kpi-GatherScore-getBillDetailLogList'}
                onClick={() => {
                  this.handleLog(row)
                }}
              >
                日志
              </j-button>
              <j-button
                type="text"
                size="mini"
                onClick={() => {
                  this.handleLogic(row)
                }}
              >
                查看考核逻辑
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
      buList: [],
      indexTypeList: [],
      typeList: [],
      personList: [],
      logicVisible: false,
      logicForm: {},
      curRow: {},
      scoreVisible: false,
      scoreForm: {
        id: '',
        score: '',
        denominator: '',
        molecule: '',
        indexValue: '',
        remark: '',
        accessory: {}
      },
      rules: {
        score: [{ required: true, message: '请输入得分', trigger: 'change' }]
      },
      keyValue: 0,
      importVisible: false,
      importUrl: scoreApi.uploadUrl,
      logVisible: false,
      logTableData: []
    }
  },
  watch: {
    timeDimensionList () {
      this.keyValue++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
    }
  },
  created () {
    this.timeDimensionList = timeDimensionList
    this.initTable(1)
    this.getSelectData()
  },
  mounted () {
    this.height = this.calHeight(60)
  },
  methods: {
    getSelectData () {
      getCodeList('code00034').then((list) => {
        this.buList = list
      })
      getCodeList('code00038').then((list) => {
        this.typeList = list
      })
    },
    handleTimeChange (timeType) {
      if (timeType && timeType.length) {
        this.query.timeDimension = timeType.map((item) => item[0]).join(',')
        this.query.timeDimensionValues = timeType
          .map((item) => item[1])
          .join(',')
      } else {
        this.query.timeDimension = ''
        this.query.timeDimensionValues = ''
      }
    },
    getIndexTypeList () {
      assessmentIndicatorsApi.getMentIndicatorsDimensionName().then((res) => {
        if (res.code === '0') {
          this.indexTypeList = res.data
        }
      })
    },
    handleScore (row) {
      this.curRow = row
      this.scoreForm = JSON.parse(JSON.stringify(row))
      this.scoreVisible = true
      this.$nextTick(() => {
        this.$refs.fileUpload.fileList =
          row.accessory && row.accessory.length ? row.accessory : []
      })
    },
    scoreSave () {
      this.$refs.scoreForm.validate((valid) => {
        if (valid) {
          // 打分
          assessApi
            .updateSrmAccessBillDetail(Object.assign({},
              getPartObj(this.scoreForm, [
                'id',
                'score',
                'denominator',
                'molecule',
                'indexType',
                'indexValue',
                'remark',
                'accessory',
                'secondaryRatio',
                'thirdRatio'
              ]), { scoreStatus: 1 })
            )
            .then((res) => {
              if (res.code === '0') {
                this.scoreClose()
                this.initTable()
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
    scoreClose () {
      this.scoreVisible = false
      this.scoreForm = {
        id: '',
        score: '',
        denominator: '',
        molecule: '',
        indexValue: '',
        remark: '',
        accessory: {}
      }
    },
    getFiles (type, fileList, file, handle) {
      if (type === 'file') {
        this.scoreForm.accessory = fileList
      }
    },
    handleOverview (row, handle) {
      this.$router.push({
        path: '/kpi/assess/overview',
        query: { handle, id: row.id }
      })
    },
    searchName (name, cb) {
      getExpertList({ name, type: 0, page: 1, size: 10 })
        .then((res) => {
          if (res.code === '0') {
            this.personList = res.data.records
          }
        })
        .finally(() => {
          cb(this.personList)
        })
    },
    selectName (item) {
      this.editForm.gradeUserId = item.accountId
      this.editForm.gradeUserName = item.name
    },
    tabClick (tab) {
      this.query.queryStatus = parseInt(tab.name)
      this.initTable()
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum,
        buCode: this.query.buCode.join(','),
        accessDimension: this.query.accessDimension.join(',')
      })
      scoreApi
        .getConcentrateScoreList(params)
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
      this.keyValue++
      this.query = {
        supplier: '',
        year: '',
        timeDimension: '',
        timeDimensionValues: '',
        businessType: '',
        code: '',
        buCode: [],
        productLine: '',
        accessDimension: [],
        index: '',
        checkUser: '',
        scoreStatus: '',
        queryStatus: this.query.queryStatus
      }
      this.timeDimensionTwo = []
    },
    handleLog (row) {
      scoreApi
        .getBillDetailLogList({ detailId: row.id })
        .then((res) => {
          if (res && res.code === '0') {
            this.logTableData = res.data
            this.logVisible = true
          }
        })
    },
    handleLogic (row) {
      this.logicVisible = true
      this.logicForm = row
    },
    editScorePerson () {
      if (this.tableSelectList.length) {
        this.editPersonVisible = true
      } else {
        this.showMessage('请先选择数据!')
      }
    },
    editPersonSave () {
      if (this.editForm.gradeUserName) {
        const params = this.tableSelectList.map((row) =>
          Object.assign({}, row, {
            gradeUserId: this.editForm.gradeUserId,
            gradeUserName: this.editForm.gradeUserName
          })
        )
        scoreApi.updateGradeCheckUser(params).then((res) => {
          if (res.code === '0') {
            this.showMessage('操作成功!', 'success')
            this.editPersonClose()
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
      } else {
        this.showMessage('请选择打分人!')
      }
    },
    editPersonClose () {
      this.editPersonVisible = false
      this.editForm = {
        gradeUserName: '',
        gradeUserId: ''
      }
    },
    handleExport () {
      const params = Object.assign({}, this.query, {
        buCode: this.query.buCode.join(','),
        accessDimension: this.query.accessDimension.join(',')
      })
      scoreApi.exportConcentrateScore(params)
    },
    handleImportTem () {
      scoreApi.modelDownloadBillDetail()
    },
    importSuccess () {
      this.initTable()
    }
  }
}
</script>
