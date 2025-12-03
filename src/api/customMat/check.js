import request from '@/utils/request'
// import formRequest from '@/utils/requestformdata'
import download from '@/utils/download'
// import qs from 'qs'
const BASE_URL = 'srm-order'

// 审核查询
export const getReturnApplyList = data => request({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnApply/pageList`,
  method: 'post',
  data
})

// 申请确认、拒绝
export const returnApplyAudit = data => request({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnApply/audit`,
  method: 'post',
  data
})

// 审核导出
export const exportReturnApply = (data) => {
  download(`${BASE_URL}/srmOrderGuestGoodsReturnApply/export`, data)
}

// 根据退货单号查询详情
export const getOrderDetil = data => request({
  url: `${BASE_URL}/srmOrderGuestGoodsReturnApply/queryDetil`,
  method: 'post',
  data
})
