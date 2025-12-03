import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'

const BASE_URL = 'srm-base-data'

// 查询供应商信息
export const getSupplierUserInfo = params => {
  return formRequest({
    url: `${BASE_URL}/srmRegistration/getSupplierUserInfo`,
    method: 'get',
    params
  })
}