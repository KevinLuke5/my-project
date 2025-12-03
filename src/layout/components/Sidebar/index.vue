<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo v-if="showLogo" :collapse="isCollapse" />
    <j-scrollbar style="margin-top: 10px; padding-bottom: 50px" wrap-class="scrollbar-wrapper">
      <j-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#fff"
        text-color="#303133"
        :unique-opened="$store.state.settings.uniqueOpened"
        active-text-color="#f57c14"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in permission_routers"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        >
          {{ route }}
        </sidebar-item>
      </j-menu>
    </j-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar']),
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    showLogo () {
      return this.$store.state.settings.sidebarLogo
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  }
}
</script>
<style lang="less">
.has-logo {
  .el-submenu__title,
  .el-menu-item {
    font-size: 14px;
    height: 46px;
    line-height: 46px;
  }
}
.el-submenu__title,
.el-menu-item {
  font-size: 14px;
  height: 46px;
  line-height: 46px;
}
</style>