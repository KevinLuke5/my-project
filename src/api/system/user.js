import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'

const BASE_URL = 'cloud-user'

export function GetResource() {
  return formRequest({
    url: `${BASE_URL}/user`,
    method: 'GET'
  })
}

export function edit(data) {
  return formRequest({
    url: `${BASE_URL}/user`,
    method: 'put',
    data
  })
}

export function del(data) {
  return formRequest({
    url: `${BASE_URL}/user/delMore`,
    method: 'delete',
    data
  })
}


// 个人中心获取登录用户信息
export function getUserInfo() {
  return formRequest({
    url: `${BASE_URL}/center/info`,
    method: 'GET'
  })
}

// 修改登录用户信息
export function updateUserInfo(data) {
  return formRequest({
    url: `${BASE_URL}/center/info`,
    method: 'put',
    data
  })
}

// 个人中心修改密码
export function updatingPass(data) {
  return formRequest({
    url: `${BASE_URL}/center/updatePass`,
    method: 'put',
    data
  })
}
