import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'
const BASE_URL = 'srm-order'
import download from '@/utils/download'

// 事务查询
export const getDemandList = data => formRequest({
  url: `${BASE_URL}/srmOrderDemandPlanOrder/getDemandList?${qs.stringify(data)}`,
  method: 'get'
})

// 要货计划生成送货单修改
export const updateDemandOrder = data => request({
  url: `${BASE_URL}/srmOrderDemandPlanOrder/updateDemandOrder`,
  method: 'post',
  data
})

// 要货单生成送货单生成接口
export const demandCreateDeliver = data => request({
  url: `${BASE_URL}/srmOrderDemandPlanOrder/demandCreateDeliver`,
  method: 'post',
  data
})

// 导出
export const exportDemandList = data => formRequest({
  url: download(`${BASE_URL}/srmOrderDemandPlanOrder/exportDemandList`, data),
  method: 'get'
})