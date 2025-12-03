import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'
import download from '@/utils/download'
import qs from 'qs'
const BASE_URL = 'srm-base-data'

// 设置查询
export const getMessageConfigPage = data => formRequest({
  url: `${BASE_URL}/srmScheduledMessageConfig/getMessageConfigPage?${qs.stringify(data)}`,
  method: 'get'
})

// 设置新增修改
export const saveOrUpdateConfig = data => request({
  url: `${BASE_URL}/srmScheduledMessageConfig/saveOrUpdateConfig`,
  method: 'post',
  data
})

// 设置删除
export const deleteConfig = data => request({
  url: `${BASE_URL}/srmScheduledMessageConfig/deleteConfig?${qs.stringify(data)}`,
  method: 'delete'
})

// 人员维护查询
export const getMessageUserPage = data => formRequest({
  url: `${BASE_URL}/srmScheduledMessageUser/getMessageUserPage?${qs.stringify(data)}`,
  method: 'get'
})

// 人员维护新增修改
export const saveOrUpdateMessageUser = data => request({
  url: `${BASE_URL}/srmScheduledMessageUser/saveOrUpdateMessageUser`,
  method: 'post',
  data
})

// 人员维护删除
export const deleteMessageUser = data => request({
  url: `${BASE_URL}/srmScheduledMessageUser/deleteMessageUser?${qs.stringify(data)}`,
  method: 'delete'
})

// 人员维护导出
export const returnApplyExport = (data) => {
  download(`${BASE_URL}/srmOrderGuestGoodsReturnApplyDetail/export`, data)
}

// 提醒日志查询
export const getLogByPage = data => formRequest({
  url: `${BASE_URL}/srmScheduledMessageLog/getLogByPage?${qs.stringify(data)}`,
  method: 'get'
})
