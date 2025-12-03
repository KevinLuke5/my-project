<template>
  <div class="app-container">
    <j-card v-loading.fullscreen.lock="fullscreenLoading" class="box-card" shadow="never">
      <div v-show="$route.query.handle !== 'view'" class="left-top-btn">
        <j-button
          v-show="form.checkStatus === 0 || $route.query.handle === 'add'"
          type="primary"
          @click="handleSubmit(0)"
        >
          保存
        </j-button>
        <j-button type="success" @click="handleSubmit(1)">
          提交打分结果
        </j-button>
      </div>
      <j-form
        ref="editForm"
        :inline="true"
        :rules="rules"
        :disabled="$route.query.handle === 'view' || ($route.query.handle === 'edit' && form.taskCode ? true:false)"
        label-position="left"
        label-width="95px"
        :model="form"
        class="form-inline"
      >
        <j-row class="three-row">
          <div class="row-item">
            <j-form-item :label="urlDic[$route.query.type] + '审厂单号'">
              <j-input v-model="form.code" disabled />
            </j-form-item>
          </div>
          <div class="row-item">
            <j-form-item label="单据名称" prop="name">
              <j-input v-model="form.name" />
            </j-form-item>
          </div>
          <div class="row-item">
            <j-form-item label="供应商" prop="supplierName">
              <j-autocomplete
                v-model="form.supplierName"
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
          </div>
          <div class="row-item">
            <j-form-item label="审厂目的" prop="destination">
              <j-select v-model="form.destination" clearable>
                <j-option
                  v-for="item in aimList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.lineNumber"
                />
              </j-select>
            </j-form-item>
          </div>
          <div class="row-item">
            <j-form-item label="审厂类别" prop="category">
              <j-select v-model="form.category" clearable>
                <j-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.lineNumber"
                />
              </j-select>
            </j-form-item>
          </div>
          <div class="row-item">
            <j-form-item label="类型" prop="equipType">
              <j-select v-model="form.equipType" clearable>
                <j-option
                  v-for="item in typeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.lineNumber"
                />
              </j-select>
            </j-form-item>
          </div>
          <div class="row-item">
            <j-form-item label="产品线" prop="srmFactoryLineRelList">
              <j-select
                v-model="form.srmFactoryLineRelList"
                value-key="lineCode"
                filterable
                multiple
                clearable
                @change="lineChange"
              >
                <j-option
                  v-for="item in lineList"
                  :key="item.lineCode"
                  :label="item.lineName"
                  :value="item"
                />
              </j-select>
            </j-form-item>
          </div>
          <div class="row-item">
            <j-form-item label="大类" prop="srmFactoryBigTypeRelList">
              <j-select
                v-model="form.srmFactoryBigTypeRelList"
                value-key="bigTypeCode"
                multiple
                filterable
                clearable
                @change="getSmallType"
              >
                <j-option
                  v-for="item in bigTypeList"
                  :key="item.bigTypeCode"
                  :label="item.bigTypeName"
                  :value="item"
                />
              </j-select>
            </j-form-item>
          </div>
          <div class="row-item">
            <j-form-item label="小类" prop="srmFactorySmallTypeRelList">
              <j-select
                v-model="form.srmFactorySmallTypeRelList"
                value-key="smallTypeCode"
                multiple
                filterable
                clearable
                @change="smallChange"
              >
                <j-option
                  v-for="item in smallTypeList"
                  :key="item.smallTypeCode"
                  :label="item.smallTypeName"
                  :value="item"
                />
              </j-select>
            </j-form-item>
          </div>
          <div class="row-item">
            <j-form-item label="属性" prop="property">
              <j-select v-model="form.property" clearable>
                <j-option
                  v-for="(value, index) in attrDic[$route.query.type]"
                  :key="index"
                  :label="value"
                  :value="parseInt(index)"
                />
              </j-select>
            </j-form-item>
          </div>
          <div class="row-item">
            <j-form-item label="审厂任务编码" prop="taskCode">
              <j-input v-model="form.taskCode" disabled />
            </j-form-item>
          </div>
          <div class="row-item">
            <j-form-item label="审厂专家" prop="professor">
              <j-input v-model="form.professor" />
            </j-form-item>
          </div>
          <div class="row-item">
            <j-form-item label="审厂原因">
              <j-input v-model="form.reason" />
            </j-form-item>
          </div>
        </j-row>
      </j-form>
        
      <div v-show="$route.query.handle !== 'view'" class="left-top-btn">
        <j-button type="primary" @click="handleStandard">
          导入标准
        </j-button>
        <j-button type="danger" @click="handleDel">
          删除项目
        </j-button>
      </div>
        
      <j-table-with-page
        :columns="tableColumns"
        :data-source="form.srmFactoryCheckGradeDtoList"
        :options="tableOptions"
        :fetch="init"
        :pagination="tablePage"
        style="margin-bottom: 30px"
        @selection-change="selectTable"
      />

      <j-form
        ref="editForm2"
        :model="form"
        :rules="rules"
        :disabled="$route.query.handle === 'view'"
      >
        <j-form-item v-show="$route.query.handle === 'view'" label="评价总分">
          <j-input v-model="form.totalScore" disabled style="width: 100px" />
          <j-link
            v-check="'qualityVerify-exportGradeDetail'"
            style="margin-left:10px;"
            :disabled="false"
            @click="handleExport"
          >
            打分明细导出
          </j-link>
        </j-form-item>

        <j-row class="one-row">
          <j-col :span="24">
            <j-form-item label="点赞" prop="goodComment">
              <j-input v-model="form.goodComment" :rows="3" type="textarea" />
            </j-form-item>
          </j-col>
          <j-col :span="24">
            <j-form-item label="不足" prop="criticizeComment">
              <j-input v-model="form.criticizeComment" :rows="3" type="textarea" />
            </j-form-item>
          </j-col>
        </j-row>
      </j-form>
      
      <standard
        :type="$route.query.type"
        :visible="staVisible"
        @result="setStandard"
        @close="staVisible = false"
      />
      <score
        ref="scoreDialog"
        :visible="scoreVisible"
        :handle="$route.query.handle"
        @close="scoreVisible = false"
        @result="setScore"
      />
    </j-card>
  </div>
</template>
<script>
import * as verifyApi from '@/api/verify/typeVerify'
import {
  getPdtLineList,
  getBigCategoryList,
  getSmallTypeBatch
} from '@/api/supplier/pool'
import { getCodeList } from '@/views/common/dic'
import _ from 'lodash'
import Standard from './standard'
import Score from './score'

export default {
  components: { Standard, Score },
  data () {
    return {
      fullscreenLoading: false,
      urlDic: {
        0: '品质',
        1: '采购',
        2: '研发'
      },
      pathDic: {
        0: 'quality',
        1: 'purchase',
        2: 'develop'
      },
      form: {
        code: '',
        name: '',
        supplierName: '',
        destination: '',
        category: '',
        equipType: '',
        srmFactoryLineRelList: [],
        srmFactoryBigTypeRelList: [],
        srmFactorySmallTypeRelList: [],
        property: '',
        taskCode: '',
        professor: '',
        reason: '',
        totalScore: '',
        goodComment: '',
        criticizeComment: '',
        srmFactoryCheckGradeDtoList: []
      },
      rules: {
        name: [{ required: true, message: '请输入单据名称', trigger: 'blur' }],
        supplierName: [
          { required: true, message: '请选择供应商', trigger: 'blur' }
        ],
        destination: [
          { required: true, message: '请选择审厂目的', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请选择审厂类别', trigger: 'blur' }
        ],
        equipType: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        // srmFactoryLineRelList: [
        //   { required: true, message: '请选择产品线', trigger: 'blur' }
        // ],
        // srmFactoryBigTypeRelList: [
        //   { required: true, message: '请选择大类', trigger: 'blur' }
        // ],
        // srmFactorySmallTypeRelList: [
        //   { required: true, message: '请选择小类', trigger: 'blur' }
        // ],
        property: [{ required: true, message: '请选择属性', trigger: 'blur' }],
        // taskCode: [
        //   { required: true, message: '请输入审厂任务编码', trigger: 'blur' }
        // ],
        professor: [
          { required: true, message: '请输入审厂专家', trigger: 'blur' }
        ],
        goodComment: [
          { required: true, message: '请输入点赞', trigger: 'blur' }
        ],
        criticizeComment: [
          { required: true, message: '请输入不足', trigger: 'blur' }
        ]
      },
      lineList: [],
      bigTypeList: [],
      smallTypeList: [],
      aimList: [],
      categoryList: [],
      typeList: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'projectName',
          label: '项目名称'
        },
        {
          prop: 'projectScore',
          label: '标准分值'
        },
        {
          prop: 'realScore',
          label: '实际得分'
        },
        {
          prop: 'reachRate',
          label: '达成率',
          render: (h, row) => <span>{row.reachRate || 0}%</span>
        },
        {
          prop: 'advice',
          label: '评价意见'
        },
        {
          label: '操作',
          fixed: 'right',
          render: (h, row) => (
            <j-button
              type="text"
              size="mini"
              onClick={() => {
                this.handleScore(row)
              }}
            >
              {this.$route.query.handle === 'view' ? '详情' : '打分'}
            </j-button>
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
        toolbarBottom: false,
        mutiSelect: true,
        index: true,
        loading: false,
        initTable: false
      },
      attrDic: {
        0: {
          // 品质
          0: 'QSA',
          1: 'QPA'
        },
        1: {
          // 采购
          2: '采购'
        },
        2: {
          // 研发
          3: '研发'
        }
      },
      staVisible: false,
      tempDtoList: [],
      scoreVisible: false,
      curRow: {},
      validMsg: '',
      checkId: '',
      gradeId: ''
    }
  },
  created () {
    this.init()
    this.getSelectData()
  },
  methods: {
    getSelectData () {
      getPdtLineList().then((res) => {
        if (res && res.code === '0') {
          this.lineList = res.data.records.map((item) => ({
            lineCode: item.code,
            lineName: item.name
          }))
        }
      })
      getBigCategoryList().then((res) => {
        if (res && res.code === '0') {
          this.bigTypeList = res.data.map((item) => ({
            bigTypeCode: item.bigTypeCode,
            bigTypeName: item.bigTypeName
          }))
        }
      })
      getCodeList('code00022').then((list) => {
        this.aimList = list
      })
      getCodeList('code00023').then((list) => {
        this.categoryList = list
      })
      getCodeList('code00024').then((list) => {
        this.typeList = list
      })
    },
    getSmallType: _.debounce(function (val) {
      if (val.length) {
        getSmallTypeBatch(val.map((big) => big.bigTypeCode)).then((res) => {
          if (res.code === '0' && res.data) {
            this.smallTypeList = res.data.map((item) => ({
              smallTypeCode: item.smallTypeCode,
              smallTypeName: item.smallTypeName
            }))
          }
        })
      }
    }, 500),
    lineChange (lineData) {
      console.log(lineData)
    },
    smallChange (smallData) {
      console.log(smallData)
    },
    searchSupplier (queryString, cb) {
      verifyApi.getSupplierName({ name: queryString }).then((res) => {
        if (res.code === '0' && res.data) cb(res.data)
      })
    },
    setSupplier (item) {
      this.form.supplierId = item.id
      this.form.supplierName = item.name
    },
    // 初始查询
    init () {
      if (this.$route.query.id) {
        this.checkId = this.$route.query.id
        this.fullscreenLoading = true
        // 编辑情况是url有id, 新增时候没有id不需要获取数据
        verifyApi
          .getFactoryCheckAndDetails({ id: this.$route.query.id })
          .then((res) => {
            if (res && res.code === '0') {
              const lineData = res.data.srmFactoryLineRels.map((item) => ({
                lineCode: item.lineCode,
                lineName: item.lineName
              }))
              const bigData = res.data.srmFactoryBigTypeRels.map((item) => ({
                bigTypeCode: item.bigTypeCode,
                bigTypeName: item.bigTypeName
              }))
              const smallData = res.data.srmFactorySmallTypeRelList.map((item) => ({
                smallTypeCode: item.smallTypeCode,
                smallTypeName: item.smallTypeName
              }))
              // console.log(lineData)
              // console.log(bigData)
              // console.log(smallData)
              this.getSmallType(bigData) // 获取小类下拉框数据
              // 删除无用字段防止干扰
              delete res.data.srmFactoryLineRels
              delete res.data.srmFactoryBigTypeRels
              delete res.data.srmFactorySmallTypeRelList
              this.form = res.data
              this.gradeId = this.form.srmFactoryCheckGradeDtoList.map(item => item.id).join(',')
              // 直接赋值下拉框无法选择
              this.$set(this.form, 'srmFactoryLineRelList', lineData)
              this.$set(this.form, 'srmFactoryBigTypeRelList', bigData)
              this.$set(this.form, 'srmFactorySmallTypeRelList', smallData)
            }
          })
          .finally(() => {
            this.fullscreenLoading = false
          })
      }
    },
    handleStandard () {
      if (this.form.srmFactoryCheckGradeDtoList.length) {
        this.showConfirm('此操作将覆盖已有内容, 是否继续?')
          .then(() => {
            this.staVisible = true
          })
          .catch(() => {})
      } else {
        this.staVisible = true
      }
    },
    // 导入标准
    setStandard (id) {
      this.fullscreenLoading = true
      // 查询标准列表
      verifyApi.getProjectDetailByCode({ id }).then((standard) => {
        if (
          standard &&
          standard.code === '0' &&
          standard.data &&
          standard.data.length
        ) {
          this.tempDtoList = this.form.srmFactoryCheckGradeDtoList // 保存一下之前的标准列表，导入失败要恢复
          this.form.srmFactoryCheckGradeDtoList =
            this.form.srmFactoryCheckGradeDtoList.concat(standard.data)
          // 导入，相当于暂存
          verifyApi
            .insertOrUpdateFactoryCheck(
              Object.assign(
                { type: this.$route.query.type, checkStatus: 0 },
                this.form
              )
            )
            .then((insert) => {
              if (insert.code === '0' && insert.data) {
                // 导入成功更新标准列表和单据id
                verifyApi
                  .getFactoryCheckAndDetails({ id: insert.data })
                  .then((res) => {
                    if (res.code === '0' && res.data) {
                      this.form.id = insert.data
                      this.form.srmFactoryCheckGradeDtoList =
                        res.data.srmFactoryCheckGradeDtoList
                    }
                  })
                this.showMessage('导入成功!', 'success')
                this.staVisible = false
              } else {
                this.form.srmFactoryCheckGradeDtoList = this.tempDtoList // 导入失败要恢复保存的标准列表
                this.showMessage(insert.message)
              }
            })
            .finally(() => {
              this.fullscreenLoading = false
            })
        } else {
          this.showMessage('没有查询到该标准的数据，请重新导入！')
          this.fullscreenLoading = false
        }
      })
    },
    // 打分
    handleScore (row) {
      // 这里要判断一下走接口还是直接取
      this.curRow = row
      // 如果打过分直接显示数据
      if (row.isScore) {
        this.$refs.scoreDialog.initData(
          JSON.parse(JSON.stringify(row.srmFactoryCheckGradeDetailList)),
          row.advice
        )
        // this.$refs.scoreDialog.initData([{ picture: { photograph: [{ name: '第一个.jpg' }] } }], '')
        this.scoreVisible = true
      } else {
        // 如果没有打分，调用接口
        verifyApi.getGradeDetail({ id: row.id }).then((res) => {
          if (res.code === '0' && res.data) {
            this.$refs.scoreDialog.initData(res.data, row.advice)
            this.scoreVisible = true
          } else {
            this.showMessage(res.message)
          }
        })
      }
    },
    // 打完分返回
    setScore (tableData, realTotal, projectScore, advice) {
      this.curRow.isScore = true // 设置打分标识
      this.curRow.realScore = realTotal
      this.curRow.projectScore = projectScore
      this.curRow.reachRate = +(((this.curRow.realScore || 0) / this.curRow.projectScore) * 100).toFixed(2)
      this.curRow.advice = advice
      this.curRow.srmFactoryCheckGradeDetailList = tableData
      this.scoreVisible = false
    },
    validData () {
      this.validMsg = ''
      let msg = ''
      // 先校验是否全部打分
      const done = this.form.srmFactoryCheckGradeDtoList.every(
        (row) => row.realScore > 0 && row.realScore <= row.projectScore
      )
      if (done) {
      // 再校验打分明细
      // 只需找出第一个就提前结束，用for循环
        const list = this.form.srmFactoryCheckGradeDtoList
        for (let i = 0; i < list.length; i++) {
          if (list[i].srmFactoryCheckGradeDetailList) {
            for (let j = 0; j < list[i].srmFactoryCheckGradeDetailList.length; j++) {
              if (list[i].srmFactoryCheckGradeDetailList[j].acquireScore !== list[i].srmFactoryCheckGradeDetailList[j].score && !list[i].srmFactoryCheckGradeDetailList[j].record && list[i].srmFactoryCheckGradeDetailList[j].evaluateStatus !== 1) {
                msg = `【${list[i].projectName}】项目中【${list[i].srmFactoryCheckGradeDetailList[j].standard}】审核记录未填，请填写完审核记录再提交！`
                break
              }
            }
          }
        }
      } else {
        msg = '请先对所有标准进行打分！'
      }
      // console.log(msg)
      return msg
    },
    handleSubmit (status) {
      if (status === 1) {
        if (!this.form.supplierId) {
          this.showMessage('请选择系统内存在的供应商!')
          return
        }
        this.validMsg = this.validData()
        // console.log(this.validMsg)
        if (!this.validMsg) {
          // 提交
          this.$refs.editForm.validate((valid) => {
            if (valid) {
              this.$refs.editForm2.validate((valid2) => { // 嵌套的form也需要校验，否则点赞和不足不会提示
                if (valid2) {
                  this.updateApi(1)
                } else {
                  return false
                }
              })
            } else {
              return false
            }
          })
        } else {
          this.$message({
            showClose: true,
            duration: 0,
            message: this.validMsg,
            type: 'warning'
          })
        }
      } else {
        // 暂存，不需要任何校验
        this.updateApi(0)
      }
    },
    updateApi (status) {
      verifyApi
        .insertOrUpdateFactoryCheck(
          Object.assign({}, this.form, { type: this.$route.query.type, checkStatus: status })
        )
        .then((res) => {
          if (res.code === '0') {
            this.showMessage('操作成功!', 'success')
            // this.$router.push({
            //   path:'/verify/' + this.pathDic[this.$route.query.type] + '/index'
            // })
            // 关闭当前标签并跳转列表页
            this.$store.dispatch('tagsView/delView', this.$route).then(() => {
              this.$router.replace({
                path: '/verify/' + this.pathDic[this.$route.query.type] + '/index'
              }).then(() => {
                // 进入列表页并强制刷新
                this.$store.dispatch('tagsView/delCachedView', this.$route).then(() => {
                  const { fullPath } = this.$route
                  this.$nextTick(() => {
                    this.$router.replace({
                      path: '/redirect' + fullPath
                    })
                  })
                })
              })
            })
          } else {
            if (status) {
              this.$message({
                showClose: true,
                duration: 0,
                message: this.validMsg,
                type: 'warning'
              })
            } else {
              this.showMessage(res.message)
            }
          }
        })
    },
    handleDel () {
      if (this.form.totalScore !== undefined && this.form.totalScore !== null && this.form.totalScore !== '') {
        this.showMessage('已提交单据不允许删除!')
      } else {
        if (this.tableSelectList.length) {
          verifyApi
            .deleteFactoryCheckGrade({
              ids: this.tableSelectList.map((row) => row.id)
            })
            .then((res) => {
              if (res.code === '0') {
                this.showMessage('删除成功!', 'success')
                // 这里要手动更新一下标准列表，但不更新其他数据
                this.form.srmFactoryCheckGradeDtoList = _.differenceBy(this.form.srmFactoryCheckGradeDtoList, this.tableSelectList, 'id')
              } else {
                this.showMessage(res.message)
              }
            })
        } else {
          this.showMessage('请先选择要删除的数据!')
        }
      }
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    close () {
      this.$emit('close')
    },
    handleExport () {
      verifyApi.exportGradeDetail({
        checkId: this.checkId,
        gradeId: this.gradeId
      })
    }
  }
}
</script>
<style lang="less" scoped>
.three-row {
  ::v-deep .el-input__inner {
    width: 200px;
  }
}
.row-item {
  display: inline-block;
  margin-right: 20px;
}
.one-row {
  ::v-deep .el-input__inner,
  ::v-deep .el-textarea__inner {
    width: 610px;
  }
}
.left-top-btn {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}
</style>