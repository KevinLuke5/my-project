<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-form
        class="head-container"
        size="mini"
        :inline="true"
        label-position="left"
        label-width="85px"
        :model="query"
      >
        <j-form-item :label="urlDic[type] + '审厂单'">
          <j-input v-model="query.code" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="单据名称">
          <j-input v-model="query.name" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="审厂任务编码">
          <j-input v-model="query.taskCode" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="类型">
          <j-select v-model="query.equipType" clearable>
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="状态">
          <j-select v-model="query.checkStatus" clearable>
            <j-option
              v-for="(value, index) in statusDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="供应商">
          <j-input v-model="query.supplierName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="审厂目的">
          <j-select v-model="query.destination" clearable>
            <j-option
              v-for="item in aimList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="审厂类别">
          <j-select v-model="query.category" clearable>
            <j-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="属性">
          <j-select v-model="query.property" clearable>
            <j-option
              v-for="(value, index) in attrDic[type]"
              :key="index"
              :label="value"
              :value="index"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="专家">
          <j-input v-model="query.professor" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'factory_check_save'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'factory_check_delete'" @click="handleDel">
            删除
          </j-button>
          <j-button v-check="'verify-toCheck'" @click="handleCheck">
            审核
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
    <!-- 审核 -->
    <j-dialog
      title="审核"
      :visible.sync="checkVisible"
      width="400px"
      :before-close="checkClose"
    >
      <j-radio-group v-model="checkForm.checkStatus">
        <j-radio :label="3">
          同意
        </j-radio>
        <j-radio :label="2">
          不同意
        </j-radio>
      </j-radio-group>
      <j-form style="margin-top: 20px">
        <j-form-item>
          <j-input
            v-model="checkForm.checkAdvice"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
          />
        </j-form-item>
      </j-form>
      <span slot="footer" class="dialog-footer">
        <j-button @click="checkClose">取 消</j-button>
        <j-button type="primary" @click="checkSave">确 认</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import * as verifyApi from '@/api/verify/typeVerify'
import { getCodeList } from '@/views/common/dic'

export default {
  props: {
    type: {
      type: Number,
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      urlDic: {
        0: '品质',
        1: '采购',
        2: '研发'
      },
      query: {
        code: '',
        name: '',
        taskCode: '',
        equipType: '',
        supplierName: '',
        destination: '',
        category: '',
        property: '',
        checkStatus: '',
        professor: ''
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          label: '单号',
          render: (h, row) => (
            <j-link
              type="primary"
              onClick={() => {
                this.handleDetail(row)
              }}
            >
              {row.code}
            </j-link>
          )
        },
        {
          prop: 'name',
          label: '单据名称',
          width: '200px'
        },
        {
          prop: 'supplierName',
          label: '供应商名称',
          width: '180px'
        },
        {
          label: '审厂目的',
          render: (h, row) => (
            <span>
              {this.aimList.length
                ? (this.aimList.find((dic) => dic.lineNumber === row.destination) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          label: '审厂类别',
          render: (h, row) => (
            <span>
              {this.categoryList.length
                ? (this.categoryList.find((dic) => dic.lineNumber === row.category) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          label: '状态',
          render: (h, row) => <span>{this.statusDic[row.checkStatus]}</span>
        },
        {
          label: '类型',
          render: (h, row) => (
            <span>
              {this.typeList.length
                ? (this.typeList.find((dic) => dic.lineNumber === row.equipType) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          prop: 'productLineName',
          label: '产品线',
          width: '200px'
        },
        {
          prop: 'generalCategoryName',
          label: '大类',
          width: '200px'
        },
        {
          prop: 'subclassCategoryName',
          label: '小类',
          width: '200px'
        },
        {
          label: '属性',
          render: (h, row) => (
            <span>{this.attrDic[this.type][row.property]}</span>
          )
        },
        {
          prop: 'taskCode',
          label: '审厂任务编码',
          width: '100px'
        },
        {
          prop: 'professor',
          label: '专家',
          width: '350px'
        },
        {
          prop: 'checkUserName',
          label: '审核人'
        },
        {
          prop: 'checkAdvice',
          label: '审核意见',
          width: '280px'
        },
        {
          prop: 'totalScore',
          label: '得分'
        },
        {
          prop: 'reason',
          label: '审厂原因',
          width: '300px'
        },
        {
          prop: 'crtUserName',
          label: '发起人'
        },
        {
          prop: 'crtTime',
          label: '创建时间'
        },
        {
          label: '操作',
          fixed: 'right',
          render: (h, row) => (
            <j-button
              type="text"
              size="mini"
              vCheck={'factory_check_save'}
              disabled={row.checkStatus === 1}
              onClick={() => {
                this.handleEdit(row)
              }}
            >
              编辑
            </j-button>
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
      attrDic: {
        0: {
          // 品质
          0: 'QSA',
          1: 'QPA'
        },
        1: {
          // 采购
          2: '采购'
        },
        2: {
          // 研发
          3: '研发'
        }
      },
      statusDic: {
        0: '待打分',
        1: '待核审',
        2: '核审不通过',
        3: '已完成'
      },
      aimList: [],
      categoryList: [],
      typeList: [],
      checkVisible: false,
      checkForm: {
        checkStatus: '',
        checkAdvice: ''
      }
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
      getCodeList('code00022').then((list) => {
        this.aimList = list
      })
      getCodeList('code00023').then((list) => {
        this.categoryList = list
      })
      getCodeList('code00024').then((list) => {
        this.typeList = list
      })
    },
    handleAdd () {
      this.$router.push({
        path: '/verify/doc',
        query: { type: this.type, handle: 'add' }
      })
    },
    handleEdit (row) {
      // if (row.totalScore !== undefined && row.totalScore !== null && row.totalScore !== '') {
      //   this.showMessage('已提交单据不可编辑！')
      // } else {
      this.$router.push({
        path: '/verify/doc',
        query: { type: this.type, handle: 'edit', id: row.id }
      })
      // }
    },
    handleDetail (row) {
      this.$router.push({
        path: '/verify/doc',
        query: { type: this.type, handle: 'view', id: row.id }
      })
    },
    handleDel () {
      if (this.tableSelectList.length) {
        verifyApi
          .deleteFactoryCheck({ ids: this.tableSelectList.map((row) => row.id) })
          .then((res) => {
            if (res.code === '0') {
              this.showMessage('删除成功!', 'success')
              this.initTable()
            } else {
              this.showMessage(res.message)
            }
          })
      } else {
        this.showMessage('请先选择要删除的数据!')
      }
    },
    initTable (page) {
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum,
        type: this.type
      })
      verifyApi
        .getFactoryCheck(params)
        .then((res) => {
          if (res.code === '0' && res.data) {
            this.tableData = res.data.records
            this.tablePage.total = res.data.total
            this.loading = false
          }
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    handleCheck () {
      // this.checkVisible = true
      if (this.tableSelectList.length) {
        if (this.tableSelectList.some(item => item.checkStatus !== 1)) {
          this.showMessage('只有待审核状态下的单据才能审核!')
        } else {
          this.checkVisible = true
        }
      } else {
        this.showMessage('请先选择数据!')
      }
    },
    checkSave () {
      if (this.checkForm.checkStatus) {
        const params = this.tableSelectList.map((item) => ({
          id: item.id,
          taskId: item.taskId,
          property: item.property,
          totalScore: item.totalScore,
          checkStatus: this.checkForm.checkStatus,
          checkAdvice: this.checkForm.checkAdvice
        }))
        verifyApi.toCheck(params).then((res) => {
          if (res && res.code === '0') {
            this.showMessage('操作成功!', 'success')
            this.checkVisible = false
            this.initTable()
          } else {
            this.showMessage(res.message)
          }
        })
      } else {
        this.showMessage('请选择是否同意!')
      }
    },
    checkClose () {
      this.checkVisible = false
      this.checkForm = {
        id: '',
        status: '',
        checkAdvice: ''
      }
    },
    resetQuery () {
      this.query = {
        code: '',
        name: '',
        taskCode: '',
        supplierName: '',
        destination: '',
        category: '',
        property: '',
        checkStatus: '',
        professor: ''
      }
    },
    docClose () {
      this.editVisible = false
    }
  }
}
</script>