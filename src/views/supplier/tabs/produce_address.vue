<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'produce_address_update'" @click="handleAdd">
        新增
      </j-button>
      <j-button v-auth="'produce_address_delete'" @click="handleDel">
        删除
      </j-button>
      <!-- <j-button v-auth="'produce_address_save'" type="primary" @click="handleSubmit">
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
        <j-form-item label="地址名称" prop="addressName">
          <j-input v-model="editForm.addressName" />
        </j-form-item>
        <j-form-item label="地址编码">
          <j-input v-model="editForm.addressCode" disabled />
        </j-form-item>
        <j-form-item label="国家/地区" prop="country">
          <j-select v-model="editForm.country">
            <j-option label="中国" value="中国" />
          </j-select>
        </j-form-item>
        <j-form-item label="省" prop="province">
          <j-select v-model="editForm.province" @change="initCity('clear')">
            <j-option
              v-for="item in provinceList"
              :key="item.adcode"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="市" prop="city">
          <j-select v-model="editForm.city" @change="initArea">
            <j-option
              v-for="item in cityList"
              :key="item.adcode"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="区/县" prop="district">
          <j-select v-model="editForm.district">
            <j-option
              v-for="item in areaList"
              :key="item.adcode"
              :label="item.name"
              :value="item.name"
            />
          </j-select>
        </j-form-item>
        <j-form-item label="详细地址" prop="address">
          <j-input v-model="editForm.address" />
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
import { getRegion } from '@/api/region/region'
const urlType = 'produce_address'

export default {
  data () {
    return {
      handleType: '新增',
      editVisible: false,
      editForm: {
        addressName: '',
        addressCode: '',
        country: '',
        province: '',
        city: '',
        district: '',
        address: ''
      },
      provinceList: [],
      cityList: [],
      areaList: [],
      rules: {
        addressName: [{ required: true, message: '请输入工厂名称', trigger: 'blur' }],
        country: [{ required: true, message: '请选择国家', trigger: 'blur' }],
        province: [{ required: true, message: '请选择省', trigger: 'blur' }],
        city: [{ required: true, message: '请选择市', trigger: 'blur' }],
        district: [{ required: true, message: '请选择区', trigger: 'blur' }],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      height: null,
      tableData: [],
      tableSelectList: [],
      tableColumns: [
        {
          prop: 'addressCode',
          label: '地址编码'
        },
        {
          prop: 'addressName',
          label: '地址名称'
        },
        {
          prop: 'country',
          label: '国家'
        },
        {
          prop: 'province',
          label: '省'
        },
        {
          prop: 'city',
          label: '市'
        },
        {
          prop: 'district',
          label: '区'
        },
        {
          prop: 'address',
          label: '详细地址'
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
                vAuth={'produce_address_update'}
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
      }
    }
  },
  created () {
    this.initTable()
    this.initProvince()
  },
  mounted () {
    this.height = this.calHeight(150).toString()
  },
  methods: {
    initProvince () {
      getRegion().then((res) => {
        if (res.code === '0') {
          this.provinceList = res.data.content[0].districts
        }
      })
    },
    initCity (clear) {
      if (clear) { // 重新选省份清空城市
        this.editForm.city = ''
      }
      if (this.editForm.province) {
        getRegion({ keywords: this.editForm.province }).then((res) => {
          if (res && res.code === '0') {
            this.cityList = res.data.content.filter(dis => dis.level === 'province')[0].districts
          }
        })
      }
    },
    initArea () {
      if (this.editForm.city) {
        getRegion({ keywords: this.editForm.city }).then((res) => {
          if (res && res.code === '0') {
            this.areaList = res.data.content.filter(dis => dis.level === 'city')[0].districts
          }
        })
      }
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    async handleEdit (row) {
      this.editForm = JSON.parse(JSON.stringify(row))
      this.handleType = '编辑'
      this.editVisible = true
      this.initCity()
      setTimeout(() => { // 同时调用地址接口第二个会不成功，所以延迟一秒再调用
        this.initArea()
      }, 1000)
      
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
        addressName: '',
        addressCode: '',
        country: '',
        province: '',
        city: '',
        district: '',
        address: ''
      }
    }
  }
}
</script>