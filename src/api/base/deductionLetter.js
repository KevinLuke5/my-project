import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'

const BASE_URL = 'srm-base-data'

// 法人下拉
export const getLegalName = params => {
  return request({
    url: `${BASE_URL}/srmBasicsOrganization/getLegalName`,
    method: 'GET',
    params
  })
}

// 组织下拉
export const getOrg = params => {
  return request({
    url: `${BASE_URL}/srmBasicsOrganization/getOrg`,
    method: 'GET',
    params
  })
}