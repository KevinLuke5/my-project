<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'develop_structure_update'" @click="addLine">
        新增
      </j-button>
      <j-button v-auth="'develop_structure_update'" @click="handleEdit">
        编辑
      </j-button>
      <j-button v-auth="'develop_structure_delete'" @click="handleDel">
        删除
      </j-button>
      <j-button @click="handleTree">
        生成组织图
      </j-button>
      <j-button v-auth="'develop_structure_save'" type="primary" @click="handleSubmit">
        保存
      </j-button>
    </div>
    <j-table :data="tableData" width="100%" @selection-change="handleSelect">
      <j-table-column type="selection" width="55" />
      <j-table-column label="序号">
        <template slot-scope="scope">
          <j-input-number
            v-model="scope.row.num"
            :precision="0"
            :min="1"
            :controls="false"
            :disabled="isLock"
          />
        </template>
      </j-table-column>
      <j-table-column label="部门/岗位名称" width="200">
        <template slot-scope="scope">
          <j-input v-model="scope.row.positionName" :disabled="isLock" />
        </template>
      </j-table-column>
      <j-table-column label="上级序号">
        <template slot-scope="scope">
          <j-input-number
            v-model="scope.row.parentNum"
            :precision="0"
            :min="0"
            :controls="false"
            :disabled="isLock"
          />
        </template>
      </j-table-column>
      <j-table-column label="编制">
        <template slot-scope="scope">
          <j-input-number
            v-model="scope.row.personnel"
            :precision="0"
            :min="1"
            :controls="false"
            :disabled="isLock"
          />
        </template>
      </j-table-column>
      <j-table-column label="在岗人数">
        <template slot-scope="scope">
          <j-input-number
            v-model="scope.row.employeesQty"
            :precision="0"
            :min="1"
            :controls="false"
            :disabled="isLock"
          />
        </template>
      </j-table-column>
      <j-table-column label="更新时间" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.updTime }}</span>
        </template>
      </j-table-column>
      <j-table-column label="更新人" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.updUserName }}</span>
        </template>
      </j-table-column>
    </j-table>
    <div class="org-tree-btn">
      <file-upload ref="fileUpload" text="上传架构补充附件" @getFiles="getFiles" />
    </div>
    <div class="org-tree-cont">
      <vue2-org-tree
        v-if="orgShow"
        :key="random"
        :data="orgData"
        :render-content="renderContent"
      />
    </div>
  </div>
</template>
<script>
import Vue2OrgTree from 'vue2-org-tree'
import 'vue2-org-tree/dist/style.css'
import _ from 'lodash'
import * as poolApi from '@/api/supplier/pool'
const urlType = 'develop_structure'

export default {
  components: { Vue2OrgTree },
  data () {
    return {
      isLock: true,
      tableData: [],
      selectData: [],
      orgData: {
        num: '',
        positionName: '',
        children: []
      },
      random: +new Date(),
      orgShow: false,
      files: []
    }
  },
  created () {
    this.initTable()
    this.initFile()
  },
  methods: {
    initTable () {
      poolApi
        .getSrmHandle({
          type: urlType,
          supplierId: this.$route.query.supplierId
        })
        .then((res) => {
          if (res.code === '0') {
            this.tableData = res.data
          }
        })
    },
    initFile () {
      poolApi
        .getSrmSupplierFile({
          businessType: urlType,
          supplierId: this.$route.query.supplierId
        })
        .then((res) => {
          if (res.code === '0') {
            // todo: 处理一下返回的文件数据格式
            this.$refs.fileUpload.fileList = res.data
          }
        })
    },
    addLine () {
      this.isLock = false
      this.tableData.push({
        supplierId: this.$route.query.supplierId,
        num: this.tableData.length
          ? this.tableData[this.tableData.length - 1].num + 1
          : 1,
        parentNum: this.tableData.length ? 1 : 0,
        positionName: '',
        personnel: 0,
        employeesQty: 0
      })
    },
    handleSelect (val) {
      this.selectData = val
    },
    handleEdit () {
      this.isLock = false
    },
    handleDel () {
      if (this.selectData.length) {
        poolApi
          .deleteBatchSrmHandle({
            type: urlType,
            ids: this.selectData.map((row) => row.id)
          })
          .then((res) => {
            if (res.code === '0') {
              this.showMessage('删除成功!', 'success')
              this.tableData = _.difference(this.tableData, this.selectData)
            } else {
              this.showMessage(res.message)
            }
          })
      } else {
        this.showMessage('请先选择要删除的行!')
      }
    },
    delLine (index) {
      this.tableData.splice(index, 1)
    },
    checkTableData () {
      // todo: 检查数据是否能转成树
    },
    handleTree () {
      this.orgData = this.tableToTree(this.tableData, 0)[0]
      this.random = +new Date() // 利用key进行组件强制更新
      this.orgShow = true
      // console.log(this.orgData)
    },
    tableToTree (list, rootValue) {
      const treeData = []
      list.forEach((item) => {
        if (item.parentNum === rootValue) {
          const children = this.tableToTree(list, item.num)
          if (children.length) {
            item.children = children
          }
          treeData.push(item)
        }
      })
      return treeData
    },
    renderContent (h, data) {
      if (data.positionName && data.employeesQty) {
        return `${data.positionName}：${data.employeesQty}人`
      } else {
        return '暂无数据'
      }
    },
    handleSubmit () {
      poolApi
        .saveBatchSrmHandle({ type: urlType, collection: this.tableData })
        .then((res) => {
          if (res.code === '0') {
            this.showMessage('保存成功!', 'success')
            this.isLock = true
          } else {
            this.showMessage(res.message)
          }
        })
    },
    getFiles (type, fileList, file, handle) {
      if (handle === 'add') {
        this.files.push(file)
        poolApi
          .insertOrUpdateSrmSupplierFile({
            businessType: urlType,
            supplierId: this.$route.query.supplierId,
            uid: file.uid,
            upFile: file
          })
          .then((res) => {
            if (res.code === '0') {
              this.showMessage('文件保存成功!', 'success')
            } else {
              this.showMessage(res.message)
            }
          })
      } else if (handle === 'delete') {
        poolApi
          .deleteSrmSupplierFile({ uid: file.uid.toString() })
          .then((res) => {
            if (res.code === '0') {
              this.showMessage('删除成功!', 'success')
            } else {
              this.showMessage(res.message)
            }
          })
      }
    }
  }
}
</script>