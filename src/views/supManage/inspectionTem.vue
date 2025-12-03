<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-form
        class="head-container"
        size="mini"
        :inline="true"
        label-position="left"
        label-width="76px"
        :model="query"
      >
        <j-form-item label="模板编号">
          <j-input v-model="query.code" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="模板名称">
          <j-input v-model="query.name" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="状态">
          <j-select v-model="query.status" clearable>
            <j-option label="有效" :value="0" />
            <j-option label="失效" :value="1" />
            <j-option label="草稿" :value="2" />
          </j-select>
        </j-form-item>
        <j-form-item label="类型">
          <j-select v-model="query.type" clearable>
            <!-- <j-option label="质量" :value="0" />
            <j-option label="成本" :value="1" />
            <j-option label="交期" :value="2" />
            <j-option label="服务" :value="3" />
            <j-option label="技术创新" :value="4" /> -->
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="时间维度">
          <j-select v-model="query.timeDimension" clearable>
            <!-- <j-option label="品质" :value="0" />
            <j-option label="采购" :value="1" />
            <j-option label="PMC" :value="2" />
            <j-option label="研发" :value="3" />
            <j-option label="制造技术" :value="4" /> -->
            <j-option
              v-for="item in timeDimensionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </j-select>
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'getTemplateList'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'insertTemplate'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'deleteBatchTemplate'" @click="handleDel">
            删除
          </j-button>
        </j-form-item>
      </j-form>

      <j-table-with-page
        :columns="tableColumns"
        :data-source="tableData"
        :options="tableOptions"
        :fetch="initTable"
        :pagination="tablePage"
        :height="height"
        @selection-change="selectTable"
      />
    </j-card>
    <inspectionTemDialog
      ref="inspectionTemDialog"
      :edit-visible="editVisible"
      :edit-form="editForm"
      :handle-type="handleType"
      @editClose="editClose"
    />
    <inspectionTemDetail
      ref="inspectionTemDetail"
      :detail-visible="detailVisible"
      :detail-form="detailForm"
      @detailClose="detailClose"
    />
  </div>
</template>

<script>
import * as inspectionTemApi from '@/api/kpi/procure'
// import { getStandardQuery, standardUpdate, standardDeleteId } from '@/api/verify/unionVerify'
import { returnIds } from '@/utils/index'
import inspectionTemDetail from './components/inspectionTemDetail'
import inspectionTemDialog from './components/inspectionTemDialog'
import { timeDimensionList, getCodeList } from '@/views/common/dic'

export default {
  name: 'InspectionTem',
  components: { inspectionTemDetail, inspectionTemDialog },
  data () {
    return {
      query: {
        code: '',
        name: '',
        status: '',
        type: '',
        timeDimension: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        id: '',
        name: '',
        status: '',
        type: '',
        timeDimension: ''
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'code',
          label: '模板编号'
        },
        {
          prop: 'name',
          label: '模板名称'
        },
        {
          prop: 'status',
          label: '状态',
          render: (h, row) => <span>{this.statusDic[row.status]}</span>
        },
        {
          prop: 'type',
          label: '类型',
          render: (h, row) => (
            <span>
              {this.typeList.length
                ? (this.typeList.find((dic) => dic.lineNumber === row.type) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          prop: 'timeDimension',
          label: '时间维度',
          render: (h, row) => (
            <span>
              {row.timeDimension !== undefined && row.timeDimension !== null
                ? this.timeDimensionList[row.timeDimension].label
                : ''}
            </span>
          )
        },
        {
          prop: 'crtUserName',
          label: '创建人'
        },
        {
          prop: 'crtTime',
          label: '创建时间'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        },
        {
          prop: 'updTime',
          label: '更新时间'
        },
        {
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vCheck={'updateTemplate'}
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
              编辑
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'getTemplateDetailList'}
                onClick={() => {
                  this.handleDetail(row)
                }}
              >
                详情
              </j-button>
            </div>
          )
        }
      ],
      standardAttributesDic: {
        0: 'QSA',
        1: 'QPA',
        2: '采购',
        3: '研发'
      },
      tablePage: {
        total: 0,
        pageNum: 1,
        pageSize: 15
      },
      tableOptions: {
        toolbarBottom: true,
        mutiSelect: true,
        index: false,
        loading: false,
        initTable: false
      },
      detailVisible: false,
      detailForm: {
        code: '',
        name: '',
        type: '',
        timeDimension: '',
        crtUserName: '',
        crtTime: '',
        updUserName: '',
        updTime: ''
      },
      statusDic: {
        0: '有效',
        1: '失效',
        2: '草稿'
      },
      timeDimensionList: [],
      typeList: []
    }
  },
  created () {
    this.timeDimensionList = timeDimensionList
    this.initTable()
    this.getSelectData()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    getSelectData () {
      getCodeList('code00040').then((list) => {
        this.typeList = list
      })
    },
    handleDetail (row) {
      this.$refs.inspectionTemDetail.getSelectData()
      this.detailForm = row
      this.detailVisible = true
      this.$refs.inspectionTemDetail.getDetailTable(row.id, row.timeDimension)
    },
    handleAdd () {
      this.$refs.inspectionTemDialog.getSelectData()
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.$refs.inspectionTemDialog.getSelectData()
      this.editForm = JSON.parse(JSON.stringify(row))
      this.handleType = '编辑'
      this.editVisible = true
    },
    handleDel () {
      const ids = returnIds(this.tableSelectList).join()
      inspectionTemApi.deleteIdInspectionTem({ ids: ids }).then(res => {
        if (res.code === '0') {
          this.showMessage('删除成功！', 'success')
          this.initTable()
        } else {
          this.showMessage(res.message, 'error')
        }
      })
    },
    // 表格查询
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum
      })
      inspectionTemApi.getInspectionTem(params)
        .then((res) => {
          this.tableData = res.data.records
          this.tablePage.total = res.data.total
          this.loading = false
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    editSave () {
      this.$refs.editForm.validate((valid) => {
        // if (valid) {
        //   if (this.handleType === '新增') {
        //     delete this.editForm.id
        //     standardUpdate(this.editForm).then(res => {
        //       if (res.code === '0') {
        //         this.showMessage('新增成功！', 'success')
        //         this.editClose()
        //         this.initTable()
        //       } else {
        //         this.showMessage(res.message, 'error')
        //       }
        //     })
        //   } else {
        //     standardUpdate(this.editForm).then(res => {
        //       if (res.code === '0') {
        //         this.showMessage('修改成功！', 'success')
        //         this.editClose()
        //         this.initTable()
        //       } else {
        //         this.showMessage(res.message, 'error')
        //       }
        //     })
        //   }
        // }
      })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        id: '',
        name: '',
        status: '',
        type: '',
        timeDimension: ''
      }
      this.initTable()
    },
    resetQuery () {
      this.query = {
        code: '',
        name: '',
        status: '',
        type: '',
        timeDimension: ''
      }
    },
    detailClose () {
      this.detailVisible = false
    }
  }
}
</script>