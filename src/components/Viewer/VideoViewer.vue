<template>
  <j-dialog
    :visible.sync="showFile"
    :modal="false"
    :center="true"
    width="700px"
  >
    <video
      :src="fileUrl"
      width="600"
      height="450"
      controls
    />
  </j-dialog>
</template>
<script>
import { filesView } from '@/api/upload'

export default {
  data () {
    return {
      showFile: false,
      fileUrl: ''
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
          this.fileUrl = result.data.fileUrl
          this.showFile = true 
        } else {
          this.showMessage(result.message)
        }
      })
    }
  }
}
</script>