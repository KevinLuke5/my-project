import request from '@/utils/request'
const BASE_URL = 'cloud-util'
export function getDownTaskList(params) {
  return request({
    url: `${BASE_URL}/fileDownload`,
    method: 'get',
    params
  })
}
export function del(params) {
  return request({
    url: `${BASE_URL}/fileDownload/deleteFileDownload`,
    method: 'delete',
    params
  })
}
//下载文件
export function getExecl(params) {
  return request({
    url: `${BASE_URL}/fileDownload/download`,
    method: 'get',
    params
  })
}

//判断文件是否存在 fileIsExist
export function fileIsExist(params) {
  return request({
    url: `${BASE_URL}/fileDownload/fileIsExist`,
    method: 'get',
    params
  })
}
