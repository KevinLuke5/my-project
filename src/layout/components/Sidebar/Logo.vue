<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }" @click="changeSystem">
    <transition name="sidebarLogoFade">
      <div v-if="collapse" key="collapse" class="sidebar-logo-link">
        <h1 class="sidebar-title">
          SRM
        </h1>
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">
          {{ title }}
        </h1>
      </div>
      <div v-else key="expand" class="sidebar-logo-link">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title">
          {{ title }}
        </h1>
      </div>
    </transition>
    <j-dialog
      title="系统切换"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="400px"
    >
      <div class="d-center">
        <j-select v-model="value" style="width: 100%" placeholder="请选择">
          <j-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </j-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <j-button @click="dialogVisible = false">
          取 消
        </j-button>
        <j-button type="primary" @click="confirm">确 定</j-button>
      </span>
    </j-dialog>
  </div>
</template>

<script>
import Logo from '@/assets/images/logo.png'
// import { getSystem } from "@/api/system/menuS.js"
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      value: '',
      options: [],
      dialogVisible: false,
      title: 'SRM-供应商协同门户',
      logo: ''
      // logo: Logo
    }
  },
  methods: {
    changeSystem () {
      // const val = window.sessionStorage.getItem("id")
      // if (val) {
      //   this.value = val
      // }
      // getSystem().then(res => {
      //   this.options = res.data
      //   this.dialogVisible = true
      // })
    },
    confirm () {
      window.sessionStorage.setItem('id', this.value)
      this.dialogVisible = false
      // this.$router.push("/dashboard");
      window.location.href = window.location.href.replace(/[#].*$/, '#/')
      window.location.reload()
    }
  }
}
</script>

<style lang="less" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}
.d-center {
  margin: 0 auto;
  width: 250px;
}
.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  margin-top: 10px;
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    cursor: pointer;
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 150px;
      vertical-align: middle;
      margin-right: 6px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      font-weight: 600;
      line-height: 50px;
      font-size: 18px;
      // font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      font-family: "Microsoft YaHei";
      vertical-align: middle;
      color: #EB6100;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
