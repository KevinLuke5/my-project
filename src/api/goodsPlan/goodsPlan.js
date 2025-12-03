// import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import download from '@/utils/download'
import qs from 'qs'
const BASE_URL = 'srm-order'

// 要货计划查询
export const getDemandPlanOrderList = data => formRequest({
  url: `${BASE_URL}/srmOrderDemandPlanOrder/getDemandPlanOrderList?${qs.stringify(data)}`,
  method: 'get'
})

// 要货计划查询送货单
export const getOrderDeliveryDetail = data => formRequest({
  url: `${BASE_URL}/srmOrderDeliverOrder/getOrderDeliveryDetail?${qs.stringify(data)}`,
  method: 'get'
})

// 要货计划导出
export const exportDemandList = (data) => {
  download(`${BASE_URL}/srmOrderDemandPlanOrder/exportDemandOrderList`, data)
}