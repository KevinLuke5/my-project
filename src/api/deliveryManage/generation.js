import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'
const BASE_URL = 'srm-order'

// 订单生成送货单查询
export const getPurchaseOrderList = data => formRequest({
  url: `${BASE_URL}/srmOrderPurchaseOrder/getPurchaseOrderList?${qs.stringify(data)}`,
  method: 'get'
})


// 订单生成送货单修改
export const updatePurchaseOrder = data => request({
  url: `${BASE_URL}/srmOrderPurchaseOrder/updatePurchaseOrder`,
  method: 'post',
  data
})

// 订单生成送货单生成接口
export const purchaseCreateDeliver = data => request({
  url: `${BASE_URL}/srmOrderPurchaseOrder/purchaseCreateDeliver`,
  method: 'post',
  data
})
