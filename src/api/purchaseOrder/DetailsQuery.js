import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'
const BASE_URL = 'srm-order'

// 采购订单确认查询
export const getPurchaseOrder = data => formRequest({
  url: `${BASE_URL}/srmOrderPurchaseOrder/getPurchaseOrder?${qs.stringify(data)}`,
  method: 'get'
})

// 批量确认
export const batchConfirmation = data => request({
  url: `${BASE_URL}/srmOrderPurchaseOrder/batchConfirmation`,
  method: 'post',
  data
})
