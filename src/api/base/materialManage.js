import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'

const BASE_URL = 'srm-base-data'

// 物料管理查询
export const getQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsMaterial/getMaterialList`,
    method: 'get',
    params
  })
}