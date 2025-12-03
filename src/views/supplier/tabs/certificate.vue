<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'certificate_save'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'certificate_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'certificate_save'" type="primary" @click="handleSubmit">
        保存
      </j-button> -->
    </div>
    <div class="tip-text">
      <div>
        请上传：营业执照、开户许可证、法人身份证、红色三章（同一纸上
        加盖公章、财务专用章、法人章）
      </div>
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
        label-width="95px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="证件名称" prop="certificateName">
          <!-- <j-input v-model="editForm.certificateName" /> -->
          <j-select
            v-model="editForm.certificateName"
            filterable
            allow-create
            default-first-option
          >
            <j-option
              v-for="item in nameList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item
          v-show="editForm.certificateName.indexOf('红色三章') === -1"
          label="证件编号"
          prop="certificateCode"
        >
          <j-input v-model="editForm.certificateCode" />
        </j-form-item>
        <j-form-item
          v-show="editForm.certificateName.indexOf('红色三章') === -1"
          label="生效日期"
          prop="effectiveDate"
        >
          <j-date-picker
            v-model="editForm.effectiveDate"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
          />
        </j-form-item>
        <j-form-item
          v-show="editForm.certificateName.indexOf('红色三章') === -1"
          label="失效日期"
          prop="expirationDate"
        >
          <j-date-picker
            v-model="editForm.expirationDate"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
          />
        </j-form-item>
        <j-form-item label="扫描文件" prop="picture">
          <img-upload ref="imgUpload" @getFiles="getFiles" />
          <pdf-upload ref="pdfUpload" @getFiles="getFiles" />
        </j-form-item>
        <j-form-item label="备注">
          <j-input v-model="editForm.certificateRemark" :rows="3" type="textarea" />
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
import { getCodeList } from '@/views/common/dic'
import onUrl from '../../../assets/images/viewon.png'
import offUrl from '../../../assets/images/viewoff.png'
const urlType = 'certificate'

export default {
  data () {
    const checkFile = (rule, value, callback) => {
      if (
        this.editForm.picture.photograph.length ||
        this.editForm.picture.file.length
      ) {
        callback()
      } else {
        callback(new Error('请上传证件图片或PDF文档'))
      }
    }
    const checkCode = (rule, value, callback) => {
      if (this.editForm.certificateName.indexOf('红色三章') === -1) {
        if (value) {
          callback()
        } else {
          callback(new Error('请输入证件编号'))
        }
      } else {
        callback()
      }
    }
    const checkSDate = (rule, value, callback) => {
      if (this.editForm.certificateName.indexOf('红色三章') === -1) {
        if (value) {
          callback()
        } else {
          callback(new Error('请选择生效日期'))
        }
      } else {
        callback()
      }
    }
    const checkEDate = (rule, value, callback) => {
      if (this.editForm.certificateName.indexOf('红色三章') === -1) {
        if (value) {
          callback()
        } else {
          callback(new Error('请选择失效日期'))
        }
      } else {
        callback()
      }
    }
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        certificateName: '',
        certificateCode: '',
        effectiveDate: '',
        expirationDate: '',
        certificateRemark: '',
        picture: {
          photograph: [],
          file: [],
          video: []
        }
      },
      rules: {
        certificateName: [
          { required: true, message: '请输入证件名称', trigger: 'blur' }
        ],
        certificateCode: [
          {
            required: true,
            validator: checkCode,
            message: '请输入证件编号',
            trigger: 'blur'
          }
        ],
        effectiveDate: [
          {
            required: true,
            validator: checkSDate,
            message: '请选择生效日期',
            trigger: 'blur'
          }
        ],
        expirationDate: [
          {
            required: true,
            validator: checkEDate,
            message: '请选择失效日期',
            trigger: 'blur'
          }
        ],
        picture: [{ required: true, validator: checkFile, trigger: 'change' }]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'certificateName',
          label: '证件名称'
        },
        {
          prop: 'certificateCode',
          label: '证件编号',
          render: (h, row) => (
            <div style="display:flex;">
              <span style="margin-right:5px;">{row.certificateCode}</span>
              <span vCheck={'getSupplierAccount'}>
                {row.certificateCode ? (
                  row.visible ? (
                    <img
                      src={onUrl}
                      width="22px"
                      onClick={() => {
                        this.switchReal(row, true)
                      }}
                    />
                  ) : (
                    <img
                      src={offUrl}
                      width="22px"
                      onClick={() => {
                        this.switchReal(row, false)
                      }}
                    />
                  )
                ) : (
                  ''
                )}
              </span>
            </div>
          )
        },
        {
          prop: 'effectiveDate',
          label: '生效日期'
        },
        {
          prop: 'expirationDate',
          label: '失效日期'
        },
        {
          prop: 'certificateRemark',
          label: '备注'
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
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                onClick={() => {
                  this.handleEdit(row)
                }}
                vAuth={'certificate_update'}
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
      },
      nameList: []
    }
  },
  created () {
    this.initTable()
    getCodeList('code00008').then((list) => {
      this.nameList = list
    })
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
        this.$refs.imgUpload.fileList =
          this.editForm.picture && this.editForm.picture.photograph
            ? this.editForm.picture.photograph
            : []
        this.$refs.pdfUpload.fileList =
          this.editForm.picture && this.editForm.picture.file
            ? this.editForm.picture.file
            : []
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
            if (res.data)
              this.tableData = res.data.map((row) => {
                row.visible = true
                return row
              })
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
    switchReal (row, isreal) {
      if (isreal) {
        poolApi.getSupplierCertificate({ id: row.id })
          .then((res) => {
            if (res.code === '0') {
              const real = res.data
              row.fake = row.certificateCode
              row.certificateCode = real
              row.visible = false
            } else {
              this.showMessage(res.message)
            }
          })
      } else {
        row.certificateCode = row.fake
        row.visible = true
      }
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        certificateName: '',
        certificateCode: '',
        effectiveDate: '',
        expirationDate: '',
        certificateRemark: '',
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