<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <div class="right-top-btn">
        <j-form size="mini">
          <!-- <j-button> 下载模板 </j-button>
          <j-button> 导入指标 </j-button> -->
          <j-button v-show="$route.query.handle === 'change'" v-check="'change'" @click="sendOa">
            保存变更并发起变更公文
          </j-button>
        </j-form>
      </div>
      <j-table :data="tableData" style="width: 100%">
        <j-table-column prop="indexName" label="指标" width="200" />
        <j-table-column prop="accessDimensionName" label="考核维度" />
        <!-- <j-table-column prop="checkDimension" label="审核维度" /> -->
        <j-table-column label="审核维度">
          <template slot-scope="scope">
            <span>{{
              dimensionList.length ?
                (
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
        <j-table-column label="二级权重">
          <template slot-scope="scope">
            <span>{{ parseFloat(scope.row.secondaryRatio*100).toFixed(2) + '%' }}</span>
            <!-- <span>{{ (scope.row.secondaryRatio*100) + '%' }}</span> -->
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
        <j-table-column label="操作" width="150" fixed="right">
          <template slot-scope="scope">
            <j-button type="text" @click="showLogic(scope.row)">
              查看考核逻辑
            </j-button>
            <j-button
              v-show="$route.query.handle === 'score'"
              v-check="'updateSrmAccessBillDetail'"
              type="text"
              @click="handleEdit(scope.row)"
            >
              打分
            </j-button>
            <j-button
              v-show="$route.query.handle === 'change'"
              v-check="'updateSrmAccessBillDetail'"
              type="text"
              @click="handleEdit(scope.row)"
            >
              变更
            </j-button>
          </template>
        </j-table-column>
      </j-table>
    </j-card>
    <!-- 编辑 -->
    <j-dialog
      title="编辑"
      :visible.sync="editVisible"
      :modal="false"
      :close-on-click-modal="false"
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
        <j-form-item label="得分" prop="score">
          <j-input-number
            v-model="editForm.score"
            :min="0"
            :max="editForm.indexType === 0 ? 100: editForm.extremeValue"
          />
          <span>{{ '（' + (editForm.indexType === 0 ? 100: editForm.extremeValue) + '分制）' }}</span>
        </j-form-item>
        <j-form-item label="指标分母">
          <j-input-number v-model="editForm.denominator" :min="0" />
        </j-form-item>
        <j-form-item label="指标分子">
          <j-input-number v-model="editForm.molecule" :min="0" />
        </j-form-item>
        <j-form-item label="指标值">
          <j-input-number v-model="editForm.indexValue" :min="0" />
        </j-form-item>
        <j-form-item label="备注">
          <j-input v-model="editForm.remark" :rows="3" type="textarea" />
        </j-form-item>
        <j-form-item label="附件" prop="accessory">
          <file-upload ref="fileUpload" type="excel" @getFiles="getFiles" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="handleSave">{{
          $route.query.handle === 'score' ? '保存' : '暂存'
        }}</j-button>
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
    <file-viewer ref="fileViewer" />
  </div>
</template>

<script>
import * as assessApi from '@/api/kpi/assess'
import { getPartObj, clearNullProperty } from '@/utils/index'
import { getCodeList } from '@/views/common/dic'

export default {
  data () {
    return {
      editVisible: false,
      editForm: {
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
      curRow: {},
      height: null,
      tableData: [{ name: 1 }],
      tableSelectList: [],
      logicVisible: false,
      logicForm: {},
      dimensionList: [],
      indexTypeList: [],
      indexAttrList: [],
      buList: []
    }
  },
  created () {
    this.getSelectData()
    this.initTable()
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
    handleEdit (row) {
      this.curRow = row
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editVisible = true
      this.$nextTick(() => {
        this.$refs.fileUpload.fileList =
          row.accessory && row.accessory.length ? row.accessory : []
      })
    },
    showLogic (row) {
      this.logicVisible = true
      this.logicForm = row
    },
    initTable () {
      assessApi
        .getBillDetail({ billId: this.$route.query.id, flag: this.$route.query.flag || 1 })
        .then((res) => {
          if (res && res.code === '0') {
            this.tableData = res.data
          }
        })
        .finally(() => {
          this.loading = false
        })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    handleSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.$route.query.handle === 'score') {
            // 打分
            assessApi
              .updateSrmAccessBillDetail(
                getPartObj(this.editForm, [
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
                ])
              )
              .then((res) => {
                if (res.code === '0') {
                  this.editClose()
                  this.initTable()
                  this.showMessage('保存成功!', 'success')
                } else {
                  this.showMessage(res.message)
                }
              })
          } else if (this.$route.query.handle === 'change') {
            // 变更
            this.curRow = Object.assign(
              this.curRow,
              clearNullProperty(this.editForm),
              { isChange: 1 }
            )
            this.showMessage('该条已暂存!', 'success')
            this.editVisible = false
          }
        } else {
          return false
        }
      })
    },
    sendOa () {
      // 处理数据
      const changeList = this.tableData.filter((item) => item.isChange)
      const resList = changeList.map((item) => ({
        id: item.id,
        billId: this.$route.query.id,
        checkDimension: item.checkDimension,
        score: item.score,
        denominator: item.denominator,
        molecule: item.molecule,
        indexValue: item.indexValue,
        remark: item.remark,
        accessory: item.accessory
      }))
      if (resList && resList.length) {
        assessApi
          .changeSrmAccessBillDetail(resList)
          .then((res) => {
            if (res && res.code === '0') {
              this.initTable()
              this.showMessage('变更成功!', 'success')
            } else {
              this.showMessage(res.message)
            }
          })
      } else {
        this.showMessage('请先变更表内数据！')
      }
    },
    getFiles (type, fileList, file, handle) {
      if (type === 'file') {
        this.editForm.accessory = fileList
      }
    },
    downExcel (file) {
      this.$refs.fileViewer.show(file)
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        id: '',
        score: '',
        denominator: '',
        molecule: '',
        indexValue: '',
        remark: '',
        accessory: {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
.right-top-btn {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 30px;
}
</style>
