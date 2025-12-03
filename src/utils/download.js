import qs from 'qs'
import { getToken } from '@/utils/auth'
import request from '@/utils/request'
import { Message, Loading  } from '@base/jy-ui-plus'
import router from '@/router/routers'

export const templateDownload = (url, params) => {
  const token = getToken()
  window.location.href = `${process.env.VUE_APP_BASE_API}${url}?${qs.stringify(params)}${params ? '&' : ''}${token ? 'token=' + token : ''}`
}

// 文件导出
export const download =  (url, params) => {
  const loadingInstance = Loading.service({
    fullscreen: true,
    text: '导出中...'
  })
  exportFile(url, params).then((res) => {
    if (res.code === '0' || res.success) {
      Message.success({
        message: '文件已加入下载队列,请前往下载管理查看'
      })
      router.push({ path: '/down/downLoad' })
    } else {
      if (res)
        Message.warning({
          message: res.message || '接口错误，稍后再试'
        })
    }
  })
    .finally(() => {
      loadingInstance.close()
    })
}

const exportFile = async (downloadUrl, params) => request({
  url: `${downloadUrl}`,
  method: 'GET',
  params
})

// 通过url下载
export const loadFileByUrl = url => {
  const downloadFile = {}
  if (typeof (downloadFile.iframe) === 'undefined') {
    const iframe = document.createElement('iframe')
    downloadFile.iframe = iframe
    document.body.appendChild(downloadFile.iframe)
  }
  downloadFile.iframe.src = url
  downloadFile.iframe.style.display = 'none'
}

export default download