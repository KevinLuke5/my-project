import request from '@/utils/request'
// import formRequest from '@/utils/requestformdata'

const BASE_URL = 'cloud-util'
const BASE_URL2 = 'cloud-user'

// 获取部门,岗位树 规则
export function getTree (params) {
  return request({
    url: `${BASE_URL}/flowCenter/flowRules/getParticipantsTree`,
    method: 'get',
    params
  })
}

// 根据部门id和状态获取人员和岗位
export function getParticipants (params) {
  return request({
    url: `${BASE_URL}/flowCenter/flowRules/getParticipants`,
    method: 'get',
    params
  })
}

// 获取当前登录用户的部门id
export function getDeptIdByUser (params) {
  return request({
    url: `${BASE_URL2}/user/getDeptIdByUser`,
    method: 'get',
    params
  })
}
