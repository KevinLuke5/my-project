import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'

const BASE_URL = 'srm-base-data'

// 专家资源池管理查询
export const getQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsExpertResources/getExpertResourceList`,
    method: 'get',
    params
  })
}

// 专家资源池管理新增修改
export const update = data => {
  return request({
    url: `${BASE_URL}/srmBasicsExpertResources/saveOrUpdateExpertResource`,
    method: 'post',
    data: data
  })
}

// 专家资源池管理删除
export const deleteId = data => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsExpertResources/deleteByExpertResourceId?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 专家资源池查询小组下拉不分页
export const getGroupList = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsGroupProfession/getGroupName`,
    method: 'get',
    params
  })
}

// 专家资源池查询专业下拉不分页(根据所属小组查所属专业)
export const getProfessionList = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsGroupProfession/getProfessionNameByGroupName`,
    method: 'get',
    params
  })
}

// 专家资源池查询专家姓名下拉不分页
export const getExpertList = params => {
  return formRequest({
    url: `${BASE_URL}/srmRegistration/getUserList`,
    method: 'get',
    params
  })
}