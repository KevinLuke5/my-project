<template>
  <j-dialog
    title="详情"
    :visible.sync="detailVisible"
    :modal="false"
    :before-close="close"
    :fullscreen="true"
  >
    <div class="manage">
      <!-- <div class="manage-table-btn">
        <span>详情</span>
      </div> -->
      <div class="details-button">
        <j-button v-check="'codeDetailInsert'" size="small" @click="detailAdd()">
          新增
        </j-button>
        <j-button v-check="'codeDetailDelete'" size="small" @click="detailDelete()">
          删除
        </j-button>
      </div>
      <div class="manage-form">
        <div class="content">
          <div v-for="(v, k) in detailForm" :key="k" class="content-item">
            <span>{{ fields[k] }}:</span>
            <span>{{ v }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <j-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      size="small"
      :height="height"
      style="width: 100%"
      tooltip-effect="dark"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <j-table-column type="selection" width="55" fixed />
      <j-table-column prop="lineNumber" label="状态码" />
      <j-table-column prop="name" label="名称" />
      <j-table-column prop="attributesOne" label="属性1" />
      <j-table-column prop="attributesTwo" label="属性2" />
      <j-table-column prop="attributesThree" label="属性3" />
      <j-table-column prop="attributesFour" label="属性4" />
      <j-table-column prop="attributesFive" label="属性5" />
      <j-table-column prop="attributesSix" label="属性6" />
      <j-table-column fixed="right" label="操作" width="50">
        <template slot-scope="scope">
          <j-button v-check="'codeDetailInsert'" type="text" @click="handleEdit(scope.row)">
            编辑
          </j-button>
        </template>
      </j-table-column>
    </j-table>

    <!-- 新增、编辑 -->
    <j-dialog
      :title="handleType"
      :visible.sync="detailEditVisible"
      :modal="false"
      :before-close="detailEditClose"
      width="400px"
    >
      <j-form
        ref="detailEditForm"
        size="mini"
        label-position="left"
        label-width="95px"
        :model="detailEditForm"
        :rules="rules"
      >
        <j-form-item label="行号" prop="lineNumber">
          <j-input v-model="detailEditForm.lineNumber" />
        </j-form-item>
        <j-form-item label="名称" prop="name">
          <j-input v-model="detailEditForm.name" />
        </j-form-item>
        <j-form-item label="属性1" prop="attributesOne">
          <j-input v-model="detailEditForm.attributesOne" />
        </j-form-item>
        <j-form-item label="属性2" prop="attributesTwo">
          <j-input v-model="detailEditForm.attributesTwo" />
        </j-form-item>
        <j-form-item label="属性3" prop="attributesThree">
          <j-input v-model="detailEditForm.attributesThree" />
        </j-form-item>
        <j-form-item label="属性4" prop="attributesFour">
          <j-input v-model="detailEditForm.attributesFour" />
        </j-form-item>
        <j-form-item label="属性5" prop="attributesFive">
          <j-input v-model="detailEditForm.attributesFive" />
        </j-form-item>
        <j-form-item label="属性6" prop="attributesSix">
          <j-input v-model="detailEditForm.attributesSix" />
        </j-form-item>
      </j-form>
      <span slot="footer">
        <j-button @click="detailEditClose">取消</j-button>
        <j-button type="primary" @click="detailEditSave">保存</j-button>
      </span>
    </j-dialog>
  </j-dialog>
</template>

<script>
import { getDetails, updateDetail, deleteDetailId } from '@/api/base/codeManage'
import { returnIds } from '@/utils/index'

export default {
  props: {
    detailVisible: Boolean,
    detailForm: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    const fields = {
      code: '代码',
      codeName: '代码名称',
      status: '状态'
    }
    return {
      fields,
      loading: false,
      height: null,
      tableData: [],
      selectList: [],
      detailEditVisible: false,
      detailEditForm: {
        id: '',
        codeId: '',
        lineNumber: '',
        name: '',
        attributesOne: '',
        attributesTwo: '',
        attributesThree: '',
        attributesFour: '',
        attributesFive: '',
        attributesSix: ''
      },
      codeId: '',
      handleType: '新增',
      rules: {
        lineNumber: [
          { required: true, message: '请输入行号', trigger: 'change' }
        ],
        name: [{ required: true, message: '请输入名称', trigger: 'change' }]
      }
    }
  },
  mounted () {
    this.height = this.getHeight()
  },
  methods: {
    detailAdd () {
      this.handleType = '新增'
      this.detailEditVisible = true
    },
    handleEdit (row) {
      this.detailEditForm = JSON.parse(JSON.stringify(row))
      this.detailEditVisible = true
      this.handleType = '编辑'
    },
    detailEditSave () {
      this.$refs.detailEditForm.validate((valid) => {
        if (valid) {
          if (this.handleType === '新增') {
            this.detailEditForm.codeId = this.codeId
            delete this.detailEditForm.id
            updateDetail(this.detailEditForm).then((res) => {
              if (res.code === '0') {
                this.showMessage('新增成功！', 'success')
                this.detailEditClose()
                this.getDetailTable(this.codeId)
              } else {
                this.showMessage(res.message, 'error')
              }
            })
          } else {
            delete this.detailEditForm.codeId
            updateDetail(this.detailEditForm).then((res) => {
              if (res.code === '0') {
                this.showMessage('修改成功！', 'success')
                this.detailEditClose()
                this.getDetailTable(this.codeId)
              } else {
                this.showMeswohaiyiaeisage(res.message, 'error')
              }
            })
          }
        }
      })
    },
    detailEditClose () {
      this.detailEditVisible = false
      this.detailEditForm = {
        id: '',
        codeId: '',
        lineNumber: '',
        name: '',
        attributesOne: '',
        attributesTwo: '',
        attributesThree: '',
        attributesFour: '',
        attributesFive: '',
        attributesSix: ''
      }
    },
    detailDelete () {
      const ids = returnIds(this.selectList).join()
      deleteDetailId({ ids: ids }).then((res) => {
        if (res.code === '0') {
          this.showMessage('删除成功！', 'success')
          this.getDetailTable(this.codeId)
        } else {
          this.showMessage(res.message, 'error')
        }
      })
    },
    getDetailTable (id) {
      this.codeId = id
      getDetails({ id: id }).then((res) => {
        if (res.code === '0') {
          this.tableData = res.data
        }
      })
    },
    handleSelectionChange (val) {
      this.selectList = val
    },
    close () {
      this.$emit('detailClose')
    }
  }
}
</script>
<style lang="less" scoped>
.manage {
  width: 100%;
  height: 100%;
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  .manage-form {
    width: 100%;
    margin: 5px 15px;
    height: auto;
    .content {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .content-item {
        width: 33%;
        display: flex;
        margin: 8px 0;
        span:first-child {
          width: auto;
          margin-right: 8px;
        }
        span:last-child {
          flex: 1;
        }
      }
    }
  }
  .details-button {
    position: absolute;
    right: 40px;
    margin-top: 20px;
  }
  .manage-table-btn {
    width: 100%;
    padding: 0 12px;
    span {
      display: inline-block;
      width: auto;
      height: 34px;
      line-height: 34px;
      margin-right: 16px;
      font-style: 16px;
      font-weight: 600;
    }
  }
}
</style>