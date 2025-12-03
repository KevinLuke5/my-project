import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
export function getCache(params) {
  return request({
    url: 'cloud-util/cache',
    method: 'get',
    params
  })
}
// 根据key获取某条数据
export function getOne(key) {
  return request({
    url: 'cloud-util/cache/' + key,
    method: 'get',
  })
}
