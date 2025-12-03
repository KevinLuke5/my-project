<template>
  <div class="dashboard-container">
    123
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Home',
  components: {},
  computed: {
    ...mapGetters([
      'roles'
    ])
  }
}
</script>

<style lang="less" scoped>
.dashboard-editor-container {
  min-height: 1000px;
  padding: 18px 22px 22px 22px;
  background-color: #f5f6fa;

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
