<template>
  <div class="app-container">
    <j-card v-loading="loading" class="box-card" shadow="never">
      <div class="oa-title">
        {{ title }}
      </div>
      <div class="button">
        <ul>
          <li>
            <i class="el-icon-edit-outline" />
            <j-button type="text" size="mini" @click="comment">
              我要批示
            </j-button>
          </li>
          <li>
            <i class="el-icon-document-copy" />
            <j-button type="text" size="mini" @click="approval">
              公文转发
            </j-button>
          </li>
          <li>
            <i class="el-icon-document-copy" />
            <j-button type="text" size="mini" @click="review">
              文件分阅
            </j-button>
          </li>
          <li>
            <i class="el-icon-search" />
            <j-button type="text" size="mini" @click="viewFlowchart">
              查看流程图
            </j-button>
          </li>
        </ul>
      </div>
      <j-scrollbar ref="myScroll" class="scroll">
        <div style="padding-top: 10px" class="main">
          <j-table :data="examList" style="width: 100%">
            <j-table-column prop="indexName" label="指标" width="200" />
            <j-table-column prop="accessDimensionName" label="考核维度" />
            <j-table-column label="审核维度">
              <template slot-scope="scope">
                <span>{{
                  dimensionList.length
                    ? (
                      dimensionList.find(
                        (dic) => dic.lineNumber === scope.row.checkDimension
                      ) || { name: '' }
                    ).name
                    : ''
                }}</span>
              </template>
            </j-table-column>
            <j-table-column prop="score" label="得分" />
            <j-table-column prop="weightedScore" label="加权得分" />
            <j-table-column prop="denominator" label="分母" />
            <j-table-column prop="molecule" label="分子" />
            <j-table-column prop="indexValue" label="指标值" />
            <j-table-column label="BU">
              <template slot-scope="scope">
                <span>
                  {{ buList.length
                    ? (
                      buList.find(
                        (dic) => dic.lineNumber === scope.row.groupLine
                      ) || { name: '' }
                    ).name
                    : '' }}
                </span>
              </template>
            </j-table-column>
            <j-table-column prop="lineName" label="产品线" />
            <j-table-column label="指标类型">
              <template slot-scope="scope">
                <span>{{
                  indexTypeList.length
                    ? (
                      indexTypeList.find(
                        (dic) => dic.lineNumber === scope.row.indexType
                      ) || { name: '' }
                    ).name
                    : ''
                }}</span>
              </template>
            </j-table-column>
            <!-- <j-table-column prop="property" label="属性" /> -->
            <j-table-column label="属性">
              <template slot-scope="scope">
                <span>{{
                  indexAttrList.length
                    ? (
                      indexAttrList.find(
                        (dic) =>
                          dic.lineNumber === parseInt(scope.row.property)
                      ) || { name: '' }
                    ).name
                    : ''
                }}</span>
              </template>
            </j-table-column>
            <j-table-column label="二级权重">
              <template slot-scope="scope">
                <span>{{ parseFloat(scope.row.secondaryRatio*100).toFixed(2) + '%' }}</span>
              </template>
            </j-table-column>
            <j-table-column label="三级权重">
              <template slot-scope="scope">
                <span>{{ parseFloat(scope.row.thirdRatio*100).toFixed(2) + '%' }}</span>
              </template>
            </j-table-column>
            <j-table-column prop="extremeValue" label="极限值" />
            <j-table-column prop="remark" label="备注" />
            <j-table-column prop="accessory" label="附件">
              <template slot-scope="scope">
                <!-- <file-upload v-model="scope.row.picture" :can-upload="false" /> -->
                <j-link
                  v-for="file in scope.row.accessory"
                  :key="file.id"
                  type="primary"
                  @click="downExcel(file)"
                >
                  {{ file.name }}
                </j-link>
              </template>
            </j-table-column>
            <j-table-column prop="gradeUserName" label="指定打分人" />
            <j-table-column prop="checkUserRemark" label="打分人备注" />
            <j-table-column prop="updTime" label="更新时间" />
            <j-table-column label="操作" width="105">
              <template slot-scope="scope">
                <j-button type="text" @click="showLogic(scope.row)">
                  查看考核逻辑
                </j-button>
              </template>
            </j-table-column>
          </j-table>
        </div>
        <div>
          <div class="table_title">
            <span>流程日志</span>
          </div>
          <j-table
            :data="logList"
            size="small"
            style="width: 100%"
            tooltip-effect="dark"
            highlight-current-row
          >
            <j-table-column prop="sendTime" width="150" label="时间" />
            <j-table-column prop="sendName" width="120" label="姓名" />
            <j-table-column prop="logInfo" label="流转日志">
              <template slot-scope="scope">
                <span v-html="scope.row.logInfo" />
              </template>
            </j-table-column>
          </j-table>
          <div class="table_title">
            <span>批示意见</span>
          </div>
          <j-table
            :data="commentsList"
            size="small"
            style="width: 100%"
            tooltip-effect="dark"
            highlight-current-row
          >
            <j-table-column prop="createTime" width="150" label="时间" />
            <j-table-column prop="ownerName" width="120" label="姓名" />
            <j-table-column prop="isAgree" width="120" label="操作">
              <template slot-scope="scope">
                <span>{{ scope.row.isAgree == 1 ? '同意' : '不同意' }}</span>
              </template>
            </j-table-column>
            <j-table-column prop="judgement" label="批示意见" />
          </j-table>
        </div>
      </j-scrollbar>
    </j-card>
    <comment
      ref="comment"
      :wait-id="waitId"
      :request-id="requestId"
      @close="commentClose"
    />
    <flowChart ref="flowChart" :flow-chart="flowChart" />
    <selectPersonnel
      ref="selectPer"
      :tree-data="treeData"
      :table-data="tableData"
      :selected-data-up="getPrincipalList"
      @handleNodeClick="handleNodeClick"
      @handleNodeClick2="handleNodeClick2"
      @handleSearch="handleSearch"
      @submitMan="submitMan"
      @getDeptByUser="getDeptByUser"
    />
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
    <file-viewer ref="fileViewer" />
  </div>
</template>

<script>
import comment from '../components/comment'
import selectPersonnel from '../components/selectPersonnel'
import flowChart from '../components/flowChart'
import {
  getFlowInfo,
  getWorkflowInFo,
  sendRead,
  sendWorkFlow,
  getWorkFlowImg
} from '@/api/kpi/oa'
import {
  getTree,
  getParticipants,
  getDeptIdByUser
} from '@/api/processCenter/selectPersonnel'
import { getCodeList } from '@/views/common/dic'

export default {
  name: 'Oa',
  components: { comment, selectPersonnel, flowChart },
  // provide () {
  //   return {
  //     init: this.init
  //   }
  // },
  data () {
    return {
      loading: false,
      examList: [],
      logList: [],
      commentsList: [],
      treeData: [],
      tableData: [],
      principalList: [],
      waitId: '',
      requestId: '',
      title: '',
      processinstId: '',
      processdir: '',
      flowChart: '',
      logicVisible: false,
      logicForm: {},
      dimensionList: [],
      indexTypeList: [],
      indexAttrList: [],
      buList: []
    }
  },
  computed: {
    getPrincipalList () {
      const datas = this.principalList
      return datas
    }
  },
  created () {
    this.getSelectData()
    this.init()
    this.getTreeList()
  },
  methods: {
    getSelectData () {
      getCodeList('code00034').then((list) => {
        this.buList = list
      })
      getCodeList('code00035').then((list) => {
        this.dimensionList = list
      })
      getCodeList('code00038').then((list) => {
        this.indexTypeList = list
      })
      getCodeList('code00039').then((list) => {
        this.indexAttrList = list
      })
    },
    downExcel (file) {
      this.$refs.fileViewer.show(file)
    },
    commentClose () {
      this.initTable()
    },
    init () {
      const url = {}
      if (this.$route.query.requestid) {
        url.requestId = this.$route.query.requestid
      } else {
        url.requestId = ''
      }
      if (this.$route.query.waitrequestid) {
        url.waitId = this.$route.query.waitrequestid
      } else {
        url.waitId = ''
      }
      this.waitId = url.waitId
      this.requestId = url.requestId
      // 获取流程数据
      getFlowInfo({ requestId: this.requestId })
        .then((res) => {
          if (res && res.processinstId) {
            this.processinstId = res.processinstId
            this.processdir = res.processdir
            this.title = res.title
          } else {
            this.showMessage('获取流程数据失败，请刷新重试！')
          }
        })
        .catch((err) => {
          this.showMessage(err)
        })
      this.initTable()
    },
    initTable () {
      this.loading = true
      getWorkflowInFo({ requestId: this.requestId, waitId: this.waitId })
        .then((res) => {
          if (res && res.code === '0' && res.data) {
            this.examList = res.data.details
            this.logList = res.data.logs
            this.commentsList = res.data.judges
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    showLogic (row) {
      this.logicVisible = true
      this.logicForm = row
    },
    // 审批
    comment () {
      this.$refs.comment.dialog = true
    },
    // 公文转发
    approval () {
      this.$refs.selectPer.dialogVisible = true
      this.selectPer = 'approval'
    },
    // 分阅
    review () {
      this.$refs.selectPer.dialogVisible = true
      this.selectPer = 'review'
    },
    // 查看流程图
    viewFlowchart () {
      this.flowChart = getWorkFlowImg({
        processInstID: this.processinstId,
        processName: this.processdir
      })
      // console.log(this.flowChart)
      window.open(this.flowChart)
      // this.$refs.flowChart.dialog = true
    },
    getTreeList () {
      getTree({ status: 1 }).then((res) => {
        this.treeData = res.data.deptTreeVos
      })
    },
    // 部门选择
    handleNodeClick (id) {
      const params = {
        dutyId: id,
        status: 1
      }
      getParticipants(params).then((res) => {
        this.tableData = res.data
      })
    },
    // 岗位选择
    handleNodeClick2 () {},
    // 搜索
    handleSearch (params) {
      getParticipants(params).then((res) => {
        this.tableData = res.data
      })
    },
    // 本部门按钮
    getDeptByUser () {
      getDeptIdByUser().then((res) => {
        const dutyId = res.data
        if (!dutyId) {
          this.$notify({
            title: '当前账号未关联部门',
            type: 'warning',
            duration: 2500
          })
        } else {
          const params = {
            dutyId: dutyId,
            status: 1
          }
          getParticipants(params).then((res) => {
            this.tableData = res.data
          })
        }
      })
    },
    // 选择人员保存
    submitMan (val) {
      const users = []
      this.principalList = val
      this.principalList.forEach((e) => {
        const user = {}
        user.userId = e.id
        user.userName = e.name
        users.push(user)
      })
      const curUserInfo = JSON.parse(localStorage.getItem('userInfo'))
      // console.log(curUserInfo)
      const baseData = {
        actionurl: `https://scm${
          process.env.NODE_ENV === 'production' ? '' : '-test'
        }.joyoung.com/srm-web/#/kpi/assess/oa`,
        requestId: this.requestId
      }
      if (this.selectPer === 'review') {
        // 分阅
        sendRead(
          Object.assign({}, baseData, {
            sendUserId: curUserInfo ? curUserInfo.userOaId : '',
            sendUserName: curUserInfo ? curUserInfo.name : '',
            users
          })
        ).then((res) => {
          if (res && res.code === '0') {
            this.initTable()
            this.$notify({
              title: '分阅成功',
              type: 'success',
              duration: 2500
            })
          } else {
            this.showMessage(res.errmsg)
          }
        })
      } else if (this.selectPer === 'approval') {
        // 转发
        sendWorkFlow(
          Object.assign({}, baseData, {
            userId: curUserInfo ? curUserInfo.userOaId : '',
            userName: curUserInfo ? curUserInfo.name : '',
            processdir: this.processdir,
            receiverList: users
          })
        ).then((res) => {
          if (res && res.code === '0') {
            this.initTable()
            this.$notify({
              title: '转发成功',
              type: 'success',
              duration: 2500
            })
          } else {
            this.showMessage(res.errmsg)
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.oa-title {
  font-size: 22px;
  font-weight: bold;
}
.button {
  height: 30px;
  background-color: #f5f6fa;
}
li {
  float: left; // 向左排列
  list-style: none;
  font-size: 14px;
  margin-right: 10px;
}
::v-deep .el-button--text {
  color: #444;
}
::v-deep ul {
  padding-inline-start: 10px;
}
.alert {
  height: 30px;
  background-color: #f5f6fa;
  font-size: 14px;
  margin-top: 10px;
}
.title {
  padding: 15px;
  width: 100%;
  background-color: #f5f6fa;
  // box-shadow: 0 1px 4px #fcfaf7;
  font-size: 14px;
  border-radius: 10px;
  color: #37414a;
}
.el-col-6 {
  display: flex;
  .label {
    // flex: 1;
    width: 70px;
    display: inline-block;
  }
  .content {
    flex: 1;
    display: inline-block;
  }
}
.el-col-24 {
  display: flex;
  .label {
    // flex: 1;
    width: 70px;
    display: inline-block;
  }
  .content {
    flex: 1;
    display: inline-block;
  }
}
::v-deep .el-scrollbar .el-scrollbar__wrap {
  overflow-x: hidden;
}
::v-deep .el-scrollbar_bar.is-horizontal {
  height: 0;
}
.scroll {
  height: 80vh;
  width: 100%;
  overflow: auto;
  overflow-x: hidden;
}
// .table {
//   color: #37414a;
// }
.table_title {
  height: 30px;
  line-height: 30px;
  margin-top: 10px;
  padding-left: 10px;
  background-color: #f5f6fa;
}
</style>