<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-form
        class="head-container"
        size="mini"
        :inline="true"
        :model="query"
        label-position="left"
        label-width="85px"
      >
        <j-form-item label="供应商">
          <j-input v-model="query.supplierName" placeholder="模糊查询" @keyup.enter.native="initTable(1)" />
        </j-form-item>
        <div class="btn">
          <div>
            <j-button v-check="'insertOrUpdateAddr'" type="primary" @click="handleAdd">
              新增
            </j-button>
            <j-button v-check="'deleteBatchAddr'" @click="handleDel">
              删除
            </j-button>
          </div>
          <j-form-item class="btn-group" style="margin-bottom: 0">
            <j-button v-check="'custom-check-pageList'" type="primary" @click="initTable(1)">
              查询
            </j-button>
            <j-button @click="resetQuery">
              重置
            </j-button>
            <j-button v-check="'custom-check-export'" @click="handleExport">
              导出
            </j-button>
          </j-form-item>
        </div>
      </j-form>

      <div class="font14">
        收货地址：组件或整机供应商维护；退货地址：配件供应商维护
      </div>

      <j-tabs v-model="activeName" @tab-click="tabClick">
        <j-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        />
      </j-tabs>

      <!-- 数据表 -->
      <j-table
        ref="table"
        v-loading="loading"
        stripe
        header-bold
        size="small"
        class="table-style"
        :data="tableData"
        :height="height"
        style="width: 100%;"
        tooltip-effect="dark"
        @selection-change="selectTable"
      >
        <j-table-column type="selection" width="55" />
        <j-table-column prop="supplierName" label="供应商" width="160" />
        <j-table-column prop="addressShort" label="地址简称" min-width="150" />
        <j-table-column prop="address" label="详细地址" width="300" />
        <j-table-column prop="linkName" label="联系人" width="90" />
        <j-table-column prop="phone" label="联系电话" width="110" />
        <j-table-column
          v-if="status === 1"
          :key="123"
          prop="line"
          label="产品线"
          width="300"
        >
          <!-- <template slot-scope="scope">
            {{ returnLine(scope.row.lines) }}
          </template> -->
        </j-table-column>
        <j-table-column
          v-if="status === 2"
          :key="132"
          prop="confirmName"
          label="退货确认人"
        />
        <j-table-column
          label="操作"
          width="120"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <div class="operate-btn-group">
              <j-button
                v-check="'insertOrUpdateAddr'"
                type="text"
                size="mini"
                @click="handleEdit(scope.row, 'edit')"
              >
                编辑
              </j-button>
            </div>
          </template>
        </j-table-column>
        <j-table-column prop="updUserName" width="90" label="更新人" />
        <j-table-column prop="updTime" label="更新时间" />
      </j-table>
      <div class="page">
        <j-pagination
          :current-page="currentPage"
          :page-sizes="[15, 30, 50, 100]"
          :page-size="tablePage.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tablePage.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </j-card>

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
        <j-form-item label="供应商" prop="supplierName" placeholder="请输入名称搜索">
          <j-select
            v-model="editForm.supplierName"
            value-key="executeUserId"
            filterable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="getSupplierName"
            :loading="loading"
          >
            <j-option
              v-for="item in supplierNameList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            >
              <span>
                {{ item.name }}
              </span>
              <!-- <span style="margin-left: 5px; color: #8492a6; font-size: 12px">
                {{ item.name }}
              </span> -->
            </j-option>
          </j-select>
        </j-form-item>
        <j-form-item label="地址简称" prop="addressShort">
          <j-input v-model="editForm.addressShort" placeholder="退货地址简称" />
        </j-form-item>
        <j-form-item label="详细地址" prop="address">
          <j-input
            v-model="editForm.address"
            :rows="1"
            type="textarea"
            placeholder="详细地址"
          />
        </j-form-item>
        <j-form-item label="联系人" prop="linkName">
          <j-input v-model="editForm.linkName" placeholder="姓名" />
        </j-form-item>
        <j-form-item label="联系电话" prop="phone">
          <j-input v-model="editForm.phone" placeholder="电话" />
        </j-form-item>
        <j-form-item
          v-if="status === 2"
          label="退货确认人"
          prop="confirmName"
          placeholder="请输入姓名搜索"
        >
          <!-- <j-select
            v-model="editForm.confirmName"
            value-key="executeUserId"
            filterable
            placeholder="请输入关键词搜索"
            remote
            :remote-method="searchPeople"
            :loading="loading"
          >
            <j-option
              v-for="item in peopleList"
              :key="item.executeUserId"
              :label="item.executeUserName"
              :value="item.executeUserName"
            >
              <span>
                {{ item.executeUserName }}
              </span>
              <span style="margin-left: 5px; color: #8492a6; font-size: 12px">
                {{ item.companyName }}
              </span>
            </j-option>
          </j-select> -->

          <j-select v-model="editForm.confirmName" filterable placeholder="姓名">
            <j-option
              v-for="item in userList"
              :key="item.key"
              :label="item.label"
              :value="item.label"
            />
          </j-select>
        </j-form-item>
        <j-form-item v-if="status === 1" label="产品线" prop="lines">
          <j-select
            v-model="editForm.lines"
            multiple
            clearable
            filterable
          >
            <j-option
              v-for="item in orderTypeList"
              :key="item.lineId"
              :label="item.name"
              :value="item.code"
            />
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
import * as addrApi from '@/api/customMat/addr'
import * as baseApi from '@/api/base/supplierUserInfo'
import * as poolApi from '@/api/supplier/pool'
import * as verifyApi from '@/api/verify/typeVerify'
import { tagDeltDataOld } from '@/utils/index'

export default {
  name: 'CustomAddr',
  data () {
    return {
      userList: [],
      orderTypeList: [],
      status: 1,
      activeName: 'first',
      tabList: [
        {
          label: '收货地址', name: 'first'
        },
        {
          label: '退货地址', name: 'second'
        }
      ],
      query: {
        supplierName: ''
      },
      height: null,
      tableData: [],
      currentPage: 1,
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
      handleType: '新增',
      editVisible: false,
      editForm: {
        addressShort: '',
        address: '',
        linkName: '',
        lines: [],
        phone: '',
        confirmName: '',
        supplierCode: '',
        supplierName: '',
        confirmAccountId: ''
      },
      rules: {
        supplierName: [
          { required: true, message: '该字段必填', trigger: 'blur' }
        ],
        addressShort: [
          { required: true, message: '该字段必填', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '该字段必填', trigger: 'blur' }
        ],
        linkName: [
          { required: true, message: '该字段必填', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '该字段必填', trigger: 'blur' }
        ],
        confirmName: [
          { required: true, message: '该字段必填', trigger: 'blur' }
        ],
        lines: [
          { required: true, message: '该字段必填', trigger: 'blur' }
        ]
      },
      loading: false,
      peopleList: [],
      supplierNameList: [],
      oldList: []
    }
  },
  watch: {
    'editForm.supplierCode' (val) {
      if (val) {
        this.supplierNameList.forEach(item => {
          if (item.code === val) {
            this.editForm.supplierName = item.name
          }
        })
      }
    },
    'editForm.supplierName': {
      handler (val) {
        if (val) {
          this.supplierNameList.forEach(item => {
            if (item.name === val) {
              this.getSupplierOrUser(item.code)
            }
          })
        }
      }
    },
    'editForm.confirmName' (val) {
      if (val && this.status === 2) {
        this.userList.forEach(item => {
          if (item.label === val) {
            this.editForm.confirmAccountId = item.value
          }
        })
      }
    }
  },
  created () {
    this.initTable(1)
    this.getPdtLineList()
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    getSupplierOrUser (val) {
      this.userList = []
      addrApi.getSupplierOrUser({
        supplierCode: val
      }).then(res => {
        this.userList = res.data.map(item => (
          {
            label: item.name,
            value: item.accountId,
            id: item.id
          }
        )
        )
      })
    },
    returnLine (item) {
      if (item.length > 0) {
        const newLine = item.map(item => item.lineName)
        return newLine.join(',')
      }
    },
    getPdtLineList () {
      poolApi.getPdtLineList().then(res => {
        this.orderTypeList = res.data.records
      })
    },
    tabClick (tab) {
      this.tabName = tab.name
      this.status = this.activeName === 'first' ? 1 :  2
      this.initTable()
    },
    handleAdd () {
      this.handleType = '新增'
      this.editVisible = true
    },
    handleEdit (row) {
      this.handleType = '编辑'
      const rowData = JSON.parse(JSON.stringify(row))
      this.oldList = rowData.lines
      rowData.lines = rowData.lines.map(item => item.lineCode)
      // rowData.lines = rowData.lines.split(',')
      this.editForm = rowData
      this.$set(this.editForm, 'peoples', this.oldList)
      this.peopleList = this.oldList
      this.editVisible = true
    },
    editSave () {
      const params = {}
      let lines = []
      const newLine = []
      if (this.handleType === '新增' && this.status === 1) {
        this.orderTypeList.forEach(item => {
          this.editForm.lines.forEach(line => {
            if (line === item.code) {
              console.log(item)
              lines.push({
                lineCode: item.code,
                lineName: item.name
              })
            }
          })
        })
      } else if (this.handleType === '编辑' && this.status === 1) {
        // console.log(this.editForm.lines);
        // console.log(this.oldList);
        this.orderTypeList.forEach(item => {
          if (this.oldList.length === 0) {
            this.editForm.lines.forEach(line => {
              if (line === item.code) {
                newLine.push({
                  lineCode: item.code,
                  lineName: item.name
                })
              }
            })
          }
          if (this.oldList.length !== 0) {
            this.oldList.forEach(lines => {
              this.editForm.lines.forEach((line) => {
                if (lines.lineCode === line) {
                  newLine.push(lines)
                }
              })
            })
          }
        })
        const newArr = [...new Set(newLine)]
        // console.log(newArr);
        const newArrCode = newArr.map(item => item.lineCode)
        // console.log(newArrCode);
        // console.log(newLine);
        const newlines = JSON.parse(JSON.stringify(this.editForm.lines))
        const newCode = JSON.parse(JSON.stringify(newArrCode))
        this.editForm.lines.forEach(item => {
          newArrCode.forEach(ite => {
            if (item === ite) {
              newlines.splice(newlines.indexOf(item), 1)
              newCode.splice(newCode.indexOf(ite), 1)
            }
          })
        })
        console.log(newlines)
        this.orderTypeList.forEach(item => {
          newlines.forEach(line => {
            if (line === item.code) {
              newArr.push({
                lineCode: item.code,
                lineName: item.name
              })
            }
          })
        })
        console.log(newArr)
        lines = tagDeltDataOld(
          this.oldList,
          newArr,
          'lineCode'
        )
      }
      this.supplierNameList.forEach(item => {
        if (this.editForm.supplierName === item.name) {
          this.editForm.supplierCode = item.code
        }
      })
      if (this.status === 1) {
        const liness = []
        this.editForm.lines.forEach(line => {
          liness.push({
            lineCode: line
          })
        })
        this.editForm.addrType = 1
        this.editForm.lines = liness
        params.srmOrderGuestGoodsReturnAddr = this.editForm
        params.lines = lines
      }
      if (this.status === 2) {
        this.editForm.addrType = 2
        params.srmOrderGuestGoodsReturnAddr = this.editForm
      }
      addrApi
        .insertOrUpdateAddr(
          Object.assign(params)
        )
        .then((res) => {
          if (res.code === '0') {
            this.showMessage('操作成功!', 'success')
            this.editClose()
            this.initTable(1)
          } else {
            this.showMessage(res.message)
            this.editForm.lines = lines.map(item => item.lineCode)
          }
        })
    },
    editClose () {
      this.editVisible = false
      this.editForm = {
        addressShort: '',
        address: '',
        linkName: '',
        phone: '',
        confirmName: '',
        supplierCode: '',
        supplierName: '',
        confirmAccountId: ''
      }
      this.supplierNameList = []
      this.userList = []
    },
    handleDel () {
      if (this.tableSelectList.length) {
        addrApi
          .deleteBatchAddr({ ids: this.tableSelectList.map((row) => row.id) })
          .then((res) => {
            if (res.code === '0') {
              this.showMessage('删除成功!', 'success')
              this.initTable()
            } else {
              this.showMessage(res.message)
            }
          })
      } else {
        this.showMessage('请先选择要删除的数据!')
      }
    },
    initTable (page) {
      if (this.status === 1) {
        this.query.addrType = 1
      }
      if (this.status === 2) {
        this.query.addrType = 2
      }
      if (page) {
        this.tablePage.pageNum = page || 1
      }
      this.tableOptions.loading = true
      const params = Object.assign({}, this.query, {
        size: this.tablePage.pageSize,
        page: this.tablePage.pageNum
      })
      addrApi
        .getAddrList(params)
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
    selectTable (val) {
      this.tableSelectList = val
    },
    getSupplierName (val) {
      if (val) {
        this.loading = true
        verifyApi
          .getSupplierName({ name: val })
          .then((res) => {
            if (res && res.code === '0') {
              this.supplierNameList = res.data.map((item) => ({
                id: item.id,
                code: item.code,
                name: item.name
              }))
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.supplierNameList = []
      }
    },
    searchPeople (keyWords) {
      if (keyWords) {
        this.loading = true
        baseApi
          .getSupplierUserInfo({ name: keyWords })
          .then((res) => {
            if (res && res.code === '0') {
              this.peopleList = res.data.map((item) => ({
                id: item.id,
                executeUserId: item.accountId,
                executeUserName: item.name,
                companyCode: item.companyCode,
                companyName: item.companyName,
                delFlag: 0
              }))
            }
          })
          .finally(() => {
            this.loading = false
          })
      } else {
        this.peopleList = []
      }
    },
    handleSizeChange: function (size) {
      this.tablePage.pageSize = size
      this.currentPage = 1
      this.initTable(1)
    },
    handleCurrentChange: function (currentPage) {
      this.tablePage.pageNum = currentPage
      this.initTable(currentPage)
    },
    handleExport () {
      if (!this.tableData.length) {
        this.$message.warning('列表无数据，无法导出')
        return
      }
      addrApi.exportAddr(this.query)
    },
    resetQuery () {
      this.query = {
        supplierName: ''
      }
    }
  }
}
</script>
<style scoped lang="less">
.font14{
  font-size: 12px;
}
.table-style {
  height: 626px !important;
}
.btn {
  display: flex;
  justify-content: space-between;
}
</style>
