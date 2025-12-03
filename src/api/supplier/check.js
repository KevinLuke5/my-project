import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import qs from 'qs'
const BASE_URL = 'srm-base-data'

// 调查表查询
export const getSrmSupplierQuestionnaire = data => formRequest({
  url: `${BASE_URL}/srmSupplierQuestionnaire/getSrmSupplierQuestionnaire?${qs.stringify(data)}`,
  method: 'get'
})

// 调查表新增编辑
export const insertOrUpdateSrmSupplierQuestionnaire = data => request({
  url: `${BASE_URL}/srmSupplierQuestionnaire/insertOrUpdateSrmSupplierQuestionnaire`,
  method: 'post',
  data
})

// 调查表删除
export const deleteSrmSupplierQuestionnaire = data => request({
  url: `${BASE_URL}/srmSupplierQuestionnaire/deleteSrmSupplierQuestionnaire`,
  method: 'delete',
  data
})

// 调查表提交
export const submitSrmSupplierQuestionnaire = data => request({
  url: `${BASE_URL}/srmSupplierQuestionnaire/submit`,
  method: 'post',
  data
})

// 调查表送审
export const toCheck = data => request({
  url: `${BASE_URL}/srmSupplierQuestionnaire/toCheck`,
  method: 'post',
  data
})

// 调查表审核
export const leaderCheck = data => request({
  url: `${BASE_URL}/srmSupplierQuestionnaire/leaderCheck`,
  method: 'post',
  data
})

// 物料查询
export const getMaterialList = data => formRequest({
  url: `${BASE_URL}/srmBasicsMaterial/getMaterialList?page=1&size=100&${qs.stringify(data)}`,
  method: 'get'
})

// 存档查询
export const getRecord = data => formRequest({
  url: `${BASE_URL}/srmSupplierRecord/getRecord?${qs.stringify(data)}`,
  method: 'get'
})