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
        <j-form-item label="代码">
          <j-input v-model="query.code" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="代码名称">
          <j-input v-model="query.codeName" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="状态">
          <j-select v-model="query.status" clearable>
            <j-option label="启用" value="0" />
            <j-option label="停用" value="1" />
          </j-select>
        </j-form-item>
        <j-form-item class="btn-group" style="margin-bottom: 0">
          <j-button v-check="'codeSelect'" type="primary" @click="initTable(1)">
            查询
          </j-button>
          <j-button @click="resetQuery">
            重置
          </j-button>
          <j-button v-check="'codeInsert'" @click="handleAdd">
            新增
          </j-button>
          <j-button v-check="'codeDelete'" @click="handleDel">
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
        <!-- <j-form-item label="代码" prop="code">
          <j-input v-model="editForm.code" />
        </j-form-item> -->
        <j-form-item label="代码名称" prop="codeName">
          <j-input v-model="editForm.codeName" />
        </j-form-item>
        <!-- <j-form-item label="状态" prop="status">
          <j-select v-model="editForm.status">
            <j-option label="启用" :value="0" />
            <j-option label="停用" :value="1" />
          </j-select>
        </j-form-item> -->
        <j-form-item label="说明" prop="remark">
          <j-input v-model="editForm.remark" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="editClose">取消</j-button>
        <j-button type="primary" @click="editSave">保存</j-button>
      </span>
    </j-dialog>
    <!-- 详情 -->
    <codeManageDetail
      ref="codeManageDetail"
      :detail-visible="detailVisible"
      :detail-form="detailForm"
      @detailClose="detailClose"
    />
  </div>
</template>

<script>
import { getQuery, update, deleteId } from '@/api/base/codeManage'
import { returnIds } from '@/utils/index'
import codeManageDetail from '@/views/base/components/codeManageDetail'

export default {
  name: 'codeManage',
  components: { codeManageDetail },
  props: {},
  data () {
    return {
      value: true,
      query: {
        code: '',
        codeName: '',
        status: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        id: '',
        codeName: '',
        remark: ''
      },
      rules: {
        code: [{ required: true, message: '请输入代码', trigger: 'change' }],
        codeName: [
          { required: true, message: '请输入代码名称', trigger: 'change' }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'code',
          label: '代码'
        },
        {
          prop: 'codeName',
          label: '代码名称 '
        },
        {
          label: '状态',
          render: (h, row) => (
            <j-switch
              value={row.status}
              active-value={0}
              inactive-value={1}
              onChange={() => {
                this.handleChange(row)
              }}
            ></j-switch>
          )
        },
        {
          prop: 'remark',
          label: '说明 '
        },
        {
          prop: 'updUserName',
          label: '更新人 '
        },
        {
          prop: 'updTime',
          label: '更新时间 '
        },
        {
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vCheck={'codeInsert'}
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
                编辑
              </j-button>
              <j-button
                type="text"
                size="mini"
                vCheck={'getCodeDetailList'}
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
        codeName: '',
        status: ''
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
      this.detailForm.code = row.code
      this.detailForm.codeName = row.codeName
      !row.status
        ? (this.detailForm.status = '启用')
        : (this.detailForm.status = '停用')
      this.$refs.codeManageDetail.getDetailTable(row.id)
      this.detailVisible = true
    },
    handleChange (row) {
      if (row.status === 0) {
        update({ id: row.id, status: 1 }).then((res) => {
          if (res.code === '0') {
            this.showMessage('更新成功！', 'success')
            this.initTable()
          } else {
            this.showMessage(res.message, 'error')
          }
        })
      } else {
        update({ id: row.id, status: 0 }).then((res) => {
          if (res.code === '0') {
            this.showMessage('更新成功！', 'success')
            this.initTable()
          } else {
            this.showMessage(res.message, 'error')
          }
        })
      }
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.handleType = '编辑'
      this.editForm = JSON.parse(JSON.stringify(row))
      this.editVisible = true
    },
    handleDel () {
      this.tableSelectList.every((item) => {
        if (item.status === 1) {
          const ids = returnIds(this.tableSelectList).join()
          deleteId({ ids: ids }).then((res) => {
            if (res.code === '0') {
              this.showMessage('删除成功！', 'success')
              this.initTable()
            } else {
              this.showMessage(res.message, 'error')
            }
          })
        } else {
          this.showMessage('请确认状态再删除！', 'error')
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
        codeName: '',
        remark: ''
      }
    },
    resetQuery () {
      this.query = {
        code: '',
        codeName: '',
        status: ''
      }
    },
    detailClose () {
      this.detailVisible = false
    }
  }
}
</script>
