<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'relation_update'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'relation_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'relation_save'" type="primary" @click="handleSubmit">
        保存
      </j-button> -->
    </div>
    <j-table-with-page
      :columns="tableColumns"
      :data-source="tableData"
      :options="tableOptions"
      :fetch="initTable"
      :pagination="tablePage"
      :height="height"
      @selection-change="selectTable"
    />
    <!-- 新增、编辑 -->
    <j-dialog
      :title="handleType"
      :visible.sync="editVisible"
      :modal="false"
      :before-close="editClose"
      width="500px"
    >
      <j-form
        ref="editForm"
        size="mini"
        label-position="left"
        label-width="125px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="干系人分类" prop="personType">
          <!-- <j-select v-model="editForm.personType">
            <j-option
              v-for="(value, index) in typeDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            />
          </j-select> -->
          <j-select
            v-model="editForm.personType"
            filterable
            allow-create
            default-first-option
          >
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="关系" prop="relation">
          <j-input v-model="editForm.relation" />
        </j-form-item>
        <j-form-item label="部门" prop="department">
          <j-input v-model="editForm.department" />
        </j-form-item>
        <j-form-item label="职务" prop="duty">
          <j-input v-model="editForm.duty" />
        </j-form-item>
        <j-form-item label="姓名" prop="userName">
          <j-input v-model="editForm.userName" />
        </j-form-item>
        <j-form-item label="联系电话" prop="telephone">
          <j-input v-model="editForm.telephone" />
        </j-form-item>
        <j-form-item label="身份证号" prop="cardId">
          <j-input v-model="editForm.cardId" />
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
import * as poolApi from '@/api/supplier/pool'
import { getCodeList } from '@/views/common/dic'
const urlType = 'relation'

export default {
  data () {
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        personType: '',
        relation: '',
        department: '',
        duty: '',
        userName: '',
        telephone: '',
        cardId: ''
      },
      rules: {
        personType: [
          { required: true, message: '请选择干系人分类', trigger: 'blur' }
        ],
        relation: [
          { required: true, message: '请输入关系描述', trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入部门', trigger: 'blur' }
        ],
        duty: [{ required: true, message: '请输入职务', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        telephone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^((0\d{2,3}-\d{7,8})|(1[3-9]\d{9}))$/, message: '请输入合法手机号/电话号', trigger: 'blur' }
        ],
        cardId: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          {
            pattern:
              /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
            message: '请输入合法身份证号',
            trigger: 'blur'
          }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          label: '干系人分类',
          // render: (h, row) => <span>{this.typeDic[row.personType]}</span>
          render: (h, row) => (
            <span>
              {this.typeList.length
                ? (this.typeList.find((dic) => dic.lineNumber === row.personType) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          prop: 'relation',
          label: '关系'
        },
        {
          prop: 'department',
          label: '部门'
        },
        {
          prop: 'duty',
          label: '职务'
        },
        {
          prop: 'userName',
          label: '姓名'
        },
        {
          prop: 'telephone',
          label: '联系电话'
        },
        {
          prop: 'cardId',
          label: '身份证号'
        },
        {
          prop: 'updTime',
          label: '更新时间'
          // width: '135'
        },
        {
          prop: 'updUserName',
          label: '更新人'
        },
        {
          prop: 'code',
          label: '操作',
          render: (h, row) => (
            <div>
              <j-button
                type="text"
                size="mini"
                vAuth={'relation_update'}
                onClick={() => {
                  this.handleEdit(row)
                }}
              >
                编辑
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
        toolbarBottom: false,
        mutiSelect: true,
        index: true,
        loading: false,
        initTable: false
      },
      // typeDic: {
      //   0: '业务关联人的亲属、同学、朋友有九阳工经历',
      //   1: '业务关联人在入职九阳前与九阳合作伙伴认识/对接/共事过',
      //   2: '业务关联人亲属、同学、朋友及有九阳工作经历的报备信息包括但不限于',
      //   3: '其他'
      // },
      typeList: []
    }
  },
  created () {
    this.initTable()
    getCodeList('code00018').then((list) => {
      this.typeList = list
    })
  },
  mounted () {
    this.height = this.calHeight(150).toString()
  },
  methods: {
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
        poolApi
          .deleteBatchSrmHandle({
            type: urlType,
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
      } else {
        this.showMessage('请先选择要删除的行!')
      }
    },
    initTable () {
      poolApi
        .getSrmHandle({
          type: urlType,
          supplierId: this.$route.query.supplierId,
          questionnaireId: this.$route.query.questionnaireId
        })
        .then((res) => {
          if (res.code === '0') {
            if (res.data) this.tableData = res.data
          }
        })
    },
    selectTable (val) {
      this.tableSelectList = val
    },
    editSave () {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          poolApi
            .saveSrmHandle(
              Object.assign(
                {
                  type: urlType,
                  supplierId: this.$route.query.supplierId,
                  questionnaireId: this.$route.query.questionnaireId
                },
                this.editForm
              )
            )
            .then((res) => {
              if (res.code === '0') {
                this.editClose()
                this.showMessage('保存成功!', 'success')
                this.initTable()
              } else {
                this.showMessage(res.message)
              }
            })
        } else {
          return false
        }
      })
    },
    handleSubmit () {},
    editClose () {
      this.editVisible = false
      this.editForm = {
        personType: '',
        relation: '',
        department: '',
        duty: '',
        userName: '',
        telephone: '',
        cardId: ''
      }
    }
  }
}
</script>