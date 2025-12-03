import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'
const BASE_URL = 'srm-order'
import download from '@/utils/download'

// 客供物料退货地址查询
export const getAddrList = data => formRequest({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnAddr/getAddrList?${qs.stringify(data)}`,
  method: 'get'
})

// 客供物料退货联系人查询
export const getSupplierOrUser = data => formRequest({
  url: `srm-base-data/srmRegistration/getSupplierOrUser?${qs.stringify(data)}`,
  method: 'get'
})

// 新增修改地址
export const insertOrUpdateAddr = data => request({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnAddr/insertOrUpdateAddr`,
  method: 'post',
  data
})

// 批量删除地址
export const deleteBatchAddr = data => request({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnAddr/deleteBatchAddr`,
  method: 'post',
  data
})

// 供应商地址维护导出
export const exportAddr = (data) => {
  download(`${BASE_URL}/srmOrderGuestGoodsReturnAddr/exportAddr`, data)
}
