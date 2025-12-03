<template>
  <j-dialog :visible.sync="showPdf" :fullscreen="true" :modal="false">
    <j-button v-if="canDownload" @click="download">
      下载
    </j-button>
    <pdf
      :src="pdfUrl"
      :page="currentPage"
      style="height:calc(80vh);overflow-y:scroll;"
      @num-pages="pageCount = $event"
      @page-loaded="currentPage = $event"
      @loaded="loadPdfHandler"
    />
    <span slot="footer" class="dialog-footer">
      <j-row type="flex" class="row-bg" justify="center">
        <j-col :span="3"><j-button type="text" @click="changePdfPage(0)">上一页</j-button></j-col>
        <j-col :span="3"><j-button type="text" disabled style="color: black">{{ currentPage }} / {{ pageCount }}</j-button></j-col>
        <j-col :span="3"><j-button type="text" @click="changePdfPage(1)">下一页</j-button></j-col>
      </j-row>
    </span>
  </j-dialog>
</template>
<script>
import pdf from 'vue-pdf'
import { filesView } from '@/api/upload'

export default {
  components: { pdf },
  props: {
    canDownload: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showPdf: false,
      pdfUrl: '',
      currentPage: 0, // pdf文件页码
      pageCount: 0 // pdf文件总页数
    }
  },
  methods: {
    show (url) {
      filesView({
        bucket: 'jy-srm',
        region: 'oss-cn-hangzhou',
        account: 'ramoss',
        objectName: url
      }).then((result) => {
        if (result.code === '0' && result.data.fileUrl) {
          this.pdfUrl = result.data.fileUrl
          this.showPdf = true
          this.loadPdfHandler()
        } else {
          this.showMessage(result.message)
        }
      })
    },
    // pdf加载时
    loadPdfHandler (e) {
      this.currentPage = 1 // 加载的时候先加载第一页
      this.pageRotate = 0
    },
    changePdfPage (val) {
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
      }
    },
    download () {
      window.open(this.pdfUrl)
    }
  }
}
</script>