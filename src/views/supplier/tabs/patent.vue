<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'patent_update'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'patent_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'patent_save'" type="primary" @click="handleSubmit">
        保存
      </j-button> -->
    </div>
    <j-table-with-page
      :columns="tableColumns"
      :data-source="tableData"
      :options="tableOptions"
      :fetch="initTable"
      :pagination="tablePage"
      :height="height"
      @selection-change="selectTable"
    />
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
        label-width="110px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="发明专利名称" prop="patentName">
          <j-input v-model="editForm.patentName" />
        </j-form-item>
        <j-form-item label="扫描文件" prop="picture">
          <img-upload ref="imgUpload" @getFiles="getFiles" />
          <pdf-upload ref="pdfUpload" @getFiles="getFiles" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="editSave">保存</j-button>
      </span>
    </j-dialog>
    <img-viewer ref="imgViewer" />
    <pdf-viewer ref="pdfViewer" />
  </div>
</template>
<script>
import * as poolApi from '@/api/supplier/pool'
const urlType = 'patent'

export default {
  data () {
    const checkFile = (rule, value, callback) => {
      if (this.editForm.picture.photograph.length || this.editForm.picture.file.length) {
        callback()
      } else {
        callback(new Error('请上传证件图片或PDF文档'))
      }
    }
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        patentName: '',
        picture: {
          photograph: [],
          file: [],
          video: []
        }
      },
      rules: {
        patentName: [
          { required: true, message: '请输入发明专利名称', trigger: 'blur' }
        ],
        picture: [
          { required: true, validator: checkFile, trigger: 'change' }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'patentName',
          label: '发明专利名称'
        },
        {
          label: '照片',
          // width: '200',
          render: (h, row) => (
            <div>
              {row.picture && row.picture.photograph
                ? row.picture.photograph.map((img) => (
                  <j-button
                    type="text"
                    onClick={() => {
                      this.showViewer(img.url)
                    }}
                  >
                    {img.name}
                  </j-button>
                ))
                : ''}
            </div>
          )
        },
        {
          label: '文件',
          // width: '200',
          render: (h, row) => (
            <div>
              {row.picture && row.picture.file
                ? row.picture.file.map((pdf) => (
                  <j-button
                    type="text"
                    onClick={() => {
                      this.showPdf(pdf.url)
                    }}
                  >
                    {pdf.name}
                  </j-button>
                ))
                : ''}
            </div>
          )
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        },
        {
          prop: 'code',
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vAuth={'patent_update'}
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
                编辑
              </j-button>
            </div>
          )
        }
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
      }
    }
  },
  created () {
    this.initTable()
  },
  mounted () {
    this.height = this.calHeight(150).toString()
  },
  methods: {
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
      this.$nextTick(() => {
        this.$refs.imgUpload.fileList = []
        this.$refs.pdfUpload.fileList = []
      })
    },
    handleEdit (row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.handleType = '编辑'
      this.editVisible = true
      this.$nextTick(() => {
        this.$refs.imgUpload.fileList = this.editForm.picture && this.editForm.picture.photograph ? this.editForm.picture.photograph : []
        this.$refs.pdfUpload.fileList = this.editForm.picture && this.editForm.picture.file ? this.editForm.picture.file : []
      })
    },
    getFiles (type, files) {
      if (type === 'img') {
        this.editForm.picture.photograph = files
      } else if (type === 'pdf') {
        this.editForm.picture.file = files
      }
      this.$refs.editForm.validateField('picture')
    },
    handleDel () {
      if (this.tableSelectList.length) {
        poolApi
          .deleteBatchSrmHandle({
            type: urlType,
            ids: this.tableSelectList.map((row) => row.id)
          })
          .then((res) => {
            if (res.code === '0') {
              this.showMessage('删除成功!', 'success')
              this.initTable()
            } else {
              this.showMessage(res.message)
            }
          })
      } else {
        this.showMessage('请先选择要删除的行!')
      }
    },
    showViewer (url) {
      this.$refs.imgViewer.show(url)
    },
    showPdf (url) {
      this.$refs.pdfViewer.show(url)
    },
    initTable () {
      poolApi
        .getSrmHandle({
          type: urlType,
          supplierId: this.$route.query.supplierId
        })
        .then((res) => {
          if (res.code === '0') {
            if (res.data) this.tableData = res.data
          }
        })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          poolApi
            .saveSrmHandle(
              Object.assign(
                { type: urlType, supplierId: this.$route.query.supplierId },
                this.editForm
              )
            )
            .then((res) => {
              if (res.code === '0') {
                this.editClose()
                this.showMessage('保存成功!', 'success')
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
    handleSubmit () {},
    editClose () {
      this.editVisible = false
      this.editForm = {
        patentName: '',
        picture: {
          photograph: [],
          file: [],
          video: []
        }
      }
    }
  }
}
</script>
<style scoped>
::v-deep .el-input--mini .el-input__inner {
  width: 100px;
}
</style>