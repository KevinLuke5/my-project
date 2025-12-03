import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import { download, templateDownload } from '@/utils/download'
import qs from 'qs'
const BASE_URL = 'srm-base-data'

// 资源池查询
export const getSrmSupplier = data => formRequest({
  url: `${BASE_URL}/srmSupplier/getSrmSupplier?${qs.stringify(data)}`,
  method: 'get'
})

// 资源池新增编辑
export const updateSrmSupplier = data => request({
  url: `${BASE_URL}/srmSupplier/insertOrUpdateSrmSupplier`,
  method: 'post',
  data
})

// 资源池删除
export const deleteSrmSupplier = data => request({
  url: `${BASE_URL}/srmSupplier/deleteSrmSupplier`,
  method: 'delete',
  data
})

// 资源池初审
export const firstCheck = data => request({
  url: `${BASE_URL}/srmSupplier/firstCheck`,
  method: 'post',
  data
})

// 资源池提交
export const submitSrmSupplier = data => request({
  url: `${BASE_URL}/srmSupplier/submitSrmSupplier`,
  method: 'post',
  data
})

// 资源池导出
export const exportSupplier = (data) => {
  download(`${BASE_URL}/srmSupplier/exportSupplier`, data)
}

// 产品线下拉
export const getPdtLineList = data => formRequest({
  url: `${BASE_URL}/srmBasicsProductLine/getPdtLineList?page=1&size=500`,
  method: 'get'
})

// 大类下拉
export const getBigCategoryList = data => formRequest({
  url: `${BASE_URL}/srmBasicsCategory/getBigTypeName?page=1&size=500`,
  method: 'get'
})

// 小类下拉
export const getSmallCategoryList = data => formRequest({
  url: `${BASE_URL}/srmBasicsSmallClass/getSmallClassList?${qs.stringify(data)}`,
  method: 'get'
})

// 多条大类查小类下拉
export const getSmallTypeBatch = data => request({
  url: `${BASE_URL}/srmBasicsCategory/getSmallTypeBatch`,
  method: 'post',
  data
})

// 地址下拉
export const getAddressNameList = data => formRequest({
  url: `${BASE_URL}/srmSupplierProduceAddress/getAddressNameList?${qs.stringify(data)}`,
  method: 'get'
})

// 实验室下拉
export const getLaboratoryNameList = data => formRequest({
  url: `${BASE_URL}/srmSupplierLaboratory/getLaboratoryNameList?${qs.stringify(data)}`,
  method: 'get'
})

// tab权限
export const srmAuth = data => formRequest({
  url: `${BASE_URL}/dataAuthority/getHandleAuthorityCode`,
  method: 'get',
  data
})

// tab查询
export const getSrmHandle = data => request({
  url: `${BASE_URL}/srmHandle/getSrmHandle`,
  method: 'post',
  data
})

// tab保存
export const saveSrmHandle = data => request({
  url: `${BASE_URL}/srmHandle/saveSrmHandle`,
  method: 'post',
  data
})

// tab删除
export const deleteBatchSrmHandle = data => request({
  url: `${BASE_URL}/srmHandle/deleteBatchSrmHandle`,
  method: 'DELETE',
  data
})

// tab架构批量保存
export const saveBatchSrmHandle = data => request({
  url: `${BASE_URL}/srmHandle/saveBatchSrmHandle`,
  method: 'post',
  data
})

// 文件查询
export const getSrmSupplierFile = data => formRequest({
  url: `${BASE_URL}/srmSupplierFile/getSrmSupplierFile?${qs.stringify(data)}`,
  method: 'get'
})

// 文件新增
export const insertOrUpdateSrmSupplierFile = data => request({
  url: `${BASE_URL}/srmSupplierFile/insertOrUpdateSrmSupplierFile`,
  method: 'post',
  data
})

// 文件删除
export const deleteSrmSupplierFile = data => request({
  url: `${BASE_URL}/srmSupplierFile/deleteSrmSupplierFile?${qs.stringify(data)}`,
  method: 'delete'
})


// 设备清单导入模板
export const modelDownloadEquipment = () => {
  templateDownload(`${BASE_URL}/srmSupplierEquipment/modelDownloadEquipment`)
}

// 设备清单导入
export const uploadEquipmentExcelFile  = `${process.env.VUE_APP_BASE_API}${BASE_URL}/srmSupplierEquipment/uploadEquipmentExcelFile`

// 基本信息脱敏查询
export const getSupplierInfoById = data => formRequest({
  url: `${BASE_URL}/srmSupplierInfo/getSupplierInfoById?${qs.stringify(data)}`,
  method: 'get'
})

// 企业证件脱敏查询
export const getSupplierCertificate = data => formRequest({
  url: `${BASE_URL}/srmSupplierCertificate/getSupplierCertificate?${qs.stringify(data)}`,
  method: 'get'
})

// 银行资料脱敏查询
export const getSupplierAccount = data => formRequest({
  url: `${BASE_URL}/srmSupplierAccount/getSupplierAccount?${qs.stringify(data)}`,
  method: 'get'
})
