<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'licence_save'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'licence_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'licence_save'" type="primary" @click="handleSubmit">
        保存
      </j-button> -->
    </div>
    <div class="tip-text">
      <div>请优先上传：ISO9001、IATF16949、CQC、CCC、ISO45001、14001、ROHS、QS等认证资质</div>
      <div>请优先上传：环评验收、消防验收、职业卫生验收、排污许可证、生产许可证、食品生产许可/流通许可证（食品相关供方）等合规资质</div>
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
        <j-form-item label="证件类型" prop="licenseType">
          <j-select v-model="editForm.licenseType" @change="typeChange">
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="证件名称" prop="licenseName">
          <!-- <j-input v-model="editForm.licenseName" /> -->
          <j-select
            v-model="editForm.licenseName"
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
        <j-form-item label="证书编号" prop="licenseCode">
          <j-input v-model="editForm.licenseCode" />
        </j-form-item>
        <j-form-item label="公司名" prop="supplierName">
          <j-input v-model="editForm.supplierName" />
        </j-form-item>
        <j-form-item label="公司地址" prop="licenseAddress">
          <j-input v-model="editForm.licenseAddress" />
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
        <j-form-item label="扫描文件" prop="picture">
          <img-upload ref="imgUpload" @getFiles="getFiles" />
          <pdf-upload ref="pdfUpload" @getFiles="getFiles" />
        </j-form-item>
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
import { getCodeList } from '@/views/common/dic'
const urlType = 'licence'

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
        licenseType: '',
        licenseName: '',
        licenseCode: '',
        supplierName: '',
        licenseAddress: '',
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
        licenseType: [
          { required: true, message: '请选择证件类型', trigger: 'blur' }
        ],
        licenseName: [
          { required: true, message: '请输入证件名称', trigger: 'blur' }
        ],
        licenseCode: [
          { required: true, message: '请输入证件名称', trigger: 'blur' }
        ],
        supplierName: [
          { required: true, message: '请输入公司名', trigger: 'blur' }
        ],
        licenseAddress: [
          { required: true, message: '请输入公司地址', trigger: 'blur' }
        ],
        effectiveDate: [
          { required: true, message: '请选择生效日期', trigger: 'blur' }
        ],
        expirationDate: [
          { required: true, message: '请选择失效日期', trigger: 'blur' }
        ],
        licenseAuthority: [
          { required: true, message: '请输入颁发机构', trigger: 'blur' }
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
          prop: 'licenseType',
          label: '证件类型',
          render: (h, row) => (
            // <span>{row.licenseType ? '认证合规类' : '认证资质类'}</span>
            <span>{row.licenseType !== null && row.licenseType !== undefined ? this.typeList[row.licenseType].label : ''}</span>
          )
        },
        {
          prop: 'licenseName',
          label: '证件名称'
        },
        {
          prop: 'licenseCode',
          label: '证书编号'
        },
        {
          prop: 'supplierName',
          label: '公司名',
          width: '200px'
        },
        {
          prop: 'licenseAddress',
          label: '公司地址',
          width: '300px'
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
          label: '备注',
          width: '300px'
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
                vAuth={'licence_update'}
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
      nameList: [],
      typeList: [
        { 
          id: 0,
          code: 'code00052',
          label: '体系类'
        },
        { 
          id: 1,
          code: 'code00053',
          label: '国内认证'
        },
        { 
          id: 2,
          code: 'code00054',
          label: '国际认证'
        },
        { 
          id: 3,
          code: 'code00055',
          label: '国内食品安全'
        },
        { 
          id: 4,
          code: 'code00056',
          label: '国内有害物质管控'
        },
        { 
          id: 5,
          code: 'code00057',
          label: '国际食品安全'
        },
        { 
          id: 6,
          code: 'code00058',
          label: '国际有害物质管控'
        }
      ]
    }
  },
  created () {
    this.initTable()
    this.getNameList()
  },
  mounted () {
    this.height = this.calHeight(150).toString()
  },
  methods: {
    getNameList (code) {
      getCodeList(code).then(list => {
        this.nameList = list
      })
    },
    typeChange (typeId) {
      if (this.typeList[typeId] && this.typeList[typeId].code) {
        this.getNameList(this.typeList[typeId].code)
      }
    },
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
        licenseType: '',
        licenseName: '',
        licenseCode: '',
        supplierName: '',
        licenseAddress: '',
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