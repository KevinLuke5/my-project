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
        <j-form-item label="小类编码">
          <j-input v-model="query.smallTypeCode" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="小类名称">
          <j-input v-model="query.smallTypeName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="大类编码">
          <j-input v-model="query.bigTypeCode" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="大类名称">
          <j-input v-model="query.bigTypeName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'small-class-select'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'small-class-insert'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'small-class-delete'" @click="handleDel">
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
        <j-form-item label="小类名称" prop="smallTypeName">
          <j-input v-model="editForm.smallTypeName" />
        </j-form-item>
        <j-form-item label="大类名称" prop="bigTypeName">
          <!-- <j-input v-model="editForm.bigTypeName" /> -->
          <j-autocomplete
            v-model="editForm.bigTypeName"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchLittle"
            :trigger-on-focus="true"
            placeholder="输入编号或名称搜索"
            @select="selectLittle"
          >
            <template slot-scope="{ item }">
              <div class="bigTypeName">
                {{ item.bigTypeName }}
              </div>
              <span class="bigTypeCode">{{ item.bigTypeCode }}</span>
            </template>
          </j-autocomplete>
        </j-form-item>
        <j-form-item label="是否共用" prop="share">
          <j-select v-model="editForm.share">
            <j-option label="是" :value="0" />
            <j-option label="否" :value="1" />
          </j-select>
        </j-form-item>
        <j-form-item label="关键件标识" prop="keyPiece">
          <j-select v-model="editForm.keyPiece">
            <j-option label="否" :value="0" />
            <j-option label="是" :value="1" />
          </j-select>
        </j-form-item>
        <j-form-item label="特殊物料标识" prop="specialMaterial">
          <j-select v-model="editForm.specialMaterial">
            <j-option label="否" :value="0" />
            <j-option label="是" :value="1" />
          </j-select>
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="editSave">保存</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import { getQuery, update, deleteId, bigSearch } from '@/api/base/littleManage'
import { returnIds } from '@/utils/index'

export default {
  name: 'LittleManage',
  components: {},
  data () {
    return {
      query: {
        bigTypeCode: '',
        bigTypeName: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        id: '',
        bigTypeId: '',
        bigTypeCode: '',
        bigTypeName: ''
      },
      rules: {
        smallTypeName: [
          { required: true, message: '请输入小类名称', trigger: 'change' }
        ],
        bigTypeName: [
          { required: true, message: '请输入大类名称', trigger: 'change' }
        ],
        share: [
          { required: true, message: '请选择是否共用', trigger: 'change' }
        ],
        keyPiece: [
          { required: true, message: '请选择关键件标识', trigger: 'change' }
        ],
        specialMaterial: [
          { required: true, message: '请选择特殊物料标识', trigger: 'change' }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'smallTypeCode',
          label: '小类编码'
        },
        {
          prop: 'smallTypeName',
          label: '小类名称'
        },
        {
          prop: 'bigTypeCode',
          label: '大类编码'
        },
        {
          prop: 'bigTypeName',
          label: '大类名称'
        },
        {
          prop: 'share',
          label: '是否共用',
          render: (h, row) => <span>{this.shareDic[row.share]}</span>
        },
        {
          prop: 'syncFlag',
          label: '来源标识',
          render: (h, row) => <span>{this.syncFlagDic[row.syncFlag]}</span>
        },
        {
          prop: 'keyPiece',
          label: '关键件标识',
          render: (h, row) => <span>{this.keyPieceDic[row.keyPiece]}</span>
        },
        {
          prop: 'specialMaterial',
          label: '特殊物料标识',
          render: (h, row) => <span>{this.specialMaterialDic[row.specialMaterial]}</span>
        },
        {
          prop: 'updUserName',
          label: '更新人'
        },
        {
          prop: 'updTime',
          label: '更新时间',
          width: '150px'
        },
        {
          label: '操作',
          render: (h, row) => (
            <j-button
              type="text"
              size="mini"
              vCheck={'small-class-insert'}
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
      shareDic: {
        0: '是',
        1: '否'
      },
      keyPieceDic: {
        0: '否',
        1: '是'
      },
      specialMaterialDic: {
        0: '否',
        1: '是'
      },
      syncFlagDic: {
        0: 'ERP同步',
        1: '页面新增'
      },
      littleList: []
    }
  },
  created () {
    this.initTable()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    searchLittle (keyWords, cb) {
      bigSearch({ keyWords })
        .then((res) => {
          if (res.code === '0') {
            this.littleList = res.data
            // 前端控制大类名称模糊搜索
            const arrList = []
            for (let i = 0; i < this.littleList.length; i++) {
              if (this.littleList[i].bigTypeName.search(keyWords) !== -1) {
                arrList.push(this.littleList[i])
              }
            }
            this.littleList = arrList
          }
        })
        .finally(() => {
          cb(this.littleList)
        })
    },
    selectLittle (item) {
      this.editForm.bigTypeId = item.id
      this.editForm.bigTypeCode = item.bigTypeCode
      this.editForm.bigTypeName = item.bigTypeName
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.handleType = '编辑'
      this.editForm.id = row.id
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editVisible = true
    },
    handleDel () {
      const ids = returnIds(this.tableSelectList).join()
      deleteId({ ids: ids }).then((res) => {
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

    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          if (this.handleType === '新增') {
            delete this.editForm.id
            update(this.editForm).then((res) => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.editClose()
                this.initTable()
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            update(this.editForm).then((res) => {
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
        bigTypeId: '',
        bigTypeCode: '',
        bigTypeName: ''
      }
    },
    resetQuery () {
      this.query = {
        bigTypeCode: '',
        bigTypeName: ''
      }
    }
  }
}
</script>
