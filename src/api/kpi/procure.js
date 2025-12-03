import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import { templateDownload } from '@/utils/download'
import qs from 'qs'
const BASE_URL = 'srm-access'

// // 业务类型(拼接小类)查询
// export const getSmallClassByName = data => formRequest({
//   url: `srm-base-data/srmBasicsSmallClass/getSmallClassByName?${qs.stringify(data)}`,
//   method: 'get'
// })

// 采购负责人管理查询
export const getDutyerManage = params => {
  return formRequest({
    url: `${BASE_URL}/srmAccessSupPurchaseRel/getSupPurchaseList`,
    method: 'get',
    params
  })
}

// // 供应商查询
// export const getSupplierByName = data => formRequest({
//   url: `/srm-base-data/srmSupplier/getSupplierByName?${qs.stringify(data)}`,
//   method: 'get'
// })

// 采购负责人管理新增
export const insertDutyerManage = data => request({
  url: `${BASE_URL}/srmAccessSupPurchaseRel/insertOrUpdateSupPurchase`,
  method: 'post',
  data
})

// 采购负责人管理删除
export const deleteIdDutyerManage = data => {
  return formRequest({
    url: `${BASE_URL}/srmAccessSupPurchaseRel/deleteBatchSupurchase?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 采购负责人管理下载导入模板
export function importTem (data) {
  templateDownload(`${BASE_URL}/srmAccessSupPurchaseRel/modelDownloadPurchase`, data)
}

// 采购负责人管理导入
export const importUrl = `${process.env.VUE_APP_BASE_API}${BASE_URL}/srmAccessSupPurchaseRel/uploadPurchaseExcelFile`

// 考核模板管理查询
export const getInspectionTem = params => {
  return formRequest({
    url: `${BASE_URL}/srmAccessTemplate/getTemplateList`,
    method: 'get',
    params
  })
}

// 考核模板管理新增
export const addInspectionTem = data => request({
  url: `${BASE_URL}/srmAccessTemplate/insertTemplate`,
  method: 'post',
  data
})

// 考核模板管理编辑
export const insertInspectionTem = data => request({
  url: `${BASE_URL}/srmAccessTemplate/updateTemplate`,
  method: 'post',
  data
})

// 考核模板管理删除
export const deleteIdInspectionTem = data => {
  return formRequest({
    url: `${BASE_URL}/srmAccessTemplate/deleteBatchTemplate?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 考核模板管理详情查询
export const getInspectionTemDetail = params => {
  return formRequest({
    url: `${BASE_URL}/srmAccessTemplateDetail/getTemplateDetailList`,
    method: 'get',
    params
  })
}

// 考核模板管理详情新增编辑
export const insertInspectionTemDetail  = data => request({
  url: `${BASE_URL}/srmAccessTemplateDetail/insertOrUpdateTemplateDetail`,
  method: 'post',
  data
})

// 考核模板管理详情删除
export const deleteIdInspectionTemDetail = data => {
  return formRequest({
    url: `${BASE_URL}/srmAccessTemplateDetail/deleteTemplateDetail?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 考核指标库查询
export const getMentIndicators = params => formRequest({
  url: `${BASE_URL}/srmAccessIndex/getIndexList`,
  method: 'get',
  params
})

// 考核指标库新增编辑
export const insertMentIndicators = data => request({
  url: `${BASE_URL}/srmAccessIndex/insertOrUpdateIndex`,
  method: 'post',
  data
})

// 考核指标库删除
export const deleteIdMentIndicators = data => {
  return formRequest({
    url: `${BASE_URL}/srmAccessIndex/deleteBatchIndex?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 考核指标库明细查询
export const getMentIndicatorsDetail = params => formRequest({
  url: `${BASE_URL}/srmAccessIndexDetail/getIndexDetailList`,
  method: 'get',
  params
})

// 考核指标库明细新增编辑
export const insertMentIndicatorsDetail = data => request({
  url: `${BASE_URL}/srmAccessIndexDetail/insertOrUpdateIndexDetail`,
  method: 'post',
  data
})

// 考核指标库明细删除
export const deleteIdMentIndicatorsDetail = data => {
  return formRequest({
    url: `${BASE_URL}/srmAccessIndexDetail/deleteBatchIndexDetail?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 考核指标库查询考核维度名称and编码
export const getMentIndicatorsDimensionName = params => formRequest({
  url: `${BASE_URL}/srmAccessDimension/getAccessdimensionName`,
  method: 'get',
  params
})

// 考核指标库明细下载导入模板
export function importTemMentIndicatorsDetail  (data) {
  templateDownload(`${BASE_URL}/srmAccessIndexDetail/modelDownloadIndexDetail`, data)
}

// 考核指标库明细导入
export const importUrlMentIndicatorsDetail  = `${process.env.VUE_APP_BASE_API}${BASE_URL}/srmAccessIndexDetail/uploadIndexDetailExcelFile`