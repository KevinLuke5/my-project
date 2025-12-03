import request from '@/utils/request'
// import formRequest from '@/utils/requestformdata'
import qs from 'qs'

const BASE_URL = 'srm-access'
const BASE_URL2 = 'workflow'

// 获取列表信息
export const getWorkflowInFo = (params) =>  request({
  url: `${BASE_URL}/srmWorkflow/getWorkflowInFo`,
  method: 'get',
  params
})

// 审批
export const finish = (data) => {
  return request({
    url: `${BASE_URL}/srmWorkflow/finishBillApplyWaitRequest`,
    method: 'post',
    data
  })
}

// 查看流程图-OA
export const getWorkFlowImg = (params) => {
  const testFlowUrl = `http://eostest.jiuyang.com.cn:7002/soa/com.joyoung.comm.FlowManageClient.flow?${qs.stringify(params)}`
  const prodFlowUrl = `http://soa.joyoung.com/soa/com.joyoung.comm.FlowManageClient.flow?${qs.stringify(params)}`
  return process.env.VUE_APP_BASE_ENV === 'prod' ? prodFlowUrl : testFlowUrl
}

// 查询流程相关信息
export const getFlowInfo = (params) =>  request({
  url: `${BASE_URL2}/wf/requestInfo`,
  method: 'get',
  params
})

// 转发-OA
export const sendWorkFlowOrigin = (data) => {
  return request({
    url: `${BASE_URL2}/wf/sendWorkFlow`,
    method: 'post',
    data
  })
}

// 分阅-OA
export const sendReadOrigin  = (data) => {
  return request({
    url: `${BASE_URL2}/wf/sendRead`,
    method: 'post',
    data
  })
}

// 转发-包装
export const sendWorkFlow = (data) => {
  return request({
    url: `${BASE_URL}/srmWorkflow/sendWorkFlow`,
    method: 'post',
    data
  })
}

// 分阅-包装
export const sendRead  = (data) => {
  return request({
    url: `${BASE_URL}/srmWorkflow/sendRead`,
    method: 'post',
    data
  })
}
