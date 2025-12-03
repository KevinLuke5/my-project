import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'
const BASE_URL = 'srm-order'
import download from '@/utils/download'

// 采购订单确认查询
export const getPurchaseOrder = data => formRequest({
  url: `${BASE_URL}/srmOrderPurchaseOrder/getPurchaseOrder?${qs.stringify(data)}`,
  method: 'get'
})

// 获取子订单
export const getPurchaseOrderSon = data => formRequest({
  url: `${BASE_URL}/srmOrderPurchaseOrder/getPurchaseOrderSon?${qs.stringify(data)}`,
  method: 'get'
})

// 操作记录日志
export const getOrderOperation = data => formRequest({
  url: `${BASE_URL}/srmOrderOperation/getOrderOperation?${qs.stringify(data)}`,
  method: 'get'
})

// 批量确认
export const batchConfirmation = data => request({
  url: `${BASE_URL}/srmOrderPurchaseOrder/batchConfirmation`,
  method: 'post',
  data
})

// 拒绝
export const rejectPurchaseOrder = data => request({
  url: `${BASE_URL}/srmOrderPurchaseOrder/rejectPurchaseOrder`,
  method: 'post',
  data
})

// 交货排程
export const deliverySchedule = data => request({
  url: `${BASE_URL}/srmOrderPurchaseOrder/deliverySchedule`,
  method: 'post',
  data
})

// 导出
export const exportPurchaseOrder = data => formRequest({
  url: download(`${BASE_URL}/srmOrderPurchaseOrder/exportPurchaseOrder`, data),
  method: 'get'
})
