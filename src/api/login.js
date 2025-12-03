import request from '@/utils/request'

export function login (username, password) {
  return request({
    url: '/cloud-auth/v1/jwt/token',
    method: 'post',
    headers: { 'mes-apk-whitelist': '81ed1fe9-6879-4d9c-8942-24cd84c58253' }, // 跳过登录拦截
    data: {
      username,
      password
    }
  })
}


export function getInfo (token, coId) {
  return request({
    url: '/cloud-auth/v1/jwt/token',
    method: 'post',
    data: {
      token,
      coId
    }
  })
}

export function logout (data) {
  return request({
    url: 'cloud-auth/logout',
    method: 'get',
    data: data
  })
}

export function getCodes (params) {
  return request({
    url: 'cloud-user/resource/code',
    method: 'get',
    params
  })
}
