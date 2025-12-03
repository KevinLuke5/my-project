import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'
const BASE_URL = 'srm-access'

// 我分配的查询
export const getAccessTaskList = data => formRequest({
  url: `${BASE_URL}/srmAccessTask/getAccessTaskList?${qs.stringify(data)}`,
  method: 'get'
})

// 创建任务单
export const insertBatchSrmAccessBill = data => request({
  url: `${BASE_URL}/srmAccessTask/insertOrUpdateTask`,
  method: 'post',
  data
})

// 复制
export const copyTask = data => formRequest({
  url: `${BASE_URL}/srmAccessTask/copyTask?${qs.stringify(data)}`,
  method: 'get'
})

// 驳回
export const rejectTask = data => formRequest({
  url: `${BASE_URL}/srmAccessTask/rejectTask?${qs.stringify(data)}`,
  method: 'get'
})

// 完成取消
export const cancelComplete = data => request({
  url: `${BASE_URL}/srmAccessTask/cancelComplete`,
  method: 'post',
  data
})

// 根据用户名或公司名称查询人员与公司关联信息
export const getUserCompanyRel = data => formRequest({
  url: `srm-base-data/srmRegistration/getUserCompanyRel?${qs.stringify(data)}`,
  method: 'get'
})

// 我处理的查询
export const getExecuteUserTask = data => formRequest({
  url: `${BASE_URL}/srmAccessTaskExecuteUser/getExecuteUserTask?${qs.stringify(data)}`,
  method: 'get'
})

// 我处理的回复记录查询
export const getRecord = data => formRequest({
  url: `${BASE_URL}/srmAccessTaskRecord/getRecord?${qs.stringify(data)}`,
  method: 'get'
})

// 我处理的回复操作
export const insertOrUpdateRecord = data => request({
  url: `${BASE_URL}/srmAccessTaskRecord/insertOrUpdateRecord`,
  method: 'post',
  data
})