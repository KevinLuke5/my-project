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
        <j-form-item label="标准编码">
          <j-input v-model="query.standardCode" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="标准名称">
          <j-input v-model="query.standardName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="标准属性">
          <j-select v-model="query.standardAttributes" clearable>
            <j-option label="QSA" :value="0" />
            <j-option label="QPA" :value="1" />
            <j-option label="采购" :value="2" />
            <j-option label="研发" :value="3" />
          </j-select>
        </j-form-item>
        <!-- <j-form-item label="项目名称">
          <j-input v-model="query.projectName" @keyup.enter.native="initTable(1)" />
        </j-form-item> -->
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'standard-select'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'standard-insert'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'standard-delete'" @click="handleDel">
            删除
          </j-button>
          <!-- <j-button @click="handleImport">
            导入标准
          </j-button>
          <j-button @click="handleLoad">
            下载标准
          </j-button> -->
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

    <!-- 新增、编辑 -->
    <j-dialog
      :title="handleType"
      :visible.sync="editVisible"
      :modal="false"
      :before-close="editClose"
      width="400px"
    >
      <j-form
        ref="editForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="editForm"
        :rules="rules"
      >
        <!-- <j-form-item label="标准编码" prop="standardCode">
          <j-input v-model="editForm.standardCode" />
        </j-form-item> -->
        <j-form-item label="标准名称" prop="standardName">
          <j-input v-model="editForm.standardName" />
        </j-form-item>
        <j-form-item label="标准属性" prop="standardAttributes">
          <j-select v-model="editForm.standardAttributes" clearable>
            <j-option label="QSA" :value="0" />
            <j-option label="QPA" :value="1" />
            <j-option label="采购" :value="2" />
            <j-option label="研发" :value="3" />
          </j-select>
        </j-form-item>
        <!-- <j-form-item label="项目名称" prop="projectName">
          <j-input v-model="editForm.projectName" />
        </j-form-item> -->
        <j-form-item label="备注" prop="remark">
          <j-input v-model="editForm.remark" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="editSave">保存</j-button>
      </span>
    </j-dialog>
    <!-- 详情 -->
    <standardManageDetail
      ref="standardManageDetail"
      :detail-visible="detailVisible"
      :detail-form="detailForm"
      @detailClose="detailClose"
    />
  </div>
</template>

<script>
import { getStandardQuery, standardUpdate, standardDeleteId } from '@/api/verify/unionVerify'
import { returnIds } from '@/utils/index'
import standardManageDetail from './components/standardManageDetail'
export default {
  name: 'standardManage',
  components: { standardManageDetail },
  data () {
    return {
      query: {
        orgName: '',
        corporateName: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        id: '',
        standardCode: '',
        standardName: '',
        standardAttributes: '',
        projectName: '',
        remark: ''
      },
      rules: {
        standardCode: [
          { required: true, message: '请输入标准编码', trigger: 'change' }
        ],
        standardName: [
          { required: true, message: '请输入标准名称', trigger: 'change' }
        ],
        standardAttributes: [
          { required: true, message: '请选择标准属性', trigger: 'change' }
        ],
        projectName: [
          { required: true, message: '请输入项目名称', trigger: 'change' }
        ],
        remark: [
          { required: true, message: '请输入备注', trigger: 'change' }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'standardCode',
          label: '标准编码'
        },
        {
          prop: 'standardName',
          label: '标准名称'
        },
        {
          prop: 'standardAttributes',
          label: '标准属性',
          render: (h, row) => <span>{this.standardAttributesDic[row.standardAttributes]}</span>
        },
        // {
        //   prop: 'projectName',
        //   label: '项目名称'
        // },
        // {
        //   prop: 'projectScore',
        //   label: '项目分值'
        // },
        {
          prop: 'remark',
          label: '备注'
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
                vCheck={'standard-insert'}
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
              编辑
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'standard-detail-select'}
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
        standardCode: '',
        standardName: '',
        standardAttributes: '',
        projectName: '',
        remark: ''
      }
    }
  },
  created () {
    this.initTable()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    handleDetail (row) {
      this.detailForm = row
      this.detailVisible = true
      this.$refs.standardManageDetail.getDetailTable(row.id)
    },
    handleImport () {},
    handleLoad () {},
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
      const ids = returnIds(this.tableSelectList).join()
      standardDeleteId({ ids: ids }).then(res => {
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
      getStandardQuery(params)
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
        if (valid) {
          if (this.handleType === '新增') {
            delete this.editForm.id
            standardUpdate(this.editForm).then(res => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            standardUpdate(this.editForm).then(res => {
              if (res.code === '0') {
                this.showMessage('修改成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          }
        }
      })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        id: '',
        standardCode: '',
        standardName: '',
        standardAttributes: '',
        projectName: '',
        remark: ''
      }
    },
    resetQuery () {
      this.query = {
        id: '',
        standardCode: '',
        standardName: '',
        standardAttributes: '',
        projectName: '',
        remark: ''
      }
    },
    detailClose () {
      this.detailVisible = false
    }
  }
}
</script>
