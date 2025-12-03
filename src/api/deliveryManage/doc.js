import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import download from '@/utils/download'
import qs from 'qs'
const BASE_URL = 'srm-order'

// 送货单取消查询
export const getDeliverOrderCancelList = data => formRequest({
  url: `${BASE_URL}/srmOrderDeliverOrder/getDeliverOrderCancelList?${qs.stringify(data)}`,
  method: 'get'
})

// 送货单取消
export const cancelDeliverOrder = data => request({
  url: `${BASE_URL}/srmOrderDeliverOrder/cancelDeliverOrder`,
  method: 'post',
  data
})

// 送货单取消导出
export const exportCancel = (data) => {
  download(`${BASE_URL}/srmOrderDeliverOrder/exportCancel`, data)
}

// 送货单接收查询
export const getDeliverReceiveList = data => formRequest({
  url: `${BASE_URL}/srmOrderDeliverOrderDetail/getDeliverReceiveList?${qs.stringify(data)}`,
  method: 'get'
})

// 送货单接收明细修改
export const updateDeliverOrderDetail = data => request({
  url: `${BASE_URL}/srmOrderDeliverOrderDetail/updateDeliverOrderDetail`,
  method: 'post',
  data
})

// 送货单接收
export const batchDeliverReceive = data => request({
  url: `${BASE_URL}/srmOrderDeliverOrderDetail/batchDeliverReceive`,
  method: 'post',
  data
})

// 送货单接收明细查询
export const getDeliverOrderReceiveDetail = data => formRequest({
  url: `${BASE_URL}/srmOrderDeliverReceiveDetail/getDeliverOrderReceiveDetail?${qs.stringify(data)}`,
  method: 'get'
})

// 送货单接收明细导出
export const exportReceiveDetail = (data) => {
  download(`${BASE_URL}/srmOrderDeliverReceiveDetail/export`, data)
}

// 到货在途查询
export const getDeliverOnPassageList = data => formRequest({
  url: `${BASE_URL}/srmOrderDeliverOrderDetail/getDeliverOnPassageList?${qs.stringify(data)}`,
  method: 'get'
})

// 到货在途导出
export const exportOnPassage = (data) => {
  download(`${BASE_URL}/srmOrderDeliverOrderDetail/export`, data)
}
