import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'

const BASE_URL = 'srm-base-data'

// 专家分类管理查询
export const getQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsGroupProfession/getBasicsGroupList`,
    method: 'get',
    params
  })
}

// 专家分类管理新增修改
export const update = data => {
  return request({
    url: `${BASE_URL}/srmBasicsGroupProfession/insertOrUpdateGroupProfession`,
    method: 'post',
    data: data
  })
}

// 专家分类管理删除
export const deleteId = data => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsGroupProfession/deleteBatch?${qs.stringify(data)}`,
    method: 'delete'
  })
}