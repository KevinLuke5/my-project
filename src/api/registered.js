import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'

const BASE_URL = 'srm-base-data'

export const registered = data => {
  return request({
    url: `${BASE_URL}/srmRegistration/register`,
    method: 'post',
    data: data
  })
}