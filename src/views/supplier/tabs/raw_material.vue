<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'raw_material_update'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'raw_material_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'raw_material_save'" type="primary" @click="handleSubmit">
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
        label-width="130px"
        :model="editForm"
        :rules="rules"
      >
        <j-form-item label="原材料" prop="rawMaterial">
          <j-select
            v-model="editForm.rawMaterial"
            filterable
            allow-create
            default-first-option
          >
            <!-- <j-option
              v-for="(value, index) in matDic"
              :key="index"
              :label="value"
              :value="parseInt(index)"
            /> -->
            <j-option
              v-for="item in matList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="采购渠道" prop="purchasingChannels">
          <j-input v-model="editForm.purchasingChannels" />
        </j-form-item>
        <j-form-item label="上年采购量(吨/PCS)" prop="lastYearPurchaseQty">
          <j-input v-model.number="editForm.lastYearPurchaseQty" />
        </j-form-item>
        <j-form-item label="上年采购额(万元)" prop="lastYearPurchaseAmount">
          <j-input v-model.number="editForm.lastYearPurchaseAmount" />
        </j-form-item>
        <j-form-item label="提报时间" prop="submitTime">
          <j-date-picker
            v-model="editForm.submitTime"
            type="date"
            value-format="yyyy-MM-dd"
            :clearable="false"
          />
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
const urlType = 'raw_material'

export default {
  data () {
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        rawMaterial: '',
        purchasingChannels: '',
        lastYearPurchaseQty: '',
        lastYearPurchaseAmount: '',
        submitTime: ''
      },
      rules: {
        rawMaterial: [
          { required: true, message: '请选择原材料', trigger: 'blur' }
        ],
        purchasingChannels: [
          { required: true, message: '请输入采购渠道', trigger: 'blur' }
        ],
        lastYearPurchaseQty: [
          {
            required: true,
            message: '请输入上年采购量',
            trigger: 'change'
          },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        lastYearPurchaseAmount: [
          {
            required: true,
            message: '请输入上年采购额',
            trigger: 'change'
          },
          { type: 'number', message: '请输入数字', trigger: 'blur' }
        ],
        submitTime: [
          {
            required: true,
            message: '请选择提报时间',
            trigger: 'change'
          }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'rawMaterial',
          label: '原材料'
          // render: (h, row) => (
          //   <span>
          //     {this.matList.length
          //       ? (this.matList.find((dic) => dic.name === row.rawMaterial) || { name: '' }).name
          //       : ''}
          //   </span>
          // )
        },
        {
          prop: 'purchasingChannels',
          label: '采购渠道'
        },
        {
          prop: 'lastYearPurchaseQty',
          label: '上年采购量'
        },
        {
          prop: 'lastYearPurchaseAmount',
          label: '上年采购额(万元)'
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
                vAuth={'raw_material_update'}
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
      // matDic: {
      //   0: 'PP',
      //   1: 'ABS',
      //   2: 'PA',
      //   3: 'PBT',
      //   4: '不锈钢',
      //   5: '马口铁'
      // },
      matList: []
    }
  },
  created () {
    this.initTable()
    getCodeList('code00014').then((list) => {
      this.matList = list
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
        rawMaterial: '',
        purchasingChannels: '',
        lastYearPurchaseQty: '',
        lastYearPurchaseAmount: '',
        submitTime: ''
      }
    }
  }
}
</script>