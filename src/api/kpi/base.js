import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import { download, templateDownload } from '@/utils/download'
const BASE_URL = 'srm-access'

// 供应商业务类型查询
export const getSupplierBusinessBindList = data => request({
  url: `${BASE_URL}/srmAccessSupplierBusinessBind/getSupplierBusinessBindList`,
  method: 'post',
  data
})

// 供应商业务类型详情
export const getSupplierBusinessBindDetail = params => formRequest({
  url: `${BASE_URL}/srmAccessSupplierBusinessBind/getSupplierBusinessBindDetail`,
  method: 'get',
  params
})

// 供应商业务类型修改
export const insertOrUpdateSupplierBusinessBind = data => request({
  url: `${BASE_URL}/srmAccessSupplierBusinessBind/insertOrUpdateSupplierBusinessBind`,
  method: 'post',
  data
})

// 供应商业务类型删除
export const deleteSupplierBusinessBind = params => formRequest({
  url: `${BASE_URL}/srmAccessSupplierBusinessBind/deleteSupplierBusinessBind`,
  method: 'delete',
  params
})

// 供应商业务类型导出
export const businessTypeExport = (data) => {
  download(`${BASE_URL}/srmAccessSupplierBusinessBind/export`, data)
}

// 供应商业务类型导入模板
export const businessTypeTemplate = (data) => {
  templateDownload(`${BASE_URL}/srmAccessSupplierBusinessBind/modelDownloadCoefficient`, data)
}

// 供应商业务类型导入
export const businessTypeUploadUrl = `${process.env.VUE_APP_BASE_API}${BASE_URL}/srmAccessSupplierBusinessBind/uploadCoefficientExcelFile`



// 指标打分人维护查询
export const getIndexScoreBindList = data => request({
  url: `${BASE_URL}/srmAccessIndexScoreBind/getIndexScoreBindList`,
  method: 'post',
  data
})

// 指标打分人维护详情
export const getIndexScoreBindDetail = params => formRequest({
  url: `${BASE_URL}/srmAccessIndexScoreBind/getIndexScoreBindDetail`,
  method: 'get',
  params
})

// 指标打分人维护修改
export const insertOrUpdateSrmAccessIndexScoreBind = data => request({
  url: `${BASE_URL}/srmAccessIndexScoreBind/insertOrUpdateSrmAccessIndexScoreBind`,
  method: 'post',
  data
})

// 指标打分人维护删除
export const deleteIndexScoreBind = params => formRequest({
  url: `${BASE_URL}/srmAccessIndexScoreBind/deleteIndexScoreBind`,
  method: 'delete',
  params
})

// 指标打分人维护导出
export const indexScoreExport = (data) => {
  download(`${BASE_URL}/srmAccessIndexScoreBind/export`, data)
}

// 指标打分人维护导入模板
export const indexScoreTemplate = (data) => {
  templateDownload(`${BASE_URL}/srmAccessIndexScoreBind/modelDownloadCoefficient`, data)
}

// 指标打分人维护导入
export const indexScoreUploadUrl = `${process.env.VUE_APP_BASE_API}${BASE_URL}/srmAccessIndexScoreBind/uploadCoefficientExcelFile`



// 考核模板维护查询
export const getTemplateBusinessBindList = data => request({
  url: `${BASE_URL}/smrAccessTemplateBusinessBind/getTemplateBusinessBindList`,
  method: 'post',
  data
})

// 考核模板维护详情
export const getTemplateBusinessBindDetail = params => formRequest({
  url: `${BASE_URL}/smrAccessTemplateBusinessBind/getTemplateBusinessBindDetail`,
  method: 'get',
  params
})

// 考核模板维护修改
export const insertOrUpdateTemplateBusinessBind = data => request({
  url: `${BASE_URL}/smrAccessTemplateBusinessBind/insertOrUpdateTemplateBusinessBind`,
  method: 'post',
  data
})

// 考核模板维护删除
export const deleteTemplateBusinessBind = params => formRequest({
  url: `${BASE_URL}/smrAccessTemplateBusinessBind/deleteTemplateBusinessBind`,
  method: 'delete',
  params
})

// 红黄牌查询
export const getSrmAccessTricolorCardList = data => request({
  url: `${BASE_URL}/srmAccessTricolorCard/getSrmAccessTricolorCardList`,
  method: 'post',
  data
})

// 红黄牌详情
export const getSrmAccessTricolorCardDetail = params => formRequest({
  url: `${BASE_URL}/srmAccessTricolorCard/getSrmAccessTricolorCardDetail`,
  method: 'get',
  params
})

// 红黄牌修改
export const insertOrUpdateSrmAccessTricolorCard = data => request({
  url: `${BASE_URL}/srmAccessTricolorCard/insertOrUpdateSrmAccessTricolorCard`,
  method: 'post',
  data
})

// 红黄牌删除
export const deleteSrmAccessTricolorCard = params => formRequest({
  url: `${BASE_URL}/srmAccessTricolorCard/deleteSrmAccessTricolorCard`,
  method: 'delete',
  params
})