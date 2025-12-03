import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'

const BASE_URL = 'cloud-user'

export function getAccount (params) {
  return formRequest({
    url: `${BASE_URL}/account`,
    method: 'get',
    params
  })
}

export function add (data) {
  return formRequest({
    url: `${BASE_URL}/account`,
    method: 'post',
    data
  })
}

export function edit (data) {
  return formRequest({
    url: `${BASE_URL}/account`,
    method: 'put',
    data
  })
}

export function validateUserNameOrPhone (data) {
  return formRequest({
    url: `${BASE_URL}/account/check`,
    method: 'get',
    params: data
  })
}

// 重置密码
export function resetPassword (data) {
  return formRequest({
    url: `${BASE_URL}/account/resetPassword`,
    method: 'post',
    data
  })
}
// export function GetApplication(data) {
//   return formRequest({
//     url: `${BASE_URL}/account/application`,
//     method: 'get',
//     params: data
//   })
// }
// 获取员工列表
export function GetUser (params) {
  return formRequest({
    url: `${BASE_URL}/account/user`,
    method: 'get',
    params
  })
}

// // 获取已关联角色信息
// export function getRelRole(params) {
//   return formRequest({
//     url: `${BASE_URL}/account/role`,
//     method: 'get',
//     params
//   })
// }
// 获取已关联角色信息
export function getRelRole (params) {
  return formRequest({
    url: `${BASE_URL}/role/list`,
    method: 'get',
    params
  })
}

// 绑定账户和角色关系
export function bindRole (data) {
  return request({
    url: `${BASE_URL}/account/bindRole`,
    method: 'put',
    data
  })
}

// 导出
export function exportExcel (params) {
  return request({
    url: `${BASE_URL}/account/exportExcel`,
    method: 'get',
    params
  })
}
// /**
//  *
//  * @param {accountId,checkedList,delList} data
//  */
// export function BindApplication(data) {
//   data.checkedList = data.checkedList.toString()
//   data.delList = data.delList.toString()
//   return formRequest({
//     url: `${BASE_URL}/account/bindApplication`,
//     method: 'put',
//     data
//   })
// }
