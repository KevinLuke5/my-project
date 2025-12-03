import Vue from 'vue'
import Router from 'vue-router'
import Layout from '../layout/index'

Vue.use(Router)

export const constantRouterMap = [
  {
    path: '/registered',
    meta: {
      title: '注册',
      noCache: true
    },
    component: () => import('@/views/login/registered'),
    hidden: true
  },
  {
    path: '/login',
    meta: {
      title: '登录',
      noCache: true
    },
    component: () => import('@/views/login/login'),
    hidden: true
  },
  {
    path: '/cas',
    meta: {
      title: 'cas登录',
      noCache: true
    },
    component: () => import('@/views/login/cas'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/features/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/features/401'),
    hidden: true
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/features/redirect')
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/menuList/menu'
    // children: [
    //   {
    //     path: "dashboard",
    //     component: () => import("@/views/system/menuList"),
    //     name: "Dashboard",
    //     meta: {
    //       title: "全部菜单",
    //       icon: "Sign",
    //       affix: true,
    //       noCache: true
    //     }
    //   }
    // ]
  },
  {
    path: '/menuList',
    component: Layout,
    redirect: 'menu',
    children: [
      {
        path: 'menu',
        component: () => import('@/views/system/menuList'),
        name: 'Menus',
        meta: {
          title: '全部菜单',
          icon: 'Sign',
          affix: true,
          noCache: true
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'center',
        component: () => import('@/views/system/userCenter/center'),
        name: '个人中心',
        meta: {
          title: '个人中心'
        }
      }
    ]
  },
  {
    path: '/down',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'downLoad',
        component: () => import('@/views/system/downTaskMa/index'),
        name: '下载管理',
        meta: {
          title: '下载管理'
        }
      }
    ]
  },
  {
    path: '/demo',
    meta: {
      title: '测试',
      noCache: true
    },
    component: () => import('@/views/demo'),
    hidden: true
  },
  {
    path: '/orderRecord',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'statementDetails',
        component: () => import('@/views/orderRecord/statementDetails'),
        name: '对账单明细',
        meta: {
          title: '对账单明细'
        }
      }
    ]
  },
  {
    path: '/supplier',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: '/supplier/pool/poolDetail',
        component: () => import('@/views/supplier/pool/poolDetail'),
        name: '企业信息详情',
        meta: {
          title: '企业信息详情'
        }
      },
      {
        path: '/supplier/check/checkDetail',
        component: () => import('@/views/supplier/check/checkDetail'),
        name: '调查表详情',
        meta: {
          title: '调查表详情'
        }
      },
      {
        path: '/supplier/check/record',
        component: () => import('@/views/supplier/check/record'),
        name: '存档详情',
        meta: {
          title: '存档详情'
        }
      },
      {
        path: '/verify/doc',
        component: () => import('@/views/verify/components/doc'),
        name: '审厂单',
        meta: {
          title: '审厂单'
        }
      },
      {
        path: '/kpi/assess/add',
        component: () => import('@/views/kpi/assess/add'),
        name: '批量创建绩效考核单',
        meta: {
          title: '批量创建绩效考核单'
        }
      },
      {
        path: '/kpi/assess/addAuto',
        component: () => import('@/views/kpi/assess/addAuto'),
        name: '批量创建绩效考核单-新',
        meta: {
          title: '批量创建绩效考核单-新'
        }
      },
      {
        path: '/kpi/assess/overview',
        component: () => import('@/views/kpi/assess/overview'),
        name: '考核单详情总览',
        meta: {
          title: '考核单详情总览'
        }
      },
      {
        path: '/kpi/assess/detail',
        component: () => import('@/views/kpi/assess/detail'),
        name: '指标打分明细',
        meta: {
          title: '指标打分明细'
        }
      },
      {
        path: '/kpi/assess/oa',
        component: () => import('@/views/kpi/assess/oa'),
        name: '维度审核',
        meta: {
          title: '维度审核'
        }
      }
    ]
  }
]

export default new Router({
  mode: 'hash',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
