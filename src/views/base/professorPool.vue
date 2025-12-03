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
        <j-form-item label="专家姓名">
          <j-input v-model="query.name" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="所属部门">
          <j-input v-model="query.department" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="所属小组">
          <j-select v-model="query.groupName" filterable clearable>
            <j-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.groupName"
              :value="item.groupName"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="所属专业">
          <j-select
            v-model="query.professionName"
            filterable
            clearable
            @focus="forGetProfessionList"
          >
            <j-option
              v-for="item in professionList"
              :key="item.id"
              :label="item.professionName"
              :value="item.professionName"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="状态">
          <j-select v-model="query.status" clearable>
            <j-option label="启用" value="0" />
            <j-option label="停用" value="1" />
          </j-select>
        </j-form-item>
        <j-form-item label="联系方式">
          <j-input v-model="query.phone" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <!-- <j-form-item label="状态">
          <j-select v-model="query.status" filterable clearable>
            <j-option
              v-for="item in statusDic"
              :key="item.label"
              :label="item.label"
              :value="item.val"
            />
          </j-select>
        </j-form-item> -->
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'resourceList'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'resourceSaveOrUpdate'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'resourceDelete'" @click="handleDel">
            删除
          </j-button>
          <!-- <j-button @click="handleImport">
            导入
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

      <!-- 导入 -->
      <!-- <j-dialog title="导入" :visible.sync="uploadVisible" width="400px">
        <j-upload
          ref="upload"
          :limit="10"
          :show-file-list="true"
          :auto-upload="false"
          :action="uploadUrl"
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
          <div slot="tip" class="j-upload__tip">
            只能上传Excel文件
          </div>
        </j-upload>
      </j-dialog> -->
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
        <j-form-item label="专家姓名" prop="name">
          <!-- <j-input v-model="editForm.name" /> -->
          <j-autocomplete
            v-model="editForm.name"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchName"
            :trigger-on-focus="false"
            placeholder="输入编号或名称搜索"
            @select="selectName"
          >
            <template slot-scope="{ item }">
              <div class="name">
                {{ item.name }}
              </div>
              <!-- <span class="code">{{ item.userId }}</span> -->
            </template>
          </j-autocomplete>
        </j-form-item>
        <!-- <j-form-item label="供应商" prop="suppliername">
          <j-autocomplete
            v-model="editForm.suppliername"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchSupplier"
            :trigger-on-focus="true"
            placeholder="输入编号或名称搜索"
            @select="selectSupplier($event, editForm)"
          >
            <template slot-scope="{ item }">
              <div class="name">
                {{ item.name }}
              </div>
              <span class="code">{{ item.code }}</span>
            </template>
          </j-autocomplete>
        </j-form-item>
        <j-form-item label="所属部门">
          <j-input v-model="editForm.department" />
        </j-form-item> -->
        <j-form-item label="所属小组" prop="groupName">
          <j-select v-model="editForm.groupName" filterable clearable>
            <j-option
              v-for="item in groupList"
              :key="item.id"
              :label="item.groupName"
              :value="item.groupName"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="所属专业" prop="professionNameList">
          <j-select
            v-model="editForm.professionNameList"
            value-key="professionName"
            filterable
            clearable
            multiple
            @focus="forGetProfessionList"
          >
            <j-option
              v-for="item in professionList"
              :key="item.professionName"
              :label="item.professionName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <!-- <j-form-item label="状态">
          <j-input v-model="editForm.status" />
        </j-form-item>
        <j-form-item label="联系方式">
          <j-input v-model="editForm.phone" />
        </j-form-item> -->
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="editSave">保存</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import { getQuery, update, deleteId, getGroupList, getProfessionList, getExpertList  } from '@/api/base/professorPool'
import { returnIds } from '@/utils/index'
import { getToken } from '@/utils/auth'

export default {
  name: 'professorPool',
  components: {  },
  data () {
    return {
      query: {
        name: '',
        department: '',
        groupName: '',
        professionName: '',
        status: '',
        phone: ''
      },
      handleType: '新增',
      editVisible: false,
      // uploadUrl: importUrl,
      editForm: {
        id: '',
        name: '',
        department: '',
        groupName: '',
        status: '',
        userId: '',
        phone: '',
        professionNameList: []
      },
      supplierList: [],
      uploadVisible: false,
      rules: {
        name: [
          { required: true, message: '请选择专家姓名', trigger: 'change' }
        ],
        groupName: [
          { required: true, message: '请选择所属小组', trigger: 'change' }
        ],
        professionNameList: [
          { required: true, message: '请选择所属专业', trigger: 'change' }
        ]
      },
      checkVisible: false,
      checkForm: {
        result: 1,
        note: ''
      },
      curRow: {},
      detailVisible: false,
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'name',
          label: '专家姓名'
        },
        {
          prop: 'department',
          label: '所属部门 '
        },
        {
          prop: 'groupName',
          label: '所属小组 '
        },
        {
          prop: 'professionNames',
          label: '所属专业 '
        },
        {
          prop: 'status',
          label: '状态 ',
          render: (h, row) => <span>{this.statusDic[row.status]}</span>
        },
        {
          prop: 'phone',
          label: '联系方式 '
        },
        {
          prop: 'status',
          label: '操作',
          render: (h, row) => (
            <j-button
              type="text"
              size="mini"
              vCheck={'resourceSaveOrUpdate'}
              onClick={() => {
                this.handleEdit(row)
              }}
            >
              编辑
            </j-button>
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
        index: false,
        loading: false,
        initTable: false
      },
      groupList: [],
      professionList: [],
      lineList: [],
      bigTypeList: [],
      smallTypeList: [],
      statusDic: {
        running: '正常',
        locking: '锁定',
        stop: '注销'
      }
    }
  },
  created () {
    this.initTable()
    this.forGetGroupList()

  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    forGetGroupList () {
      getGroupList({}).then(res => {
        if (res.code === '0') {
          this.groupList = res.data
        }
      })
    },
    forGetProfessionList () {
      getProfessionList({ groupName: this.editForm.groupName }).then(res => {
        if (res.code === '0') {
          this.professionList = res.data.map(item => {
            return { professionName: item.professionName }
          })
        }
      })
    },

    searchName (keyword, cb) {
      getExpertList({ name: this.editForm.name, type: 0, page: 1, size: 10 })
        .then((res) => {
          if (res.code === '0') {
            this.supplierList = res.data.records
          }
        })
        .finally(() => {
          cb(this.supplierList)
        })
    },
    selectName (item) {
      // this.editForm.supplierid = item.id
      this.editForm.name = item.name
      this.editForm.department = item.dept
      this.editForm.status = item.status
      this.editForm.userId = item.userId
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
      this.forGetGroupList()
    },
    handleEdit (row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      const professionData = row.professionNameList.map((item) => ({
        professionName: item.professionName
      }))
      this.$set(this.editForm, 'professionNameList', professionData)
      this.handleType = '编辑'
      this.editVisible = true
    },
    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.handleType === '新增') {
            this.editForm.phone = this.supplierList[0].phoneNumber
            delete this.editForm.id
            this.editForm.professionNameList = this.editForm.professionNameList.map(item => {
              return { professionName: item.professionName }
            })
            update(this.editForm).then(res => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            getExpertList({ name: this.editForm.name, type: 0, page: 1, size: 10 })
              .then((res) => {
                if (res.code === '0') {
                  if (res.data.records[0] && !!res.data.records[0].phoneNumber) {
                    this.editForm.phone = res.data.records[0].phoneNumber
                  }
                  update(this.editForm).then(res => {
                    if (res.code === '0') {
                      this.showMessage('修改成功！', 'success')
                      this.editClose()
                      this.initTable()
                    } else {
                      this.showMessage(res.message, 'error')
                    }
                  })
                }
              })
          }
        }
      })
    },
    handleDel () {
      const ids = returnIds(this.tableSelectList).join()
      deleteId({ ids: ids }).then(res => {
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
      getQuery(params)
        .then((res) => {
          this.tableData = res.data.records
          this.tablePage.total = res.data.total
          this.loading = false
        })
        .finally(() => {
          this.tableOptions.loading = false
        })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    handleImport () {
      // this.uploadVisible = true
    },

    submitUpload () {
      this.$refs.upload.headers['Authorization'] = getToken()
      this.$refs.upload.submit()
      this.uploadVisible = false
    },

    uploadSuccess (res) {
      if (res.code === '0') {
        this.$message({
          message: '导入成功',
          type: 'success'
        })
        this.init()
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
        id: '',
        name: '',
        department: '',
        groupName: '',
        status: '',
        userId: '',
        professionNameList: []
      }
    },
    resetQuery () {
      this.query = {
        name: '',
        department: '',
        groupName: '',
        professionName: '',
        status: '',
        phone: ''
      }
    }
  }
}
</script>
