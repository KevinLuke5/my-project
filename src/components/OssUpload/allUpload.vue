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
    <all-viewer ref="allViewer" :can-download="canDownload" />
  </div>
</template>
<script>
import { uploadImage, uploadFile } from '@base/file'
import { getToken } from '@/utils/auth'

export default {
  props: {
    text: {
      type: String,
      default: '上传文件'
    },
    canUpload: {
      type: Boolean,
      default: true
    },
    type: {
      type: String,
      default: 'file'
    },
    canDownload: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      loading: false,
      fileList: [],
      fileTypes: [
        'zip',
        'rar',
        'pdf',
        'docx',
        'doc',
        'xls',
        'xlsx',
        'csv',
        'ppt',
        'pptx',
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'vnd.ms-excel',
        'vnd.openxmlformats-officedocument.wordprocessingml.document',
        'vnd.openxmlformats-officedocument.presentationml.presentation',
        'x-zip-compressed'
      ],
      excelTypes: [
        'xls',
        'xlsx',
        'csv',
        'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'vnd.ms-excel'
      ],
      pdfTypes: ['pdf'],
      imgTypes: ['jpeg', 'png', 'gif', 'jpg']
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
      let urltype = 'file'
      if (
        file.file &&
        file.file.type &&
        file.file.type.indexOf('image/') !== -1
      ) {
        urltype = 'img'
      }
      if (urltype === 'file') {
        uploadFile([file.file], {
          maxSize: 1024 * 1024 * 100,
          types: this[this.type + 'Types'],
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
          })
          .finally(() => {
            this.loading = false
          })
      } else if (urltype === 'img') {
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
          })
          .finally(() => {
            this.loading = false
          })
      }
    },
    // 处理上传错误
    handleError (file, err) {
      const idx = this.$refs.upload.uploadFiles.findIndex(
        (item) => item.uid === file.uid
      )
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
        type: file.file.type,
        url
      }
      file.file.url = url
      this.fileList.push(curFile)
      this.$emit('getFiles', 'file', this.fileList, curFile, 'add')
    },
    onRemove (file, fileList) {
      this.fileList = fileList
      this.$emit('getFiles', 'file', fileList, file, 'delete')
    },
    onPreview (file) {
      if (
        file &&
        (file.type === 'application/pdf' || file.name.substr(-4) === '.pdf')
      ) {
        this.$refs.allViewer.show(file.url, 'pdf')
      } else if (file && file.type.indexOf('image/') !== -1) {
        this.$refs.allViewer.show(file.url, 'image')
      } else if (
        file &&
        (file.name.substr(-4) === '.xls' ||
          file.name.substr(-5) === '.xlsx' ||
          file.name.substr(-4) === '.csv')
      ) {
        this.$refs.allViewer.show(file.url, 'excel')
      } else {
        this.$refs.allViewer.show(file.url, 'file')
      }
    }
  }
}
</script>