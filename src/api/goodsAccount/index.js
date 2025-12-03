import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import { templateDownload, download } from '@/utils/download'
const BASE_URL = 'srm-finance'

// 货款往来对账单日志 查询
export const getPaymentBillLog = params => formRequest({
  url: `${BASE_URL}/srmFinancePaymentBillLog/getPaymentBillLog`,
  method: 'get',
  params
})

// 货款往来对账单日志 详情
export const getBill = params => formRequest({
  url: `${BASE_URL}/srmFinancePaymentBillLog/getBill`,
  method: 'get',
  params
})

// 货款往来对账单日志 导出
export const exportPaymentBillLog = (data) => {
  download(`${BASE_URL}/srmFinancePaymentBillLog/exportPaymentBillLog`, data)
}

// 货款往来对账单 生成
export const createPaymentBill = data => request({
  url: `${BASE_URL}/srmFinancePaymentBill/createPaymentBill`,
  method: 'POST',
  data
})

// 货款往来对账单 查询
export const getPaymentBill = params => formRequest({
  url: `${BASE_URL}/srmFinancePaymentBill/getPaymentBill`,
  method: 'get',
  params
})

// 货款往来对账单 操作日志
export const getOperationItem = params => formRequest({
  url: `${BASE_URL}/srmFinancePaymentOperation/getOperationItem`,
  method: 'get',
  params
})

// 货款往来对账单 确认&退回&取消
export const paymentBillUpdateStatus = data => request({
  url: `${BASE_URL}/srmFinancePaymentBill/updateStatus`,
  method: 'POST',
  data
})

// 货款往来对账单 明细
export const getPaymentBillDetail = params => formRequest({
  url: `${BASE_URL}/srmFinancePaymentBill/getPaymentBillDetail`,
  method: 'get',
  params
})

// 货款往来对账单 保存 提交
export const updatePaymentBillAndDetail = data => request({
  url: `${BASE_URL}/srmFinancePaymentBill/updatePaymentBillAndDetail`,
  method: 'POST',
  data
})

// 货款往来对账单 导出
export const exportPaymentBill = (data) => {
  download(`${BASE_URL}/srmFinancePaymentBill/exportPaymentBill`, data)
}

// 付款明细 查询
export const getSrmFinancePaymentDetailPage = params => formRequest({
  url: `${BASE_URL}/srmFinancePaymentDetail/getSrmFinancePaymentDetailPage`,
  method: 'get',
  params
})

// 付款明细 导出
export const exportSrmFinancePaymentDetail = (data) => {
  templateDownload(`${BASE_URL}/srmFinancePaymentDetail/exportSrmFinancePaymentDetail`, data)
}