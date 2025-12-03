import formRequest from '@/utils/requestformdata'
import qs from 'qs'

const BASE_URL = '/jy-district/api/v2/district/get'

// 获取省份和城市
export const getRegion = data => {
  return formRequest({
    url: `${BASE_URL}?${qs.stringify(data)}`,
    method: 'get'
  })
}