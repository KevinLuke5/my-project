import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'

const BASE_URL = 'cloud-user'

// 获取所有的菜单树
export function getMenusTree(data) {
  return request({
    url: `${BASE_URL}/resource/list`,
    method: 'get',
    params: data
  })
}
// 获取所有的资源列表
export function getResource(data) {
  return request({
    url: `${BASE_URL}/resource/tree`,
    method: 'get',
    params: data
  })
}

export function getChildren(data) {
  return formRequest({
    url: `${BASE_URL}/menu/resource`,
    method: 'get',
    params: data
  })
}
export function buildMenus() {
  return request({
    url: `${BASE_URL}/resource/build`,
    method: 'get'
  })
}

export function add(data) {
  return formRequest({
    url: `${BASE_URL}/resource`,
    method: 'post',
    data
  })
}

export function del(data) {
  return formRequest({
    url: `${BASE_URL}/resource/delMore`,
    method: 'delete',
    data
  })
}

export function edit(data) {
  return formRequest({
    url: `${BASE_URL}/resource`,
    method: 'put',
    data
  })
}

export function getSelect(data) {
  return formRequest({
    url: `cloud-util/nacos/nacosServices`,
    method: 'get',
    params: data
  })
}
