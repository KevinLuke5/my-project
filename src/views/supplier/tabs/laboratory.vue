<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'laboratory_update'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'laboratory_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'laboratory_save'" type="primary" @click="handleSubmit">
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
        label-width="155px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="实验室名称" prop="laboratoryName">
          <j-input v-model="editForm.laboratoryName" />
        </j-form-item>
        <j-form-item label="能力描述" prop="powerDescriptionList">
          <j-select
            v-model="editForm.powerDescriptionList"
            multiple
            filterable
            allow-create
            default-first-option
            @change="powerChange"
          >
            <j-option
              v-for="item in powerList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="测试项" prop="testItemList">
          <j-select
            v-model="editForm.testItemList"
            multiple
            filterable
            allow-create
            default-first-option
            @change="testChange"
          >
            <j-option
              v-for="item in testList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="是否已加入九阳协同测试" prop="isJoined">
          <j-select v-model="editForm.isJoined">
            <j-option label="是" :value="1" />
            <j-option label="否" :value="0" />
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
import * as poolApi from '@/api/supplier/pool'
import { getCodeList } from '@/views/common/dic'
const urlType = 'laboratory'

export default {
  data () {
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        laboratoryName: '',
        powerDescription: '',
        powerDescriptionList: [],
        testItem: '',
        testItemList: [],
        isJoined: ''
      },
      rules: {
        laboratoryName: [
          { required: true, message: '请输入实验室名称', trigger: 'blur' }
        ],
        powerDescriptionList: [
          { required: true, message: '请选择能力描述', trigger: 'blur' }
        ],
        testItemList: [
          { required: true, message: '请选择测试项', trigger: 'blur' }
        ],
        isJoined: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'laboratoryName',
          label: '实验室名称'
        },
        {
          prop: 'powerDescription',
          label: '能力描述'
          // render: (h, row) => (
          //   <span>
          //     {this.powerList.length
          //       ? (this.powerList.find((dic) => dic.name === row.powerDescription) || { name: '' }).name
          //       : ''}
          //   </span>
          // )
        },
        {
          prop: 'testItem',
          label: '测试项',
          width: '300px'
          // render: (h, row) => (
          //   <span>
          //     {this.testList.length
          //       ? (this.testList.find((dic) => dic.name === row.testItem) || { name: '' }).name
          //       : ''}
          //   </span>
          // )
        },
        {
          label: '是否已加入九阳协同测试',
          render: (h, row) => <div>{row.isJoined ? '是' : '否'}</div>
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
                vAuth={'laboratory_update'}
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
      powerList: [],
      testList: []
    }
  },
  created () {
    this.initTable()
    getCodeList('code00015').then((list) => {
      this.powerList = list
    })
    getCodeList('code00016').then((list) => {
      this.testList = list
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
      const form = JSON.parse(JSON.stringify(row))
      this.editForm = Object.assign(form, {
        powerDescriptionList: form.powerDescription.split(','),
        testItemList: form.testItem.split(',')
      })
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
    testChange (val) {
      this.editForm.testItem = val.join(',')
    },
    powerChange (val) {
      this.editForm.powerDescription = val.join(',')
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
        laboratoryName: '',
        describe: '',
        testItem: '',
        isJoined: ''
      }
    }
  }
}
</script>