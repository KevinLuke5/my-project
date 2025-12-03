<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'equipment_update'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'equipment_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- 导入功能权限用v-check和Tab页的按钮权限不同 -->
      <j-button v-check="'modelDownloadEquipment'" @click="downTemplate">
        下载导入模板
      </j-button>
      <j-button v-check="'uploadEquipmentExcelFile'" @click="uploadVisible = true">
        导入
      </j-button>
      <!-- <j-button v-auth="'equipment_save'" type="primary" @click="handleSubmit">
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
        <j-form-item label="地址名称" prop="addressName">
          <j-select v-model="editForm.addressName" value-key="id" @change="setAddress">
            <j-option
              v-for="item in addressList"
              :key="item.id"
              :label="item.addressName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="设备类型" prop="equipmentType">
          <j-select v-model="editForm.equipmentType">
            <j-option
              v-for="(value, index) in typeDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="使用部门" prop="equipmentCode">
          <j-input v-model="editForm.equipmentCode" />
        </j-form-item>
        <j-form-item label="设备名称" prop="equipmentName">
          <j-input v-model="editForm.equipmentName" />
        </j-form-item>
        <j-form-item label="品牌" prop="brand">
          <j-input v-model="editForm.brand" />
        </j-form-item>
        <j-form-item label="规格型号" prop="equipmentModel">
          <j-input v-model="editForm.equipmentModel" />
        </j-form-item>
        <j-form-item label="数量" prop="equipmentQty">
          <j-input-number
            v-model="editForm.equipmentQty"
            :precision="0"
            :min="0"
            :controls="false"
          />
        </j-form-item>
        <j-form-item label="校验类型" prop="checkType">
          <j-select v-model="editForm.checkType">
            <j-option label="无" :value="2" />
            <j-option label="内校" :value="0" />
            <j-option label="外校" :value="1" />
          </j-select>
        </j-form-item>
        <j-form-item label="校验生效日期" prop="validityStartTime">
          <j-date-picker
            v-model="editForm.validityStartTime"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
          />
        </j-form-item>
        <j-form-item label="校验失效日期" prop="validityEndTime">
          <j-date-picker
            v-model="editForm.validityEndTime"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
          />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="editSave">保存</j-button>
      </span>
    </j-dialog>

    <!-- 导入 -->
    <j-dialog title="导入" :visible.sync="uploadVisible" width="400px">
      <j-upload
        ref="upload"
        :limit="10"
        :show-file-list="true"
        :auto-upload="false"
        :action="uploadUrl"
        :data="{ id: $route.query.supplierId }"
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
        <div slot="tip" class="j-upload__tip" style="margin-top:6px;">
          只能上传Excel文件
        </div>
      </j-upload>
    </j-dialog>
  </div>
</template>

<script>
import * as poolApi from '@/api/supplier/pool'
import { getToken } from '@/utils/auth'
const urlType = 'equipment'

export default {
  data () {
    const checkStartTime = (rule, value, callback) => {
      if (this.editForm.checkType !== 2) {
        if (value) {
          callback()
        } else {
          callback(new Error('请选择生效日期'))
        }
      } else {
        callback()
      }
    }
    const checkEndTime = (rule, value, callback) => {
      if (this.editForm.checkType !== 2) {
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
        addressId: '',
        addressName: '',
        equipmentCode: '',
        equipmentName: '',
        equipmentType: '',
        equipmentModel: '',
        equipmentQty: '',
        brand: '',
        checkType: '',
        validityStartTime: '',
        validityEndTime: ''
      },
      rules: {
        addressName: [
          { required: true, message: '请选择地址', trigger: 'blur' }
        ],
        equipmentType: [
          { required: true, message: '请选择设备类型', trigger: 'change' }
        ],
        equipmentCode: [
          { required: true, message: '请输入使用部门', trigger: 'blur' }
        ],
        equipmentName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        brand: [{ required: true, message: '请输入品牌', trigger: 'blur' }],
        equipmentModel: [
          { required: true, message: '请输入规格型号', trigger: 'blur' }
        ],
        equipmentQty: [
          {
            required: true,
            message: '请输入日配套产能',
            trigger: 'blur'
          }
        ],
        checkType: [
          { required: true, message: '请选择校验类型', trigger: 'change' }
        ],
        validityStartTime: [
          // { required: true, message: '请选择生效日期', trigger: 'blur' }
          { required: true, validator: checkStartTime, trigger: 'change' }
        ],
        validityEndTime: [
          // { required: true, message: '请选择失效日期', trigger: 'blur' }
          { required: true, validator: checkEndTime, trigger: 'change' }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'addressName',
          label: '地址名称',
          width: '180px'
        },
        {
          label: '设备类型',
          render: (h, row) => <span>{this.typeDic[row.equipmentType]}</span>
        },
        {
          prop: 'equipmentName',
          label: '设备名称'
        },
        {
          prop: 'brand',
          label: '品牌'
        },
        {
          prop: 'equipmentModel',
          label: '规格型号'
        },
        {
          prop: 'equipmentCode',
          label: '使用部门'
        },
        {
          prop: 'equipmentQty',
          label: '数量'
        },
        {
          label: '校验类型',
          render: (h, row) => <span>{row.checkType === 1 ? '外校' : row.checkType === 0 ? '内校' : '无'}</span>
        },
        {
          prop: 'validityStartTime',
          label: '有效期限',
          width: '300px',
          render: (h, row) => {
            if (row.validityStartTime && row.validityEndTime) {
              return (<span>
                {row.validityStartTime} 至 {row.validityEndTime}
              </span>)
            } else {
              return <span></span>
            }
            
          }
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
                vAuth={'equipment_update'}
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
      typeDic: {
        0: '生产类',
        1: '测试类',
        2: '检验类'
      },
      addressList: [],
      uploadVisible: false,
      uploadUrl: poolApi.uploadEquipmentExcelFile
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
      poolApi
        .getAddressNameList({ id: this.$route.query.supplierId })
        .then((res) => {
          if (res.code === '0' && res.data) this.addressList = res.data
        })
    },
    setAddress (item) {
      this.editForm.addressId = item.id
      this.editForm.addressName = item.addressName
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.handleType = '编辑'
      this.editVisible = true
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
    handleSubmit () {},
    downTemplate () {
      poolApi.modelDownloadEquipment()
    },
    submitUpload () {
      this.$refs.upload.headers['Authorization'] = getToken()
      this.$refs.upload.submit()
    },
    uploadSuccess (res) {
      if (res.code === '0') {
        this.$message({
          message: '导入成功',
          type: 'success'
        })
        this.initTable()
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
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        addressId: '',
        addressName: '',
        equipmentCode: '',
        equipmentName: '',
        equipmentType: '',
        equipmentModel: '',
        equipmentQty: '',
        brand: '',
        checkType: '',
        validityStartTime: '',
        validityEndTime: ''
      }
    }
  }
}
</script>