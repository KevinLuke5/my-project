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
        <j-form-item label="版本">
          <j-input v-model="query.versionName" placeholder="版本编码/名称模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <j-form-item label="考核周期" prop="timeRange">
          <j-date-picker
            v-model="query.timeRange"
            type="datetimerange"
            range-separator="~"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleRangeChange"
          />
        </j-form-item>
        <div style="margin-bottom: 5px">
          <j-button
            v-check="'kpi-colorCard-insertOrUpdateSrmAccessTricolorCard'"
            type="primary"
            @click="handleAdd"
          >
            新增
          </j-button>
          <div class="right-btn">
            <j-button
              v-check="'kpi-colorCard-getSrmAccessTricolorCardList'"
              type="primary"
              @click="initTable(1)"
            >
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button
              v-check="'kpi-colorCard-deleteSrmAccessTricolorCard'"
              @click="handleDel"
            >
              删除
            </j-button>
          </div>
        </div>
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
      class="dialog-form"
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
        label-width="105px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="版本名称" prop="versionName">
          <j-input v-model="editForm.versionName" />
        </j-form-item>
        <j-form-item label="红牌边界值" prop="redThreshold" required>
          <j-input v-model="editForm.redThreshold" />
        </j-form-item>
        <j-form-item label="绿牌边界值" prop="greenThreshold" required>
          <j-input v-model="editForm.greenThreshold" />
        </j-form-item>
        <j-form-item label="生效时间" prop="effectiveTime">
          <j-date-picker
            v-model="editForm.effectiveTime"
            type="datetime"
            range-separator="~"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </j-form-item>
        <j-form-item label="失效时间" prop="expirationTime">
          <j-date-picker
            v-model="editForm.expirationTime"
            type="datetime"
            range-separator="~"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </j-form-item>
        <j-form-item label="备注">
          <j-input v-model="editForm.remake" />
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
import {
  getSrmAccessTricolorCardList,
  insertOrUpdateSrmAccessTricolorCard,
  // getSrmAccessTricolorCardDetail,
  deleteSrmAccessTricolorCard
} from '@/api/kpi/base'
import { returnIds } from '@/utils/index'

export default {
  name: 'TemplateManage',
  data () {
    const validateRed = (rule, value, callback) => {
      if (value) {
        if (!/^(0|[1-9]\d*)$/.test(value)) {
          callback(new Error('数字必须为0或正整数'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入红牌边界值'))
      }
    }
    const validateGreen = (rule, value, callback) => {
      if (value) {
        if (!/^(0|[1-9]\d*)$/.test(value)) {
          callback(new Error('数字必须为0或正整数'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入绿牌边界值'))
      }
    }
    return {
      loading: false,
      query: {
        versionName: '',
        timeRange: [],
        startTime: '',
        endTime: ''
      },
      handleType: '新增',
      editVisible: false,
      editForm: {
        versionName: '',
        redThreshold: '',
        greenThreshold: '',
        effectiveTime: '',
        expirationTime: '',
        remake: ''
      },
      rules: {
        versionName: [
          { required: true, message: '请输入版本名称', trigger: 'change' }
        ],
        redThreshold: [
          { validator: validateRed, trigger: 'change' }
        ],
        greenThreshold: [
          { validator: validateGreen, trigger: 'change' }
        ],
        effectiveTime: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
        expirationTime: [{ required: true, message: '请选择失效日期', trigger: 'change' }]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'versionCode',
          label: '版本号'
        },
        {
          prop: 'versionName',
          label: '版本名称'
        },
        {
          prop: 'redThreshold',
          label: '红牌边界值'
        },
        {
          prop: 'greenThreshold',
          label: '绿牌边界值'
        },
        {
          prop: 'effectiveTime',
          label: '生效时间'
        },
        {
          prop: 'expirationTime',
          label: '失效时间'
        },
        {
          prop: 'remake',
          label: '备注'
        },
        {
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vCheck={'kpi-colorCard-insertOrUpdateSrmAccessTricolorCard'}
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
                编辑
              </j-button>
            </div>
          )
        },
        {
          prop: 'updTime',
          label: '更新时间'
        },
        {
          prop: 'updUserName',
          label: '更新人'
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
      importVisible: false,
      importUrl: ''
    }
  },
  watch: {
    timeDimensionList () {
      this.keyValue++ // 只要监听到数据源发生变化 ，改变keyValue的值，达到重新渲染的效果
    }
  },
  created () {
    this.initTable()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    handleRangeChange (timeRange) {
      if (timeRange && timeRange.length) {
        this.query.startTime = timeRange[0]
        this.query.endTime = timeRange[1]
      } else {
        this.query.startTime = ''
        this.query.endTime = ''
      }
    },
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
      if (this.tableSelectList.length) {
        const ids = returnIds(this.tableSelectList).join()
        deleteSrmAccessTricolorCard({ ids }).then((res) => {
          if (res.code === '0') {
            this.showMessage('删除成功！', 'success')
            this.initTable()
          } else {
            this.showMessage(res.message, 'error')
          }
        })
      } else {
        this.showMessage('请先选择数据！')
      }
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
      getSrmAccessTricolorCardList(params)
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
    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          insertOrUpdateSrmAccessTricolorCard(this.editForm).then((res) => {
            if (res && res.code === '0') {
              this.showMessage('操作成功！', 'success')
              this.editClose()
              this.initTable()
            } else {
              this.showMessage(res.message, 'error')
            }
          })
        }
      })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        versionName: '',
        redThreshold: '',
        greenThreshold: '',
        effectiveTime: '',
        expirationTime: '',
        remake: ''
      }
    },
    resetQuery () {
      this.query = {
        versionName: '',
        timeRange: [],
        startTime: '',
        endTime: ''
      }
    }
  }
}
</script>