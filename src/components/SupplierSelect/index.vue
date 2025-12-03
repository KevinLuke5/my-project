<template>
  <!-- 经销商模糊搜索 -->
  <j-select
    v-bind="$attrs"
    filterable
    clearable
    remote
    reserve-keyword
    :remote-method="selectSearch"
    :loading="remoteLoading"
    placeholder="请输入供应商名称"
    v-on="$listeners"
  >
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
  name: 'SupplierSelect',
  data () {
    return {
      remoteLoading: false,
      selectOptions: []
    }
  },
  methods: {
    selectSearch (str) {
      if (!str) return
      const params = {
        name: str
      }
      this.remoteLoading = true
      clearTimeout(this.selecttimeout)
      this.selectTimeout = setTimeout(() => {
        commonApi.getSupplierName(params).then(res => {
          this.remoteLoading = false
          if (res && Number(res.code) === 0) {
            res.data = res.data || []
            this.selectOptions = res.data.map(coupon => {
              return {
                label: coupon.name,
                value: coupon.id
              }
            })
            this.$emit('currentResult', window._clone(res.data || []))
          } else {
            this.selectOptions = []
          }
        }).catch(() => {
          this.selectOptions = []
        })
      }, 1500)
    }
  }
}
</script>
