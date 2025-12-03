import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import download from '@/utils/download'
import qs from 'qs'
const BASE_URL = 'srm-order'

// 申请查询
export const getGoodsReturnList = data => formRequest({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnApplyDetail/getGoodsReturnList?${qs.stringify(data)}`,
  method: 'get'
})

// 申请新增修改
export const insertOrUpdateReturnApply = data => request({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnApplyDetail/insertOrUpdateReturnApply`,
  method: 'post',
  data
})

// 申请提交、取消
export const commitOrCancel = data => request({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnApplyDetail/commitOrCancel`,
  method: 'post',
  data
})

// 根据物料查询已接收送货单
export const getDeliverOrderInfo = data => formRequest({
  url: `${BASE_URL}/srmOrderDeliverOrderDetail/getDeliverOrderInfo?${qs.stringify(data)}`,
  method: 'get'
})

// 获取退货地址信息
export const getAddrInfo = data => formRequest({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnAddr/getAddrInfo?${qs.stringify(data)}`,
  method: 'get'
})

// 退货申请导出
export const returnApplyExport = (data) => {
  download(`${BASE_URL}/srmOrderGuestGoodsReturnApplyDetail/export`, data)
}
