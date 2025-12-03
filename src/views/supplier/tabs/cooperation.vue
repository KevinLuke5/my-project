<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'cooperation_update'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'cooperation_delete'" @click="handleDel">
        删除
      </j-button>
      <j-button v-auth="'cooperation_save'" type="primary" @click="handleSubmit">
        保存
      </j-button>
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
        label-width="70px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="物料编码" prop="materialCode">
          <j-autocomplete
            v-model="editForm.materialCode"
            style="width: 388px"
            popper-class="search-autocomplete"
            :fetch-suggestions="searchMat"
            :trigger-on-focus="false"
            :debounce="800"
            placeholder="请输入搜索"
            @select="setMat"
          >
            <template slot-scope="{ item }">
              <div class="name">
                {{ item.itemName }}
              </div>
              <span class="code">{{ item.itemCode }}</span>
            </template>
          </j-autocomplete>
        </j-form-item>
        <j-form-item label="物料描述">
          <j-input v-model="editForm.materialName" disabled />
        </j-form-item>
        <j-form-item label="订货条件" prop="orderConditions">
          <j-input v-model="editForm.orderConditions" />
        </j-form-item>
        <j-form-item label="价格" prop="price">
          <j-input v-model.number="editForm.price" />
        </j-form-item>
        <j-form-item label="交期(天)" prop="deliveryDate">
          <j-input v-model.number="editForm.deliveryDate" />
        </j-form-item>
        <j-form-item label="付款条件" prop="payConditions">
          <j-input v-model="editForm.payConditions" />
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
import * as checkApi from '@/api/supplier/check'
const urlType = 'cooperation'

export default {
  data () {
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        materialId: '',
        materialCode: '',
        materialName: '',
        orderConditions: '',
        price: '',
        deliveryDate: '',
        payConditions: '',
        remark: ''
      },
      rules: {
        materialCode: [
          { required: true, message: '请输入物料', trigger: 'blur' }
        ],
        orderConditions: [
          { required: true, message: '请输入订货条件址', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        deliveryDate: [
          { required: true, message: '请输入交期(天)', trigger: 'blur' },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        payConditions: [
          { required: true, message: '请输入付款条件', trigger: 'blur' }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'materialCode',
          label: '物料编码'
        },
        {
          prop: 'materialName',
          label: '物料描述'
        },
        {
          prop: 'orderConditions',
          label: '订货条件'
        },
        {
          prop: 'price',
          label: '单价（元）'
        },
        {
          prop: 'deliveryDate',
          label: '交期（天）'
        },
        {
          prop: 'payConditions',
          label: '付款条件'
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
                vAuth={'cooperation_update'}
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
      matList: []
    }
  },
  created () {
    this.initTable()
  },
  mounted () {
    this.height = this.calHeight(150).toString()
  },
  methods: {
    searchMat (queryString, cb) {
      checkApi.getMaterialList({ itemCode: queryString }).then((res) => {
        if (res.code === '0' && res.data.records) cb(res.data.records)
      })
    },
    setMat (item) {
      this.editForm.materialId = item.itemId
      this.editForm.materialCode = item.itemCode
      this.editForm.materialName = item.itemName
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
        factoryName: '',
        factoryCode: '',
        addressId: '',
        addressName: '',
        majorProduct: '',
        startTime: '',
        floorArea: '',
        plantArea: '',
        laboratoryArea: '',
        inspectionArea: ''
      }
    }
  }
}
</script>