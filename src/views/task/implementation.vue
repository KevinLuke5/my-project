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
        <j-form-item label="任务编号">
          <j-input v-model="query.code" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="任务主题">
          <j-input v-model="query.theme" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="任务类别">
          <j-select v-model="query.type" clearable multiple>
            <j-option
              v-for="item in typeList"
              :key="item.lineNumber"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="截止日期">
          <j-date-picker
            v-model="query.timeRange"
            type="datetimerange"
            range-separator="~"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </j-form-item>
        <j-form-item label="状态">
          <j-select v-model="query.status" clearable multiple>
            <j-option
              v-for="(value, index) in statusDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="执行人">
          <j-input v-model="query.code" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="发起人">
          <j-input v-model="query.theme" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getAccessTaskList'" type="primary" @click="search(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
        </j-form-item>
      </j-form>

      <j-table header-bold :data="tableData" :height="height">
        <j-table-column prop="code" label="任务编号" />
        <j-table-column label="任务主题">
          <template slot-scope="scope">
            <j-link size="mini" :disabled="scope.row.status === 5" @click="handleEdit(scope.row)">
              {{ scope.row.theme }}
            </j-link>
          </template>
        </j-table-column>
        <j-table-column prop="type" label="任务类别" />
        <j-table-column prop="stopTime" label="截止时间" />
        <j-table-column prop="achieveTime" label="完成时间" />
        <j-table-column label="状态">
          <template slot-scope="scope">
            <j-popover placement="right" trigger="hover">
              <j-table :data="scope.row.recordList">
                <j-table-column width="150" prop="executeUserName" label="执行者" />
                <j-table-column width="100" label="状态">
                  <template slot-scope="props1">
                    <span>{{ statusDic[props1.row.status] }}</span>
                  </template>
                </j-table-column>
                <j-table-column width="300" prop="content" label="回复" />
                <j-table-column width="100" label="操作">
                  <template slot-scope="props2">
                    <j-button v-check="'rejectTask'" type="text" @click="handleReject(scope.row.id, props2.row)">
                      驳回
                    </j-button>
                  </template>
                </j-table-column>
              </j-table>
              <j-link slot="reference">
                {{ statusDic[scope.row.status] }}
              </j-link>
            </j-popover>
          </template>
        </j-table-column>
        <j-table-column prop="crtTime" label="执行人耗时" />
        <j-table-column prop="companyName" label="逾期次数" />
        <j-table-column prop="startUserName" label="驳回次数" />
        <j-table-column
          prop="executeUser"
          label="执行人"
          show-overflow-tooltip
          width="300"
        />
        <j-table-column prop="companyName" label="公司" />
        <j-table-column prop="startUserName" label="发起人" />
        <j-table-column prop="crtTime" label="创建时间" />
        <j-table-column label="日志">
          <template slot-scope="scope">
            <j-popover placement="right" trigger="hover">
              <j-table :data="scope.row.operationList">
                <j-table-column width="150" prop="operationTime" label="操作时间" />
                <j-table-column width="100" prop="operationUserName" label="操作人" />
                <j-table-column label="操作项" width="300">
                  <template slot-scope="props">
                    <span>{{ props.row.operationItem }}</span>
                  </template>
                </j-table-column>
              </j-table>
              <j-link slot="reference">
                历史记录
              </j-link>
            </j-popover>
          </template>
        </j-table-column>
      </j-table>
      <j-pagination
        class="page"
        style="margin:20px auto 0;"
        :current-page="tablePage.pageNum"
        :page-sizes="[15, 50, 100]"
        :page-size="tablePage.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tablePage.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </j-card>
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
        <j-form-item label="任务编号" required>
          <j-input v-model="editForm.code" placeholder="自动生成" disabled />
        </j-form-item>
        <j-form-item label="任务主题" prop="theme">
          <j-input v-model="editForm.theme" />
        </j-form-item>
        <j-form-item label="任务类别" prop="type">
          <j-select
            v-model="editForm.type"
            filterable
            allow-create
            default-first-option
          >
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="截止时间" prop="stopTime">
          <j-date-picker
            v-model="editForm.stopTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            :clearable="false"
          />
        </j-form-item>
        <j-form-item label="执行人" prop="peoples">
          <j-select
            v-model="editForm.peoples"
            value-key="executeUserId"
            multiple
            filterable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="searchPeople"
            :loading="loading"
          >
            <j-option
              v-for="item in peopleList"
              :key="item.executeUserId"
              :label="item.executeUserName"
              :value="item"
            >
              <span>
                {{ item.executeUserName }}
              </span>
              <span style="margin-left: 5px; color: #8492a6; font-size: 12px">
                {{ item.companyName }}
              </span>
            </j-option>
          </j-select>
        </j-form-item>
        <j-form-item label="任务内容" prop="taskContent">
          <j-input v-model="editForm.taskContent" :rows="3" type="textarea" />
        </j-form-item>
        <j-form-item label="添加附件" prop="file">
          <file-upload ref="fileUpload" text="文件上传" @getFiles="getFiles" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button v-show="handleType === '新增'" type="primary">保存</j-button>
        <j-button type="primary" @click="handleCreate">{{
          handleType === '新增' ? '创建' : '修改'
        }}</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import * as taskApi from '@/api/task/task'
import { getCodeList } from '@/views/common/dic'
import { tagDeltData } from '@/utils/index'
import dayjs from 'dayjs'

export default {
  name: 'Implementation',
  data () {
    return {
      loading: false,
      activeTab: 'a',
      query: {
        code: '',
        theme: '',
        status: '',
        type: '',
        timeRange: [],
        startTime: '',
        endTime: ''
      },
      statusDic: {
        0: '草稿',
        1: '进行中',
        2: '已逾期',
        3: '已提交',
        4: '已驳回',
        5: '已完成',
        6: '已取消'
      },
      height: null,
      countA: 0,
      countB: 0,
      tableData: [],
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        code: '',
        theme: '',
        type: '',
        stopTime: '',
        taskContent: '',
        executeUserList: [],
        accessory: []
      },
      oldList: [],
      typeList: [],
      peopleList: [],
      rules: {
        theme: [{ required: true, message: '请输入代码名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择状态', trigger: 'change' }],
        stopTime: [
          { required: true, message: '请选择截止时间', trigger: 'change' }
        ],
        peoples: [
          { required: true, message: '请选择执行人', trigger: 'change' }
        ],
        taskContent: [
          { required: true, message: '请输入任务内容', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    const lastmonth = dayjs()
      .add(-1, 'month')
      .startOf('month')
      .format('YYYY-MM-DD HH:mm:ss')
    const next2month = dayjs()
      .add(+2, 'month')
      .endOf('month')
      .format('YYYY-MM-DD HH:mm:ss')
    this.query.timeRange = [lastmonth, next2month]
    this.initTable(1)
    this.getSelectData()
  },
  mounted () {
    this.height = this.calHeight(60).toString()
  },
  methods: {
    getTime () {},
    search (page) {
      if (this.activeTab === 'a') {
        this.initTable(page)
      } else if (this.activeTab === 'b') {
        this.initTableB(page)
      }
    },
    tabClick (tab) {
      if (tab.name === 'a') {
        this.initTable(1)
      } else if (tab.name === 'b') {
        this.initTableB(1)
      }
    },
    searchPeople (keyWords) {
      if (keyWords) {
        this.loading = true
        taskApi
          .getUserCompanyRel({ keyWords })
          .then((res) => {
            if (res && res.code === '0') {
              this.peopleList = res.data.map((item) => ({
                id: item.id,
                executeUserId: item.accountId,
                executeUserName: item.name,
                companyCode: item.companyCode,
                companyName: item.companyName,
                delFlag: 0
              }))
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.peopleList = []
      }
    },
    getSelectData () {
      getCodeList('code00060').then((list) => {
        this.typeList = list
      })
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.handleType = '编辑'
      const rowData = JSON.parse(JSON.stringify(row))
      // 处理一下格式，否则回填和搜索数据不一致
      const executeUserList = rowData.executeUserList ? rowData.executeUserList.map((item) => ({
        id: item.id,
        executeUserId: item.executeUserId,
        executeUserName: item.executeUserName,
        companyCode: item.companyCode,
        companyName: item.companyName,
        delFlag: item.delFlag
      })) : []
      this.oldList = executeUserList
      this.editForm = rowData
      this.$set(this.editForm, 'peoples', this.oldList)
      this.peopleList = this.oldList
      // 初始化附件
      this.$nextTick(() => {
        this.$refs.fileUpload.fileList = rowData.accessory && rowData.accessory.length ? rowData.accessory : []
      })
      this.editVisible = true
    },
    handleSave () {
      const executeUserList = tagDeltData(
        this.oldList,
        this.editForm.peoples,
        'executeUserId'
      )
      taskApi
        .insertBatchSrmAccessBill(
          Object.assign(this.editForm, {
            executeUserList,
            status: 0
          })
        )
        .then((res) => {
          if (res.code === '0') {
            this.showMessage('操作成功!', 'success')
          } else {
            this.showMessage(res.message)
          }
        })
    },
    handleCreate () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          const executeUserList = tagDeltData(
            this.oldList,
            this.editForm.peoples,
            'executeUserId'
          )
          taskApi
            .insertBatchSrmAccessBill(
              Object.assign(this.editForm, {
                executeUserList,
                status: 1
              })
            )
            .then((res) => {
              if (res.code === '0') {
                this.editClose()
                this.showMessage('操作成功!', 'success')
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
    editClose () {
      this.editVisible = false
      this.editForm = {
        code: '',
        theme: '',
        type: '',
        stopTime: '',
        taskContent: '',
        executeUserList: [],
        accessory: []
      }
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = {
        code: this.query.code,
        theme: this.query.theme,
        status: this.query.status.length ? this.query.status.join(',') : null,
        type: this.query.type.length ? this.query.type.join(',') : null,
        startTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[0]
            : '',
        endTime:
          this.query.timeRange && this.query.timeRange.length
            ? this.query.timeRange[1]
            : '',
        page: this.tablePage.pageNum,
        size: this.tablePage.pageSize
      }
      taskApi
        .getAccessTaskList(params)
        .then((res) => {
          if (res && res.code === '0') {
            this.countA = res.data.count
            this.tableData = res.data.srmAccessTaskExtPage.records
            this.tablePage.total = res.data.srmAccessTaskExtPage.total
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
        theme: '',
        status: '',
        type: '',
        timeRange: [],
        startTime: '',
        endTime: ''
      }
    },
    getFiles (type, fileList, file, handle) {
      this.editForm.accessory = fileList
    },
    handleSizeChange (val) {
      this.tablePage.pageNum = 1
      this.tablePage.pageSize = val
      this.initTable()
    },
    handleCurrentChange (val) {
      this.tablePage.pageNum = val
      this.initTable()
    }
  }
}
</script>