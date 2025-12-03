import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import { download, templateDownload } from '@/utils/download'
import qs from 'qs'
const BASE_URL = 'srm-base-data'

// 审厂单查询
export const getFactoryCheck = data => formRequest({
  url: `${BASE_URL}/srmFactoryCheck/getFactoryCheck?${qs.stringify(data)}`,
  method: 'get'
})

// 审厂单新增、编辑、暂存、提交
export const insertOrUpdateFactoryCheck = data => request({
  url: `${BASE_URL}/srmFactoryCheck/insertOrUpdateFactoryCheck`,
  method: 'post',
  data
})

// 审厂单批量删除
export const deleteFactoryCheck = data => request({
  url: `${BASE_URL}/srmFactoryCheck/deleteFactoryCheck`,
  method: 'delete',
  data
})

// 审厂单审核
export const toCheck = data => request({
  url: `${BASE_URL}/srmFactoryCheck/toCheck`,
  method: 'post',
  data
})

// 导入标准
export const getStandardNameList = data => formRequest({
  url: `${BASE_URL}/srmFactoryStandard/getStandardNameList?${qs.stringify(data)}`,
  method: 'get'
})

// 导入标准明细
export const getProjectDetailByCode = data => formRequest({
  url: `${BASE_URL}/srmFactoryProject/getProjectDetailByCode?${qs.stringify(data)}`,
  method: 'get'
})

// 审厂单详情查询
export const getFactoryCheckAndDetails = data => formRequest({
  url: `${BASE_URL}/srmFactoryCheck/getFactoryCheckAndDetails?${qs.stringify(data)}`,
  method: 'get'
})

// 审厂单详情批量删除
export const deleteFactoryCheckGrade = data => request({
  url: `${BASE_URL}/srmFactoryCheckGrade/deleteFactoryCheckGrade`,
  method: 'delete',
  data
})

// 审厂单详情明细查询
export const getGradeDetail = data => formRequest({
  url: `${BASE_URL}/srmFactoryCheckGradeDetail/getGradeDetail?${qs.stringify(data)}`,
  method: 'get'
})

// 远程搜索供应商
export const getSupplierName = data => formRequest({
  url: `${BASE_URL}/srmSupplier/getSupplierName?${qs.stringify(data)}`,
  method: 'get'
})

// 密码重置
export const resetPassword = data => formRequest({
  url: `cloud-user/account/resetPassword?${qs.stringify(data)}`,
  method: 'put'
})

// 打分明细导出
export const exportGradeDetail = (data) => {
  templateDownload(`${BASE_URL}/srmFactoryCheckGradeDetail/exportGradeDetail`, data)
}