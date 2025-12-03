// import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import download from '@/utils/download'
import qs from 'qs'
const BASE_URL = 'srm-order'

// 箱码查询
export const getBoxCodeList = data => formRequest({
  url: `${BASE_URL}/srmOrderBoxCode/getBoxCodeList?${qs.stringify(data)}`,
  method: 'get'
})

// 箱码导出
export const exportBoxCode = (data) => {
  download(`${BASE_URL}/srmOrderBoxCode/export`, data)
}