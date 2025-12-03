import request from '@/utils/request'

// 查看文件
export const filesView = data => request({
  url: 'cloud-oss/oss/temp_url',
  method: 'post',
  data
})