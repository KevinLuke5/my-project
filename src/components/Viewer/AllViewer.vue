<template>
  <div v-loading.fullscreen.lock="loading" element-loading-text="拼命读取中">
    <j-dialog :visible.sync="showExcel" :fullscreen="true" :modal="false">
      <j-button v-if="canDownload" @click="download">
        下载
      </j-button>
      <j-tabs tab-position="bottom" lazy @tab-click="loadExcelTable">
        <j-tab-pane v-for="tab in excelHtmlList" :key="tab.sheetName" :label="tab.sheetName">
          <div class="excel-table" v-html="tab.html" />
          <!-- <div :id="tab.sheetName" class="excel-table" /> -->
        </j-tab-pane>
      </j-tabs>
    </j-dialog>
    <j-dialog title="提示" :visible.sync="excelErrVisible" width="30%">
      <span>{{ errMsg }}请下载查看！</span>
      <span slot="footer" class="dialog-footer">
        <j-button @click="excelErrVisible = false">取 消</j-button>
        <j-button type="primary" @click="excelDownload">下 载</j-button>
      </span>
    </j-dialog>
    <j-dialog :visible.sync="showPdf" :fullscreen="true" :modal="false">
      <j-button v-if="canDownload" @click="download">
        下载
      </j-button>
      <pdf
        :src="fileUrl"
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
  </div>
</template>
<script>
import pdf from 'vue-pdf'
import 'viewerjs/dist/viewer.css'
import { api as viewerApi } from 'v-viewer'
import { filesView } from '@/api/upload'
import { excelToHtml } from '@/utils/excel'

export default {
  components: { pdf },
  props: {
    canDownload: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      loading: false,
      viewer: null,
      options: {
        toolbar: false,
        navbar: false,
        zIndex: 99999,
        movable: false // 是否可拖拽移动
      },
      showPdf: false,
      fileUrl: '',
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      showExcel: false,
      excelHtml: '',
      excelHtmlList: [],
      excelErrVisible: false,
      errMsg: ''
    }
  },
  methods: {
    show (url, type) {
      // this.loading = true
      filesView({
        bucket: 'jy-srm',
        region: 'oss-cn-hangzhou',
        account: 'ramoss',
        objectName: url
      }).then((result) => {
        if (result.code === '0' && result.data.fileUrl) {
          this.fileUrl = result.data.fileUrl
          if (type === 'image') {
            this.viewer = viewerApi({
              options: {
                viewed () {
                  // 图片显示后
                  // 获取图片预览容器，禁掉右键菜单，防止下载图片
                  document.getElementsByClassName(
                    'viewer-canvas'
                  )[0].oncontextmenu = () => false
                },
                ...this.options
              },
              images: [result.data.fileUrl]
            })
          } else if (type === 'pdf') {
            this.showPdf = true
            this.loadPdfHandler()
          } 
          // else if (type === 'excel') {
          //   // Excel预览
          //   excelToHtml(result.data.fileUrl).then((data) => {
          //     const { excelHtmlList, excelHtml } = data
          //     this.excelHtmlList = excelHtmlList
          //     this.excelHtml = excelHtml
          //     this.showExcel = true
          //     this.$nextTick(() => {
          //       this.loadExcelTable({ label: excelHtmlList[0].sheetName, index: 0 })
          //     })
          //   }).catch((err) => {
          //     if (err.isTooMuch) {
          //       this.errMsg = err.msg
          //       this.excelErrVisible = true
          //     } else {
          //       this.showMessage(err.msg)
          //     }
          //   }).finally(() => {
          //     this.loading = false
          //   })
          // } 
          else {
            if (this.canDownload) {
              window.open(result.data.fileUrl)
            } else {
              this.showMessage('本文件不允许下载！')
            }
          }
        } else {
          this.showMessage(result.message)
        }
      })
    },
    loadExcelTable (tab) {
      console.log('点击tab', tab.label, tab.index)
      console.log(this.excelHtmlList[tab.index])
      console.log(document.getElementById(tab.label))
      // document.getElementById(tab.label).innerHTML = this.excelHtmlList[tab.index].html
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
      window.open(this.fileUrl)
    },
    excelDownload () {
      this.excelErrVisible = false
      console.log(this.fileUrl)
      window.open(this.fileUrl)
    }
  }
}
</script>