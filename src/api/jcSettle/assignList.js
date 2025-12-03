import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'
const BASE_URL = 'srm-finance'
import download from '@/utils/download'



// 分页查询分配清单
export const getAllotInventoryPage = params => request({
  url: `${BASE_URL}/srmFinanceAllotInventory/getAllotInventoryPage`,
  method: 'get',
  params
})

// 导出分配清单
export const exportAllotInventory = data => formRequest({
  url: download(`${BASE_URL}/srmFinanceAllotInventory/exportAllotInventory`, data),
  method: 'get'
})

// 集采-对账单汇总
export const getSrmFinanceGroupPurchaseBillPage = params => request({
  url: `${BASE_URL}/srmFinanceGroupPurchaseBill/getSrmFinanceGroupPurchaseBillPage`,
  method: 'get',
  params
})

// 集采-对账单明细表查询
export const getSrmFinanceGroupPurchaseBillDetailPage = params => request({
  url: `${BASE_URL}/srmFinanceGroupPurchaseBill/getSrmFinanceGroupPurchaseBillDetailPage`,
  method: 'get',
  params
})

// 对账单明细关联查询
export const getSrmFinanceGroupPurchaseBillDetailRelPage = params => request({
  url: `${BASE_URL}/srmFinanceGroupPurchaseBill/getSrmFinanceGroupPurchaseBillDetailRelPage`,
  method: 'get',
  params
})

// 数据更新
export const createSrmFinanceGroupPurchaseBill = params => request({
  url: `${BASE_URL}/srmFinanceGroupPurchaseBill/createSrmFinanceGroupPurchaseBill`,
  method: 'get',
  params
})

// 对账单查询导出
export const exportSrmFinanceGroupPurchaseBill = data => formRequest({
  url: download(`${BASE_URL}/srmFinanceGroupPurchaseBill/exportSrmFinanceGroupPurchaseBill`, data),
  method: 'get'
})

// 对账单明细表导出
export const exportSrmFinanceGroupPurchaseBillDetail = data => formRequest({
  url: download(`${BASE_URL}/srmFinanceGroupPurchaseBill/exportSrmFinanceGroupPurchaseBillDetail`, data),
  method: 'get'
})

// 收货账期查询
export const getSrmFinanceReceivePaymentPage = params => request({
  url: `${BASE_URL}/srmFinanceReceivePayment/getSrmFinanceReceivePaymentPage`,
  method: 'get',
  params
})

// 收货账期导出
export const exportSrmFinanceReceivePayment = data => formRequest({
  url: download(`${BASE_URL}/srmFinanceReceivePayment/exportSrmFinanceReceivePayment`, data),
  method: 'get'
})

// 新增或修改
export const saveOrUpdateSrmFinanceReceivePayment = data => request({
  url: `${BASE_URL}/srmFinanceReceivePayment/saveOrUpdateSrmFinanceReceivePayment`,
  method: 'post',
  data
})
