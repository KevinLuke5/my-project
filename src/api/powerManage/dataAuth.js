import request from '@/utils/request'

const BASE_URL = 'cloud-user'

// 获得数据权限角色
export const getOwnerRoles = data => {
  return request({
    url: `${BASE_URL}/roleUser/getOwnerRoleList`,
    method: 'post',
    data
  })
}

// 人员新增多个数据权限角色
export const insertBatchOwner = data => {
  return request({
    url: `${BASE_URL}/roleUser/insertBatchOwner`,
    method: 'post',
    data
  })
}

// 查询可选授权角色
export const getManagerRoles = data => {
  return request({
    url: `${BASE_URL}/roleUser/getManagerRoles`,
    method: 'post',
    data
  })
}

// 人员新增多个授权权限角色
export const insertBatchManager = data => {
  return request({
    url: `${BASE_URL}/roleUser/insertBatchManager`,
    method: 'post',
    data
  })
}