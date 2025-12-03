<template>
  <div id="nav-container">
    <div class="nav-left">
      <div class="nav-search">
        <j-input v-model="keyword" placeholder="请输入关键词" prefix-icon="el-icon-search" />
      </div>
      <div v-if="menuList.length" class="nav-body">
        <div v-if="submenuList.length" class="center">
          <div v-for="(item, index) in submenuList" :key="index" class="nav-box">
            <div class="nav-title" style="cursor: pointer;" @click="handleChoice(item.href)">
              {{ item.name }}
            </div>
            <div
              v-for="(lable, value) in item.children"
              :key="value"
              class="nav-child"
              @click="handleChoice(lable.href)"
            >
              {{ lable.name }}
            </div>
          </div>
        </div>
        <div v-else class="center">
          <div v-for="(item, index) in menuList" :key="index" class="nav-box">
            <div class="nav-title">
              {{ item.name }}
            </div>
            <div
              v-for="(lable, value) in item.children"
              :key="value"
              class="nav-child"
              @click="handleChoice(lable.href)"
            >
              {{ lable.name }}
            </div>
          </div>
        </div>
      </div>
      <div v-else class="nav-body">
        <div class="error">
          "......该关键词暂无匹配项。"
        </div>
      </div>
    </div>
    <div class="nav-right">
      <div
        v-for="(item, index) in menuList"
        :key="index"
        :class="menuName(index)"
        @click="menuClick(index, item.name)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script>
import { GetMenuTree } from '@/api/system/menuS'
export default {
  name: 'Menus',
  data: () => {
    return {
      menuState: null,
      keyword: '',
      submenuList: [],
      list: []
    }
  },
  computed: {
    // 前端搜索逻辑构建
    menuList: function () {
      if (!this.keyword) {
        return this.list
      }
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.submenuList = []
      const data = this.list
      const newList = []
      for (const i in data) {
        if (data[i].children.length) {
          const newList2 = []
          data[i].children.forEach(item => {
            if (item.name.indexOf(this.keyword) !== -1) {
              newList2.push(item)
            }
          })
          if (newList2.length) {
            newList.push({
              name: data[i].name,
              role: data[i].role,
              children: newList2
            })
          }
        }
      }
      return newList
    }
  },
  created () {
    this.getMenuList()
  },
  methods: {
    // 菜单列表点击
    handleChoice (val) {
      this.$router.push(val)
    },
    // 右侧菜单点击
    menuClick (val, name) {
      if (this.menuState === val) {
        this.menuState = null
        this.submenuList = []
        return
      } else {
        this.menuState = val
      }
      if (name) {
        const data = this.menuList
        for (const i in data) {
          if (data[i].name === name) {
            this.submenuList = data[i].children
          }
        }
      }
    },
    // 获取菜单列表
    getMenuList () {
      GetMenuTree().then(res => {
        if (!res.data.length) {
          this.$message({
            showClose: true,
            dangerouslyUseHTMLString: true,
            message: '<div style="padding: 20px 0;"><strong style="font-size: 16px;">您没有权限访问系统！</strong><div style="margin-top: 20px;">请联系管理员开通权限</div></div>',
            type: 'error',
            duration: 0
          })
        }
        this.list = res.data
      })
    },
    // 右侧菜单栏点击高亮显示
    menuName: function (val) {
      return this.menuState === val ? 'nav-name active' : 'nav-name'
    }
  }
}
</script>
<style lang="less" scoped>
#nav-container {
  padding: 24px;
  min-width: 900px;
  display: flex;
  overflow: hidden;
  background: #f5f6fa;
}
.nav-left {
  padding-right: 1px;
  width: 80%;
  border-right: 1px solid #e6e6e6;
  overflow: hidden;
  .nav-search {
    width: 500px;
    position: fixed;
    input {
      outline: none;
    }
  }

  .nav-body {
    border-top: 1px solid #e6e6e6;
    margin-top: 50px;
    max-height: 72vh;
    overflow: auto;
    .error {
      color: #999;
      margin-top: 20px;
      margin-left: 20px;
      font-size: 14px;
    }
    .center {
      column-count: 3;
      column-width: 200px;
      column-gap: 12px;
    }
    .nav-box {
      display: inline-block;
      margin-bottom: 20px;
      width: 100%;
      break-inside: avoid;
      font-size: 14px;
      line-height: 32px;
      .nav-title {
        color: #333;
        height: 32px;
        margin-bottom: 5px;
      }
      .nav-child {
        padding-left: 10px;
        cursor: pointer;
        height: 32px;
        color: #999;
      }
      .nav-child:hover {
        color: #FF6D36;
        background: #ebeaea;
      }
    }
  }
}
.nav-right {
  margin-top: 40px;
  width: 20%;
  overflow: auto;
  max-height: 72vh;
  .nav-name {
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    padding-left: 20px;
    color: #333;
  }
  .nav-name:hover {
    cursor: pointer;
    color: #FF6D36;
    border-left: 1px solid #FF6D36;
  }
  .nav-name.active {
    cursor: pointer;
    color: #FF6D36;
    border-left: 1px solid #FF6D36;
  }
}
</style>
