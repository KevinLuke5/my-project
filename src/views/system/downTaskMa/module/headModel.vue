<template>
  <div class="head-container">
    <!-- 多类型查询提供 -->
    <div class="select">
      <div class="item">
        <span>文件名称</span>
        <j-input
          v-model="query.originalName"
          clearable
          placeholder="输入关键字搜索"
          style="width: 200px;"
          size="small"
          @keyup.enter.native="handleSearch"
        />
      </div>
    </div>
    <div class="button">
      <!-- 搜索 -->
      <j-button size="mini" type="primary" @click="handleSearch">
        搜索
      </j-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "HeadModel",
  props: {
    // 接收一个对象，直接绑定到搜索选项
    query: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  methods: {
    handleSearch () {
      this.$emit("handleSearch")
    }
  }
}
</script>
<style lang="less" scoped>
.head-container {
  padding-bottom: 0;
}
.select {
  // width: 100%;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  .item {
    margin: 10px 10px 0 0;
    span {
      display: inline-block;
      width: 70px;
      line-height: 30px;
      color: #37414a;
      font-size: 12px;
      font-weight: 600;
    }
  }
}
.button {
  display: flex;
  justify-content: flex-end;
}
</style>
