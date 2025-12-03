import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import { templateDownload } from '@/utils/download'
import qs from 'qs'

const BASE_URL = 'srm-base-data'

// 审厂项目管理查询
export const getQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryProject/getProjectList`,
    method: 'get',
    params
  })
}

// 审厂项目管理新增修改
export const update = data => {
  return request({
    url: `${BASE_URL}/srmFactoryProject/insertOrUpdateProject`,
    method: 'post',
    data: data
  })
}

// 审厂项目管理删除
export const deleteId = data => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryProject/deleteBatchProject?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 审厂项目管理明细
export const getDetail = params => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryProjectdDetail/getProjectDetail`,
    method: 'get',
    params
  })
}

// 审厂项目管理明细新增/修改
export const getDetailEdit = data => {
  return request({
    url: `${BASE_URL}/srmFactoryProjectdDetail/insertOrUpdateProjectDetail`,
    method: 'post',
    data: data
  })
}

// 审厂项目管理明细删除
export const getDetailDelete = data => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryProjectdDetail/deleteBatchProjectDetailIds?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 审厂项目管理明细下载导入模板
export function importTem (data) {
  templateDownload(`${BASE_URL}/srmFactoryProjectdDetail/modelDownloadProjectDetail`, data)
}

// 审厂项目管理明细导入
export const importUrl = `${process.env.VUE_APP_BASE_API}${BASE_URL}/srmFactoryProjectdDetail/uploadProjectDetailExcelFile`

// 审厂标准管理查询
export const getStandardQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryStandard/getStandardList`,
    method: 'get',
    params
  })
}

// 审厂标准管理新增修改
export const standardUpdate = data => {
  return request({
    url: `${BASE_URL}/srmFactoryStandard/insertOrUpdateStandard`,
    method: 'post',
    data: data
  })
}

// 审厂标准管理删除
export const standardDeleteId = data => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryStandard/deleteBatchStandard?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 审厂标准管理明细
export const getStandardDetail = params => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryStandardProjectRel/getDetailBystandardId`,
    method: 'get',
    params
  })
}

// 审厂标准管理明细新增
export const getStandardDetailAdd = data => {
  return request({
    url: `${BASE_URL}/srmFactoryStandardProjectRel/insertOrUpdateStandardRel`,
    method: 'post',
    data: data
  })
}

// 审厂标准管理明细删除
export const getStandardDetailDelete = data => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryStandardProjectRel/deleteBatchStandardRel?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 审厂综合评分权重查询
export const scoreWeightQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryScoreWeights/getScoreWeightsList`,
    method: 'get',
    params
  })
}

// 审厂综合评分权重新增修改
export const scoreWeightUpdate = data => {
  return request({
    url: `${BASE_URL}/srmFactoryScoreWeights/insertOrUpdateScoreWeights`,
    method: 'post',
    data: data
  })
}

// 审厂综合评分权重删除
export const scoreWeightDeleteId = data => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryScoreWeights/deleteScoreWeights?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 联合审厂管理查询
export const uniteFactoryExaminQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryTask/getTaskList`,
    method: 'get',
    params
  })
}

// 联合审厂管理新增修改
export const uniteFactoryExaminUpdate = data => {
  return request({
    url: `${BASE_URL}/srmFactoryTask/temporaryStorage`,
    method: 'post',
    data: data
  })
}

// 联合审厂管理删除
export const deleteIdUniteFactoryExamin = data => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryTask/deleteTask?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 联合审厂管理审厂地址删除
export const factoryPlaceDeleteId = data => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryAddress/deleteAddressById?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 联合审厂管理审厂专家删除
export const expertsDeleteId = data => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryExpert/deleteExpertById?${qs.stringify(data)}`,
    method: 'delete'
  })
}

// 联合审厂管理任务详情
export const uniteFactoryExaminDetail = params => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryTask/getTaskDetail`,
    method: 'get',
    params
  })
}

// 联合审厂管理查询小组名称
export const addExpertsDialogQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsGroupProfession/getGroupName`,
    method: 'get',
    params
  })
}

// 联合审厂管理查询审厂专家
export const addExpertsDialogExpert = params => {
  return formRequest({
    url: `${BASE_URL}/srmBasicsExpertResources/getUserByGroupName`,
    method: 'get',
    params
  })
}

// 联合审厂管理新增审厂专家
export const addExpertsDialogSave = data => {
  return request({
    url: `${BASE_URL}/srmFactoryExpert/insertExpert`,
    method: 'post',
    data: data
  })
}

// 联合审厂管理预审
export const preTrialSave = data => {
  return request({
    url: `${BASE_URL}/srmFactoryTask/preTrial`,
    method: 'post',
    data: data
  })
}

// 联合审厂管理审核
export const auditSave = data => {
  return request({
    url: `${BASE_URL}/srmFactoryTask/audit`,
    method: 'post',
    data: data
  })
}

// 联合审厂管理查询审厂结果
export const rectificationQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryResult/getResultList`,
    method: 'get',
    params
  })
}

// 品质总规则查询
export const qualityTotalQuery = params => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryQualityRule/getRuleList`,
    method: 'get',
    params
  })
}

// 品质总规则新增修改
export const qualityTotalUpdate = data => {
  return request({
    url: `${BASE_URL}/srmFactoryQualityRule/insertOrUpdateRules`,
    method: 'post',
    data: data
  })
}

// 品质总规则删除
export const qualityTotalDeleteId = data => {
  return formRequest({
    url: `${BASE_URL}/srmFactoryQualityRule/deleteRule?${qs.stringify(data)}`,
    method: 'delete'
  })
}