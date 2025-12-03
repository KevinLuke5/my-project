<template>
  <div>
    <j-dialog
      title="我要批示"
      :visible.sync="dialog"
      append-to-body
      top="20vh"
      width="30%"
      :before-close="handleClose"
    >
      <j-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        class="ruleForm"
      >
        <j-form-item prop="isAgree">
          <j-radio v-model="ruleForm.isAgree" :label="1">
            同意
          </j-radio>
          <j-radio v-model="ruleForm.isAgree" :label="0">
            不同意
          </j-radio>
        </j-form-item>
        <j-form-item prop="judgement">
          <div><span slot="label">批示意见</span></div>
          <j-input
            v-model="ruleForm.judgement"
            :rows="4"
            maxlength="100"
            show-word-limit
            type="textarea"
          />
        </j-form-item>
      </j-form>
      <div class="bottom">
        <j-button
          :loading="loading"
          type="primary"
          size="mini"
          @click="submitForm"
        >
          保存
        </j-button>
        <j-button size="mini" @click="cancel">
          取消
        </j-button>
      </div>
    </j-dialog>
  </div>
</template>

<script>
import { finish } from '@/api/kpi/oa'
export default {
  name: 'ComMent',
  props: {
    waitId: {
      type: String,
      required: true
    },
    requestId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      ruleForm: {
        isAgree: '',
        judgement: ''
      },
      rules: {
        isAgree: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        judgement: [
          { required: true, message: '请输入批示意见', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    handleClose () {
      this.$confirm('确定关闭吗？未保存数据将会丢失')
        .then((_) => {
          this.cancel()
        })
        .catch((_) => {})
    },
    submitForm () {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          const addForm = {
            isAgree: this.ruleForm.isAgree,
            judgement: this.ruleForm.judgement,
            waitId: this.waitId,
            requestId: this.requestId
            // typeStatus: 1
          }
          this.loading = true
          finish(JSON.stringify(addForm))
            .then((res) => {
              if (res) {
                if (res.code === '0') {
                  this.$notify({
                    title: '批示成功',
                    type: 'success',
                    duration: 1000
                  })
                  this.cancel()
                  // this.init()
                  this.$emit('close')
                } else {
                  this.$notify({
                    title: res.message || '批示失败',
                    type: 'error',
                    duration: 1500
                  })
                }
              }
            })
            .finally(() => {
              this.loading = false
            })
        } else {
          return false
        }
      })
      
    },
    cancel () {
      this.dialog = false
      this.loading = false
      this.ruleForm = {
        isAgree: '',
        judgement: ''
      }
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