import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'
const BASE_URL = 'srm-order'
import download from '@/utils/download'


// 事务查询
export const getPurchaseOrder = data => formRequest({
  url: `${BASE_URL}/srmOrderPurchaseTransactionDetail/getPurchaseTransactionDetail?${qs.stringify(data)}`,
  method: 'get'
})

// 事务查询
export const getOrderDeliveryDetail = data => formRequest({
  url: `${BASE_URL}/srmOrderDeliverOrder/getOrderDeliveryDetail?${qs.stringify(data)}`,
  method: 'get'
})

// 导出
export const exportTransactionDetail = data => formRequest({
  url: download(`${BASE_URL}/srmOrderPurchaseTransactionDetail/exportTransactionDetail`, data),
  method: 'get'
})
