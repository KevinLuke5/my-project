import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'
const BASE_URL = 'srm-order'
import download from '@/utils/download'

// 送货单打印与查询
export const getOrderDeliver = data => formRequest({
  url: `${BASE_URL}/srmOrderDeliverOrder/getOrderDeliver?${qs.stringify(data)}`,
  method: 'get'
})

// 送货单明细查看
export const getDeliverOrderDetail = data => formRequest({
  url: `${BASE_URL}/srmOrderDeliverOrderDetail/getDeliverOrderDetail?${qs.stringify(data)}`,
  method: 'get'
})

// 打印次数
export const printCount = data => request({
  url: `${BASE_URL}/srmOrderDeliverPrint/print`,
  method: 'post',
  data
})

// 发货
export const deliverGoods = data => request({
  url: `${BASE_URL}/srmOrderDeliverOrder/deliverGoods`,
  method: 'post',
  data
})

// 批量发货
export const deliverGoodsBatch = data => request({
  url: `${BASE_URL}/srmOrderDeliverOrder/deliverGoodsBatch`,
  method: 'post',
  data
})

// 批量创建箱码
export const batchCreatBoxCode = data => request({
  url: `${BASE_URL}/srmOrderBoxCode/batchCreatBoxCode`,
  method: 'post',
  data
})

// 送货单明细修改
export const updateDeliverOrderDetail = data => request({
  url: `${BASE_URL}/srmOrderDeliverOrderDetail/updateDeliverOrderDetail`,
  method: 'post',
  data
})

// 导出
export const exportOrder = data => formRequest({
  url: download(`${BASE_URL}/srmOrderDeliverOrder/export`, data),
  method: 'get'
})
