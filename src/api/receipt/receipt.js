import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import { download, templateDownload } from '@/utils/download'
import qs from 'qs'
const BASE_URL = 'srm-finance'

// 采购发票查询
export const getPurchaseInvoicePage = data => formRequest({
  url: `${BASE_URL}/srmFinancePurchaseInvoice/getPurchaseInvoicePage?${qs.stringify(data)}`,
  method: 'get'
})

// 发票明细查询
export const getPurchaseInvoiceDetail = data => formRequest({
  url: `${BASE_URL}/srmFinancePurchaseInvoice/getPurchaseInvoiceDetail?${qs.stringify(data)}`,
  method: 'get'
})

// 生成并计税
export const saveInvoice = data => request({
  url: `${BASE_URL}/srmFinancePurchaseInvoice/saveInvoice`,
  method: 'post',
  data
})

// 发票提交
export const submitInvoice = data => request({
  url: `${BASE_URL}/srmFinancePurchaseInvoice/submitInvoice`,
  method: 'post',
  data
})

// 申请复核、复核退回
export const applyReview = data => request({
  url: `${BASE_URL}/srmFinancePurchaseInvoice/applyReview`,
  method: 'post',
  data
})

// 纸质发票明细上传查询
export const getPaperInvoicePage = data => formRequest({
  url: `${BASE_URL}/srmFinancePaperInvoiceDetail/getPaperInvoicePage?${qs.stringify(data)}`,
  method: 'get'
})

// 纸质发票新增修改
export const insertOrUpdatePaperInvoice = data => request({
  url: `${BASE_URL}/srmFinancePaperInvoiceDetail/insertOrUpdatePaperInvoice`,
  method: 'post',
  data
})

// 纸质发票提交 & 删除 & 申请复核
export const submit = data => request({
  url: `${BASE_URL}/srmFinancePaperInvoiceDetail/submit`,
  method: 'post',
  data
})

// 模板下载
export const modelDownloadPaperInvoice = (data) => {
  templateDownload(`${BASE_URL}/srmFinancePaperInvoiceDetail/modelDownloadPaperInvoice`, data)
}

// 纸质发票导入
export const uploadUrl = `${process.env.VUE_APP_BASE_API}${BASE_URL}/srmFinancePaperInvoiceDetail/uploadPaperInvoiceExcelFile`

// TODO:导出
export const Export = (data) => {
  download(`${BASE_URL}/srmFinancePaperInvoiceDetail/Export`, data)
}

// 采购发票导出
export const exportPurchaseInvoice = (data) => {
  templateDownload(`${BASE_URL}/srmFinancePurchaseInvoice/exportPurchaseInvoice`, data)
}

// 纸质发票导出
export const exportPaperInvoice = (data) => {
  templateDownload(`${BASE_URL}/srmFinancePaperInvoiceDetail/exportPaperInvoice`, data)
}

// 法人查询
export const getCorporateNameAndCode = data => request({
  url: 'srm-base-data/dataAuthority/getCorporateNameAndCode',
  method: 'post',
  data
})
