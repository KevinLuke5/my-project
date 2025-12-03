<template>
  <div>
    <j-dialog
      title="流程图"
      :visible.sync="dialog"
      append-to-body
      top="20vh"
      width="40%"
      :before-close="handleClose"
    >
      <iframe
        :src="flowChart"
        frameborder="0"
        width="100%"
        height="400px"
      />
    </j-dialog>
  </div>
</template>

<script>
export default {
  name: 'FlowChart',
  // inject: ['init'],
  props: {
    flowChart: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      dialog: false
    }
  },
  computed: {},
  watch: {},
  mounted () {
    console.log(this.flowChart)
  },
  methods: {
    handleClose (done) {
      // this.$confirm(this.$t("message.closeDrawerComfirm"))
      //   .then(_ => {
      //     this.cancel();
      //   })
      //   .catch(_ => { });
      this.cancel()
    },
    cancel () {
      // console.log("关闭窗口")
      this.dialog = false
    }
  }
}
</script>

<style lang="less" scoped>
.bottom {
  margin-top: 20px;
  padding: 0 20px;
  display: flex;
  justify-content: flex-end;
}
</style>