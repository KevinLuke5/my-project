<template>
  <!-- srm字典数据下拉选择 -->
  <j-select v-bind="$attrs" clearable v-on="$listeners">
    <j-option
      v-for="item in selectOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </j-select>
</template>

<script>
import * as commonApi from '@/api/common'

export default {
  name: 'DicSrmSelect',
  props: {
    code: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      selectOptions: []
    }
  },
  mounted () {
    this.fetchOptions()
  },
  methods: {
    // options内容请求
    fetchOptions () {
      commonApi.getCodeDetailList({
        code: this.code
      }).then(res => {
        res.data = res.data || []
        this.selectOptions = (window._get(res, 'data') || []).map(item => {
          return {
            label: item.name,
            value: item.lineNumber
          }
        })
        this.$emit('currentResult', window._clone(res.data))
      }).catch(() => {
        this.selectOptions = []
      })
    }
  }
}
</script>
