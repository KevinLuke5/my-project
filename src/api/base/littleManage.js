import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'

const BASE_URL = 'srm-base-data'

// 小类管理查询
export const getQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsSmallClass/getSmallClassList`,
    method: 'get',
    params
  })
}

// 小类管理新增修改
export const update = data => {
  return request({
    url: `${BASE_URL}/srmBasicsSmallClass/insertOrUpdateSmallClass`,
    method: 'post',
    data: data
  })
}

// 小类管理删除
export const deleteId = data => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsSmallClass/deleteBatchBySmallId?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 大类名称查询下拉
export const bigSearch = data => formRequest({
  url: `${BASE_URL}/srmBasicsCategory/getBigName`,
  method: 'get',
  data
})