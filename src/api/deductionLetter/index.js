/*
 * @Author: lvkaijun
 * @Date: 2023-04-27 9:38:24
 * @LastEditTime: 2023-04-27 9:49:32
 * @Description: 扣款函管理模块
 */
import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
// import qs from 'qs'
import download from '@/utils/download'

const BASE_URL = 'srm-finance'

// 扣款函新增
export const saveSrmDeductMoneyLetter = data => {
  return request({
    url: `${BASE_URL}/srmDeductMoneyLetter/saveSrmDeductMoneyLetter`,
    method: 'POST',
    data
  })
}

// 扣款函分页查询
export const selectPage = data => {
  return request({
    url: `${BASE_URL}/srmDeductMoneyLetter/selectPage`,
    method: 'POST',
    data
  })
}

// 扣款函生成编码
export const createBillCode = params => {
  return request({
    url: `${BASE_URL}/srmDeductMoneyLetter/createBillCode`,
    method: 'GET',
    params
  })
}

// 扣款函发布
export const releaseSrmDeductMoneyLetter = data => {
  return request({
    url: `${BASE_URL}/srmDeductMoneyLetter/releaseSrmDeductMoneyLetter`,
    method: 'POST',
    data
  })
}

// 扣款函修改
export const modify = data => {
  return request({
    url: `${BASE_URL}/srmDeductMoneyLetter/modify`,
    method: 'POST',
    data
  })
}

// 扣款函批量发布
export const releaseSrmDeductMoneyLetterBath = data => {
  return request({
    url: `${BASE_URL}/srmDeductMoneyLetter/releaseSrmDeductMoneyLetterBath`,
    method: 'POST',
    data
  })
}

// 扣款函下载导入模板
export const importTemplate = data => formRequest({
  url: download(`${BASE_URL}/srmDeductMoneyLetter/importTemplate`, data),
  method: 'get'
})

// 扣款函导入
export const imports = data => {
  return request({
    url: `${BASE_URL}/srmDeductMoneyLetter/imports`,
    method: 'POST',
    data
  })
}

// 扣款函下载导出草稿
export const srmDeductMoneyLetterExport = data => formRequest({
  url: download(`${BASE_URL}/srmDeductMoneyLetter/export`, data),
  method: 'get'
})

// 扣款函退回至草稿
export const backToDraft = data => {
  return request({
    url: `${BASE_URL}/srmDeductMoneyLetter/backToDraft`,
    method: 'POST',
    data
  })
}

// 扣款函导出已发布
export const exportRelease = data => formRequest({
  url: download(`${BASE_URL}/srmDeductMoneyLetter/exportRelease`, data),
  method: 'get'
})

// 扣款函导出已对账
export const exportAccount = data => formRequest({
  url: download(`${BASE_URL}/srmDeductMoneyLetter/exportAccount`, data),
  method: 'get'
})

// 扣款函导出已开票
export const exportDraw = data => formRequest({
  url: download(`${BASE_URL}/srmDeductMoneyLetter/exportDraw`, data),
  method: 'get'
})

// bom导出
export const exportBom = data => formRequest({
  url: download('srm-order/srmOrderPurchaseOrder/exportBom', data),
  method: 'get'
})
