<template>
  <j-dialog
    title="交货排程新增"
    :visible.sync="detailVisible"
    :modal="false"
    :before-close="close"
    :fullscreen="false"
  >
    <!-- 表格 -->
    <j-table
      ref="multipleTable"
      v-loading="loading"
      :data="tableData"
      border
      size="small"
      style="width: 100%"
      tooltip-effect="dark"
      highlight-current-row
    >
      <j-table-column prop="index" label="操作" width="60">
        <template slot-scope="scope">
          <j-button type="primary" class="primary" @click="addOrReduce(scope.$index)">
            {{ scope.$index === 0 ? '+' : '-' }}
          </j-button>
        </template>
      </j-table-column>
      <j-table-column type="index" label="序号" />
      <j-table-column prop="name" label="物料编码" />
      <j-table-column prop="attributesOne" label="物料描述" />
      <j-table-column prop="attributesTwo" label="订单量" />
      <j-table-column prop="attributesThree" label="交货排程量">
        <template slot-scope="scope">
          <j-input v-model="scope.row.attributesThree" />
        </template>
      </j-table-column>
      <j-table-column prop="attributesFour" label="交货日期">
        <template slot-scope="scope">
          <j-input v-model="scope.row.attributesFour" />
        </template>
      </j-table-column>
    </j-table>
    <j-button
      type="primary"
      class="button-save"
      size="medium"
      @click="save(scope.row)"
    >
      保存
    </j-button>
  </j-dialog>
</template>

<script>
import { getDetails } from '@/api/base/codeManage'

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
      tableData: [
        {
          name: '阿的萨达',
          attributesOne: '123',
          attributesTwo: '3123',
          attributesThree: '4144',
          attributesFour: '44444'
        }
      ],
      selectList: [],
      codeId: ''
    }
  },
  mounted () {
    // this.height = this.getHeight()
  },
  methods: {
    addOrReduce (index) {
      if (index === 0) {
        const newData = {
          name: '阿的萨达',
          attributesOne: '123',
          attributesTwo: '3123',
          attributesThree: '',
          attributesFour: ''
        }
        this.tableData.push(newData)
      } else {
        this.tableData.splice(index, 1)
      }
    },
    save () {

    },
    getDetailTable (id) {
      this.codeId = id
      getDetails({ id: id }).then((res) => {
        if (res.code === '0') {
          this.tableData = res.data
        }
      })
    },
    close () {
      this.$emit('detailClose')
    }
  }
}
</script>
<style lang="less" scoped>
.primary {
  color: #FF6D36;
  /deep/ span {
    color: #fff !important;
  }
}
/deep/ .el-dialog__body {
  position: relative;
  padding-bottom: 75px !important;
  .button-save {
    margin-top: 20px;
    position: absolute;
    right: 20px;
  }
}
</style>
