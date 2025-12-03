import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'
const BASE_URL = 'srm-order'
import download from '@/utils/download'

// 导出
export const getExport = data => formRequest({
  url: download(`${BASE_URL}/srmOrderGuestGoodsReturnApply/getExport`, data),
  method: 'get'
})

// 分页查询客供物料退货账务
export const getPages = data => request({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnApply/getPages`,
  method: 'post',
  data
})

// 客供物料退货账务推送到erp
export const deleteBatchAddr = data => request({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnApply/pushErp`,
  method: 'post',
  data
})
