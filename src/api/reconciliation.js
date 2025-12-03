import request from '@/utils/request'
const BASE_URL = 'srm-finance'
import  { templateDownload } from '@/utils/download'

// 承兑列表查询-九阳
export const getSrmFinanceAcceptBillPage = data => request({
  url: `${BASE_URL}/srmFinanceAcceptBill/getSrmFinanceAcceptBillPage`,
  method: 'get',
  params: data
})

// 发布、取消、确认承兑对象
export const updateStatus = data => request({
  url: `${BASE_URL}/srmFinanceAcceptBill/updateStatus`,
  method: 'post',
  data
})


// 纸质发票导出
export const exportSrmFinanceAcceptBill = data =>
  templateDownload(`${BASE_URL}/srmFinanceAcceptBill/exportSrmFinanceAcceptBill`, data)