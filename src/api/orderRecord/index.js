/*
 * @Author: lvkaijun
 * @Date: 2023-05-18 9:38:24
 * @LastEditTime: 2023-05-27 9:49:32
 * @Description: 订单对账管理模块
 */
import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
// import qs from 'qs'
import { download, templateDownload } from '@/utils/download'

const BASE_URL = 'srm-finance'


// 订单事务分页导出
export const exportOrderTransaction = data => formRequest({
  url: download(`${BASE_URL}/srmFinanceOrderTransaction/exportOrderTransaction`, data),
  method: 'get'
})

// 采购对账单查询
export const getBillInfoPage = params => {
  return request({
    url: `${BASE_URL}/srmFinanceBillInfo/getBillInfoPage`,
    method: 'GET',
    params
  })
}

// 未发布 已发布 已确认 已开票 查询对账单明细
export const getBillInfoDetail = params => {
  return request({
    url: `${BASE_URL}/srmFinanceBillInfo/getBillInfoDetail`,
    method: 'GET',
    params
  })
}

// 对账单确认
export const batchConfirm = data => {
  return request({
    url: `${BASE_URL}/srmFinanceBillInfo/batchConfirm`,
    method: 'POST',
    data
  })
}

// 对账单导出（除取消页签）
export const exportBillInfo = data => formRequest({
  url: templateDownload(`${BASE_URL}/srmFinanceBillInfo/exportBillInfo`, data),
  method: 'get'
})

// 对账单明细导出
export const exportBillInfoDetail = data => formRequest({
  url: templateDownload(`${BASE_URL}/srmFinanceBillInfo/exportBillInfoDetail`, data),
  method: 'get'
})
