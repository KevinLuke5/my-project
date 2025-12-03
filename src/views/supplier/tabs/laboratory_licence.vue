<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'laboratory_licence_update'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'laboratory_licence_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'laboratory_licence_save'" type="primary" @click="handleSubmit">
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
        label-width="95px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="证件名称" prop="licenseName">
          <j-input v-model="editForm.licenseName" />
        </j-form-item>
        <j-form-item label="证书编号" prop="licenseCode">
          <j-input v-model="editForm.licenseCode" />
        </j-form-item>
        <j-form-item label="实验室名称" prop="laboratoryName">
          <j-select v-model="editForm.laboratoryName" value-key="id" @change="setLab">
            <j-option
              v-for="item in labList"
              :key="item.id"
              :label="item.laboratoryName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="地址" prop="laboratoryAddress">
          <j-input v-model="editForm.laboratoryAddress" />
        </j-form-item>
        <j-form-item label="生效日期" prop="effectiveDate">
          <j-date-picker
            v-model="editForm.effectiveDate"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
          />
        </j-form-item>
        <j-form-item label="失效日期" prop="expirationDate">
          <j-date-picker
            v-model="editForm.expirationDate"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
          />
        </j-form-item>
        <j-form-item label="颁发机构" prop="licenseAuthority">
          <j-input v-model="editForm.licenseAuthority" />
        </j-form-item>
        <!-- <j-form-item label="扫描文件" prop="picture">
          <img-upload ref="imgUpload" @getFiles="getFiles" />
          <pdf-upload ref="pdfUpload" @getFiles="getFiles" />
        </j-form-item> -->
        <j-form-item label="备注">
          <j-input v-model="editForm.licenseRemark" :rows="3" type="textarea" />
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
const urlType = 'laboratory_licence'

export default {
  data () {
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        laboratoryId: '',
        laboratoryName: '',
        laboratoryAddress: '',
        licenseName: '',
        licenseCode: '',
        licenseAuthority: '',
        licenseRemark: '',
        effectiveDate: '',
        expirationDate: '',
        picture: {
          photograph: [],
          file: [],
          video: []
        }
      },
      rules: {
        licenseName: [{ required: true, message: '请输入证件名称', trigger: 'blur' }],
        licenseCode: [{ required: true, message: '请输入证件名称', trigger: 'blur' }],
        laboratoryName: [{ required: true, message: '请选择实验室', trigger: 'blur' }],
        laboratoryAddress: [{ required: true, message: '请输入实验室地址', trigger: 'blur' }],
        effectiveDate: [
          {
            required: true,
            message: '请选择生效日期',
            trigger: 'blur'
          }
        ],
        expirationDate: [
          {
            required: true,
            message: '请选择失效日期',
            trigger: 'blur'
          }
        ],
        licenseAuthority: [{ required: true, message: '请输入颁发机构', trigger: 'blur' }],
        picture: [{ required: true, message: '请上传证件文件', trigger: 'change' }]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'licenseName',
          label: '证件名称'
        },
        {
          prop: 'licenseCode',
          label: '证书编号'
        },
        {
          prop: 'laboratoryName',
          label: '实验室名称'
        },
        {
          prop: 'laboratoryAddress',
          label: '地址'
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
          prop: 'licenseAuthority',
          label: '颁发机构'
        },
        {
          prop: 'licenseRemark',
          label: '备注'
        },
        // {
        //   label: '照片',
        //   // width: '200',
        //   render: (h, row) => (
        //     <div>
        //       {row.picture && row.picture.photograph
        //         ? row.picture.photograph.map((img) => (
        //           <j-button
        //             type="text"
        //             onClick={() => {
        //               this.showViewer(img.url)
        //             }}
        //           >
        //             {img.name}
        //           </j-button>
        //         ))
        //         : ''}
        //     </div>
        //   )
        // },
        // {
        //   label: '文件',
        //   // width: '200',
        //   render: (h, row) => (
        //     <div>
        //       {row.picture && row.picture.file
        //         ? row.picture.file.map((pdf) => (
        //           <j-button
        //             type="text"
        //             onClick={() => {
        //               this.showPdf(pdf.url)
        //             }}
        //           >
        //             {pdf.name}
        //           </j-button>
        //         ))
        //         : ''}
        //     </div>
        //   )
        // },
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
                vAuth={'laboratory_licence_update'}
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
      },
      labList: []
    }
  },
  created () {
    this.initTable()
    this.getSelectData()
  },
  mounted () {
    this.height = this.calHeight(150).toString()
  },
  methods: {
    getSelectData () {
      poolApi.getLaboratoryNameList({ id: this.$route.query.supplierId }).then((res) => {
        if (res.code === '0' && res.data) this.labList = res.data
      })
    },
    setLab (item) {
      this.editForm.laboratoryId = item.id
      this.editForm.laboratoryName = item.laboratoryName
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.handleType = '编辑'
      this.editVisible = true
      // this.$nextTick(() => {
      //   this.$refs.imgUpload.fileList = this.editForm.picture && this.editForm.picture.photograph ? this.editForm.picture.photograph : []
      //   this.$refs.pdfUpload.fileList = this.editForm.picture && this.editForm.picture.file ? this.editForm.picture.file : []
      // })
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
    showViewer (url) {
      this.$refs.imgViewer.show(url)
    },
    showPdf (url) {
      this.$refs.pdfViewer.show(url)
    },
    handleSubmit () {},
    editClose () {
      this.editVisible = false
      this.editForm = {
        laboratoryId: '',
        laboratoryName: '',
        laboratoryAddress: '',
        licenseName: '',
        licenseCode: '',
        licenseAuthority: '',
        licenseRemark: '',
        effectiveDate: '',
        expirationDate: '',
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