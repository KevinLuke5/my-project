<template>
  <j-dialog
    :title="'审厂结果：' + factoryResult"
    :visible.sync="rectificationVisible"
    :modal="false"
    :before-close="close"
    :fullscreen="true"
  >
    <j-form
      ref="rectificationForm"
      class="dialog-form"
      size="mini"
      :inline="true"
      label-position="left"
      label-width="95px"
      :model="rectificationForm"
      :rules="rules"
    />
    <!-- 表格 -->
    <j-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      size="small"
      :height="height"
      style="width: 100%"
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <j-table-column type="selection" width="55" fixed />
      <j-table-column prop="dept" label="考核部门">
        <template slot-scope="scope">
          {{ deptDic[scope.row.dept] }}
        </template>
      </j-table-column>
      <j-table-column prop="radio" label="权重" />
      <j-table-column label="得分">
        <template slot-scope="scope">
          <div v-if="scope.row.dept === 2">
            {{ allNumPurchase >= 0 ? allNumPurchase : 0 }}
          </div>
          <div v-if="scope.row.dept === 3">
            {{ allNumResearch >= 0 ? allNumResearch : 0 }}
          </div>
          <div v-if="scope.row.dept === 4">
            {{ score >= 0 ? score : 0 }}
          </div>
        </template>
      </j-table-column>
      <j-table-column fixed="right" label="详细情况" width="200">
        <template slot-scope="scope">
          <div v-if="scope.row.dept === 4">
            <j-button type="text" @click="handleSituation(scope.row, 0, 'qsa')">
              查看QSA打分详情
            </j-button>
            <j-button type="text" @click="handleSituation(scope.row, 0, 'qpa')">
              查看QPA打分详情
            </j-button>
          </div>
          <div v-else-if="scope.row.dept !== 4">
            <j-button type="text" @click="handleSituation(scope.row, type)">
              查看{{ deptDic[scope.row.dept] }}打分详情
            </j-button>
          </div>
        </template>
      </j-table-column>
    </j-table>
    <h2>综合得分：{{ overallRatings }}</h2>
  </j-dialog>
</template>

<script>
// import { getStandardrectification, getStandardrectificationAdd, getStandardrectificationDelete } from '@/api/verify/unionVerify'
// import { projectSearch } from '@/api/options'
// import { returnIds } from '@/utils/index'
import * as unionVerifyApi from '@/api/verify/unionVerify'

export default {
  props: {
    rectificationVisible: Boolean,
    rectificationForm: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      deptDic: {
        2: '采购',
        3: '研发',
        4: '品质'
      },
      deptDicDiff: {
        0: 'QSA',
        1: 'QPA',
        2: '采购',
        3: '研发'
      },
      loading: false,
      height: null,
      tableData: [],
      selectList: [],
      codeId: '',
      handleType: '新增',
      rules: {
        projectName: [
          { required: true, message: '请选择项目名称', trigger: 'change' }
        ],
        standard: [
          { required: true, message: '请输入标准', trigger: 'change' }
        ],
        scoreStandard: [
          { required: true, message: '请输入评分标准', trigger: 'change' }
        ],
        score: [{ required: true, message: '请输入分值', trigger: 'change' }],
        mandatory: [
          { required: true, message: '请选择强制项', trigger: 'change' }
        ],
        veto: [{ required: true, message: '请选择否决项', trigger: 'change' }]
      },
      projectList: [],
      factoryResult: '',
      score: '',
      overallRatings: '',
      againIdQSA: '',
      againIdQPA: '',
      checkType: '',
      type: '',
      allNumPurchase: '',
      allNumResearch: ''
    }
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    handleSituation (row, type, flag) {
      if (type === 0) {
        this.type = 0
        if (flag === 'qsa') {
          this.$router.push({
            path: '/verify/doc',
            query: { handle: 'view', id: this.againIdQSA, type: this.type }
          })
        } else if (flag === 'qpa') {
          this.$router.push({
            path: '/verify/doc',
            query: { handle: 'view', id: this.againIdQPA, type: this.type }
          })
        }
      } else {
        this.type = row.type
        this.$router.push({
          path: '/verify/doc',
          query: { handle: 'view', id: row.againId, type: this.type }
        })
      }
    },
    getrectificationTable (id) {
      unionVerifyApi.rectificationQuery({ taskId: id }).then((res) => {
        if (res.code === '0') {
          this.tableData = res.data.list.filter((item) => item.dept > 1)
          if (res.data.result) {
            this.tableData.push(res.data.result)
          }
          res.data.list.forEach((item) => {
            if (item.dept === 0) {
              this.againIdQSA = item.againId
            } else if (item.dept === 1) {
              this.againIdQPA = item.againId
            }
          })
          this.tableData.forEach((item) => {
            if (item.dept === 2) {
              Object.assign(item, { type: 1 })
              this.allNumPurchase = item.allNum
            } else if (item.dept === 3) {
              Object.assign(item, { type: 2 })
              this.allNumResearch = item.allNum
            }
          })
          if (res.data.list[0].factoryResult === 1) {
            this.factoryResult = '通过'
          } else if (res.data.list[0].factoryResult === 2) {
            this.factoryResult = '整改'
          } else {
            this.factoryResult = '淘汰'
          }
        }
        this.overallRatings = res.data.result.allNum
        this.score = res.data.result.score

      })
    },
    // getrectificationTable (id) {
    //   this.codeId = id
    //   getStandardrectification({ id: id }).then((res) => {
    //     if (res.code === '0') {
    //       this.tableData = res.data
    //     }
    //   })
    // },
    handleSelectionChange (val) {
      this.selectList = val
    },
    close () {
      this.tableData = []
      this.factoryResult = ''
      this.overallRatings = ''
      this.$emit('rectificationClose')
    }
  }
}
</script>