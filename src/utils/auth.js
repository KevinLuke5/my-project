import Cookies from 'js-cookie'
import Config from '@/settings'

const TokenKey = Config.TokenKey
const trueDomain = document.domain
const truePath = location.pathname

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token, rememberMe) {
  if (rememberMe) {
    return Cookies.set(TokenKey, token, {
      expires: Config.tokenCookieExpires,
      // domain: process.env.VUE_APP_DOMAIN ? process.env.VUE_APP_DOMAIN : null
      domain: trueDomain,
      path: truePath
    })
  } else return Cookies.set(TokenKey, token, {
    // domain: process.env.VUE_APP_DOMAIN ? process.env.VUE_APP_DOMAIN : null
    domain: trueDomain,
    path: truePath
  })
}

export function removeToken () {
  // if (process.env.VUE_APP_DOMAIN) {
  //   var keys = document.cookie.match(/[^ =;]+(?==)/g)
  //   if (keys) {
  //     for (var i = keys.length; i--;) {
  //       document.cookie = keys[i] + '=0;path=/;expires=' + new Date(0).toUTCString() // 清除当前域名下的,例如：m.ratingdog.cn
  //       document.cookie = keys[i] + '=0;path=/;domain=' + document.domain + ';expires=' + new Date(0).toUTCString() // 清除当前域名下的，例如 .m.ratingdog.cn
  //       document.cookie = keys[i] + '=0;path=/;domain=' + process.env.VUE_APP_DOMAIN + ';expires=' + new Date(0).toUTCString() // 清除一级域名下的或指定的，例如 .ratingdog.cn
  //     }
  //   }
  // }
  // return Cookies.remove(TokenKey)
  Cookies.remove(TokenKey, {
    domain: trueDomain,
    path: truePath
  })
}

const CompanyId = 'coId'

export function setCompanyId (coId) {
  return localStorage.setItem(CompanyId, coId)
}
export function getCompanyId () {
  return localStorage.getItem(CompanyId)
}
export function removeCompanyId () {
  return localStorage.removeItem(CompanyId)
}
// 切换公司时标记
const swicthKey = 'swicthKey'
export function setKey () {
  return localStorage.setItem(swicthKey, '1')
}
export function getKey () {
  return localStorage.getItem(swicthKey)
}
export function removeKey () {
  return localStorage.removeItem(swicthKey)
}

// 验证是否管理员身份
export function getIsSystemAdmin () {
  return Cookies.get('isSystemAdmin')
}
