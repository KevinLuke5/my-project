// import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
const BASE_URL = 'srm-order'
import download from '@/utils/download'


// 报表查询
export const getOrderDataInspectPage = params => formRequest({
  url: `${BASE_URL}/srmOrderPurchaseOrder/getOrderDataInspectPage`,
  method: 'get',
  params
})

// 导出
export const exportOrderDataInspect = data => formRequest({
  url: download(`${BASE_URL}/srmOrderPurchaseOrder/exportOrderDataInspect`, data),
  method: 'get'
})
