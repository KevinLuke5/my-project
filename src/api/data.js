import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'

export function initData(url, params) {
  return request({
    url: url,
    method: 'GET',
    params
  })
}

export function initDataFormData(url, params) {
  return formRequest({
    url: url,
    method: 'GET',
    params
  })
}
export function download(url, params) {
  return request({
    url: url + '?' + qs.stringify(params, {
      indices: false
    }),
    method: 'get',
    responseType: 'blob'
  })
}
