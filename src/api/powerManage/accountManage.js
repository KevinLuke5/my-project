import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'

const BASE_URL = 'srm-base-data'

// 账号管理查询
export const getQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmRegistration/getUserList`,
    method: 'get',
    params
  })
}

// 账号管理新增
export const addList = data => {
  return request({
    url: `${BASE_URL}/srmRegistration/insertUser`,
    method: 'post',
    data: data
  })
}

// 账号管理修改
export const update = data => {
  return request({
    url: `${BASE_URL}/srmRegistration/updateUser`,
    method: 'post',
    data: data
  })
}

// 账号管理删除
export const deleteId = data => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsExpertResources/deleteByExpertResourceId?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 账号查询小组下拉不分页
export const getGroupList = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsGroupProfession/getGroupName`,
    method: 'get',
    params
  })
}

// 账号查询专业下拉不分页
export const getProfessionList = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsGroupProfession/getProfessionName`,
    method: 'get',
    params
  })
}

// 账号查询专家姓名下拉不分页
export const getExpertList = params => {
  return formRequest({
    url: `${BASE_URL}/srmRegistration/getUserList`,
    method: 'get',
    params
  })
}

// 账号管理添加采购组织
export const accountOrgAdd = data => {
  return request({
    url: `${BASE_URL}/srmRegistration/bindOrganization`,
    method: 'post',
    data: data
  })
}

// 账号管理添加供应商公司
export const accountSupplierAdd = data => {
  return request({
    url: `${BASE_URL}/srmRegistration/bindSupplierCompany`,
    method: 'post',
    data: data
  })
}