import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'

const BASE_URL = 'srm-base-data'

// 产品线管理查询
export const getQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsProductLine/getPdtLineList`,
    method: 'get',
    params
  })
}

// 产品线管理新增修改
export const update = data => {
  return request({
    url: `${BASE_URL}/srmBasicsProductLine/insertOrUpdatePdtLine`,
    method: 'post',
    data: data
  })
}

// 产品线管理删除
export const deleteId = data => {
  return request({
    url: `${BASE_URL}/srmBasicsProductLine/deletePdtLineById?${qs.stringify(data)}`,
    method: 'delete'
  })
}