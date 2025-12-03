<template>
  <div>
    <j-upload
      ref="upload"
      v-loading="loading"
      action="#"
      :file-list="fileList"
      :http-request="upload"
      :on-remove="onRemove"
      :on-preview="onPreview"
      style="margin-bottom: 15px"
      :disabled="!canUpload"
    >
      <j-button v-show="canUpload">
        {{ text }}
      </j-button>
    </j-upload>
    <img-viewer ref="imgViewer" :can-download="canDownload" />
  </div>
</template>
<script>
import { uploadImage } from '@base/file'
import { getToken } from '@/utils/auth'

export default {
  props: {
    text: {
      type: String,
      default: '上传图片'
    },
    canUpload: {
      type: Boolean,
      default: true
    },
    canDownload: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      loading: false,
      fileList: []
    }
  },
  methods: {
    upload (file) {
      if (!getToken()) {
        this.$message({
          message: '登录失效，请先进行登录再上传！',
          type: 'warning'
        })
        return
      }
      this.loading = true
      uploadImage([file.file], {
        maxSize: 1024 * 1024 * 50,
        tokens: getToken(),
        bucket: 'jy-srm',
        region: 'oss-cn-hangzhou',
        account: 'ramoss'
      })
        .then((res) => {
          if (!res || !res[0]) {
            this.$message({
              message: '上传失败',
              type: 'warning'
            })
            return
          }
          this.setFiles(file, res[0])
        })
        .catch((err) => {
          this.handleError(file, err)
        }).finally(() => {
          this.loading = false
        })
    },
    // 处理上传错误
    handleError (file, err) {
      const idx = this.$refs.upload.uploadFiles.findIndex((item) => item.uid === file.uid)
      this.$refs.upload.uploadFiles.splice(idx, 1) // 去除文件列表失败文件
      this.$message({
        message: err.message,
        type: 'warning'
      })
    },
    // 处理已经上传的文件
    setFiles (file, url) {
      const curFile = {
        uid: file.file.uid,
        name: file.file.name,
        url
      }
      file.file.url = url
      this.fileList.push(curFile)
      this.$emit('getFiles', 'img', this.fileList, curFile, 'add')
    },
    onRemove (file, fileList) {
      this.fileList = fileList
      this.$emit('getFiles', 'img', fileList, file, 'delete')
    },
    onPreview (file) {
      this.$refs.imgViewer.show(file.url)
    }
  }
}
</script>