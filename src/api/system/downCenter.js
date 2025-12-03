import request from '@/utils/request'
const BASE_URL = 'srm-base-data' // 微服务名，后端提供

// 查询
export const fileQuery = params => request({
  url: `${BASE_URL}/srmFile/getSrmFilePage`,
  method: 'get',
  params
})

// 下载-暂时不需要
// export const fileDown = params => request({
//   url: `${BASE_URL}/sysFile/download`,
//   method: 'post',
//   params
// })


// 删除
export const fileDel = params => request({
  url: `${BASE_URL}/srmFile/deleteSrmFile`,
  method: 'delete',
  params
})

// 查看文件
export const fileView = data => request({
  url: 'cloud-oss/oss/temp_url',
  method: 'post',
  data
})