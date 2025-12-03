<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'account_save'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'account_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'account_save'" type="primary" @click="handleSubmit">
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
        label-width="120px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="国家/地区" prop="country">
          <j-select v-model="editForm.country">
            <j-option label="中国" value="中国" />
          </j-select>
        </j-form-item>
        <j-form-item label="省" prop="province">
          <j-select v-model="editForm.province" @change="initCity('clear')">
            <j-option
              v-for="item in provinceList"
              :key="item.adcode"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="市" prop="city">
          <j-select v-model="editForm.city">
            <j-option
              v-for="item in cityList"
              :key="item.adcode"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>  
        <j-form-item label="开户名称" prop="accountName">
          <j-input v-model="editForm.accountName" />
        </j-form-item>
        <j-form-item label="开户行全称" prop="bankName">
          <j-input v-model="editForm.bankName" />
        </j-form-item>
        <j-form-item label="银行账号" prop="bankAccount">
          <j-input v-model="editForm.bankAccount" />
        </j-form-item>
        <j-form-item label="IBAN账号">
          <j-input v-model="editForm.ibanAccount" />
        </j-form-item>
        <j-form-item label="开户许可证扫描件" prop="picture">
          <img-upload ref="imgUpload" @getFiles="getFiles" />
          <pdf-upload ref="pdfUpload" @getFiles="getFiles" />
        </j-form-item>
        <j-form-item label="备注">
          <j-input v-model="editForm.remark" :rows="3" type="textarea" />
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
import { getRegion } from '@/api/region/region'
import onUrl from '../../../assets/images/viewon.png'
import offUrl from '../../../assets/images/viewoff.png'
const urlType = 'account'

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
        country: '',
        province: '',
        city: '',
        accountName: '',
        bankName: '',
        bankAccount: '',
        ibanAccount: '',
        remark: '',
        picture: {
          photograph: [],
          file: [],
          video: []
        }
      },
      rules: {
        country: [{ required: true, message: '请选择国家', trigger: 'change' }],
        province: [{ required: true, message: '请选择省', trigger: 'change' }],
        city: [{ required: true, message: '请选择市', trigger: 'change' }],
        accountName: [
          { required: true, message: '请输入开户名称', trigger: 'blur' }
        ],
        bankName: [
          { required: true, message: '请输入开户行全称', trigger: 'blur' }
        ],
        bankAccount: [
          { required: true, message: '请输入银行账号', trigger: 'blur' }
        ],
        picture: [
          { required: true, validator: checkFile, trigger: 'change' }
        ]
      },
      provinceList: [],
      cityList: [],
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'country',
          label: '银行国家'
        },
        {
          prop: 'province',
          label: '银行省份'
        },
        {
          prop: 'city',
          label: '银行城市'
        },
        {
          prop: 'accountName',
          label: '开户名称'
        },
        {
          prop: 'bankName',
          label: '开户行全称'
        },
        {
          prop: 'bankAccount',
          label: '银行账号',
          render: (h, row) => (
            <div style="display:flex;">
              <span style="margin-right:5px;">{row.bankAccount}</span>
              <span vCheck={'getSupplierAccount'}>
                {row.bankAccount ? (
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
          prop: 'ibanAccount',
          label: 'IBAN账号'
        },
        {
          label: '图片',
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
              {row.picture.file
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
          prop: 'remark',
          label: '备注'
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
                vAuth={'account_update'}
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
    this.initProvince()
  },
  mounted () {
    this.height = this.calHeight(150).toString()
  },
  methods: {
    initProvince () {
      getRegion().then((res) => {
        if (res.code === '0') {
          this.provinceList = res.data.content[0].districts
        }
      })
    },
    initCity (clear) {
      if (clear) { // 重新选省份清空城市
        this.editForm.city = ''
      }
      if (this.editForm.province) {
        getRegion({ keywords: this.editForm.province }).then((res) => {
          if (res && res.code === '0') {
            this.cityList = res.data.content.filter(dis => dis.level === 'province')[0].districts
          }
        })
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
      this.initCity()
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
            if (res.data) this.tableData = res.data.map((row) => {
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
        poolApi.getSupplierAccount({ id: row.id })
          .then((res) => {
            if (res.code === '0') {
              const real = res.data
              row.fake = row.bankAccount
              row.bankAccount = real
              row.visible = false
            } else {
              this.showMessage(res.message)
            }
          })
      } else {
        row.bankAccount = row.fake
        row.visible = true
      }
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        country: '',
        province: '',
        city: '',
        accountName: '',
        bankName: '',
        bankAccount: '',
        ibanAccount: '',
        remark: '',
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