import { login, logout, getInfo, getCodes } from '@/api/login'
import { codeLogin } from '@/api/app/app.js'

import {
  getToken,
  setToken,
  removeToken,
  setCompanyId,
  getCompanyId,
  removeCompanyId
} from '@/utils/auth'
import Cookies from 'js-cookie'

const user = {
  state: {
    // 是否隐藏菜单
    isHideMenu: true,
    token: getToken(),
    companyId: getCompanyId(),
    company: {},
    companies: [],
    name: '',
    userId: null,
    user: {},
    roles: [],
    codes: {},
    // 第一次加载菜单时用到
    loadMenus: false,
    currentSystemId: null
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_ID: (state, id) => {
      state.userId = id
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_COMPANYID: (state, companyId) => {
      state.companyId = companyId
    },
    SET_COMPANY: (state, company) => {
      state.company = company
    },
    SET_COMPANIES: (state, companies) => {
      state.companies = companies
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_LOAD_MENUS: (state, loadMenus) => {
      state.loadMenus = loadMenus
    },
    SET_CODES: (state, codes) => {
      state.codes = codes
    },
    SET_Hide (state, type) {
      state.isHideMenu = type
    },
    SET_CURRENT_SYSTEMID: (state, id) => {
      state.currentSystemId = id
    }
  },

  actions: {
    // 登录
    Login ({ commit, dispatch }, userInfo) {
      const rememberMe = userInfo.rememberMe
      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password)
          .then(val => {
            const res = val.data
            setToken(res.token, rememberMe)
            setCompanyId(res.user.company.id)
            // 设置是否是系统管理员
            Cookies.set('isSystemAdmin', res.user.isSystemAdmin)
            // 用于埋点获取登录人信息
            // Cookies.set('ww__d', btoa(res.user.userOaId), {
            //   domain: process.env.VUE_APP_DOMAIN
            //     ? process.env.VUE_APP_DOMAIN
            //     : null
            // })
            const uid_cookie_name = Cookies.get('uid_cookie_name')
            Cookies.set(uid_cookie_name, btoa(res.user.id), {
              domain: window.location.hostname,
              path: window.location.pathname
            })

            commit('SET_TOKEN', res.token)
            commit('SET_NAME', res.user.name)
            commit('SET_COMPANY', Object.assign({}, res.user.company))
            commit('SET_COMPANIES', res.user.companies)
            commit('SET_COMPANYID', res.user.company.id)
            commit('SET_ID', res.user.id)
            commit('SET_USER', res.user)
            localStorage.setItem('userInfo', JSON.stringify(res.user))
            // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
            commit('SET_LOAD_MENUS', true)
            getCodes({ accountId: res.user.id, coId: res.user.coId }).then(res => {
              setUserInfo(res.data, commit)
              resolve()
            })
          })
          .catch(error => {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
            reject(error)
          })
      })
    },
    // 登录
    CodeLogin ({ commit, dispatch }, ticket) {
      return new Promise((resolve, reject) => {
        codeLogin({
          ticket: ticket
        })
          .then(val => {
            const res = val.data
            setCompanyId(res.user.company.id)
            // 设置是否是系统管理员
            Cookies.set('isSystemAdmin', res.user.isSystemAdmin)
            // 用于埋点获取登录人信息
            // Cookies.set('ww__d', btoa(res.user.userOaId), {
            //   domain: process.env.VUE_APP_DOMAIN
            //     ? process.env.VUE_APP_DOMAIN
            //     : null
            // })
            const uid_cookie_name = Cookies.get('uid_cookie_name')
            Cookies.set(uid_cookie_name, btoa(res.user.id), {
              domain: window.location.hostname,
              path: window.location.pathname
            })

            // Cookies.set('SRM-Token', res.token)
            setToken(res.token)
            // document.cookie = "SRM-Token=" + res.token + ";SameSite=None; Secure=true"
            // commit("SET_TOKEN", res.token);
            commit('SET_NAME', res.user.name)
            commit('SET_COMPANY', Object.assign({}, res.user.company))
            commit('SET_COMPANIES', res.user.companies)
            commit('SET_COMPANYID', res.user.company.id)
            commit('SET_ID', res.user.id)
            commit('SET_USER', res.user)
            localStorage.setItem('userInfo', JSON.stringify(res.user))
            // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
            commit('SET_LOAD_MENUS', true)
            getCodes({ accountId: res.user.id, coId: res.user.coId }).then(res => {
              setUserInfo(res.data, commit)
              resolve()
            })
            // resolve(res)
          })
          .catch(error => {
            Cookies.remove('username')
            Cookies.remove('password')
            Cookies.remove('rememberMe')
            reject(error)
          })
      })
    },
    // 切换公司
    SelectCompany ({ commit }, companyId) {
      return new Promise((resolve, reject) => {
        const token = getToken()
        getInfo(token, companyId)
          .then(val => {
            const res = val.data
            removeToken()
            setToken(res.token)
            setCompanyId(res.user.company.id)
            // 设置是否是系统管理员
            Cookies.set('isSystemAdmin', res.user.isSystemAdmin)
            // 用于埋点获取登录人信息
            // Cookies.set('ww__d', btoa(res.user.userOaId), {
            //   domain: process.env.VUE_APP_DOMAIN
            //     ? process.env.VUE_APP_DOMAIN
            //     : null
            // })
            const uid_cookie_name = Cookies.get('uid_cookie_name')
            Cookies.set(uid_cookie_name, btoa(res.user.id), {
              domain: window.location.hostname,
              path: window.location.pathname
            })

            commit('SET_TOKEN', res.token)
            commit('SET_COMPANY', Object.assign({}, res.user.company))
            commit('SET_COMPANIES', res.user.companies)
            commit('SET_COMPANYID', res.user.company.id)
            commit('SET_LOAD_MENUS', true)
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    SetCurrentSystemID ({ commit }, id) {
      commit('SET_CURRENT_SYSTEMID', id)
    },
    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        const coId = getCompanyId()
        getInfo(getToken(), coId)
          .then(val => {
            const res = val.data
            removeToken()
            setToken(res.token)
            setCompanyId(res.user.company.id)
            // 设置是否是系统管理员
            Cookies.set('isSystemAdmin', res.user.isSystemAdmin)
            // 用于埋点获取登录人信息
            // Cookies.set('ww__d', btoa(res.user.userOaId), {
            //   domain: process.env.VUE_APP_DOMAIN
            //     ? process.env.VUE_APP_DOMAIN
            //     : null
            // })
            const uid_cookie_name = Cookies.get('uid_cookie_name')
            Cookies.set(uid_cookie_name, btoa(res.user.id), {
              domain: window.location.hostname,
              path: window.location.pathname
            })

            commit('SET_TOKEN', res.token)
            commit('SET_NAME', res.user.name)
            commit('SET_COMPANY', Object.assign({}, res.user.company))
            commit('SET_COMPANIES', res.user.companies)
            commit('SET_COMPANYID', res.user.company.id)
            commit('SET_ID', res.user.id)
            getCodes({ accountId: res.user.id, coId: res.user.coId }).then(res => {
              setUserInfo(res.data, commit)
            })
            commit('SET_USER', res.user)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })

      })
    },

    updateLoadMenus ({ commit }) {
      return new Promise((resolve, reject) => {
        commit('SET_LOAD_MENUS', false)
      })
    },
    // 登出
    LogOut ({ commit, dispatch }) {
      return new Promise((resolve, reject) => {
        const token = getToken()
        if (token) {
          logout(token).then((res) => {
            // if (res.code === 'success') {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            removeCompanyId()
            // 清除工厂列表
            // dispatch('removeFacList', {}, { root: true })
            resolve()
            // }
          }).catch(error => {
            reject(error)
          })
        } else {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          removeCompanyId()
          // 清除工厂列表
          // dispatch('removeFacList', {}, { root: true })
          resolve()
        }
      })
    }
  }
}

export const setUserInfo = (res, commit) => {
  // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
  // if (res.codes) {
  //   commit("SET_CODES", res.codes)
  if (res) {
    commit('SET_CODES', res)
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  } else {
    commit('SET_ROLES', ['ROLE_SYSTEM_DEFAULT'])
  }
  // commit("SET_USER", res)
}

export default user
