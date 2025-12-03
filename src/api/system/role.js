import request from '@/utils/request'
import formRequest from '@/utils/requestformdata.js'
const BASE_URL = 'cloud-user'

// 保存当前角色关联的账号
export function saveResource (data) {
  return formRequest({
    url: `${BASE_URL}/role/bindAccount`,
    method: 'put',
    data
  })
}


// 保存当前角色拥有的资源
export function saveRoleResource (data) {
  return request({
    url: `${BASE_URL}/role/v1/bindResource`,
    method: 'put',
    data
  })
}

// 查询角色已关联的标签
export function getCheckedLabel (data) {
  return request({
    url: `${BASE_URL}/role/getLabelByRoleId`,
    method: 'get',
    params: data
  })
}

// 保存角色和标签的关联关系
export function aboutLabel (data) {
  return formRequest({
    url: `${BASE_URL}/role/bindRoleLabel`,
    method: 'post',
    data
  })
}


export function getRole (params) {
  return request({
    url: `${BASE_URL}/role`,
    method: 'get',
    params
  })
}

export function add (data) {
  return formRequest({
    url: `${BASE_URL}/role`,
    method: 'post',
    data
  })
}

export function delMore (data) {
  return formRequest({
    url: `${BASE_URL}/role/delMore`,
    method: 'delete',
    data
  })
}

export function edit (data) {
  return formRequest({
    url: `${BASE_URL}/role`,
    method: 'put',
    data
  })
}

// 启用禁用角色
export function modifyStatus (data) {
  return formRequest({
    url: `${BASE_URL}/role/modifyStatus`,
    method: 'post',
    data
  })
}

// 查询可关联账号
export function getJudgedAccount (data) {
  return request({
    url: `${BASE_URL}/role/account`,
    method: 'get',
    params: data
  })
}

// 保存当前角色关联的账号
export function bindAccountAndRole (data) {
  return request({
    url: `${BASE_URL}/role/v2/bindAccount`,
    method: 'put',
    data
  })
}

// 查询可关联资源
export function getResoure (data) {
  return formRequest({
    url: `${BASE_URL}/resource/get_ids_by_role_id`,
    method: 'get',
    params: data
  })
}




// 导出
export function exportExcel (params) {
  return request({
    url: `${BASE_URL}/role/exportExcel`,
    method: 'get',
    params
  })
}

// 资源导入
export const batchImport = data => request({
  url: `${BASE_URL}/resource/batch_import`,
  method: 'post',
  data
})
