import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'
const BASE_URL = 'srm-order'
import download from '@/utils/download'

// 导出
export const queryExport = data => formRequest({
  url: download(`${BASE_URL}/srmOrderGuestGoodsReturnApply/queryExport`, data),
  method: 'get'
})

// 分页查询客供物料退货确认
export const queryPage = data => request({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnApply/queryPage`,
  method: 'post',
  data
})

// 根据退货单号查询详情
export const queryDetil = data => request({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnApply/queryDetil`,
  method: 'post',
  data
})

// 客供物料退货确认修改详情的确认出库量
export const saveOrUpd = data => request({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnApply/saveOrUpd`,
  method: 'post',
  data
})

// 客供物料退货确认提交
export const submit = data => request({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnApply/submit`,
  method: 'post',
  data
})
