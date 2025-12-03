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
        <j-form-item label="考核单号">
          <j-input v-model="query.code" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="考核单名称">
          <j-input v-model="query.name" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="时间维度">
          <j-select v-model="query.timeDimension" clearable>
            <j-option
              v-for="item in timeDimensionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="状态">
          <j-select v-model="query.status" clearable>
            <j-option
              v-for="(value, index) in statusDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="BU">
          <j-select v-model="query.department" clearable>
            <j-option
              v-for="item in buList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="业务类型">
          <j-input v-model="query.businessType" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="供应商编码">
          <j-input v-model="query.supplierCode" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="供应商名称">
          <j-input v-model="query.supplierName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="创建时间">
          <j-date-picker
            v-model="query.timeRange"
            type="daterange"
            range-separator="~"
            value-format="yyyy-MM-dd"
          />
        </j-form-item>
        <j-form-item label="采购负责人">
          <j-input v-model="query.purchaseUserName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="整改处理人">
          <j-input v-model="query.assignProcessor" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="红黄牌">
          <j-select v-model="query.colourGrade">
            <j-option
              v-for="(value, index) in colorDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getBill'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'insertBatchSrmAccessBill'" @click="handleAdd">
            批量创建
          </j-button>
          <j-button v-check="'insertBatchSrmAccessBill'" @click="handleAddAuto">
            批量自动创建
          </j-button>
          <j-button v-check="'deleteBatchBill'" @click="handleDel">
            删除
          </j-button>
          <j-button v-check="'toPublish'" @click="handleRelease">
            发布
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
    <!-- 审核 -->
    <j-dialog
      title="审核"
      :visible.sync="checkVisible"
      width="400px"
      :before-close="checkClose"
    >
      <j-radio-group v-model="checkForm.status">
        <j-radio :label="4">
          同意
        </j-radio>
        <j-radio :label="5">
          不同意
        </j-radio>
      </j-radio-group>
      <j-form style="margin-top: 20px">
        <j-form-item label="采购寄语：">
          <j-input
            v-model="checkForm.checkAdvice"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </j-form-item>
      </j-form>
      <span slot="footer" class="dialog-footer">
        <j-button @click="checkClose">取 消</j-button>
        <j-button type="primary" @click="checkSave">确 认</j-button>
      </span>
    </j-dialog>
    <!-- 红黄绿 -->
    <j-dialog title="评定" :visible.sync="colorVisible" width="300px">
      <j-form>
        <j-form-item label="红黄绿评定">
          <j-select v-model="curColor">
            <j-option
              v-for="(value, index) in colorDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
      </j-form>
      <span slot="footer" class="dialog-footer">
        <j-button @click="colorVisible = false">取 消</j-button>
        <j-button type="primary" @click="colorSave">确 认</j-button>
      </span>
    </j-dialog>
    <!-- 整改确认 -->
    <j-dialog
      title="整改确认"
      :visible.sync="confirmVisible"
      width="400px"
      :before-close="confirmClose"
    >
      <j-form
        ref="confirmForm"
        :model="confirmForm"
        :rules="rules"
        style="margin-top: 20px"
      >
        <j-form-item prop="status">
          <j-radio-group v-model="confirmForm.status">
            <j-radio :label="0">
              同意
            </j-radio>
            <j-radio :label="1">
              不同意
            </j-radio>
          </j-radio-group>
        </j-form-item>
        <j-form-item label="审批意见：" prop="approvalOpinion">
          <j-input
            v-model="confirmForm.approvalOpinion"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </j-form-item>
      </j-form>
      <span slot="footer" class="dialog-footer">
        <j-button @click="confirmClose">取 消</j-button>
        <j-button type="primary" @click="confirmSave">确 认</j-button>
      </span>
    </j-dialog>
    <!-- 指定处理人 -->
    <j-dialog title="指定处理人" :visible.sync="handlePersonVisible" width="300px">
      <j-form>
        <j-form-item label="姓名" prop="checkUserName">
          <j-select
            v-model="handlePersonList"
            filterable
            multiple
            value-key="id"
            placeholder="请输入关键词搜索"
            remote
            :remote-method="getCheckNameList"
          >
            <j-option
              v-for="item in checkNameList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </j-select>
        </j-form-item>
      </j-form>
      <span slot="footer" class="dialog-footer">
        <j-button @click="handlePersonVisible = false">取 消</j-button>
        <j-button type="primary" @click="handlePersonSave">确 认</j-button>
      </span>
    </j-dialog>
    <!-- 日志 -->
    <j-dialog title="整改确认日志" :visible.sync="logVisible">
      <j-table :data="logTableData">
        <j-table-column prop="crtTime" label="操作时间" />
        <j-table-column prop="crtUserName" label="操作人" />
        <j-table-column label="操作项">
          <template slot-scope="scope">
            {{ scope.row.status === 1 ? '不同意':'同意' }}：{{ scope.row.approvalOpinion }}
          </template>
        </j-table-column>
      </j-table>
    </j-dialog>
    <!-- 上传整改计划 -->
    <j-dialog
      title="上传整改计划"
      :visible.sync="planVisible"
      :modal="false"
      :close-on-click-modal="false"
      width="350px"
    >
      <j-form>
        <j-form-item prop="accessory">
          <file-upload ref="fileUpload" text="上传Excel/PDF" @getFiles="getFiles" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="planVisible = false">取消</j-button>
        <j-button type="primary" @click="planSave">保存</j-button>
      </span>
    </j-dialog>
    <file-viewer ref="fileViewer" />
  </div>
</template>

<script>
import * as assessApi from '@/api/kpi/assess'
import { getCodeList, timeDimensionList } from '@/views/common/dic'
import { getExpertList } from '@/api/base/professorPool'

export default {
  name: 'SupplierAssess',
  data () {
    return {
      query: {
        code: '',
        name: '',
        timeDimension: '',
        status: '',
        department: '',
        businessType: '',
        supplierCode: '',
        supplierName: '',
        timeRange: [],
        startTime: '',
        endTime: '',
        purchaseUserName: '',
        assignProcessor: '',
        colourGrade: ''
      },
      checkVisible: false,
      checkForm: {
        id: '',
        status: '',
        checkAdvice: ''
      },
      colorVisible: false,
      curColor: '',
      curRow: {},
      timeDimensionList: [],
      colorDic: {
        0: '红牌',
        1: '黄牌',
        2: '绿牌'
      },
      statusDic: {
        0: '新建',
        1: '待打分&待维度审核',
        2: '待审核',
        3: '变更待审核',
        4: '审核通过',
        5: '审核不通过',
        6: '已批准'
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'code',
          label: '考核单号'
        },
        {
          prop: 'name',
          label: '考核名称',
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
          label: '状态',
          render: (h, row) => <span>{this.statusDic[row.status]}</span>
        },
        {
          label: 'BU',
          render: (h, row) => (
            <span>
              {this.buList.length
                ? (
                  this.buList.find(
                    (dic) => dic.lineNumber === row.department
                  ) || { name: '' }
                ).name
                : ''}
            </span>
          )
        },
        {
          prop: 'businessType',
          label: '业务类型'
        },
        {
          prop: 'supplierCode',
          label: '供应商编码'
        },
        {
          prop: 'supplierName',
          label: '供应商名称'
        },
        {
          prop: 'purchaseUserName',
          label: '采购负责人'
        },
        {
          prop: 'checkAdvice',
          label: '采购寄语',
          width: '200px'
        },
        {
          prop: 'totalScore',
          label: '综合得分'
        },
        {
          label: '红黄牌',
          render: (h, row) => (
            <div>
              <span>{this.colorDic[row.colourGrade]}</span>
              <j-button
                type="text"
                size="mini"
                disabled={row.status === 6}
                vCheck={'updateSrmAccessBill'}
                onClick={() => {
                  this.handleColor(row)
                }}
                style="margin-left: 6px"
              >
                评定
              </j-button>
            </div>
          )
        },
        {
          label: '整改处理人',
          render: (h, row) => (
            <div>
              {row.assignProcessor && row.assignProcessor.length
                ? row.assignProcessor.map(item => item.name).join(',') : ''}
            </div>
          )
        },
        {
          label: '整改计划',
          width: '100',
          render: (h, row) => (
            <div>
              {row.accessory && row.accessory.length
                ? row.accessory.map(file => (
                  <j-link
                    type="info"
                    onClick={() => {
                      this.downFile(file)
                    }}
                  >
                    {file.name}
                  </j-link>
                )) : ''}
            </div>
          )
        },
        {
          label: '打分变更',
          render: (h, row) => (
            <div class="operate-btn-group">
              <j-button
                type="text"
                size="mini"
                disabled={row.status !== 1}
                vCheck={'updateSrmAccessBillDetail'}
                onClick={() => {
                  this.handleDetail(row, 'score')
                }}
              >
                打分
              </j-button>
              <j-button
                type="text"
                size="mini"
                disabled={
                  !(row.status === 1 || row.status === 4 || row.status === 5)
                }
                vCheck={'updateSrmAccessBillDetail'}
                onClick={() => {
                  this.handleDetail(row, 'change')
                }}
              >
                变更
              </j-button>
            </div>
          )
        },
        {
          prop: 'crtUserName',
          label: '创建人'
        },
        {
          prop: 'crtTime',
          label: '创建时间'
        },
        {
          label: '操作',
          fixed: 'right',
          width: '140',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vCheck={'getBillAll'}
                onClick={() => {
                  this.handleOverview(row, 'view')
                }}
              >
                详情
              </j-button>
              <j-button
                type="text"
                size="mini"
                disabled={!(row.status === 2 || row.status === 3)}
                vCheck={'toCheck'}
                onClick={() => {
                  this.handleCheck(row)
                }}
              >
                采购审核
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'assess-confirm'}
                disabled={!row.assignProcessor || !row.assignProcessor.length}
                onClick={() => {
                  this.handleConfirm(row)
                }}
              >
                整改确认
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'assess-confirmLog'}
                onClick={() => {
                  this.handleLog(row)
                }}
              >
                确认日志
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'updateSrmAccessBill'}
                onClick={() => {
                  this.handlePerson(row)
                }}
              >
                添加整改处理人
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'updateSrmAccessBill'}
                onClick={() => {
                  this.handlePlan(row)
                }}
              >
                上传整改计划
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
      timeList: [],
      staList: [],
      buList: [],
      confirmVisible: false,
      confirmForm: {
        status: '',
        approvalOpinion: ''
      },
      rules: {
        status: [
          { required: true, message: '请选择是否同意', trigger: 'blur' }
        ],
        approvalOpinion: [
          { required: true, message: '请输入意见', trigger: 'change' }
        ]
      },
      checkNameList: [],
      handlePersonVisible: false,
      handlePersonList: [],
      logVisible: false,
      logTableData: [],
      planVisible: false,
      planFileList: []
    }
  },
  created () {
    this.timeDimensionList = timeDimensionList
    this.initTable(1)
    this.getSelectData()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    getSelectData () {
      getCodeList('code00034').then((list) => {
        this.buList = list
      })
    },
    handleColor (row) {
      this.curRow = row
      this.curColor = row.colourGrade
      this.colorVisible = true
    },
    colorSave () {
      assessApi
        .updateSrmAccessBill({
          id: this.curRow.id,
          colourGrade: this.curColor
        })
        .then((res) => {
          if (res.code === '0') {
            this.showMessage('修改成功!', 'success')
            this.colorVisible = false
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
    },
    handleAdd () {
      this.$router.push({
        path: '/kpi/assess/add',
        query: { handle: 'add' }
      })
    },
    handleAddAuto () {
      this.$router.push({
        path: '/kpi/assess/addAuto',
        query: { handle: 'add' }
      })
    },
    handleOverview (row, handle) {
      this.$router.push({
        path: '/kpi/assess/overview',
        query: { handle, id: row.id }
      })
    },
    handleDetail (row, handle) {
      this.$router.push({
        path: '/kpi/assess/detail',
        query: { handle, id: row.id }
      })
    },
    handleDel () {
      if (this.tableSelectList.length) {
        assessApi
          .deleteBatchBill(this.tableSelectList.map((row) => row.id))
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
    handleRelease () {
      if (this.tableSelectList.length) {
        if (this.tableSelectList.some((item) => item.status !== 0)) {
          this.showMessage('只有新建考核单才能发布!')
        } else {
          assessApi
            .toPublish(this.tableSelectList.map((row) => row.id))
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
        this.showMessage('请先选择要发布的考核单!')
      }
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum,
        startTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[0]
            : '',
        endTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[1]
            : ''
      })
      assessApi
        .getBill(params)
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
        code: '',
        name: '',
        timeDimension: '',
        status: '',
        department: '',
        businessType: '',
        supplierCode: '',
        supplierName: '',
        timeRange: [],
        startTime: '',
        endTime: '',
        purchaseUserName: '',
        assignProcessor: '',
        colourGrade: ''
      }
    },
    handleCheck (row) {
      this.checkForm.id = row.id
      this.checkVisible = true
    },
    checkSave () {
      if (this.checkForm.status) {
        assessApi.toCheck(this.checkForm).then((res) => {
          if (res.code === '0') {
            this.showMessage('操作成功!', 'success')
            this.checkClose()
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
      } else {
        this.showMessage('请选择是否同意!')
      }
    },
    checkClose () {
      this.checkVisible = false
      this.checkForm = {
        id: '',
        status: '',
        checkAdvice: ''
      }
    },
    getCheckNameList (name) {
      if (name) {
        getExpertList({ name, type: 0, page: 1, size: 10 }).then((res) => {
          if (res.code === '0') {
            this.checkNameList = res.data.records.map((item) => ({
              id: item.accountId,
              name: item.name
            }))
          }
        })
      } else {
        this.checkNameList = []
      }
    },
    handlePerson (row) {
      // 回填处理人
      if (row.assignProcessor && row.assignProcessor.length) {
        this.checkNameList = row.assignProcessor
        this.handlePersonList = row.assignProcessor
      }
      this.handlePersonVisible = true
      this.curRow = JSON.parse(JSON.stringify(row))
    },
    handlePersonSave () {
      assessApi
        .updateSrmAccessBill({
          id: this.curRow.id,
          assignProcessor: this.handlePersonList
        })
        .then((res) => {
          if (res.code === '0') {
            this.showMessage('修改成功!', 'success')
            this.handlePersonVisible = false
            this.handlePersonList = []
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
    },
    getFiles (type, fileList, file, handle) {
      if (type === 'file') {
        this.planFileList = fileList
      }
    },
    downFile (file) {
      this.$refs.fileViewer.show(file)
    },
    handlePlan (row) {
      this.curRow = JSON.parse(JSON.stringify(row))
      this.planVisible = true
      this.$nextTick(() => {
        this.$refs.fileUpload.fileList =
          row.accessory && row.accessory.length ? row.accessory : []
      })
    },
    planSave () {
      assessApi
        .updateSrmAccessBill({
          id: this.curRow.id,
          accessory: this.planFileList
        })
        .then((res) => {
          if (res.code === '0') {
            this.showMessage('修改成功!', 'success')
            this.planVisible = false
            this.planFileList = []
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
    },
    handleConfirm (row) {
      this.confirmForm.billId = row.id
      this.confirmForm.assignProcessor = row.assignProcessor
      this.confirmVisible = true
    },
    confirmSave () {
      this.$refs.confirmForm.validate((valid) => {
        if (valid) {
          assessApi.updateConfirm(this.confirmForm).then((res) => {
            if (res.code === '0') {
              this.showMessage('操作成功!', 'success')
              this.confirmClose()
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
    confirmClose () {
      this.confirmVisible = false
      this.confirmForm = {
        status: '',
        approvalOpinion: ''
      }
    },
    handleLog (row) {
      assessApi.getAssignProcessorLog({ billId: row.id }).then((res) => {
        if (res.code === '0') {
          this.logTableData = res.data
          this.logVisible = true
        } else {
          this.showMessage(res.message)
        }
      })
    }
  }
}
</script>