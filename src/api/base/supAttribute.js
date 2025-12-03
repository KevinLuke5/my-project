import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'

const BASE_URL = 'srm-base-data'

// 主页查询
export const getQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmSupplier/getSrmSupplierMaintain`,
    method: 'get',
    params
  })
}
// 查询供应商
export const querySupList = params => {
  return formRequest({
    url: `${BASE_URL}/srmSupplier/getSupplierName`,
    method: 'get',
    params
  })
}
// 保存
export const saveSupList = data => {
  return request({
    url: `${BASE_URL}/srmSupplier/insertOrUpdateSrmSupplier`,
    method: 'post',
    data
  })
}