<template>
  <div v-loading.fullscreen.lock="loading" class="app-container">
    <j-card shadow="never">
      <j-tabs v-model="activeName" @tab-click="tabClick">
        <j-tab-pane label="考核单详情" name="first">
          <j-form
            :inline="true"
            label-position="left"
            label-width="100px"
            :model="form"
          >
            <j-row class="four-row">
              <j-col :span="6">
                <j-form-item label="考核单号">
                  <span>{{ form.code }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="考核单名称">
                  <span>{{ form.name }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="状态">
                  <span>{{ statusDic[form.status] }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="BU">
                  <span>{{
                    buList.length
                      ? (
                        buList.find(
                          (dic) => dic.lineNumber === form.department
                        ) || { name: '' }
                      ).name
                      : ''
                  }}</span>
                </j-form-item>
              </j-col>
            </j-row>
            <j-row class="four-row">
              <j-col :span="6">
                <j-form-item label="供应商编码">
                  <span>{{ form.supplierCode }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="供应商名称">
                  <span>{{ form.supplierName }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="联系人">
                  <span>{{ form.supplierName }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="联系电话">
                  <span>{{ form.linkPhone }}</span>
                </j-form-item>
              </j-col>
            </j-row>
            <j-row class="four-row">
              <j-col :span="6">
                <j-form-item label="业务类型">
                  <span>{{ form.businessType }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="评价总分">
                  <span>{{ form.totalScore }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="排名">
                  <span>{{ form.currentRank }}/{{ form.totalRank }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="红黄绿评定">
                  <span>{{ colorDic[form.colourGrade] }}</span>
                </j-form-item>
              </j-col>
            </j-row>
            <j-row class="four-row">
              <j-col :span="6">
                <j-form-item label="时间维度">
                  <!-- <span>{{ timeDic[form.timeDimension] }}</span> -->
                  <span>{{
                    (
                      timeDimensionList.find(
                        (dic) => dic.value === form.timeDimension
                      ) || { label: '' }
                    ).label
                  }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="时间维度值">
                  <span>{{ form.timeDimensionValue }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="12">
                <j-form-item label="考核周期">
                  <span>{{ form.accessStartTime }} ~ {{ form.accessEndTime }}</span>
                </j-form-item>
              </j-col>
            </j-row>
            <j-row class="four-row">
              <j-col :span="6">
                <j-form-item label="创建人">
                  <span>{{ form.crtUserName }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="创建时间">
                  <span>{{ form.crtTime }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="采购负责人">
                  <span>{{ form.purchaseUserName }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="审核时间">
                  <span>{{ form.checkTime }}</span>
                </j-form-item>
              </j-col>
              <j-col :span="6">
                <j-form-item label="采购寄语">
                  <span>{{ form.checkAdvice }}</span>
                </j-form-item>
              </j-col>
            </j-row>
          </j-form>
          <div class="card-title">
            考核维度
          </div>
          <j-table :data="form.checkList" style="width: 100%">
            <j-table-column prop="accessDimensionName" label="考核维度" width="180" />
            <j-table-column prop="firstRatio" label="维度权重" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.firstRatio*100 + '%' }}</span>
              </template>
            </j-table-column>
            <j-table-column prop="score" label="维度得分" width="180" />
            <j-table-column prop="ranks" label="维度排名" width="180" />
            <!-- <j-table-column label="专业寄语" width="180">
              <template slot-scope="scope">
                <j-input v-model="scope.row.text" type="textarea" :maxlength="80" />
              </template>
            </j-table-column> -->
          </j-table>

          <div class="left-bottom-btn">
            <j-button v-check="'getBillDetailGroup'" type="primary" @click="viewIndex">
              查看指标明细
            </j-button>
            <!-- <j-button v-check="'getBillDetail'" type="primary" @click="viewScore">
              查看指标打分明细
            </j-button> -->
            <j-button v-check="'getBillDetail'" type="primary" @click="viewScore(true)">
              指标打分明细管理
            </j-button>
          </div>
        </j-tab-pane>

        <j-tab-pane label="审核结果详情" name="second">
          <j-table :data="resTableData" style="width: 100%">
            <j-table-column type="expand">
              <template slot-scope="scope">
                <j-table :data="scope.row.workflowWaits" style="width: 100%">
                  <j-table-column prop="userName" label="审核人" />
                  <j-table-column prop="judgement" label="批示意见" />
                  <j-table-column prop="crtTime" label="批示时间" />
                </j-table>
              </template>
            </j-table-column>
            <!-- <j-table-column prop="checkDimension" label="审核维度" width="180" /> -->
            <j-table-column label="审核维度" width="180">
              <template slot-scope="scope">
                <span>{{
                  (
                    dimensionList.find(
                      (dic) => dic.lineNumber === scope.row.checkDimension
                    ) || { name: '' }
                  ).name
                }}</span>
              </template>
            </j-table-column>
            <j-table-column label="状态" width="180">
              <template slot-scope="scope">
                <span>{{ resStatusDic[scope.row.status] }}</span>
              </template>
            </j-table-column>
          </j-table>
        </j-tab-pane>
      </j-tabs>
    </j-card>
    <j-dialog title="指标明细汇总（所有指标明细）" :fullscreen="true" :visible.sync="allDetailVisible">
      <j-table :data="allDetailTableData" style="width: 100%">
        <j-table-column prop="indexName" label="指标" width="250" />
        <j-table-column prop="accessDimensionName" label="考核维度" />
        <!-- <j-table-column prop="checkDimension" label="审核维度" /> -->
        <j-table-column label="审核维度">
          <template slot-scope="scope">
            <span>{{
              (
                dimensionList.find(
                  (dic) => dic.lineNumber === scope.row.checkDimension
                ) || { name: '' }
              ).name
            }}</span>
          </template>
        </j-table-column>
        <!-- <j-table-column prop="indexType" label="指标类型" /> -->
        <j-table-column label="指标类型">
          <template slot-scope="scope">
            <span>{{
              indexTypeList.length ?
                (
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
              indexAttrList.length ?
                (
                  indexAttrList.find(
                    (dic) => dic.lineNumber === parseInt(scope.row.property)
                  ) || { name: '' }
                ).name
                : ''
            }}</span>
          </template>
        </j-table-column>
        <j-table-column prop="secondaryRatio" label="二级权重">
          <template slot-scope="scope">
            <!-- <span>{{ (scope.row.secondaryRatio*100) + '%' }}</span> -->
            <span>{{ parseFloat(scope.row.secondaryRatio*100).toFixed(2) + '%' }}</span>
          </template>
        </j-table-column>
        <j-table-column prop="extremeValue" label="极限值" />
        <j-table-column prop="score" label="得分" />
        <j-table-column prop="weightedScore" label="加权得分" />
        <!-- <j-table-column label="状态" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.status }}</span>
          </template>
        </j-table-column> -->
      </j-table>
    </j-dialog>
  </div>
</template>
<script>
import * as assessApi from '@/api/kpi/assess'
import { getCodeList, timeDimensionList } from '@/views/common/dic'

export default {
  data () {
    return {
      loading: false,
      activeName: 'first',
      form: {
        checkList: []
      },
      dimensionList: [],
      buList: [],
      resTableData: [],
      resDetailVisible: false,
      allDetailTableData: [],
      allDetailVisible: false,
      // timeDic: {
      //   0: '周',
      //   1: '半月度',
      //   2: '月度',
      //   3: '季度',
      //   4: '半年度',
      //   5: '年度'
      // },
      timeDimensionList: [],
      indexTypeList: [],
      indexAttrList: [],
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
      resStatusDic: {
        0: '审批拒绝',
        1: '审批通过',
        2: '待审核'
      }
    }
  },
  created () {
    this.timeDimensionList = timeDimensionList
    this.initTable()
    this.getSelectData()
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
    initTable () {
      this.loading = true
      assessApi
        .getBillAll({ id: this.$route.query.id })
        .then((res) => {
          if (res && res.code === '0') {
            this.form = res.data
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    viewIndex () {
      this.loading = true
      assessApi
        .getBillDetailGroup({ billId: this.$route.query.id })
        .then((res) => {
          if (res && res.code === '0') {
            this.allDetailTableData = res.data
            this.allDetailVisible = true
          }
        })
        .finally(() => {
          this.loading = false
        })
      this.allDetailVisible = true
    },
    viewScore (all) {
      this.$router.push({
        path: '/kpi/assess/detail',
        query: { id: this.$route.query.id, handle: 'score', flag: all ? 0 : 1 }
      })
    },
    // showResDetail (row) {
    //   this.resDetailVisible = true
    // },
    tabClick (tab) {
      // console.log(tab.label, tab.name)
      if (tab && tab.name === 'second') {
        assessApi
          .getApprovalResult({ billId: this.$route.query.id })
          .then((res) => {
            if (res && res.code === '0') {
              this.resTableData = res.data
            }
          })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.four-row {
  ::v-deep .el-input__inner {
    width: 200px;
  }
}
.one-row {
  ::v-deep .el-input__inner,
  ::v-deep .el-textarea__inner {
    width: 610px;
  }
}
.left-bottom-btn {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
}
.card-title {
  font-size: 14px;
  font-weight: bold;
  margin: 15px 0;
}
</style>
