import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'

const BASE_URL = 'srm-base-data'

// 分级分类管理查询
export const getQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsClassification/getBasicClassList`,
    method: 'get',
    params
  })
}

// 分级分类管理新增修改
export const update = data => {
  return request({
    url: `${BASE_URL}/srmBasicsClassification/insertOrUpdate`,
    method: 'post',
    data: data
  })
}

// 分级分类管理删除
export const deleteId = data => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsClassification/deleteById?${qs.stringify(data)}`,
    method: 'delete'
  })
}