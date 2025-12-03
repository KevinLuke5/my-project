import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import { download, templateDownload } from '@/utils/download'
const BASE_URL = 'srm-access'

// 集中打分查询
export const getConcentrateScoreList = params => formRequest({
  url: `${BASE_URL}/srmAccessBillDetail/getConcentrateScoreList`,
  method: 'get',
  params
})

// 修改打分人
export const updateGradeCheckUser = data => request({
  url: `${BASE_URL}/srmAccessBillDetail/updateGradeCheckUser`,
  method: 'post',
  data
})

// 模板下载
export const modelDownloadBillDetail = (data) => {
  templateDownload(`${BASE_URL}/srmAccessBillDetail/modelDownloadBillDetail`, data)
}

// 导入
export const uploadUrl = `${process.env.VUE_APP_BASE_API}${BASE_URL}/srmAccessBillDetail/uploadBillDetailExcelFile`

// 导出
export const exportConcentrateScore = (data) => {
  download(`${BASE_URL}/srmAccessBillDetail/exportConcentrateScore`, data)
}

// 日志
export const getBillDetailLogList = params => formRequest({
  url: `${BASE_URL}/srmAccessBillDetailLog/getBillDetailLogList`,
  method: 'get',
  params
})
