import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import { download, templateDownload } from '@/utils/download'
import qs from 'qs'
const BASE_URL = 'srm-access'

// 业务类型(拼接小类)查询
export const getSmallClassByName = data => formRequest({
  url: `srm-base-data/srmBasicsSmallClass/getSmallClassByName?${qs.stringify(data)}`,
  method: 'get'
})

// 模板查询
export const getTemplateNameList = data => formRequest({
  url: `${BASE_URL}/srmAccessTemplate/getTemplateNameList`,
  method: 'get'
})

// 供应商查询
export const getSupplierByName = data => formRequest({
  url: `/srm-base-data/srmSupplier/getSupplierByName?${qs.stringify(data)}`,
  method: 'get'
})

// 创建考核单
export const insertBatchSrmAccessBill = data => request({
  url: `${BASE_URL}/srmAccessBill/insertBatchSrmAccessBill`,
  method: 'post',
  data
})

// 创建考核单-新
export const insertBatchSrmAccessBillNew = data => request({
  url: `${BASE_URL}/srmAccessBill/insertBatchSrmAccessBillNew`,
  method: 'post',
  data
})

// 考核单删除
export const deleteBatchBill = data => request({
  url: `${BASE_URL}/srmAccessBill/deleteBatchBill`,
  method: 'delete',
  data
})

// 考核单查询
export const getBill = data => formRequest({
  url: `${BASE_URL}/srmAccessBill/getBill?${qs.stringify(data)}`,
  method: 'get'
})

// 考核单修改
export const updateSrmAccessBill = data => request({
  url: `${BASE_URL}/srmAccessBill/updateSrmAccessBill`,
  method: 'post',
  data
})

// 考核单整改确认
export const updateConfirm = data => request({
  url: `${BASE_URL}/srmAccessBillAssignProcessor/confirm`,
  method: 'post',
  data
})

// 确认日志查询
export const getAssignProcessorLog = params => formRequest({
  url: `${BASE_URL}/srmAccessBillAssignProcessor/getAssignProcessorLog`,
  method: 'get',
  params
})

// 考核单发布
export const toPublish = data => request({
  url: `${BASE_URL}/srmAccessBill/toPublish`,
  method: 'post',
  data
})

// 考核单审核
export const toCheck = data => request({
  url: `${BASE_URL}/srmAccessBill/toCheck`,
  method: 'post',
  data
})

// 总览
export const getBillAll = data => formRequest({
  url: `${BASE_URL}/srmAccessBill/getBillAll?${qs.stringify(data)}`,
  method: 'get'
})

// 指标明细查询
export const getBillDetailGroup = data => formRequest({
  url: `${BASE_URL}/srmAccessBillDetail/getBillDetailGroup?${qs.stringify(data)}`,
  method: 'get'
})

// 指标打分明细-查询
export const getBillDetail = data => formRequest({
  url: `${BASE_URL}/srmAccessBillDetail/getBillDetail?${qs.stringify(data)}`,
  method: 'get'
})

// 指标打分明细-打分
export const updateSrmAccessBillDetail = data => request({
  url: `${BASE_URL}/srmAccessBillDetail/updateSrmAccessBillDetail`,
  method: 'post',
  data
})

// 指标打分明细-变更
export const changeSrmAccessBillDetail = data => request({
  url: `${BASE_URL}/srmAccessBillDetail/change`,
  method: 'post',
  data
})

// 考核结果
export const getApprovalResult = params => request({
  url: `${BASE_URL}/srmWorkflowBill/getApprovalResult`,
  method: 'get',
  params
})

// 考核汇总查询
export const getBillOverview = params => request({
  url: `${BASE_URL}/srmAccessBill/getBillOverview`,
  method: 'get',
  params
})

// 考核汇总查询-新
export const getBillOverviewNew = params => request({
  url: `${BASE_URL}/srmAccessBill/getBillOverviewNew`,
  method: 'get',
  params
})

// 考核汇总导出
export const billOverviewExport = (data) => {
  download(`${BASE_URL}/srmAccessBill/billOverviewExport`, data)
}

// 系统日志查询
export const getBillLog = params => request({
  url: `${BASE_URL}/srmAccessBillLog/getBillLog`,
  method: 'get',
  params
})

// 系统日志导出
export const exportLogDetail = (data) => {
  download(`${BASE_URL}/srmAccessBillLogDetail/exportLogDetail`, data)
}

// 考核系数查询
export const getCoefficientPage = data => formRequest({
  url: `${BASE_URL}/srmAccessBillCoefficient/getCoefficientPage?${qs.stringify(data)}`,
  method: 'get'
})

// 考核系数模板下载
export const modelDownloadCoefficient = (data) => {
  templateDownload(`${BASE_URL}/srmAccessBillCoefficient/modelDownloadCoefficient`, data)
}

// 考核系数新增修改
export const saveOrUpdateCoefficient = data => request({
  url: `${BASE_URL}/srmAccessBillCoefficient/saveOrUpdateCoefficient`,
  method: 'post',
  data
})

// 考核系数导入
export const uploadCoefficientExcelFile = `${process.env.VUE_APP_BASE_API}${BASE_URL}/srmAccessBillCoefficient/uploadCoefficientExcelFile`

// 考核系数批量删除
export const deleteBatchByIds = data => request({
  url: `${BASE_URL}/srmAccessBillCoefficient/deleteBatchByIds?${qs.stringify(data)}`,
  method: 'delete'
})
