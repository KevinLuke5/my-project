<template>
  <div class="app-container">
    <j-card class="box-card" shadow="never">
      <j-tabs v-model="activeComponent" :before-leave="beforeTab" @tab-click="handleClick">
        <j-tab-pane
          v-for="tab in tabList"
          :key="tab.key"
          :label="tab.label"
          :name="tab.key"
        />
        <component :is="activeComponent" />
      </j-tabs>
    </j-card>
  </div>
</template>

<script>
// import { srmAuth } from '@/api/supplier/pool'

// tabs里的组件动态导入
const modules = {}
const comps = require.context('../tabs', false, /\.vue$/)
comps.keys().forEach((key) => {
  const comp = comps(key)
  modules[key.replace(/^\.\/(.*)\.\w+$/, '$1')] = comp.default
})

export default {
  name: 'PoolDetail',
  components: modules,
  data () {
    return {
      activeComponent: 'info',
      tabList: []
      // allTabs: [
      //   {
      //     key: 'info',
      //     label: '基本信息',
      //     auth: 'info_get'
      //   },
      //   {
      //     key: 'certificate',
      //     label: '企业证件',
      //     auth: 'certificate_get'
      //   },
      //   {
      //     key: 'structure',
      //     label: '组织架构',
      //     auth: 'structure_get'
      //   },
      //   {
      //     key: 'account',
      //     label: '银行资料',
      //     auth: 'account_get'
      //   },
      //   {
      //     key: 'licence',
      //     label: '认证及合规性',
      //     auth: 'licence_get'
      //   },
      //   {
      //     key: 'operate',
      //     label: '经营情况',
      //     auth: 'operate_get'
      //   },
      //   {
      //     key: 'supply',
      //     label: '供应能力',
      //     auth: 'supply_get'
      //   },
      //   {
      //     key: 'produce_address',
      //     label: '制造地址',
      //     auth: 'produce_address_get'
      //   },
      //   {
      //     key: 'factory',
      //     label: '工厂情况',
      //     auth: 'factory_get'
      //   },
      //   {
      //     key: 'self_made',
      //     label: '自制能力',
      //     auth: 'self_made_get'
      //   },
      //   {
      //     key: 'equipment',
      //     label: '设备清单',
      //     auth: 'equipment_get'
      //   },
      //   // {
      //   //   key: 'raw_material',
      //   //   label: '原材料供应',
      //   //   auth: 'raw_material_get'
      //   // },
      //   {
      //     key: 'quality_structure',
      //     label: '品质架构',
      //     auth: 'quality_structure_get'
      //   },
      //   {
      //     key: 'laboratory',
      //     label: '实验室',
      //     auth: 'laboratory_get'
      //   },
      //   {
      //     key: 'laboratory_licence',
      //     label: '实验室认证资质',
      //     auth: 'laboratory_licence_get'
      //   },
      //   {
      //     key: 'develop_structure',
      //     label: '研发架构', 
      //     auth: 'develop_structure_get'
      //   },
      //   {
      //     key: 'patent',
      //     label: '专利证书',
      //     auth: 'patent_get'
      //   },
      //   {
      //     key: 'develop_experience',
      //     label: '产品开发经验',
      //     auth: 'develop_experience_get'
      //   }
      // ]
    }
  },
  created () {
    this.tabList = JSON.parse(sessionStorage.getItem('tabs')) || []
    // 获取tab权限
    // srmAuth().then(res => {
    //   if (res.data) {
    //     sessionStorage.setItem('auths', JSON.stringify(res.data))
    //     const auths = res.data
    //     if (auths) {
    //       const result = []
    //       this.allTabs.forEach((tab) => {
    //         auths.forEach((auth) => {
    //           if (auth === tab.auth) {
    //             result.push(tab)
    //           }
    //         })
    //       })
    //       this.tabList = result
    //       console.log('tab权限加载完', this.tabList)
    //     }
    //   }
    // })
  },
  methods: {
    handleClick (tab) {
      // console.log(tab)
    },
    beforeTab (newTab, oldTab) {
      // console.log(newTab, oldTab)
      // 若返回 false 或者返回 Promise 且被 reject，则阻止切换。
    }
  }
}
</script>