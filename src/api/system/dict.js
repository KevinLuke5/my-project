import request from '@/utils/request'
import formRequest from '@/utils/requestformdata.js'

const BASE_URL = 'cloud-util'

// 验证数据字典列表是否重复
export function validateDictLabel(data) {
  return formRequest({
    url: `${BASE_URL}/dict/checkDict`,
    method: 'post',
    data
  })
}
// 验证数据字典详情是否重复
export function validateDictDetail(data) {
  return formRequest({
    url: `${BASE_URL}/dict/checkDictDetail`,
    method: 'post',
    data
  })
}

// ------------------------字典列表------------------
// 查询字典列表接口
export function getDictList(params) {
  return request({
    url: `${BASE_URL}/dict/getDict`,
    method: 'get',
    params
  })
}

export function addDictList(data) {
  return formRequest({
    url: `${BASE_URL}/dict/insertDict`,
    method: 'post',
    data
  })
}

export function delDictList(data) {
  return formRequest({
    url: `${BASE_URL}/dict/deleteDict`,
    method: 'delete',
    data
  })
}

export function editDictList(data) {
  return formRequest({
    url: `${BASE_URL}/dict/updateDict`,
    method: 'put',
    data
  })
}




// ------------------------字典详情------------------
// 查询字典详情前缀
export function getDictDetailPrefix(params) {
  return request({
    url: `${BASE_URL}/dict/prefix`,
    method: 'get',
    params
  })
}
// 查询字典详情接口
export function getDictDetail(params) {
  return request({
    url: `${BASE_URL}/dict/getDictDetail`,
    method: 'get',
    params
  })
}
export function addDictDetail(data) {
  return formRequest({
    url: `${BASE_URL}/dict/insertDictDetail`,
    method: 'post',
    data
  })
}

export function delDictDetail(data) {
  return formRequest({
    url: `${BASE_URL}/dict/deleteDictDetail`,
    method: 'delete',
    data
  })
}

export function editDictDetail(data) {
  return formRequest({
    url: `${BASE_URL}/dict/updateDictDetail`,
    method: 'put',
    data
  })
}


// 其他页面调用转义功能
export function children(data) {
  return formRequest({
    url: 'cloud-util/dict/children',
    method: 'get',
    params: data
  })
}

// 关联到数据字典接口
export function addStaffInfo(data) {
  return formRequest({
    url: 'cloud-util/dict/insertDictUserRel',
    method: 'post',
    params: data
  })
}
