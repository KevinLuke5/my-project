import formRequest from '@/utils/requestformdata'
import request from '@/utils/request'
import qs from 'qs'
const BASE_URL = 'cloud-data-scm'

// BOM工单组件
// export const getBOM = data => request({
//   url: `${BASE_URL}/scmErpTaskComponent/queryAll`,
//   method: 'post',
//   data
// })

export const getBOM = data => formRequest({
  url: `${BASE_URL}/scmErpTaskComponent/queryAll?${qs.stringify(data)}`,
  method: 'post'
})