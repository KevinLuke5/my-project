<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  data () {
    return {
      time: null
    }
  },
  watch: {
    $route (to, from) {
      if (to.query.isHideMenu) {
        this.$store.commit('SET_Hide', false)
      } else {
        this.$store.commit('SET_Hide', true)
      }
    }
  },
  mounted () {
    this.addWatermark('', '', { opacity: 0.3, angle: 15, width: 210, height: 120, fontSize: '14px' })
  },
  methods: {
    date_format (micro_second) {
      // 总秒数
      var second = Math.floor(micro_second / 1000)
      // 分钟
      var min = Math.floor(second / 60 % 60)
      if (min > 10) {
        return false
      }
      // 秒
      var sec = Math.floor(second % 60)
      return min + '分钟' + sec + '秒'
    }
  }
}
</script>
<style lang="less">
@import "~@/assets/styles/reset.less";
@import "~@/assets/styles/variables.less";

#app {

  .main-container {
    min-height: 100%;
    transition: margin-left .28s;
    margin-left: @sideBarWidth;
    position: relative;
  }

  .sidebar-container {
    transition: width 0.28s;
    width: @sideBarWidth !important;
    background-color: @menuBg;
    height: 100%;
    position: fixed;
    font-size: 0;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
    overflow: hidden;

    // reset element-ui css
    .horizontal-collapse-transition {
      transition: 0s width ease-in-out, 0s padding-left ease-in-out, 0s padding-right ease-in-out;
    }

    .scrollbar-wrapper {
      overflow-x: hidden !important;
    }

    .el-scrollbar__bar.is-vertical {
      right: 0;
    }

    .el-scrollbar {
      height: 100%;
    }

    &.has-logo {
      .el-scrollbar {
        height: calc(100% - 50px);
      }
    }

    .is-horizontal {
      display: none;
    }

    a {
      display: inline-block;
      width: 100%;
      overflow: hidden;
    }

    .svg-icon {
      margin-right: 16px;
    }

    .el-menu {
      border: none;
      height: 100%;
      width: 100% !important;
    }

    // menu hover
    .submenu-title-noDropdown,
    .el-submenu .el-submenu__title {
      &:hover {
        background-color: @menuHover !important;
        color: @menuHoverText !important;
      }
    }

    .is-active>.el-submenu__title {
      color: @subMenuActiveText !important;
      font-weight: 700;
    }

    & .nest-menu .el-submenu>.el-submenu__title,
    & .el-submenu .el-menu-item {
      min-width: @sideBarWidth !important;
      background-color: @subMenuBg !important;

      &:hover {
        background-color: @subMenuHover !important;
        color: @menuHoverText !important;
      }
    }
  }

  .hideSidebar {
    .sidebar-container {
      width: 54px !important;
    }

    .main-container {
      margin-left: 54px;
    }

    .submenu-title-noDropdown {
      padding: 0 !important;
      position: relative;

      .el-tooltip {
        padding: 0 !important;

        .svg-icon {
          margin-left: 20px;
        }
      }
    }

    .el-submenu {
      overflow: hidden;

      &>.el-submenu__title {
        padding: 0 !important;

        .svg-icon {
          margin-left: 20px;
        }

        .el-submenu__icon-arrow {
          display: none;
        }
      }
    }

    .el-menu--collapse {
      .el-submenu {
        &>.el-submenu__title {
          &>span {
            height: 0;
            width: 0;
            overflow: hidden;
            visibility: hidden;
            display: inline-block;
          }
        }
      }
    }
  }

  .el-menu--collapse .el-menu .el-submenu {
    min-width: @sideBarWidth !important;
  }

  // mobile responsive
  .mobile {
    .main-container {
      margin-left: 0;
    }

    .sidebar-container {
      transition: transform .28s;
      width: @sideBarWidth !important;
    }

    &.hideSidebar {
      .sidebar-container {
        pointer-events: none;
        transition-duration: 0.3s;
        transform: translate3d(-@sideBarWidth, 0, 0);
      }
    }
  }

  .withoutAnimation {

    .main-container,
    .sidebar-container {
      transition: none;
    }
  }
}

// when menu collapsed
.el-menu--vertical {
  &>.el-menu {
    .svg-icon {
      margin-right: 16px;
    }
  }

  .nest-menu .el-submenu>.el-submenu__title,
  .el-menu-item {
    &:hover {
      // you can use @subMenuHover
      background-color: @menuHover !important;
      color: @menuHoverText !important;
    }
  }

  // the scroll bar appears when the subMenu is too long
  >.el-menu--popup {
    max-height: 100vh;
    overflow-y: auto;

    &::-webkit-scrollbar-track-piece {
      background: #d3dce6;
    }

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-thumb {
      background: #99a9bf;
      border-radius: 20px;
    }
  }
}
</style>
