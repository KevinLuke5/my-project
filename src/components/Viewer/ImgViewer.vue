<template>
  <span />
</template>
<script>
import 'viewerjs/dist/viewer.css'
import { api as viewerApi } from 'v-viewer'
import { filesView } from '@/api/upload'

export default {
  props: {
    canDownload: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      viewer: null,
      options: {
        toolbar: false,
        navbar: false,
        zIndex: 99999,
        movable: false // 是否可拖拽移动
      }
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
          this.viewer = viewerApi({
            options: {
              viewed () { // 图片显示后
                if (!this.canDownload) {
                // 获取图片预览容器，禁掉右键菜单，防止下载图片
                  document.getElementsByClassName('viewer-canvas')[0].oncontextmenu = () => false
                }
              },
              ...this.options
            },
            images: [result.data.fileUrl]
          })
        } else {
          this.showMessage(result.message)
        }
      })
    }
  }
}
</script>