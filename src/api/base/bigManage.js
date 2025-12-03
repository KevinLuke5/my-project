import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'

const BASE_URL = 'srm-base-data'

// 大类管理查询
export const getQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsCategory/getCategoryList`,
    method: 'get',
    params
  })
}

// 大类管理新增修改
export const update = data => {
  return request({
    url: `${BASE_URL}/srmBasicsCategory/insertOrUpdateCategory`,
    method: 'post',
    data: data
  })
}

// 大类管理删除
export const deleteId = data => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsCategory/deleteCategoryById?${qs.stringify(data)}`,
    method: 'delete'
  })
}