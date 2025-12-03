import request from '@/utils/request'
export function getGateLog(params) {
  return request({
    url: 'cloud-util/log',
    method: 'get',
    params
  })
}

export function del(id) {
  return request({
    url: 'cloud-admin/sysLog/' + id,
    method: 'delete'
  })
}
