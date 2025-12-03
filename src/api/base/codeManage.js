import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'

const BASE_URL = 'srm-base-data'

// 代码管理查询
export const getQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsCode/getPageList`,
    method: 'get',
    params
  })
}

// 代码管理新增修改
export const update = data => {
  return request({
    url: `${BASE_URL}/srmBasicsCode/saveOrUpdateCode`,
    method: 'post',
    data: data
  })
}

// 代码管理删除
export const deleteId = data => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsCode/deleteByIds?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 代码管理详情
export const getDetails = params => {
  return request({
    url: `${BASE_URL}/srmBasicsCodeDetail/getCodeDetail`,
    method: 'get',
    params
  })
}

// 代码管理详情新增修改
export const updateDetail = data => {
  return request({
    url: `${BASE_URL}/srmBasicsCodeDetail/saveOrUpdateCodeDetail`,
    method: 'post',
    data: data
  })
}

// 代码管理详情删除
export const deleteDetailId = data => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsCodeDetail/deleteById?${qs.stringify(data)}`,
    method: 'delete'
  })
}