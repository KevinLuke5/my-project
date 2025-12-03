<template>
  <j-dialog
    :visible.sync="visible"
    :modal="false"
    :before-close="close"
    width="450px"
  >
    <j-form
      inline
      size="mini"
      class="head-container"
      label-position="left"
      label-width="93px"
    >
      <j-form-item label="选择标准">
        <j-autocomplete
          v-model="keyword"
          style="width: 388px"
          popper-class="search-autocomplete"
          :fetch-suggestions="searchStandard"
          :trigger-on-focus="false"
          :debounce="800"
          placeholder="请输入标准名称或编码搜索"
          @select="setStandard"
        >
          <template slot-scope="{ item }">
            <div class="name">
              {{ item.standardName }}
            </div>
            <span class="code">{{ item.standardCode }}</span>
          </template>
        </j-autocomplete>
      </j-form-item>
    </j-form>
    <span slot="footer" class="dialog-footer">
      <j-button @click="close">取消</j-button>
      <j-button type="primary" @click="dataConfirm">导入</j-button>
    </span>
  </j-dialog>
</template>

<script>
import { getStandardNameList } from '@/api/verify/typeVerify'

export default {
  props: {
    visible: {
      type: Boolean,
      default () {
        return false
      }
    },
    type: {
      type: [Number, String],
      default () {
        return 0
      }
    }
  },
  data () {
    return {
      keyword: '',
      result: {}
    }
  },
  methods: {
    searchStandard (queryString, cb) {
      getStandardNameList({
        standardKeyWords: queryString,
        type: this.type
      }).then((res) => {
        if (res.code === '0' && res.data) {
          cb(res.data)
        } else {
          cb([])
        }
      })
    },
    setStandard (item) {
      this.keyword = item.standardName
      this.result = item
    },
    dataConfirm () {
      if (this.result.id) {
        this.$emit('result', this.result.id)
      } else {
        this.showMessage('请先选择标准！')
      }
    },
    close () {
      this.keyword = ''
      this.result = {}
      this.$emit('close')
    }
  }
}
</script>
