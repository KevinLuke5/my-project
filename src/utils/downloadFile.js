import CryptoJS from 'crypto-js'
import formRequest from '@/utils/requestformdata'
const BASE_URL = 'mes-basic'



/**
 * 解密
 * parm 后台返回密文
 */
export const decrypt = (parm) => {
  var key = CryptoJS.enc.Utf8.parse("mes202106291qaz1")
  var encryptedHexStr = CryptoJS.enc.Hex.parse(parm)
  var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
  var decrypt = CryptoJS.AES.decrypt(encryptedBase64Str, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })

  var res = decrypt.toString(CryptoJS.enc.Utf8)
  return res
}

export const downloadFileByFile = (fileId) => {
  var res1 = formRequest({
    url: `${process.env.VUE_APP_BASE_API}${BASE_URL}/mesSysFile/selectUrl?id=${fileId}`,
    method: 'get'
  })
  res1.then((res) => {
   window.location.href = decrypt(res.data)
  })
}

