<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'self_made_update'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'self_made_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'self_made_save'" type="primary" @click="handleSubmit">
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
        label-width="95px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="分类" prop="partsType">
          <j-select
            v-model="editForm.partsType"
            filterable
            allow-create
            default-first-option
          >
            <!-- <j-option
              v-for="(value, index) in typeDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            /> -->
            <j-option
              v-for="item in typeList"
              :key="item.id"
              :label="item.name"
              :value="item.lineNumber"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="地址名称" prop="addressName">
          <j-select v-model="editForm.addressName" value-key="id" @change="setAddress">
            <j-option
              v-for="item in addressList"
              :key="item.id"
              :label="item.addressName"
              :value="item"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="日配套产能" prop="dailyCapacity">
          <j-input-number
            v-model="editForm.dailyCapacity"
            :precision="0"
            :min="0"
            :controls="false"
          />
        </j-form-item>
        <j-form-item label="备注">
          <j-input v-model="editForm.remark" :rows="3" type="textarea" />
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
const urlType = 'self_made'

export default {
  data () {
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        addressId: '',
        addressName: '',
        partsType: '',
        dailyCapacity: '',
        remark: ''
      },
      rules: {
        partsType: [{ required: true, message: '请选择分类', trigger: 'blur' }],
        addressName: [
          { required: true, message: '请选择地址', trigger: 'blur' }
        ],
        dailyCapacity: [
          {
            required: true,
            message: '请输入日配套产能',
            trigger: 'blur'
          }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'partsType',
          label: '分类',
          // render: (h, row) => <span>{this.typeDic[row.partsType]}</span>
          render: (h, row) => (
            <span>
              {this.typeList.length
                ? (this.typeList.find((dic) => dic.lineNumber === row.partsType) || { name: '' }).name
                : ''}
            </span>
          )
        },
        {
          prop: 'addressName',
          label: '地址名称'
        },
        {
          prop: 'dailyCapacity',
          label: '日配套产能'
        },
        {
          prop: 'remark',
          label: '备注'
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
                vAuth={'self_made_update'}
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
      //   0: '模具',
      //   1: '五金',
      //   2: '注塑',
      //   3: '玻璃',
      //   4: '喷涂',
      //   5: '油漆',
      //   6: '电镀',
      //   7: '镭雕',
      //   8: '其他'
      // },
      typeList: [],
      addressList: []
    }
  },
  created () {
    this.initTable()
    this.getSelectData()
  },
  mounted () {
    this.height = this.calHeight(150).toString()
  },
  methods: {
    getSelectData () {
      poolApi
        .getAddressNameList({ id: this.$route.query.supplierId })
        .then((res) => {
          if (res.code === '0' && res.data) this.addressList = res.data
        })
      getCodeList('code00012').then((list) => {
        this.typeList = list
      })
    },
    setAddress (item) {
      this.editForm.addressId = item.id
      this.editForm.addressName = item.addressName
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
          supplierId: this.$route.query.supplierId
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
                { type: urlType, supplierId: this.$route.query.supplierId },
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
        addressId: '',
        addressName: '',
        partsType: '',
        dailyCapacity: '',
        remark: ''
      }
    }
  }
}
</script>