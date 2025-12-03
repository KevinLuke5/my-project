import request from '@/utils/request'
import download from '@/utils/download'
// import qs from 'qs'
const BASE_URL = 'srm-order'

// 库存查询
export const srmOrderStockList = data => request({
  url: `${BASE_URL}/srmOrderStock/pageList`,
  method: 'post',
  data
})

// 库存同步
export const srmOrderStockSynchronous = data => request({
  url: `${BASE_URL}/srmOrderStock/synchronous`,
  method: 'post',
  data
})

// 库存导出
export const srmOrderStockExport = (data) => {
  download(`${BASE_URL}/srmOrderStock/export`, data)
}
