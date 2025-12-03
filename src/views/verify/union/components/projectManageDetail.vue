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
      <j-form-item label="项目编码" prop="projectCode">
        <j-input v-model="detailForm.projectCode" disabled />
      </j-form-item>
      <j-form-item label="项目名称" prop="projectName">
        <j-input v-model="detailForm.projectName" disabled />
      </j-form-item>
      <j-form-item label="项目分值" prop="projectScore">
        <j-input v-model="detailForm.projectScore" disabled />
      </j-form-item>
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
      <j-form-item label="备注" prop="remark">
        <j-input v-model="detailForm.remark" disabled />
      </j-form-item>
      <j-form-item class="btn-group" style="margin-bottom: 0">
        <j-button v-check="'project-detail-insert'" @click="detailAdd">
          新增
        </j-button>
        <j-button v-check="'project-detail-delete'" @click="detailDelete">
          删除
        </j-button>
        <j-button v-check="'modelDownloadProjectDeta'" @click="importTemplate">
          下载模板
        </j-button>
        <j-button v-check="'uploadProjectDetailExcel'" @click="handleImport">
          导入模板
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
      <!-- <j-table-column prop="lineNumber" label="项目" /> -->
      <j-table-column prop="child" label="子项" />
      <!-- <j-table-column prop="attributesOne" label="属性" /> -->
      <j-table-column prop="mandatory" label="强制项">
        <template slot-scope="scope">
          {{ scope.row.mandatory === 'N' ? '否' : '是' }}
        </template>
      </j-table-column>
      <j-table-column prop="veto" label="否决项">
        <template slot-scope="scope">
          {{ scope.row.veto === 'N' ? '否' : '是' }}
        </template>
      </j-table-column>
      <j-table-column prop="standard" label="标准" width="280" />
      <j-table-column prop="scoreStandard" label="评分标准" width="280" />
      <j-table-column prop="score" label="分值" />
      <j-table-column prop="updUserName" label="更新人" />
      <j-table-column prop="updTime" label="更新时间" />
      <j-table-column fixed="right" label="操作" width="50">
        <template slot-scope="scope">
          <j-button v-check="'project-detail-insert'" type="text" @click="handleEdit(scope.row)">
            编辑
          </j-button>
        </template>
      </j-table-column>
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
        <j-form-item label="子项" prop="child">
          <j-input v-model="detailEditForm.child" />
        </j-form-item>
        <j-form-item label="标准" prop="standard">
          <j-input v-model="detailEditForm.standard" />
        </j-form-item>
        <j-form-item label="评分标准" prop="scoreStandard">
          <j-input v-model="detailEditForm.scoreStandard" />
        </j-form-item>
        <j-form-item label="分值" prop="score">
          <j-input v-model="detailEditForm.score" />
        </j-form-item>
        <j-form-item label="强制项" prop="mandatory">
          <j-select v-model="detailEditForm.mandatory" clearable>
            <j-option label="否" value="N" />
            <j-option label="是" value="Y" />
          </j-select>
        </j-form-item>
        <j-form-item label="否决项" prop="veto">
          <j-select v-model="detailEditForm.veto" clearable>
            <j-option label="否" value="N" />
            <j-option label="是" value="Y" />
          </j-select>
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="detailEditClose">取消</j-button>
        <j-button type="primary" @click="detailEditSave">保存</j-button>
      </span>
    </j-dialog>

    <!-- 导入 -->
    <j-dialog
      title="导入"
      :visible.sync="uploadVisible"
      width="400px"
      :modal-append-to-body="false"
    >
      <j-upload
        ref="upload"
        :limit="10"
        :accept="'.xls, .xlsx'"
        :show-file-list="true"
        :auto-upload="false"
        :action="uploadUrl"
        :data="{id: detailForm.id}"
        :on-exceed="exceedWarn"
        :on-success="uploadSuccess"
      >
        <j-button slot="trigger" size="mini" type="info">
          选取文件
        </j-button>
        <j-button
          style="margin-left: 10px"
          size="mini"
          type="primary"
          @click="submitUpload"
        >
          提交
        </j-button>
        <div slot="tip" class="j-upload__tip">
          只能上传Excel文件
        </div>
      </j-upload>
    </j-dialog>
  </j-dialog>
</template>

<script>
import { getDetail, getDetailEdit, getDetailDelete, importTem, importUrl } from '@/api/verify/unionVerify'
import { returnIds } from '@/utils/index'
import { getToken } from '@/utils/auth'

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
        id: '',
        projectId: '',
        child: '',
        standard: '',
        scoreStandard: '',
        score: '',
        mandatory: '',
        veto: ''
      },
      codeId: '',
      handleType: '新增',
      rules: {
        child: [
          { required: true, message: '请输入子项', trigger: 'change' }
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
      uploadVisible: false,
      uploadUrl: importUrl
    }
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    importTemplate () {
      importTem()
    },
    handleImport () {
      this.uploadVisible = true
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
            delete this.detailEditForm.id
            this.detailEditForm.projectId = this.codeId
            getDetailEdit(this.detailEditForm).then((res) => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.detailEditClose()
                this.getDetailTable(this.codeId)
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            getDetailEdit(this.detailEditForm).then((res) => {
              if (res.code === '0') {
                this.showMessage('修改成功！', 'success')
                this.detailEditClose()
                this.getDetailTable(this.codeId)
              } else {
                this.showMeswohaiyiaeisage(res.message, 'error')
              }
            })
          }
        }
      })
    },
    detailEditClose () {
      this.detailEditVisible = false
      this.detailEditForm = {
        id: '',
        projectId: '',
        child: '',
        standard: '',
        scoreStandard: '',
        score: '',
        mandatory: '',
        veto: ''
      }
    },
    detailDelete () {
      const ids = returnIds(this.selectList).join()
      getDetailDelete({ ids: ids }).then((res) => {
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
      getDetail({ id: id }).then((res) => {
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
    },
    submitUpload () {
      this.$refs.upload.headers['Authorization'] = getToken()
      this.$refs.upload.submit()
    },
    uploadSuccess (res) {
      const id = this.detailForm.id
      if (res.code === '0') {
        this.$message({
          message: '导入成功',
          type: 'success'
        })
        this.getDetailTable(id)
        this.$refs.upload.clearFiles()
        this.uploadVisible = false
      } else {
        this.$refs.upload.clearFiles()
        this.$message({
          message: res.message,
          type: 'warning'
        })
      }
    },
    exceedWarn () {
      this.$message({
        message: '只能选择一个文件上传',
        type: 'warning'
      })
    }
  }
}
</script>