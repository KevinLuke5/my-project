<template>
  <div>
    <div class="tab-top-btn">
      <j-button v-auth="'evaluate_update'" @click="handleEdit">
        {{ isLock ? '编辑' : '取消' }}
      </j-button>
      <j-button v-auth="'evaluate_save'" type="primary" @click="handleSubmit">
        保存
      </j-button>
    </div>
    <j-table :data="tableData" width="100%">
      <j-table-column type="index" width="55" />
      <j-table-column label="维度" prop="dimension" />
      <j-table-column label="名称" prop="name" />
      <j-table-column label="分值" width="200">
        <template slot-scope="scope">
          <j-rate v-model="scope.row.score" :disabled="isLock" />
        </template>
      </j-table-column>
      <j-table-column label="结论" width="200">
        <template slot-scope="scope">
          <j-input v-model="scope.row.conclusion" :disabled="isLock" />
        </template>
      </j-table-column>
      <j-table-column label="详情描述" width="200">
        <template slot-scope="scope">
          <j-input v-model="scope.row.describe" :disabled="isLock" />
        </template>
      </j-table-column>
      <j-table-column label="备注" width="200">
        <template slot-scope="scope">
          <j-input v-model="scope.row.remark" :disabled="isLock" />
        </template>
      </j-table-column>
      <j-table-column label="更新时间" prop="updTime" width="200" />
      <j-table-column label="更新人" prop="updUserName" width="200" />
    </j-table>
  </div>
</template>
<script>
import * as poolApi from '@/api/supplier/pool'
const urlType = 'evaluate'

export default {
  data () {
    return {
      isLock: true,
      tableData: [],
      tempTable: [],
      initData: [
        {
          dimension: '专业',
          name: '品质(Q)',
          score: 0,
          conclusion: '',
          describe: '',
          remark: ''
        },
        {
          dimension: '专业',
          name: '价格(C)',
          score: 0,
          conclusion: '',
          describe: '',
          remark: ''
        },
        {
          dimension: '专业',
          name: '交期(D)',
          score: 0,
          conclusion: '',
          describe: '',
          remark: ''
        },
        {
          dimension: '专业',
          name: '服务及环境(S)',
          score: 0,
          conclusion: '',
          describe: '',
          remark: ''
        },
        {
          dimension: '专业',
          name: '创新(I)',
          score: 0,
          conclusion: '',
          describe: '',
          remark: ''
        },
        {
          dimension: '综合',
          name: '综合评价',
          score: 0,
          conclusion: '',
          describe: '',
          remark: ''
        },
        {
          dimension: '行动',
          name: '采购经理',
          score: 0,
          conclusion: '',
          describe: '',
          remark: ''
        }
      ]
    }
  },
  created () {
    this.initTable()
  },
  methods: {
    handleEdit () {
      if (this.isLock) {
        this.isLock = false
        // 保存一下编辑前的数据
        this.tempTable = JSON.parse(JSON.stringify(this.tableData))
      } else {
        this.isLock = true
        // 恢复编辑前的数据
        this.tableData = JSON.parse(JSON.stringify(this.tempTable))
      }
    },
    handleSubmit () {
      const tableData = this.tableData.map((item) =>
        Object.assign({}, item, {
          supplierId: this.$route.query.supplierId,
          questionnaireId: this.$route.query.questionnaireId
        })
      )
      poolApi
        .saveBatchSrmHandle({ type: urlType, collection: tableData })
        .then((res) => {
          if (res.code === '0') {
            this.showMessage('保存成功!', 'success')
            this.isLock = true
          } else {
            this.showMessage(res.message)
          }
        })
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
            if (res.data && res.data.length) {
              this.tableData = res.data
            } else {
              this.tableData = this.initData
            }
          }
        })
    }
  }
}
</script>