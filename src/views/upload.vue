<template>
  <j-dialog
    title="导入"
    :visible.sync="visible"
    :before-close="close"
    width="400px"
  >
    <j-upload
      ref="upload"
      :limit="limit"
      :show-file-list="true"
      :auto-upload="false"
      :action="uploadUrl"
      :on-exceed="exceedWarn"
      :on-success="uploadSuccess"
    >
      <j-button slot="trigger" size="mini" type="info">
        选取文件
      </j-button>
      <j-button
        style="margin-left: 10px"
        size="mini"
        type="primary"
        @click="submitUpload"
      >
        提交
      </j-button>
      <div slot="tip" class="j-upload__tip" style="margin-top:8px">
        只能上传Excel文件
        <span class="downloadLink" @click="importTemDownload">模板点击下载</span>
      </div>
    </j-upload>
  </j-dialog>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
    visible: Boolean,
    uploadUrl: {
      type: String,
      default: ''
    },
    showTemDownload: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
    }
  },
  methods: {
    submitUpload () {
      this.$refs.upload.headers['Authorization'] = getToken()
      this.$refs.upload.submit()
    },
    uploadSuccess (res) {
      if (res.code === '0') {
        this.$message({
          message: '导入成功',
          type: 'success'
        })
        this.close()
      } else {
        // this.$refs.upload.clearFiles()
        this.$message({
          message: res.message,
          type: 'warning'
        })
      }
    },
    exceedWarn () {
      this.$message({
        message: `只能选择${this.limit}个文件上传`,
        type: 'warning'
      })
    },
    close () {
      this.$refs.upload.clearFiles()
      this.$emit('close')
    },
    importTemDownload () {
      this.$emit('handleImportTem')
    }
  }
}
</script>
<style>
.downloadLink {
  font-weight: 700;
  cursor: pointer;
  text-decoration: underline;
  color: #f66500;
}
.downloadLink:hover {
  color: #f88433;
  transition: color 1s ease;
}
.j-upload__tip {
  margin-top: 10px;
}
</style>