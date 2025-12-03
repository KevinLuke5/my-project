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
          <j-input
            v-model="query.code"
            @keyup.enter.native="tabClick({ name: activeTab })"
          />
        </j-form-item>
        <j-form-item label="任务主题">
          <j-input
            v-model="query.theme"
            @keyup.enter.native="tabClick({ name: activeTab })"
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
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getAccessTaskList'" type="primary" @click="search(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-show="activeTab === 'a'" v-check="'createTask'" @click="handleAdd">
            新增
          </j-button>
        </j-form-item>
      </j-form>

      <j-tabs v-model="activeTab" @tab-click="tabClick">
        <j-tab-pane :label="'我分配的(' + countA + ')'" name="a">
          <j-table header-bold :data="tableData" :height="height">
            <j-table-column prop="code" label="任务编号" />
            <j-table-column label="任务主题">
              <template slot-scope="scope">
                <j-link size="mini" @click="handleEdit(scope.row)">
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
                  <j-table :data="scope.row.executeUsers" max-height="500">
                    <j-table-column width="150" prop="executeUserName" label="执行者" />
                    <j-table-column width="100" label="状态">
                      <template slot-scope="props1">
                        <span>{{ statusDic[props1.row.detailStatus] }}</span>
                      </template>
                    </j-table-column>
                    <j-table-column width="300" prop="content" label="回复">
                      <template slot-scope="inscope">
                        <!-- 拼接回复数据 -->
                        <div v-for="item in inscope.row.replyList" :key="item.id">
                          ● {{ item.operationTime }}，{{ item.content }}，
                          <span v-if="item.accessory">
                            <j-link v-for="file in item.accessory" :key="file.id" @click="onPreview(file)">
                              {{ file.name }}
                            </j-link>
                          </span>
                        </div>
                      </template>
                    </j-table-column>
                    <j-table-column width="100" label="操作">
                      <template slot-scope="props2">
                        <j-button
                          v-check="'rejectTask'"
                          :disabled="props2.row.detailStatus !== 2"
                          :style="
                            props2.row.detailStatus !== 2
                              ? 'color:grey !important'
                              : ''
                          "
                          type="text"
                          @click="handleReject(scope.row.id, props2.row)"
                        >
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
            <j-table-column
              prop="executeUser"
              label="执行人"
              show-overflow-tooltip
              width="300"
            />
            <!-- <j-table-column prop="companyName" label="公司" /> -->
            <j-table-column prop="startUserName" label="发起人" />
            <!-- <j-table-column prop="startUserName" label="发起人">
              <template slot-scope="scope">
                <span>({{ scope.row.startUserName }}):{{ scope.row.startCompanyName }}</span>
              </template>
            </j-table-column> -->
            <j-table-column prop="crtTime" label="创建时间" />
            <j-table-column label="日志">
              <template slot-scope="scope">
                <j-popover placement="right" trigger="hover">
                  <j-table :data="scope.row.operationList" max-height="500">
                    <j-table-column width="150" prop="operationTime" label="操作时间" />
                    <j-table-column width="100" prop="operationUserName" label="操作人" />
                    <j-table-column label="操作项" width="300">
                      <template slot-scope="props">
                        <div v-html="props.row.operationItem" />
                      </template>
                    </j-table-column>
                  </j-table>
                  <j-link slot="reference">
                    历史记录
                  </j-link>
                </j-popover>
              </template>
            </j-table-column>
            <j-table-column label="操作">
              <template slot-scope="scope">
                <div class="operate-btn-group">
                  <j-button
                    v-check="'copyTask'"
                    type="text"
                    size="mini"
                    @click="handleCopy(scope.row.id)"
                  >
                    复制
                  </j-button>
                  <j-button
                    v-check="'cancelComplete'"
                    :disabled="scope.row.status === 5 || scope.row.status === 6"
                    :style="
                      scope.row.status === 5 || scope.row.status === 6
                        ? 'color:grey !important'
                        : ''
                    "
                    type="text"
                    size="mini"
                    @click="handleCancelComplete(scope.row.id, 6)"
                  >
                    取消
                  </j-button>
                  <j-button
                    v-check="'cancelComplete'"
                    :disabled="scope.row.status === 5 || scope.row.status === 6"
                    :style="
                      scope.row.status === 5 || scope.row.status === 6
                        ? 'color:grey !important'
                        : ''
                    "
                    type="text"
                    size="mini"
                    @click="handleCancelComplete(scope.row.id, 5)"
                  >
                    完成
                  </j-button>
                </div>
              </template>
            </j-table-column>
          </j-table>
          <j-pagination
            class="page"
            style="margin: 20px auto 0"
            :current-page="tablePage.pageNum"
            :page-sizes="[15, 50, 100]"
            :page-size="tablePage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tablePage.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </j-tab-pane>
        <j-tab-pane :label="'由我处理(' + countB + ')'" name="b">
          <j-table-with-page
            :columns="tableColumnsB"
            :data-source="tableDataB"
            :options="tableOptions"
            :fetch="initTableB"
            :pagination="tablePageB"
            :height="height"
          />
        </j-tab-pane>
      </j-tabs>
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
        :disabled="editForm.status === 5 || editForm.status === 6"
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
          <all-upload ref="fileUpload" text="文件上传" @getFiles="getFiles" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button
          v-show="handleType === '新增' || editForm.status === 0"
          type="primary"
          @click="handleCreate(0)"
        >保存
        </j-button>
        <j-button v-show="editForm.status !== 5" type="primary" @click="handleCreate(4)">{{
          handleType === '新增' || editForm.status === 0 ? '创建' : '修改'
        }}</j-button>
      </span>
    </j-dialog>

    <!-- 由我处理 -->
    <j-dialog
      :visible.sync="replyVisible"
      :modal="false"
      width="500px"
      @close="replyClose"
    >
      <j-form
        ref="replyForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="replyForm"
      >
        <j-form-item label="任务主题">
          <j-input v-model="replyForm.theme" disabled />
        </j-form-item>
        <j-form-item label="任务内容">
          <j-input
            v-model="replyForm.taskContent"
            :rows="3"
            type="textarea"
            disabled
          />
        </j-form-item>
        <j-form-item label="查看附件">
          <div>
            <j-button
              v-for="file in replyForm.accessory"
              :key="file.id"
              type="text"
              @click="onPreview(file)"
            >
              {{ file.name }}
            </j-button>
          </div>
        </j-form-item>
        <j-form-item
          v-show="
            !(replyForm.detailStatus === 5 || replyForm.detailStatus === 6)
          "
          label="添加附件"
          prop="file"
        >
          <all-upload ref="replyFileUpload" text="文件上传" @getFiles="getReplayFiles" />
        </j-form-item>
        <j-form-item
          v-show="
            !(replyForm.detailStatus === 5 || replyForm.detailStatus === 6)
          "
          required
          label="回复"
        >
          <j-input v-model="replyForm.content" :rows="3" type="textarea" />
        </j-form-item>
        <j-form-item
          v-show="
            !(replyForm.detailStatus === 5 || replyForm.detailStatus === 6)
          "
        >
          <j-button
            v-check="'insertOrUpdateRecord'"
            style="float: right"
            type="primary"
            @click="replySave"
          >
            提交
          </j-button>
        </j-form-item>
        <j-form-item v-check="'getRecord'" label="回复记录">
          <div v-for="item in replyList" :key="item.id">
            {{ item.crtTime + '，' + item.content }}
            <span>
              <j-link v-for="file in item.accessory" :key="file.id" @click="onPreview(file)">
                {{ file.name }}
              </j-link>
            </span>
          </div>
        </j-form-item>
      </j-form>
    </j-dialog>
    <all-viewer ref="allViewer" />
  </div>
</template>

<script>
import * as taskApi from '@/api/task/task'
import { getCodeList } from '@/views/common/dic'
import { tagDeltData } from '@/utils/index'
import dayjs from 'dayjs'

export default {
  name: 'TaskList',
  data () {
    const checkTime = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择截止时间'))
      } else if (
        this.editForm.status === 0 &&
        value <= dayjs().format('YYYY-MM-DD HH:mm:ss')
      ) {
        callback(new Error('截止时间要大于当前时间'))
      } else if (
        [1, 2, 3, 4].includes(this.editForm.status) &&
        value <= this.editForm.crtTime
      ) {
        callback(new Error('截止时间要大于创建时间' + this.editForm.crtTime))
      } else {
        callback()
      }
    }
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
        1: '已逾期',
        2: '已提交',
        3: '已驳回',
        4: '进行中',
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
      tableDataB: [],
      tableColumnsB: [
        {
          prop: 'code',
          label: '任务编号'
        },
        {
          label: '任务主题',
          render: (h, row) => (
            <j-link
              size="mini"
              onClick={() => {
                this.handleReply(row)
              }}
            >
              {row.theme}
            </j-link>
          )
        },
        {
          prop: 'crtTime',
          label: '创建时间'
        },
        {
          prop: 'stopTime',
          label: '截止时间'
        },
        {
          label: '状态',
          render: (h, row) => <span>{this.statusDic[row.detailStatus]}</span>
        },
        {
          prop: 'startUserName',
          label: '发起人'
          // render: (h, row) => <span>({ row.startUserName }):{ row.startCompanyName }</span>
        }
      ],
      tablePageB: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      tableOptions: {
        toolbarBottom: true,
        mutiSelect: false,
        index: false,
        loading: false,
        initTable: false
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        code: '',
        theme: '',
        status: 0,
        type: '',
        stopTime: '',
        taskContent: '',
        executeUserList: [],
        accessory: []
      },
      oldList: [],
      replyVisible: false,
      replyForm: {
        code: '',
        theme: '',
        taskContent: '',
        accessory: []
      },
      accessory: [],
      replyList: [],
      typeList: [],
      peopleList: [],
      rules: {
        theme: [{ required: true, message: '请输入代码名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择状态', trigger: 'change' }],
        stopTime: [{ validator: checkTime, required: true, trigger: 'change' }],
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
    this.initTableB()
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
                // id: item.id,
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
      const executeUserList = rowData.executeUserList
        ? rowData.executeUserList.map((item) => ({
          id: item.id,
          executeUserId: item.executeUserId,
          executeUserName: item.executeUserName,
          companyCode: item.companyCode,
          companyName: item.companyName,
          delFlag: item.delFlag
        }))
        : []
      this.oldList = executeUserList
      this.editForm = rowData
      this.$set(this.editForm, 'peoples', executeUserList)
      this.peopleList = executeUserList
      this.editVisible = true
      // 初始化附件
      this.$nextTick(() => {
        this.$refs.fileUpload.fileList =
          rowData.accessory && rowData.accessory.length ? rowData.accessory : []
        this.$refs.editForm.clearValidate()
      })
    },
    // 保存 0 创建 4
    handleCreate (status) {
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
                status
              })
            )
            .then((res) => {
              if (res.code === '0') {
                this.editClose(status)
                this.showMessage('操作成功!', 'success')
                this.initTable(1)
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
      // if (status) {
      this.editVisible = false
      this.$nextTick(() => {
        this.$refs.fileUpload.fileList = []
      })
      this.oldList = []
      this.peopleList = []
      this.editForm = {
        code: '',
        theme: '',
        status: 0,
        type: '',
        stopTime: '',
        taskContent: '',
        executeUserList: [],
        accessory: []
      }
      this.$refs.editForm.clearValidate()
      // }
    },
    handleCopy (taskId) {
      taskApi.copyTask({ taskId }).then((res) => {
        if (res && res.code === '0') {
          this.showMessage('操作成功！', 'success')
          this.initTable()
        } else {
          this.showMessage(res.message)
        }
      })
    },
    handleReject (taskId, row) {
      taskApi.rejectTask({ taskId, userId: row.executeUserId }).then((res) => {
        if (res && res.code === '0') {
          this.showMessage('操作成功！', 'success')
          this.initTable()
        } else {
          this.showMessage(res.message)
        }
      })
    },
    handleCancelComplete (id, status) {
      taskApi.cancelComplete({ id, status }).then((res) => {
        if (res && res.code === '0') {
          this.showMessage('操作成功！', 'success')
          this.initTable()
        } else {
          this.showMessage(res.message)
        }
      })
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
    initTableB (page) {
      if (page) {
        this.tablePageB.pageNum = page || 1
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
        page: this.tablePageB.pageNum,
        size: this.tablePageB.pageSize
      }
      return new Promise((resolve, reject) => {
        taskApi
          .getExecuteUserTask(params)
          .then((res) => {
            if (res && res.code === '0') {
              this.countB = res.data.count
              this.tableDataB = res.data.executeUserTasks.records
              this.tablePageB.total = res.data.executeUserTasks.total
              resolve(res.data.executeUserTasks.records)
            } else {
              reject(res)
            }
          })
          .finally(() => {
            this.tableOptions.loading = false
          })
      })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    handleReply (row) {
      // 先刷新列表数据获取最新状态再弹窗
      this.initTableB().then((list) => {
        const rowList = list.filter((newrow) => newrow.id === row.id)
        this.curRow = rowList.length
          ? rowList[0]
          : JSON.parse(JSON.stringify(row))
        this.replyForm = {
          taskId: this.curRow.id,
          code: this.curRow.code,
          theme: this.curRow.theme,
          detailStatus: this.curRow.detailStatus,
          taskContent: this.curRow.taskContent,
          accessory: this.curRow.accessory || []
        }
        this.replySearch()
      })
    },
    replySearch () {
      taskApi
        .getRecord(Object.assign(this.editForm, { taskId: this.curRow.id }))
        .then((res) => {
          if (res.code === '0') {
            this.replyList = res.data
            this.replyVisible = true
          } else {
            this.showMessage(res.message)
          }
        })
    },
    replySave () {
      if (!this.replyForm.content || !this.replyForm.content.trim()) {
        this.showMessage('请填写回复内容！')
        return
      }
      taskApi
        .insertOrUpdateRecord(
          Object.assign({
            taskId: this.replyForm.taskId,
            content: this.replyForm.content,
            accessory: this.accessory
          })
        )
        .then((res) => {
          if (res.code === '0') {
            // this.replyForm.content = ''
            // this.replySearch()
            this.showMessage('操作成功!', 'success')
            this.initTableB(1)
            this.replyClose()
          } else {
            this.showMessage(res.message)
          }
        })
    },
    replyClose () {
      this.$refs.replyFileUpload.fileList = []
      this.accessory = []
      this.replyForm.content = ''
      this.replyVisible = false
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
    getReplayFiles (type, fileList, file, handle) {
      this.accessory = fileList
    },
    handleSizeChange (val) {
      this.tablePage.pageNum = 1
      this.tablePage.pageSize = val
      this.initTable()
    },
    handleCurrentChange (val) {
      this.tablePage.pageNum = val
      this.initTable()
    },
    onPreview (file) {
      if (file.type === 'application/pdf' || file.name.substr(-4) === '.pdf') {
        this.$refs.allViewer.show(file.url, 'pdf')
      } else if (file.type.indexOf('image/') !== -1) {
        this.$refs.allViewer.show(file.url, 'image')
      } else if (
        file.name.substr(-4) === '.xls' ||
        file.name.substr(-5) === '.xlsx' ||
        file.name.substr(-4) === '.csv'
      ) {
        this.$refs.allViewer.show(file.url, 'excel')
      } else {
        this.$refs.allViewer.show(file.url, 'file')
      }
    }
  }
}
</script>
