<template>
  <j-dialog
    width="400px"
    :title="handleType"
    :visible.sync="editVisible"
    :modal="false"
    :before-close="close"
  >
    <j-form
      ref="editForm"
      class="dialog-form"
      size="mini"
      label-position="left"
      label-width="95px"
      :model="editForm"
      :rules="rules"
    >
      <j-form-item label="模板名称" prop="name">
        <j-input v-model="editForm.name" />
      </j-form-item>
      <j-form-item label="状态" prop="status">
        <j-select v-model="editForm.status" clearable>
          <j-option label="有效" :value="0" />
          <j-option label="失效" :value="1" />
          <j-option label="草稿" :value="2" />
        </j-select>
      </j-form-item>
      <j-form-item label="类型" prop="type">
        <!-- <j-input v-model="editForm.type" /> -->
        <j-select v-model="editForm.type" clearable>
          <j-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.lineNumber"
          />
        </j-select>
      </j-form-item>
      <j-form-item label="时间维度" prop="timeDimension">
        <!-- <j-input v-model="editForm.timeDimension" /> -->
        <j-select v-model="editForm.timeDimension" clearable>
          <j-option
            v-for="item in timeDimensionList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </j-select>
      </j-form-item>
    </j-form>
    <span slot="footer">
      <j-button @click="close">取消</j-button>
      <j-button type="primary" @click="editSave">保存</j-button>
    </span>
  </j-dialog>
</template>

<script>
import * as inspectionTemApi from '@/api/kpi/procure'
import { projectSearch } from '@/api/options'
import { returnIds } from '@/utils/index'
import { timeDimensionList, getCodeList } from '@/views/common/dic'

export default {
  props: {
    editVisible: Boolean,
    editForm: {
      type: Object,
      default () {
        return {}
      }
    },
    handleType: {
      type: String,
      default: function () {
        return '新增'
      }
    }
  },
  data () {
    return {
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
      rules: {
        name: [
          { required: true, message: '请输入模版名称', trigger: 'change' }
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' }
        ],
        timeDimension: [
          { required: true, message: '请选择时间维度', trigger: 'change' }
        ]
      },
      projectList: [],
      timeDimensionList: [],
      typeList: []
    }
  },
  created () {
    this.timeDimensionList = timeDimensionList
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    getEverything () {
      
    },
    getSelectData () {
      getCodeList('code00040').then((list) => {
        this.typeList = list
      })
    },
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
      this.detailEditForm.projectCode = item.projectCode
      this.detailEditForm.projectName = item.projectName
    },
    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.handleType === '新增') {
            this.detailEditForm.projectId = this.codeId
            this.detailEditForm.standardId = this.codeId
            inspectionTemApi.addInspectionTem(this.editForm).then((res) => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.close()
                // this.getDetailTable(this.codeId)
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } 
          else {
            inspectionTemApi.insertInspectionTem(this.editForm).then((res) => {
              if (res.code === '0') {
                this.showMessage('修改成功！', 'success')
                this.close()
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
        standardId: '',
        projectId: '',
        projectCode: '',
        projectName: ''
      }
    },
    getDetailTable (id) {
      this.codeId = id
      inspectionTemApi.getInspectionTemDetail({ id: id }).then((res) => {
        if (res.code === '0') {
          this.tableData = res.data
        }
      })
    },
    handleSelectionChange (val) {
      this.selectList = val
    },
    close () {
      this.$emit('editClose')
    }
  }
}
</script>