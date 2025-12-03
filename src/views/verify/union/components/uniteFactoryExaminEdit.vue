<template>
  <div>
    <!-- 新增、编辑 -->
    <j-dialog
      :title="handleType"
      :visible.sync="editVisible"
      :modal="false"
      :close-on-click-modal="false"
      :before-close="close"
      :fullscreen="true"
    >
      <div v-if="handleType !== '详情'" style="margin-bottom: 10px">
        <j-button @click="handleStaging">
          暂存
        </j-button>
        <j-button type="primary" @click="submitPretrial">
          提交预审
        </j-button>
      </div>
      <j-form
        ref="editForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="editForm"
        :rules="rulesEdit"
        :inline="true"
        :disabled="handleType === '详情'"
      >
        <!-- <j-form-item label="审厂任务编码">
          <j-input v-model="editForm.factoryCode" placeholder="自动生成" disabled />
        </j-form-item> -->
        <j-form-item label="审厂任务名称" prop="factoryName">
          <j-input v-model="editForm.factoryName" />
        </j-form-item>
        <j-form-item label="审厂目的" prop="factoryPurpose">
          <j-select v-model="editForm.factoryPurpose" clearable>
            <j-option
              v-for="item in aimList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="审厂类别" prop="factoryType">
          <j-select v-model="editForm.factoryType" clearable>
            <j-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="供应商" prop="supplierName">
          <j-autocomplete
            v-model="editForm.supplierName"
            style="width: 300px"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchSupplier"
            :trigger-on-focus="false"
            :debounce="800"
            placeholder="请输入关键词搜索,选择系统内供应商"
            @select="setSupplier"
          >
            <template slot-scope="{ item }">
              <div class="name">
                {{ item.name }}
              </div>
              <!-- <span class="code">{{ item.id }}</span> -->
            </template>
          </j-autocomplete>
        </j-form-item>
        <j-form-item label="类型" prop="type">
          <j-select v-model="editForm.type" clearable>
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="产品线" prop="lineName">
          <j-select
            v-model="editForm.lineRels"
            value-key="lineCode"
            filterable
            multiple
            clearable
          >
            <j-option
              v-for="item in lineList"
              :key="item.lineCode"
              :label="item.lineName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="大类" prop="bigTypeName">
          <j-select
            v-model="editForm.bigTypeRels"
            value-key="bigTypeCode"
            multiple
            filterable
            clearable
            @change="getSmallType"
          >
            <j-option
              v-for="item in bigTypeList"
              :key="item.bigTypeCode"
              :label="item.bigTypeName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="小类" prop="smallTypeName">
          <j-select
            v-model="editForm.smallTypeRels"
            value-key="smallTypeCode"
            multiple
            filterable
            clearable
          >
            <j-option
              v-for="item in smallTypeList"
              :key="item.smallTypeCode"
              :label="item.smallTypeName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="审厂模块" prop="factoryModels">
          <j-select v-model="editForm.factoryModels" multiple clearable>
            <j-option label="QSA" value="0" />
            <j-option label="QPA" value="1" />
            <j-option label="采购模块" value="2" />
            <j-option label="研发工程模块" value="3" />
          </j-select>
        </j-form-item>
        <j-form-item label="审厂原因">
          <j-input v-model="editForm.factoryReason" type="textarea" />
        </j-form-item>
        <j-form-item label="门槛附件" prop="accessory">
          <!-- <h4>上传门槛附件：</h4> -->
          <file-upload
            ref="fileUpload"
            text="点击上传"
            :can-download="false"
            @getFiles="getFiles"
          />
          <!-- <div class="org-tree-cont">
          <vue2-org-tree
            v-if="orgShow"
            :key="random"
            :data="orgData"
            :render-content="renderContent"
          />
        </div> -->
        </j-form-item>
      </j-form>

      <h3 style="color: red">
        配件审厂只需要填大类和小类、整机审厂只需填产品线！
      </h3>
      <!-- <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="handleSave">保存</j-button>
      </span> -->
      <j-button type="text" @click="basicInformation">
        查看供应商基本信息
      </j-button>
      <j-button type="text" @click="handleArchive">
        查看《供应商调查表》存档
      </j-button>

      <!-- 联合审厂安排表格 -->
      <h3>联合审厂安排：</h3>
      <j-button v-if="handleType !== '详情'" @click="handleFactoryPlace">
        添加审厂地点
      </j-button>
      <j-table
        ref="arrangeTable"
        v-loading="arrangeLoading"
        :data="addressList"
        size="small"
        style="width: 100%"
        tooltip-effect="dark"
        highlight-current-row
        @selection-change="handleSelectionChangeArrange"
      >
        <!-- <j-table-column type="selection" width="55" fixed /> -->
        <j-table-column prop="child" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </j-table-column>
        <j-table-column prop="factoryName" label="地点名称" />
        <j-table-column prop="factoryAudiTime" label="审厂时间" />
        <j-table-column prop="addressName" label="详细地址" />
        <j-table-column fixed="right" label="操作" width="50">
          <template slot-scope="scope">
            <j-button v-if="handleType !== '详情'" type="text" @click="handleDel(scope.row, scope.$index)">
              删除
            </j-button>
          </template>
        </j-table-column>
      </j-table>

      <!-- 审厂专家表格 -->
      <h3>审厂专家：</h3>
      <j-table
        ref="expertsTable"
        v-loading="expertsLoading"
        :data="expertList"
        size="small"
        style="width: 100%"
        tooltip-effect="dark"
        highlight-current-row
        @selection-change="handleSelectionChangeExperts"
      >
        <!-- <j-table-column type="selection" width="55" fixed /> -->
        <j-table-column prop="child" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </j-table-column>
        <j-table-column prop="groupName" label="小组" />
        <j-table-column prop="expertName" label="审厂专家" />
        <j-table-column prop="professionName" label="专业" />
        <j-table-column fixed="right" label="操作" width="50">
          <template slot-scope="scope">
            <j-button v-if="handleType !== '详情'" type="text" @click="handleDelExpert(scope.row.id)">
              删除
            </j-button>
          </template>
        </j-table-column>
      </j-table>
      <!-- 添加审厂地点 -->
      <j-dialog
        :visible.sync="factoryPlaceVisible"
        :modal="false"
        :before-close="factoryPlaceClose"
        width="400px"
      >
        <j-form
          ref="factoryPlaceForm"
          size="mini"
          label-position="left"
          label-width="95px"
          :model="factoryPlaceForm"
          :rules="rules"
        >
          <j-form-item label="地点名称" prop="factoryName">
            <j-input v-model="factoryPlaceForm.factoryName" />
          </j-form-item>
          <j-form-item label="审厂时间" prop="factoryAudiTime">
            <j-date-picker v-model="factoryPlaceForm.factoryAudiTime" type="datetime" placeholder="选择日期时间" />
          </j-form-item>
          <j-form-item label="详细地址" prop="addressName">
            <j-input v-model="factoryPlaceForm.addressName" />
          </j-form-item>
        </j-form>
        <span slot="footer">
          <j-button @click="factoryPlaceClose">取消</j-button>
          <j-button type="primary" @click="factoryPlaceSave">保存</j-button>
        </span>
      </j-dialog>

      <!-- 审核意见 -->
      <h3>审核意见：</h3>
      <j-table
        ref="checkTable"
        v-loading="checkLoading"
        :data="checkList"
        size="small"
        style="width: 100%"
        tooltip-effect="dark"
        highlight-current-row
      >
        <!-- <j-table-column type="selection" width="55" fixed /> -->
        <j-table-column prop="child" label="序号">
          <template slot-scope="scope">
            <span>{{ scope.$index + 1 }}</span>
          </template>
        </j-table-column>
        <j-table-column prop="name" label="姓名" />
        <j-table-column prop="results" label="批示意见">
          <template slot-scope="scope">
            {{ resultsDic[scope.row.results] + '（' + scope.row.remark + '）' }}
          </template>
        </j-table-column>
      </j-table>
    </j-dialog>
  </div>
</template>

<script>
import { getCodeList } from '@/views/common/dic'
import * as poolApi from '@/api/supplier/pool'
import * as unionVerifyApi from '@/api/verify/unionVerify'
import { getSupplierName } from '@/api/verify/typeVerify'
// import { returnIds } from '@/utils/index'
import {
  getPdtLineList,
  getBigCategoryList,
  getSmallTypeBatch
} from '@/api/supplier/pool'
import _ from 'lodash'
export default {
  props: {
    editVisible: Boolean,
    handleType: {
      type: String,
      default: function () {
        // return '新增'
      }
    }
    // editForm: {
    //   type: Object,
    //   default () {
    //     return {}
    //   }
    // }
  },
  data () {
    return {
      tableExpertList: [],
      height: null,
      arrangeLoading: false,
      expertsLoading: false,
      checkLoading: false,
      addressList: [],
      expertList: [],
      checkList: [],
      aimList: [],
      categoryList: [],
      typeList: [],
      lineList: [],
      bigTypeList: [],
      smallTypeList: [],
      factoryPlaceVisible: false,
      factoryPlaceForm: {
        factoryName: '',
        factoryAudiTime: '',
        addressName: ''
      },
      editForm: {
        factoryPurpose: '',
        factoryType: '',
        factoryName: '',
        supplierId: '',
        supplierCode: '',
        supplierName: '',
        type: '',
        lineCode: '',
        lineName: '',
        lineRels: [],
        bigTypeCode: '',
        bigTypeName: '',
        bigTypeRels: [],
        smallTypeCode: '',
        smallTypeName: '',
        smallTypeRels: [],
        factoryModels: [],
        factoryReason: '',
        expertList: [],
        accessory: []
      },
      resultsDic: {
        1: '同意',
        2: '不同意'
      },
      rulesEdit: {
        factoryName: [
          { required: true, message: '请输入审厂任务名称', trigger: 'change' }
        ],
        factoryPurpose: [
          { required: true, message: '请输入审厂目的', trigger: 'change' }
        ],
        factoryType: [
          { required: true, message: '请输入审厂类别', trigger: 'change' }
        ],
        supplierName: [
          { required: true, message: '请输入供应商', trigger: 'change' }
        ],
        type: [{ required: true, message: '请输入类型', trigger: 'change' }],
        factoryModels: [
          { required: true, message: '请输入审厂模块', trigger: 'change' }
        ]
      },
      rules: {
        factoryName: [
          { required: true, message: '请输入地点名称', trigger: 'change' }
        ],
        factoryAudiTime: [
          { required: true, message: '请选择审厂时间', trigger: 'change' }
        ],
        addressName: [
          { required: true, message: '请输入具体地址', trigger: 'change' }
        ]
      },
      currentId: '',
      files: []
      // orgData: {
      //   num: '',
      //   positionName: '',
      //   children: []
      // },
      // random: +new Date(),
      // orgShow: false
    }
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    // 初始查询
    initEveryList (id) {
      this.currentId = id
      // 编辑情况是url有id, 新增时候没有id不需要获取数据
      unionVerifyApi
        .uniteFactoryExaminDetail({ id: this.currentId })
        .then((res) => {
          if (res.code === '0') {
            const lineData = res.data[0].lineRels.map((item) => ({
              lineCode: item.lineCode,
              lineName: item.lineName
            }))
            const bigData = res.data[0].bigTypeRels.map((item) => ({
              bigTypeCode: item.bigTypeCode,
              bigTypeName: item.bigTypeName
            }))
            const smallData = res.data[0].smallTypeRels.map((item) => ({
              smallTypeCode: item.smallTypeCode,
              smallTypeName: item.smallTypeName
            }))
            // console.log(lineData)
            // console.log(bigData)
            // console.log(smallData)
            this.getSmallType(bigData) // 获取小类下拉框数据
            // 删除无用字段防止干扰
            delete res.data[0].lineRels
            delete res.data[0].bigTypeRels
            delete res.data[0].smallTypeRels
            this.editForm = res.data[0]
            this.expertList = res.data[0].expertList
            this.checkList = res.data[0].auditResults
            if (res.data[0].addressList) {
              this.addressList = res.data[0].addressList
            } else {
              this.addressList = []
            }
            this.$set(this.editForm, 'lineRels', lineData)
            this.$set(this.editForm, 'bigTypeRels', bigData)
            this.$set(this.editForm, 'smallTypeRels', smallData)
          }
          this.editForm.accessory = res.data[0].accessory
          this.$nextTick(() => {
            this.$refs.fileUpload.fileList =
              this.editForm.accessory && this.editForm.accessory.length
                ? this.editForm.accessory
                : []
          })
        })
    },
    searchSupplier (queryString, cb) {
      getSupplierName({ name: queryString }).then((res) => {
        if (res.code === '0' && res.data) cb(res.data)
      })
    },
    setSupplier (item) {
      this.editForm.supplierId = item.id
      this.editForm.supplierCode = item.code
      this.editForm.supplierName = item.name
    },
    getUniteFactoryExaminDetail (id) {
      unionVerifyApi.uniteFactoryExaminDetail({ id: id }).then((res) => {
        if (res.code === '0') {
          this.editForm = res.data[0]
          this.expertList = res.data[0].expertList
          if (res.data[0].addressList) {
            this.addressList = res.data[0].addressList
          } else {
            this.addressList = []
          }
        }
      })
    },
    handleStaging () {
      const params = Object.assign({}, this.editForm, {
        insertStatus: 1,
        addressList: this.addressList
      })
      unionVerifyApi.uniteFactoryExaminUpdate(params).then((res) => {
        if (res.code === '0') {
          this.showMessage('暂存成功！', 'success')
          this.close()
        } else {
          this.showMessage(res.message, 'error')
        }
      })
    },
    submitPretrial () {
      if (!this.editForm.supplierCode) {
        this.showMessage('请选择系统内存在的供应商!')
        return
      }
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (
            (this.editForm.type === 1 &&
              this.$refs.fileUpload.fileList.length !== 0) ||
            (this.editForm.type === 2 &&
              this.$refs.fileUpload.fileList.length !== 0) ||
            this.editForm.type === 3 || this.editForm.type === 4
          ) {
            const params = Object.assign({}, this.editForm, {
              insertStatus: 2,
              addressList: this.addressList
            })
            unionVerifyApi.uniteFactoryExaminUpdate(params).then((res) => {
              if (res.code === '0') {
                this.showMessage('提交预审成功！', 'success')
                this.close()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            this.showMessage('请上传门槛附件！', 'warning')
          }
        }
      })
    },
    getSelectData () {
      getPdtLineList().then((res) => {
        if (res.code === '0' && res.data) {
          this.lineList = res.data.records.map((item) => ({
            lineCode: item.code,
            lineName: item.name
          }))
        }
      })
      getBigCategoryList().then((res) => {
        if (res.code === '0' && res.data) {
          this.bigTypeList = res.data.map((item) => ({
            bigTypeCode: item.bigTypeCode,
            bigTypeName: item.bigTypeName
          }))
        }
      })
      getCodeList('code00022').then((list) => {
        this.aimList = list
      })
      getCodeList('code00023').then((list) => {
        this.categoryList = list
      })
      getCodeList('code00024').then((list) => {
        this.typeList = list
      })
      getCodeList('code00017').then((list) => {
        this.statusList = list
      })
      // poolApi.getPdtLineList().then((res) => {
      //   if (res.code === '0' && res.data) this.lineList = res.data.records
      // })
      // unionVerifyApi.getPdtLineList().then((res) => {
      //   if (res.code === '0' && res.data) this.lineList = res.data.records
      // })
      // poolApi.getBigCategoryList().then((res) => {
      //   if (res.code === '0' && res.data) this.bigTypeList = res.data
      // })
      // getCodeList('code00001').then(list => {
      //   this.statusList = list
      // })
    },
    getSmallType: _.debounce(function (val) {
      if (val.length) {
        getSmallTypeBatch(val.map((big) => big.bigTypeCode)).then((res) => {
          if (res.code === '0' && res.data) {
            this.smallTypeList = res.data.map((item) => ({
              smallTypeCode: item.smallTypeCode,
              smallTypeName: item.smallTypeName
            }))
          }
        })
      }
    }, 2000),
    handleDel (row, index) {
      if (row.id) {
        unionVerifyApi.factoryPlaceDeleteId({ id: row.id }).then((res) => {
          if (res.code === '0') {
            this.getSelectData()
            this.initEveryList(this.currentId)
          } else {
            this.showMessage(res.message, 'error')
          }
        })
      } else {
        this.addressList.splice(index, 1)
      }
    },
    handleDelExpert (id) {
      unionVerifyApi.expertsDeleteId({ id: id }).then((res) => {
        if (res.code === '0') {
          this.showMessage('删除成功！', 'success')
          this.getSelectData()
          this.initEveryList(this.currentId)
        } else {
          this.showMessage(res.message, 'error')
        }
      })
    },
    handleFactoryPlace () {
      this.factoryPlaceVisible = true
    },
    factoryPlaceClose () {
      this.factoryPlaceVisible = false
      this.factoryPlaceForm = {
        factoryName: '',
        factoryAudiTime: '',
        addressName: ''
      }
    },
    factoryPlaceSave () {
      this.$refs.factoryPlaceForm.validate((valid) => {
        if (valid) {
          this.factoryPlaceForm.factoryAudiTime = this.$moment(
            this.factoryPlaceForm.factoryAudiTime
          ).format('YYYY-MM-DD HH:mm:ss')
          this.addressList.push(this.factoryPlaceForm)
          this.factoryPlaceClose()
        }
      })
    },
    getFiles (type, fileList, file, handle) {
      this.files.push(file)
      if (type === 'file') {
        this.editForm.accessory = fileList
      }
      // if (handle === 'add') {
      //   poolApi
      //     .insertOrUpdateSrmSupplierFile({
      //       // businessType: urlType,
      //       supplierId: this.$route.query.supplierId,
      //       uid: file.uid,
      //       upFile: file
      //     })
      //     .then((res) => {
      //       if (res.code === '0') {
      //         this.showMessage('文件保存成功!', 'success')
      //       } else {
      //         this.showMessage(res.message)
      //       }
      //     })
      // } else if (handle === 'delete') {
      //   poolApi
      //     .deleteSrmSupplierFile({ uid: file.uid.toString() })
      //     .then((res) => {
      //       if (res.code === '0') {
      //         this.showMessage('删除成功!', 'success')
      //       } else {
      //         this.showMessage(res.message)
      //       }
      //     })
      // }
    },
    basicInformation () {
      this.$router.push({
        path: '/supplier/pool/poolDetail',
        query: {
          supplierId: this.editForm.supplierId,
          name: this.editForm.supplierName,
          code: this.editForm.supplierCode
        }
      })
    },
    handleArchive () {
      this.$router.push({
        path: '/supplier/check/checkIndex',
        query: { supplierName: this.editForm.supplierName }
      })
    },
    handleSelectionChangeArrange () {},
    handleSelectionChangeExperts (val) {
      this.tableExpertList = val
    },
    // getSmallType () {
    //   poolApi
    //     .getSmallCategoryList({
    //       page: 1,
    //       size: 500,
    //       bigTypeName: this.editForm.bigTypeName
    //     })
    //     .then((res) => {
    //       if (res.code === '0' && res.data)
    //         this.smallTypeList = res.data.records
    //     })
    // },
    close () {
      this.editForm = {
        factoryPurpose: '',
        factoryType: '',
        factoryName: '',
        supplierId: '',
        supplierCode: '',
        supplierName: '',
        type: '',
        lineCode: '',
        lineName: '',
        lineRels: [],
        bigTypeCode: '',
        bigTypeName: '',
        bigTypeRels: [],
        smallTypeCode: '',
        smallTypeName: '',
        smallTypeRels: [],
        factoryModels: [],
        factoryReason: '',
        expertList: [],
        accessory: []
      }
      this.expertList = []
      this.addressList = []
      this.checkList = []
      this.$refs.fileUpload.fileList = []
      this.$emit('editClose')
    }
  }
}
</script>

<style>
</style>