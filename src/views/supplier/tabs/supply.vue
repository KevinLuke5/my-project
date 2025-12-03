<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'supply_update'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'supply_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'supply_save'" type="primary" @click="handleSubmit">
        保存
      </j-button> -->
    </div>
    <div class="tip-text">
      <div>“主要设备”请填写支撑产能的关键设备</div>
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
        <j-form-item label="类型" prop="supplyType">
          <j-select v-model="editForm.supplyType" @change="changeVaild">
            <j-option label="整机" :value="0" />
            <j-option label="配件" :value="1" />
          </j-select>
        </j-form-item>
        <j-form-item label="产品线" prop="productLineName">
          <j-select
            v-model="editForm.productLineName"
            value-key="name"
            filterable
            @change="setProductLine"
          >
            <j-option
              v-for="item in lineList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item v-show="editForm.supplyType === 1" label="大类" prop="generalCategoryName">
          <j-select
            v-model="editForm.generalCategoryName"
            value-key="bigTypeName"
            filterable
            @change="getSmallType"
          >
            <j-option
              v-for="item in bigTypeList"
              :key="item.id"
              :label="item.bigTypeName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item v-show="editForm.supplyType === 1" label="小类" prop="subclassCategoryName">
          <j-select
            v-model="editForm.subclassCategoryName"
            value-key="name"
            filterable
            @change="setSmallType"
          >
            <j-option
              v-for="item in smallTypeList"
              :key="item.id"
              :label="item.smallTypeName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="供应物资" prop="materials">
          <j-input v-model="editForm.materials" />
        </j-form-item>
        <j-form-item label="主要设备" prop="majorEquipment">
          <j-input v-model="editForm.majorEquipment" />
        </j-form-item>
        <j-form-item label="设备数量" prop="equipmentQty">
          <j-input-number
            v-model="editForm.equipmentQty"
            :precision="0"
            :min="0"
            :controls="false"
          />
        </j-form-item>
        <j-form-item label="日产能(台)" prop="dailyCapacity">
          <j-input-number
            v-model="editForm.dailyCapacity"
            :precision="0"
            :min="0"
            :controls="false"
          />
        </j-form-item>
        <j-form-item label="供应周期(天)" prop="supplyCycle">
          <j-input-number
            v-model="editForm.supplyCycle"
            :precision="0"
            :min="0"
            :controls="false"
          />
        </j-form-item>
        <j-form-item v-if="userType === 'E'" label="供应关系评级">
          <j-select v-model="editForm.relationRate" clearable>
            <j-option
              v-for="(value, index) in levelDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
        <j-form-item v-if="userType === 'E'" label="供应关系状态">
          <j-select v-model="editForm.relationStatus" clearable>
            <j-option
              v-for="(value, index) in statusDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="图片视频" prop="picture">
          <img-upload ref="imgUpload" @getFiles="getFiles" />
          <video-upload ref="videoUpload" @getFiles="getFiles" />
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
    <video-viewer ref="videoViewer" />
  </div>
</template>
<script>
import * as poolApi from '@/api/supplier/pool'
const urlType = 'supply'

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
    const checkBigType = (rule, value, callback) => {
      if (this.editForm.supplyType === 1) {
        if (value) {
          callback()
        } else {
          callback(new Error('请选择大类'))
        }
      } else {
        callback()
      }
    }
    const checkSmallType = (rule, value, callback) => {
      if (this.editForm.supplyType === 1) {
        if (value) {
          callback()
        } else {
          callback(new Error('请选择小类'))
        }
      } else {
        callback()
      }
    }
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        supplyType: '',
        productLineId: '',
        productLineName: '',
        generalCategoryId: '',
        generalCategoryName: '',
        subclassCategoryId: '',
        subclassCategoryName: '',
        materials: '',
        majorEquipment: '',
        equipmentQty: '',
        dailyCapacity: '',
        supplyCycle: '',
        relationRate: '',
        relationStatus: '',
        remark: '',
        picture: {
          photograph: [],
          file: [],
          video: []
        }
      },
      rules: {
        supplyType: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ],
        productLineName: [
          { required: true, message: '请选择产品线', trigger: 'change' }
        ],
        generalCategoryName: [
          { required: true, validator: checkBigType, trigger: 'change' }
        ],
        subclassCategoryName: [
          { required: true, validator: checkSmallType, trigger: 'change' }
        ],
        materials: [
          { required: true, message: '请输入供应物资', trigger: 'blur' }
        ],
        majorEquipment: [
          { required: true, message: '请输入主要设备', trigger: 'blur' }
        ],
        equipmentQty: [
          {
            required: true,
            message: '请输入设备数量',
            trigger: 'blur'
          }
        ],
        dailyCapacity: [
          {
            required: true,
            message: '请输入日产能',
            trigger: 'blur'
          }
        ],
        supplyCycle: [
          {
            required: true,
            message: '请输入供应周期',
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
          label: '类型',
          render: (h, row) => <span>{row.supplyType ? '配件' : '整机'}</span>
        },
        {
          prop: 'productLineName',
          label: '产品线'
        },
        {
          prop: 'generalCategoryName',
          label: '大类'
        },
        {
          prop: 'subclassCategoryName',
          label: '小类'
        },
        {
          prop: 'materials',
          label: '供应物资',
          width: '280px'
        },
        {
          prop: 'majorEquipment',
          label: '主要设备'
        },
        {
          prop: 'equipmentQty',
          label: '设备数量'
        },
        {
          prop: 'dailyCapacity',
          label: '日产能(台)'
        },
        {
          prop: 'supplyCycle',
          label: '供应周期(天)'
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
          label: '视频',
          // width: '200',
          render: (h, row) => (
            <div>
              {row.picture && row.picture.video
                ? row.picture.video.map((video) => (
                  <j-button
                    type="text"
                    onClick={() => {
                      this.showVideo(video.url)
                    }}
                  >
                    {video.name}
                  </j-button>
                ))
                : ''}
            </div>
          )
        },
        {
          label: '供应关系评级',
          render: (h, row) => <span>{this.levelDic[row.relationRate]}</span>
        },
        {
          label: '供应关系状态',
          render: (h, row) => <span>{this.statusDic[row.relationStatus]}</span>
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
                vAuth={'supply_update'}
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
        toolbarBottom: true,
        mutiSelect: true,
        index: true,
        loading: false,
        initTable: false
      },
      lineList: [],
      bigTypeList: [],
      smallTypeList: [],
      levelDic: {
        0: '不合格',
        1: '潜在',
        2: '预备',
        3: '合格'
      },
      statusDic: {
        0: '冻结',
        1: '正常',
        2: '关闭'
      },
      userType: ''
    }
  },
  created () {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    // console.log(userInfo)
    // 用户类型：九阳是E 经销商是S 供应商是O
    this.userType = userInfo ? userInfo.userType : ''
    this.initTable()
    this.getSelectData()
  },
  mounted () {
    this.height = this.calHeight(150).toString()
  },
  methods: {
    getSelectData () {
      poolApi.getPdtLineList().then((res) => {
        if (res.code === '0' && res.data) this.lineList = res.data.records
      })
      poolApi.getBigCategoryList().then((res) => {
        if (res.code === '0' && res.data) this.bigTypeList = res.data
      })
    },
    getSmallType (item) {
      this.setBigType(item)
      poolApi
        .getSmallCategoryList({
          page: 1,
          size: 500,
          bigTypeName: item.bigTypeName
        })
        .then((res) => {
          if (res.code === '0' && res.data)
            this.smallTypeList = res.data.records
        })
    },
    setProductLine (item) {
      this.editForm.productLineId = item.id
      this.editForm.productLineCode = item.code
      this.editForm.productLineName = item.name
    },
    setBigType (item) {
      this.editForm.generalCategoryId = item.id
      this.editForm.generalCategoryCode = item.bigTypeCode
      this.editForm.generalCategoryName = item.bigTypeName
    },
    setSmallType (item) {
      this.editForm.subclassCategoryId = item.id
      this.editForm.subclassCategoryCode = item.smallTypeCode
      this.editForm.subclassCategoryName = item.smallTypeName
    },
    changeVaild (supplyType) {
      // this.$refs.editForm.clearValidate()
      this.$refs.editForm.validate()
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
      this.$nextTick(() => {
        this.$refs.imgUpload.fileList = []
        this.$refs.videoUpload.fileList = []
      })
    },
    handleEdit (row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.handleType = '编辑'
      this.editVisible = true
      this.$nextTick(() => {
        this.$refs.imgUpload.fileList = this.editForm.picture && this.editForm.picture.photograph
          ? this.editForm.picture.photograph
          : []
        this.$refs.videoUpload.fileList = this.editForm.picture && this.editForm.picture.video
          ? this.editForm.picture.video
          : []
      })
    },
    getFiles (type, files) {
      if (type === 'img') {
        this.editForm.picture.photograph = files
      } else if (type === 'video') {
        this.editForm.picture.video = files
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
    showVideo (url) {
      this.$refs.videoViewer.show(url)
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
        supplyType: '',
        productLineId: '',
        productLineName: '',
        generalCategoryId: '',
        generalCategoryName: '',
        subclassCategoryId: '',
        subclassCategoryName: '',
        materials: '',
        majorEquipment: '',
        equipmentQty: '',
        dailyCapacity: '',
        supplyCycle: '',
        relationRate: '',
        relationStatus: '',
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