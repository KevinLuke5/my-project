import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import { templateDownload } from '@/utils/download'
import download from '@/utils/download'

const BASE_URL = 'srm-finance'

// 收款明细录入查询
export const getSrmFinanceReceiptDetailPage = data => request({
  url: `${BASE_URL}/srmFinanceReceiptDetail/getSrmFinanceReceiptDetailPage`,
  method: 'get',
  params: data
})

// 收款明细录入新增和修改
export const saveOrUpdateSrmFinanceReceiptDetail = data => request({
  url: `${BASE_URL}/srmFinanceReceiptDetail/saveOrUpdateSrmFinanceReceiptDetail`,
  method: 'post',
  data
})

// 批量提交
export const submitSrmFinanceReceiptDetail = data => request({
  url: `${BASE_URL}/srmFinanceReceiptDetail/submitSrmFinanceReceiptDetail`,
  method: 'post',
  data
})

export const uploadSrmFinanceReceiptDetailExcelFile = `${process.env.VUE_APP_BASE_API}${BASE_URL}/srmFinanceReceiptDetail/uploadSrmFinanceReceiptDetailExcelFile`

// 模板下载
export const modelDownloadSrmFinanceReceiptDetail = (data) => {
  templateDownload(`${BASE_URL}/srmFinanceReceiptDetail/modelDownloadSrmFinanceReceiptDetail`, data)
}

// 导出
export const exportSrmFinanceReceiptDetail = data => formRequest({
  url: download(`${BASE_URL}/srmFinanceReceiptDetail/exportSrmFinanceReceiptDetail`, data),
  method: 'get'
})
