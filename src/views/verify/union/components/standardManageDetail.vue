<template>
  <j-dialog
    title="详情"
    :visible.sync="detailVisible"
    :modal="false"
    :before-close="close"
    :fullscreen="true"
  >
    <j-form
      ref="detailForm"
      class="dialog-form"
      size="mini"
      :inline="true"
      label-position="left"
      label-width="95px"
      :model="detailForm"
      :rules="rules"
    >
      <!-- <j-form-item label="项目编码" prop="projectCode">
        <j-input v-model="detailForm.projectCode" disabled />
      </j-form-item>
      <j-form-item label="项目名称" prop="projectName">
        <j-input v-model="detailForm.projectName" disabled />
      </j-form-item>
      <j-form-item label="项目分值" prop="projectScore">
        <j-input v-model="detailForm.projectScore" disabled />
      </j-form-item> -->
      <!-- <j-form-item label="标准属性" prop="standardAttributes">
        <j-select v-model="detailForm.standardAttributes" disabled>
          <j-option label="QSA" :value="0" />
          <j-option label="QPA" :value="1" />
          <j-option label="采购" :value="2" />
          <j-option label="研发" :value="3" />
        </j-select>
      </j-form-item>
      <j-form-item label="项目名称" prop="projectName">
        <j-input v-model="detailForm.projectName" disabled />
      </j-form-item> -->
      <!-- <j-form-item label="备注" prop="remark">
        <j-input v-model="detailForm.remark" disabled />
      </j-form-item> -->
      <j-form-item class="btn-group" style="margin-bottom: 0">
        <j-button v-check="'standard-detail-insert'" @click="detailAdd">
          新增
        </j-button>
        <j-button v-check="'standard-detail-delete'" @click="detailDelete">
          删除
        </j-button>
      </j-form-item>
    </j-form>
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
      <j-table-column prop="projectCode" label="项目编码" />
      <j-table-column prop="projectName" label="项目名称" />
      <j-table-column prop="updUserName" label="更新人" />
      <j-table-column prop="updTime" label="更新时间" />
      <!-- <j-table-column fixed="right" label="操作" width="50">
        <template slot-scope="scope">
          <j-button type="text" @click="handleEdit(scope.row)">
            编辑
          </j-button>
        </template>
      </j-table-column> -->
    </j-table>

    <!-- 新增、编辑 -->
    <j-dialog
      :title="handleType"
      :visible.sync="detailEditVisible"
      :modal="false"
      :before-close="detailEditClose"
      width="400px"
    >
      <j-form
        ref="detailEditForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="detailEditForm"
        :rules="rules"
      >
        <j-form-item label="项目名称" prop="projectName">
          <!-- <j-input v-model="detailEditForm.projectName" /> -->
          <j-autocomplete
            v-model="detailEditForm.projectName"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchProject"
            :trigger-on-focus="true"
            placeholder="输入编号或名称搜索"
            @select="selectProject"
          >
            <template slot-scope="{ item }">
              <div class="projectName">
                {{ item.projectName }}
              </div>
              <span class="projectCode">{{ item.projectCode }}</span>
            </template>
          </j-autocomplete>
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="detailEditClose">取消</j-button>
        <j-button type="primary" @click="detailEditSave">保存</j-button>
      </span>
    </j-dialog>
  </j-dialog>
</template>

<script>
import { getStandardDetail, getStandardDetailAdd, getStandardDetailDelete } from '@/api/verify/unionVerify'
import { projectSearch } from '@/api/options'
import { returnIds } from '@/utils/index'

export default {
  props: {
    detailVisible: Boolean,
    detailForm: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    const fields = {
      code: '代码',
      codeName: '代码名称',
      status: '状态'
    }
    return {
      fields,
      loading: false,
      height: null,
      tableData: [],
      selectList: [],
      detailEditVisible: false,
      detailEditForm: {
        standardId: '',
        projectId: '',
        projectCode: '',
        projectName: ''
      },
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
        score: [
          { required: true, message: '请输入分值', trigger: 'change' }
        ],
        mandatory: [
          { required: true, message: '请选择强制项', trigger: 'change' }
        ],
        veto: [
          { required: true, message: '请选择否决项', trigger: 'change' }
        ]
      },
      projectList: []
    }
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    searchProject (keyWords, cb) {
      projectSearch({ keyWords })
        .then((res) => {
          if (res.code === '0') {
            this.projectList = res.data
          }
        })
        .finally(() => {
          cb(this.projectList)
        })
    },
    selectProject (item) {
      this.detailEditForm.projectId = item.id
      this.detailEditForm.projectCode = item.projectCode
      this.detailEditForm.projectName = item.projectName
    },
    detailAdd () {
      this.handleType = '新增'
      this.detailEditVisible = true
    },
    handleEdit (row) {
      this.detailEditForm = JSON.parse(JSON.stringify(row))
      this.detailEditVisible = true
      this.handleType = '编辑'
    },
    detailEditSave () {
      this.$refs.detailEditForm.validate((valid) => {
        if (valid) {
          if (this.handleType === '新增') {
            this.detailEditForm.standardId = this.codeId
            getStandardDetailAdd(this.detailEditForm).then((res) => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.detailEditClose()
                this.getDetailTable(this.codeId)
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } 
          // else {
          //   getStandardDetailAdd(this.detailEditForm).then((res) => {
          //     if (res.code === '0') {
          //       this.showMessage('修改成功！', 'success')
          //       this.detailEditClose()
          //       this.getDetailTable(this.codeId)
          //     } else {
          //       this.showMeswohaiyiaeisage(res.message, 'error')
          //     }
          //   })
          // }
        }
      })
    },
    detailEditClose () {
      this.detailEditVisible = false
      this.detailEditForm = {
        standardId: '',
        projectId: '',
        projectCode: '',
        projectName: ''
      }
    },
    detailDelete () {
      const ids = returnIds(this.selectList).join()
      getStandardDetailDelete({ ids: ids }).then((res) => {
        if (res.code === '0') {
          this.showMessage('删除成功！', 'success')
          this.getDetailTable(this.codeId)
        } else {
          this.showMessage(res.message, 'error')
        }
      })
    },
    getDetailTable (id) {
      this.codeId = id
      getStandardDetail({ id: id }).then((res) => {
        if (res.code === '0') {
          this.tableData = res.data
        }
      })
    },
    handleSelectionChange (val) {
      this.selectList = val
    },
    close () {
      this.$emit('detailClose')
    }
  }
}
</script>