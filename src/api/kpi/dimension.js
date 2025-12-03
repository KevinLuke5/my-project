import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'
const BASE_URL = 'srm-access'

// 考核维度查询
export const getDimensionList = data => formRequest({
  url: `${BASE_URL}/srmAccessDimension/getDimensionList?${qs.stringify(data)}`,
  method: 'get'
})

// 考核维度新增修改
export const insertOrUpdateDimension = data => request({
  url: `${BASE_URL}/srmAccessDimension/insertOrUpdateDimension`,
  method: 'post',
  data
})

// 考核维度删除
export const deleteBatchDimension = data => request({
  url: `${BASE_URL}/srmAccessDimension/deleteBatchDimension?${qs.stringify(data)}`,
  method: 'delete'
})