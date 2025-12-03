<template>
  <div v-if="!item.hidden && item.children" class="menu-wrapper">
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link :to="resolvePath(onlyOneChild.path)">
        <j-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item v-if="onlyOneChild.meta" :icon="onlyOneChild.meta.icon||item.meta.icon" :title="onlyOneChild.meta.title" />
        </j-menu-item>
      </app-link>
    </template>
    <!-- <template v-if="item.children.length === 0">
      <app-link :to="resolvePath(item.path)">
        <j-menu-item :index="resolvePath(item.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <item v-if="item.meta" :icon="item.meta.icon" :title="item.meta.title" />
        </j-menu-item>
      </app-link>
    </template> -->

    <j-submenu v-else ref="submenu" :index="resolvePath(item.path)">
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta.icon" :title="item.meta.title" />
      </template>

      <template v-if="hidden">
        <div v-for="(child,index) in item.children" :key="index">
          <sidebar-item
            v-if="child.children&&child.children.length>0"
            :key="child.path"
            :is-nest="true"
            :item="child"
            :base-path="resolvePath(child.path)"
            class="nest-menu"
          />
          <app-link v-else :key="child.name" :to="resolvePath(child.path)">
            <j-menu-item :index="resolvePath(child.path)">
              <item v-if="child.meta" :icon="child.meta.icon" :title="child.meta.title" />
            </j-menu-item>
          </app-link>
        </div>
      </template>
    </j-submenu>
  </div>
</template>

<script>

import path from 'path'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'
import { isExternal } from '@/utils/validate'
import Layout from '@/layout/index'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      onlyOneChild: null
    }
  },
  computed: {
    hidden: function () {
      return this.item.children.filter(function (child) {
        return child.hidden
      })
    }
  },
  methods: {
    handleRouterPush (e) {
      this.$router.push(`/${e}`)
    },
    hasOneShowingChild (children, parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      if (showingChildren.length === 0) {
        this.onlyOneChild = { ...parent, path: '', noShowingChildren: true, component: Layout }
        return true
      }

      return false
    },
    handleId () {
      console.log('handleId')
    },
    resolvePath (routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)   // 将相对路径转化为绝对路径
    },
    isExternalLink (routePath) {
      return isExternal(routePath)
    }
  }
}
</script>