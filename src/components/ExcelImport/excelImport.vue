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
      :action="importUrl"
      :on-exceed="exceedWarn"
      :on-success="uploadSuccess"
      :data="importForm"
      :before-upload="beforeAvatarUpload"
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
        <span v-show="isTemplate" class="downloadLink" @click="importTemDownload">模板点击下载</span>
      </div>
    </j-upload>
  </j-dialog>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  props: {
    visible: Boolean,
    importUrl: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 1
    },
    importForm: {
      type: Object,
      default () {
        return {}
      }
    },
    fileSize: {
      type: Number,
      default: 50
    },
    isTemplate: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      fileList: []
    }
  },
  methods: {
    beforeAvatarUpload (file) {
      const isFileSize = file.size / 1024 / 1024 < this.fileSize
      if (!isFileSize) {
        this.$message.error(`上传文件大小不能超过 ${this.fileSize}MB!`)
        this.$refs.upload.abort()
      }
      return isFileSize
    },
    submitUpload () {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message({
          message: '请先选择文件',
          type: 'warning'
        })
        return
      }
      this.$refs.upload.headers['Authorization'] = getToken()
      this.$refs.upload.submit()
    },
    uploadSuccess (res, file, fileList) {
      if (res.code === '0') {
        this.$message({
          message: '导入成功',
          type: 'success'
        })
        this.$emit('succesImport', res.data)
        this.close()
      } else {
        // file.status = 'ready'
        // this.fileList = [file]
        this.$refs.upload.clearFiles()
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
      this.$emit('handleTem')
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