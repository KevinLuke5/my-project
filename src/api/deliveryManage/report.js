import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
const BASE_URL = 'srm-order'
import download from '@/utils/download'


// VMI台账报表查询
export const getVmiPage = params => formRequest({
  url: `${BASE_URL}/srmOrderStockVmi/getVmiPage`,
  method: 'get',
  params
})

// VMI库存同步
export const syncVmiStock = data => request({
  url: `${BASE_URL}/srmOrderStockVmi/syncVmiStock`,
  method: 'post',
  data
})

// 导出
export const exportVmiStock = data => formRequest({
  url: download(`${BASE_URL}/srmOrderStockVmi/exportVmiStock`, data),
  method: 'get'
})

// 库存收发报表导出
export const exportStockTransceiver = data => formRequest({
  url: download(`${BASE_URL}/srmOrderStockTransceiver/exportStockTransceiver`, data),
  method: 'get'
})

// 数据同步
export const syncStockTransceiver = data => request({
  url: `${BASE_URL}/srmOrderStockTransceiver/syncStockTransceiver`,
  method: 'post',
  data
})

// 库存收发报表
export const getStockTransceiverPage = params => formRequest({
  url: `${BASE_URL}/srmOrderStockTransceiver/getStockTransceiverPage`,
  method: 'get',
  params
})

// 库存收发修改
export const updateStockTransceiver = data => request({
  url: `${BASE_URL}/srmOrderStockTransceiver/updateStockTransceiver`,
  method: 'post',
  data
})
