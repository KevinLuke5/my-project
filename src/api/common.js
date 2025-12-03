import request from '@/utils/request'
const BASE_URL = 'srm-base-data'

// 法人查询
export const getCorporateNameAndCode = data => request({
  url: `${BASE_URL}srm-base-data/dataAuthority/getCorporateNameAndCode`,
  method: 'post',
  data
})

// 查询供应商名称
export const getSupplierName = data => request({
  url: `${BASE_URL}/srmSupplier/getSupplierName`,
  method: 'get',
  params: data
})

// 代码表下拉数据
export const getCodeDetailList = data => request({
  url: `${BASE_URL}/srmBasicsCode/getCodeDetailList`,
  method: 'get',
  params: data
})