<template>
  <j-dialog :visible.sync="visible" :fullscreen="true" :before-close="close">
    <div class="tab-top-btn">
      <j-button v-show="handle !== 'view'" @click="handleSubmit">
        暂存
      </j-button>
    </div>
    <j-table :data="tableData" width="100%">
      <j-table-column label="序号" type="index" width="55" />
      <j-table-column label="子项" prop="child" />
      <j-table-column label="强制项" prop="mandatory" />
      <j-table-column label="否决项" prop="veto" />
      <j-table-column label="标准" prop="standard" />
      <j-table-column label="分值" prop="score" />
      <j-table-column label="评分标准" prop="scoreStandard" width="200" />
      <j-table-column label="得分" width="200">
        <template slot="header">
          <span style="color: red">*</span>
          <span>得分</span>
        </template>
        <template slot-scope="scope">
          <j-input-number
            v-model="scope.row.acquireScore"
            :precision="0"
            :min="0"
            :max="scope.row.score"
            :disabled="handle === 'view'"
          />
        </template>
      </j-table-column>
      <j-table-column label="审核记录" width="200">
        <template slot="header">
          <span style="color: red">*</span>
          <span>审核记录</span>
        </template>
        <template slot-scope="scope">
          <j-input v-model="scope.row.record" type="textarea" :disabled="handle === 'view'" />
        </template>
      </j-table-column>
      <j-table-column label="评价状态" width="90">
        <template slot-scope="scope">
          <j-switch
            v-model="scope.row.evaluateStatus"
            active-color="#C0CCDA"
            inactive-color="#13ce66"
            :active-value="1"
            :inactive-value="0"
            :disabled="handle === 'view'"
          />
          {{ scope.row.evaluateStatus === 1 ? '剔除' : '有效' }}
        </template>
      </j-table-column>
      <j-table-column label="图片" width="200">
        <template slot-scope="scope">
          <img-upload
            :ref="'imgUpload' + scope.$index"
            v-model="scope.row.picture"
            :can-upload="handle !== 'view'"
            @getFiles="getFiles(arguments, scope.row)"
          />
        </template>
      </j-table-column>
      <j-table-column label="文档" width="200">
        <template slot-scope="scope">
          <file-upload
            :ref="'fileUpload' + scope.$index"
            v-model="scope.row.picture"
            :can-upload="handle !== 'view'"
            @getFiles="getFiles(arguments, scope.row)"
          />
        </template>
      </j-table-column>
      <j-table-column label="视频" width="200">
        <template slot-scope="scope">
          <video-upload
            :ref="'videoUpload' + scope.$index"
            v-model="scope.row.picture"
            :can-upload="handle !== 'view'"
            @getFiles="getFiles(arguments, scope.row)"
          />
        </template>
      </j-table-column>
    </j-table>
    <j-form>
      <j-form-item label="评价意见">
        <j-input
          v-model="advice"
          :rows="3"
          type="textarea"
          :disabled="handle === 'view'"
        />
      </j-form-item>
    </j-form>
  </j-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default () {
        return false
      }
    },
    handle: {
      type: String,
      default: 'add'
    }
  },
  data () {
    return {
      tableData: [],
      advice: ''
    }
  },
  methods: {
    initData (tableData, advice) {
      this.tableData = tableData
      this.advice = advice
      // console.log(tableData)
      // 批量设置上传的文件
      this.$nextTick(() => {
        // console.log(this.$refs)
        // console.log(this.$refs['imgUpload' + 0].fileList)
        // debugger
        tableData.forEach((row, index) => {
          this.$refs['imgUpload' + index]
            ? (this.$refs['imgUpload' + index].fileList =
                row.picture && row.picture.photograph
                  ? row.picture.photograph
                  : [])
            : ''
          this.$refs['fileUpload' + index]
            ? (this.$refs['fileUpload' + index].fileList =
                row.picture && row.picture.file ? row.picture.file : [])
            : ''
          this.$refs['videoUpload' + index]
            ? (this.$refs['videoUpload' + index].fileList =
                row.picture && row.picture.video ? row.picture.video : [])
            : ''
        })
      })
    },
    tableValid () {
      return this.tableData.every(
        (row) =>
          row.acquireScore >= 0 &&
          row.acquireScore <= row.score &&
          (row.acquireScore === row.score || (row.record && row.record.trim()))
      )
    },
    handleSubmit () {
      // if (this.advice && this.advice.trim()) {
      // 去掉全部打分校验
      // if (this.tableValid()) {
      // console.log(this.tableData)
      // 实际得分
      const realTotal = this.tableData.reduce((total, item) => {
        if (item.evaluateStatus === 1) {
          // 剔除项不参与计算
          return total
        } else {
          return total + item.acquireScore
        }
      }, 0)
      // 标准分值
      const projectScore = this.tableData.reduce((total, item) => {
        if (item.evaluateStatus === 1) {
          return total
        } else {
          return total + item.score
        }
      }, 0)
      this.$emit('result', this.tableData, realTotal, projectScore, this.advice)
      // } else {
      //   this.showMessage('请完成全部打分！得分不是满分时审核记录必填！')
      // }
      // } else {
      //   this.showMessage('请填写评价意见！')
      // }
    },
    getFiles (args, row) {
      // args 包含 type, fileList, file, handle
      if (args[0] && args[1]) {
        if (!row.picture) {
          // picture没有数据是null, 先构建结构否则后面报错
          row.picture = {
            photograph: [],
            file: [],
            video: []
          }
        }
        if (args[0] === 'img') {
          row.picture.photograph = args[1]
        } else if (args[0] === 'video') {
          row.picture.video = args[1]
        } else if (args[0] === 'file') {
          row.picture.file = args[1]
        }
      }
    },
    close () {
      this.$emit('close')
    }
  }
}
</script>