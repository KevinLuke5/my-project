// import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'

const BASE_URL = 'srm-base-data'

// 资源池权限
export const facSearch = data => formRequest({
  url: `${BASE_URL}/srmHandle/getAuthorityCode`,
  method: 'get',
  data
})

// 代码表下拉数据
export const getCodeDetailList = data => formRequest({
  url: `${BASE_URL}/srmBasicsCode/getCodeDetailList?${qs.stringify(data)}`,
  method: 'get'
})

// 项目名称查询下拉
export const projectSearch = params => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryProject/getProjectByNameOrCode`,
    method: 'get',
    params
  })
}