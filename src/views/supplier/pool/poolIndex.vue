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
        <j-form-item label="供应商编码">
          <j-input v-model="query.code" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="供应商名称">
          <j-input v-model="query.name" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="状态">
          <j-select v-model="query.status" clearable>
            <j-option
              v-for="(value, index) in statusDic"
              :key="index"
              :label="value"
              :value="index"
            />
            <!-- <j-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            /> -->
          </j-select>
        </j-form-item>
        <j-form-item label="重要性">
          <j-select v-model="query.significance" clearable>
            <j-option
              v-for="(value, index) in signDic"
              :key="index"
              :label="value"
              :value="index"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="产品线">
          <j-select v-model="query.productLineName" filterable clearable>
            <j-option
              v-for="item in lineList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="大类">
          <j-select
            v-model="query.generalCategoryName"
            filterable
            clearable
            @change="getSmallType"
          >
            <j-option
              v-for="item in bigTypeList"
              :key="item.id"
              :label="item.bigTypeName"
              :value="item.bigTypeName"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="小类">
          <j-select v-model="query.subclassCategoryName" filterable clearable>
            <j-option
              v-for="item in smallTypeList"
              :key="item.id"
              :label="item.smallTypeName"
              :value="item.smallTypeName"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="专业性">
          <j-select v-model="query.professional" clearable>
            <j-option
              v-for="(value, index) in professDic"
              :key="index"
              :label="value"
              :value="index"
            />
          </j-select>
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'resource_pooling_get'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'resource_pooling_post'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'resource_pooling_delete'" @click="handleDel">
            删除
          </j-button>
          <j-button v-check="'resource_pooling_trial'" @click="firstVerify">
            初审
          </j-button>
          <!-- <j-button @click="handleImport">
            导入
          </j-button> -->
          <j-button @click="handleExport">
            导出
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
    <!-- 初审 -->
    <j-dialog
      title="初审"
      :visible.sync="checkVisible"
      width="400px"
      :before-close="checkClose"
    >
      <j-radio-group v-model="checkForm.status">
        <j-radio :label="3">
          通过
        </j-radio>
        <j-radio :label="2">
          不通过
        </j-radio>
      </j-radio-group>
      <j-input
        v-model="checkForm.advice"
        type="textarea"
        style="margin-top: 20px"
        :rows="3"
        placeholder="请输入内容"
      />
      <span slot="footer" class="dialog-footer">
        <j-button @click="checkClose">取 消</j-button>
        <j-button type="primary" @click="checkSave">确 定</j-button>
      </span>
    </j-dialog>
    <!-- 新增、编辑 -->
    <j-dialog
      :title="handleType"
      :visible.sync="editVisible"
      :modal="false"
      :close-on-click-modal="false"
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
        <j-form-item label="供应商名称" prop="name">
          <j-input v-model="editForm.name" />
        </j-form-item>
        <j-form-item label="供应商编码">
          <j-input v-model="editForm.code" placeholder="自动生成" disabled />
        </j-form-item>
        <j-form-item label="联系人" prop="linkPerson">
          <j-input v-model="editForm.linkPerson" />
        </j-form-item>
        <j-form-item label="电话" prop="linkPhone">
          <j-input v-model="editForm.linkPhone" />
        </j-form-item>
        <!-- <j-form-item label="状态" prop="status">
          <j-select v-model="editForm.status">
            <j-option
              v-for="(value, index) in statusDic"
              :key="index"
              :label="value"
              :value="index"
            />
            <j-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item> -->
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="handleSave">保存</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import * as poolApi from '@/api/supplier/pool'
// import { getCodeList } from '@/views/common/dic'
import { handleTabs } from '../tabAuth'

export default {
  name: 'PoolIndex',
  data () {
    return {
      query: {
        code: '',
        name: '',
        status: '',
        significance: '',
        productLineName: '',
        generalCategoryName: '',
        subclassCategoryName: '',
        professional: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        code: '',
        name: '',
        linkPerson: '',
        linkPhone: '',
        status: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ],
        lineList: [
          { required: true, message: '请选择产品线', trigger: 'blur' }
        ],
        bigTypeList: [
          { required: true, message: '请选择大类', trigger: 'blur' }
        ],
        smallTypeList: [
          { required: true, message: '请选择小类', trigger: 'blur' }
        ],
        linkPerson: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        linkPhone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }]
      },
      checkVisible: false,
      checkForm: {
        id: '',
        status: '',
        advice: ''
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'code',
          label: '供应商编码'
        },
        {
          prop: 'name',
          label: '供应商名称'
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
          label: '状态',
          render: (h, row) => <span>{this.statusDic[row.status]}</span>
          // render: (h, row) => (
          //   <span>
          //     {this.statusList.length
          //       ? (this.statusList.find((dic) => dic.lineNumber === row.status) || { name: '' }).name
          //       : ''}
          //   </span>
          // )
        },
        {
          label: '重要性维度',
          render: (h, row) => <span>{this.signDic[row.significance]}</span>
        },
        {
          label: '专业性维度',
          render: (h, row) => <span>{this.professDic[row.significance]}</span>
        },
        {
          label: '精益维度',
          render: (h, row) => <span>{this.leanDic[row.lean]}</span>
        },
        {
          label: '质量维度',
          render: (h, row) => <span>{this.qualityDic[row.quality]}</span>
        },
        {
          prop: 'linkPerson',
          label: '联系人'
        },
        {
          prop: 'linkPhone',
          label: '电话'
        },
        {
          prop: 'advice',
          label: '初审意见'
        },
        {
          label: '操作',
          fixed: 'right',
          render: (h, row) => (
            <div class="operate-btn-group">
              <j-button
                type="text"
                size="mini"
                vCheck={'resource_pooling_post'}
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
                编辑
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'resource_pooling_submit'}
                disabled={row.status !== 0 && row.status !== 2}
                onClick={() => {
                  this.handleSubmit(row)
                }}
              >
                提交
              </j-button>
              <j-button
                type="text"
                size="mini"
                onClick={() => {
                  this.handleDetail(row)
                }}
              >
                查看详情
              </j-button>
            </div>
          )
        }
        // {
        //   prop: 'status',
        //   label: '操作',
        //   render: (h, row) => (
        //     <j-button type="text" vCheck={'transfer-update'}>
        //       修改
        //     </j-button>
        //   )
        // },
      ],
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
      statusDic: {
        0: '新注册',
        1: '待核审',
        2: '核审不通过',
        3: '潜在',
        4: '预备',
        5: '合格',
        6: '冻结',
        7: '淘汰'
      },
      signDic: {
        1: '战略级供应商',
        2: '优选级供应商',
        3: '合格供应商',
        4: '拟淘汰供应商'
      },
      professDic: {
        1: '专业供应商',
        2: '综合供应商',
        3: '超级供应商'
      },
      leanDic: {
        1: '1星',
        2: '2星',
        3: '3星',
        4: '4星',
        5: '5星'
      },
      qualityDic: {
        1: '1级',
        2: '2级',
        3: '3级',
        4: '4级',
        5: '5级'
      },
      lineList: [],
      bigTypeList: [],
      smallTypeList: [],
      statusList: []
    }
  },
  created () {
    this.initTable(1)
    this.getSelectData()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    getSelectData () {
      poolApi.getPdtLineList().then((res) => {
        if (res.code === '0' && res.data) this.lineList = res.data.records
      })
      poolApi.getBigCategoryList().then((res) => {
        if (res.code === '0' && res.data) this.bigTypeList = res.data
      })
      // getCodeList('code00001').then((list) => {
      //   this.statusList = list
      // })
    },
    getSmallType () {
      poolApi
        .getSmallCategoryList({
          page: 1,
          size: 500,
          bigTypeName: this.query.generalCategoryName
        })
        .then((res) => {
          if (res.code === '0' && res.data)
            this.smallTypeList = res.data.records
        })
    },
    firstVerify () {
      if (this.tableSelectList.length) {
        if (
          this.tableSelectList.some(
            (item) => !(item.status === 1 || item.status === 2)
          )
        ) {
          this.showMessage('存在所选供应商不能审核!')
        } else {
          this.checkVisible = true
        }
      } else {
        this.showMessage('请先选择要审核的供应商!')
      }
    },
    checkSave () {
      if (this.checkForm.status) {
        const params = this.tableSelectList.map((item) => ({
          id: item.id,
          status: this.checkForm.status,
          advice: this.checkForm.advice
        }))
        poolApi.firstCheck(params).then((res) => {
          if (res.code === '0') {
            this.showMessage('操作成功!', 'success')
            this.checkVisible = false
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
      } else {
        this.showMessage('请选择是否通过!')
      }
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.editForm = row
      this.handleType = '编辑'
      this.editVisible = true
    },
    handleImport () {},
    handleExport () {
      poolApi.exportSupplier(this.query)
    },
    handleDel () {
      if (this.tableSelectList.length) {
        if (this.tableSelectList.some((item) => item.status !== 0)) {
          this.showMessage('只能删除新注册的供应商!')
        } else {
          poolApi
            .deleteSrmSupplier({
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
        }
      } else {
        this.showMessage('请先选择要删除的数据!')
      }
    },
    handleDetail (row) {
      handleTabs(false).then(() => {
        this.$router.push({
          path: '/supplier/pool/poolDetail',
          query: { supplierId: row.id, name: row.name, code: row.code }
        })
      })
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum
      })
      poolApi
        .getSrmSupplier(params)
        .then((res) => {
          if (res && res.code === '0') {
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
          }
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    resetQuery () {
      this.query = {
        code: '',
        name: '',
        status: '',
        significance: '',
        productLineName: '',
        generalCategoryName: '',
        subclassCategoryName: '',
        professional: ''
      }
    },
    handleSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          poolApi
            .updateSrmSupplier(
              Object.assign({}, this.editForm, {
                flag: this.handleType === '编辑' ? 1 : 0
              })
            )
            .then((res) => {
              if (res.code === '0') {
                this.editClose()
                this.showMessage('保存成功!', 'success')
              } else {
                this.showMessage(res.message)
              }
            })
        } else {
          return false
        }
      })
    },
    handleSubmit (row) {
      poolApi
        .submitSrmSupplier({
          id: row.id,
          status: 1 // 提交变成待审核状态
        })
        .then((res) => {
          if (res.code === '0') {
            this.showMessage('操作成功!', 'success')
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
    },
    checkClose () {
      this.checkVisible = false
      this.checkForm = {
        id: '',
        status: '',
        advice: ''
      }
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        code: '',
        name: '',
        linkPerson: '',
        linkPhone: '',
        status: ''
      }
    }
  }
}
</script>