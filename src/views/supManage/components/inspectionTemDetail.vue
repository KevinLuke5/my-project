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
    >
      <j-form-item label="模板编号" prop="code">
        <j-input v-model="detailForm.code" disabled />
      </j-form-item>
      <j-form-item label="模板名称" prop="name">
        <j-input v-model="detailForm.name" disabled />
      </j-form-item>
      <j-form-item label="类型" prop="type">
        <!-- <j-input v-model="detailForm.type" disabled /> -->
        <j-select v-model="detailForm.type" clearable disabled>
          <j-option
            v-for="item in typeList"
            :key="item.id"
            :label="item.name"
            :value="item.lineNumber"
          />
        </j-select>
      </j-form-item>
      <j-form-item label="时间维度" prop="timeDimension">
        <!-- <j-input v-model="detailForm.timeDimension" disabled /> -->
        <j-select v-model="detailForm.timeDimension" clearable disabled>
          <j-option
            v-for="item in timeDimensionList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </j-select>
      </j-form-item>
      <j-form-item label="创建人" prop="crtUserName">
        <j-input v-model="detailForm.crtUserName" disabled />
      </j-form-item>
      <j-form-item label="创建时间" prop="crtTime">
        <j-input v-model="detailForm.crtTime" disabled />
      </j-form-item>
      <j-form-item label="更新人" prop="updUserName">
        <j-input v-model="detailForm.updUserName" disabled />
      </j-form-item>
      <j-form-item label="更新时间" prop="updTime">
        <j-input v-model="detailForm.updTime" disabled />
      </j-form-item>
      <j-form-item class="btn-group" style="margin-bottom: 0">
        <j-button v-check="'insertOrUpdateTempla'" @click="detailAdd">
          新增
        </j-button>
        <j-button v-check="'deleteTemplateDetail'" @click="detailDelete">
          删除
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
      <j-table-column prop="indexName" label="指标" width="200" />
      <j-table-column prop="accessDimensionName" label="考核维度" />
      <j-table-column prop="checkDimension" label="审核维度">
        <template slot-scope="scope">
          <span>{{
            checkDimensionList.length ?
              (
                checkDimensionList.find(
                  (dic) => dic.lineNumber === scope.row.checkDimension
                ) || { name: '' }
              ).name
              : ''
          }}</span>
        </template>
      </j-table-column>
      <j-table-column prop="indexType" label="指标类型">
        <template slot-scope="scope">
          <span>{{
            indexTypeList.length ?
              (
                indexTypeList.find(
                  (dic) => dic.lineNumber === scope.row.indexType
                ) || { name: '' }
              ).name
              : ''
          }}</span>
        </template>
      </j-table-column>
      <j-table-column prop="property" label="属性">
        <template slot-scope="scope">
          <span>{{
            propertyList.length ?
              (
                propertyList.find(
                  (dic) => dic.lineNumber === scope.row.property
                ) || { name: '' }
              ).name
              : ''
          }}</span>
        </template>
      </j-table-column>
      <j-table-column prop="oneRatioCase" label="一级权重" />
      <j-table-column prop="ratioCase" label="二级权重" />
      <j-table-column prop="extremeValue" label="极限值" />
      <j-table-column prop="updUserName" label="更新人" />
      <j-table-column prop="updTime" label="更新时间" />
      <j-table-column fixed="right" label="操作" width="50">
        <template slot-scope="scope">
          <j-button v-check="'insertOrUpdateTempla'" type="text" @click="handleEdit(scope.row)">
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
        <!-- <j-form-item label="项目名称" prop="projectName">
          <j-input v-model="detailEditForm.projectName" />
          <j-autocomplete
            v-model="detailEditForm.projectName"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchProject"
            :trigger-on-focus="true"
            placeholder="输入编号或名称搜索"
            @select="selectProject"
          >
            <template slot-scope="{ item }">
              <div class="projectName">
                {{ item.projectName }}
              </div>
              <span class="projectCode">{{ item.projectCode }}</span>
            </template>
          </j-autocomplete>
        </j-form-item> -->
        <j-form-item label="指标" prop="indexName">
          <!-- <j-input v-model="detailEditForm.indexName" /> -->
          <j-autocomplete
            v-model="detailEditForm.indexName"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchIndexName"
            :trigger-on-focus="true"
            placeholder="输入编号或名称搜索"
            @select="selectIndexName"
          >
            <template slot-scope="{ item }">
              <div class="name">
                {{ item.name }}
              </div>
            </template>
          </j-autocomplete>
        </j-form-item>
        <j-form-item label="二级权重" prop="ratio">
          <j-input v-model="detailEditForm.ratio" />
        </j-form-item>
        <j-form-item label="极限值" prop="extremeValue">
          <j-input v-model="detailEditForm.extremeValue" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="detailEditClose">取消</j-button>
        <j-button type="primary" @click="detailEditSave">保存</j-button>
      </span>
    </j-dialog>
  </j-dialog>
</template>

<script>
import * as inspectionTemApi from '@/api/kpi/procure'
import { returnIds } from '@/utils/index'
import { timeDimensionList, getCodeList } from '@/views/common/dic'

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
        templateId: '',
        indexId: '',
        indexName: '',
        indexType: '',
        accessDimensionName: '',
        accessDimensionCode: '',
        checkDimension: '',
        property: '',
        ratio: '',
        extremeValue: '',
        timeDimension: ''
      },
      codeId: '',
      handleType: '新增',
      rules: {
        indexName: [
          { required: true, message: '请选择指标', trigger: 'change' }
        ]
      },
      checkDimensionList: [],
      indexNameList: [],
      timeDimensionList: [],
      typeList: [],
      indexTypeList: [],
      propertyList: []
    }
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    getSelectData () {
      // 审核维度
      getCodeList('code00035').then((list) => {
        this.checkDimensionList = list
      })
      // 类型
      getCodeList('code00040').then((list) => {
        this.typeList = list
      })
      // 指标类型
      getCodeList('code00038').then((list) => {
        this.indexTypeList = list
      })
      // 指标属性
      getCodeList('code00039').then((list) => {
        this.propertyList = list
      })
      this.timeDimensionList = timeDimensionList
    },
    searchIndexName (name, cb) {
      inspectionTemApi.getMentIndicators({ name,  page: 1, size: 500 })
        .then((res) => {
          if (res.code === '0') {
            this.indexNameList = res.data.records
          }
        })
        .finally(() => {
          cb(this.indexNameList)
        })
    },
    selectIndexName (item) {
      this.detailEditForm.indexId = item.id
      this.detailEditForm.indexName = item.name
      this.detailEditForm.indexType = item.type
      this.detailEditForm.accessDimensionName = item.accessDimensionName
      this.detailEditForm.accessDimensionCode = item.accessDimensionCode
      this.detailEditForm.checkDimension = item.checkDimension
      this.detailEditForm.property = item.property
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
          const params = Object.assign({}, this.detailEditForm, { timeDimension: this.detailForm.timeDimension })
          if (this.handleType === '新增') {
            delete this.detailEditForm.id
            inspectionTemApi.insertInspectionTemDetail(params).then((res) => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.detailEditClose()
                this.getDetailTable(this.codeId)
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } 
          else {
            inspectionTemApi.insertInspectionTemDetail(params).then((res) => {
              if (res.code === '0') {
                this.showMessage('修改成功！', 'success')
                this.detailEditClose()
                this.getDetailTable(this.codeId)
              } else {
                this.showMessage(res.message, 'error')
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
        templateId: '',
        indexId: '',
        indexName: '',
        indexType: '',
        accessDimensionName: '',
        accessDimensionCode: '',
        checkDimension: '',
        property: '',
        ratio: '',
        extremeValue: '',
        timeDimension: ''
      }
    },
    detailDelete () {
      const ids = returnIds(this.selectList).join()
      inspectionTemApi.deleteIdInspectionTemDetail({ ids: ids }).then((res) => {
        if (res.code === '0') {
          this.showMessage('删除成功！', 'success')
          this.getDetailTable(this.codeId)
        } else {
          this.showMessage(res.message, 'error')
        }
      })
    },
    getDetailTable (id, timeDimension) {
      this.codeId = id
      this.detailEditForm.timeDimension = timeDimension
      this.detailEditForm.templateId = id
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
      this.$emit('detailClose')
    }
  }
}
</script>