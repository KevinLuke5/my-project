import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'

const BASE_URL = 'srm-base-data'

// 法人组织查询
export const getQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsOrganization/getOrganizationList`,
    method: 'get',
    params
  })
}

// 法人组织查询
export const getOrganization = params => {
  return request({
    url: `${BASE_URL}/srmBasicsOrganization/getOrganization`,
    method: 'post',
    data: params
  })
}