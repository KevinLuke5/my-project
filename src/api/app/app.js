import formRequest from "@/utils/requestformdata";

const BASE_URL = "cloud-app";

// 验证appid是否重复
export function validateAppId(data) {
  return formRequest({
    url: `${BASE_URL}/app/checkAppId`,
    method: "post",
    data
  });
}

// ---------------------------应用管理列表------------------------

// 扫码登录
export function codeLogin(params) {
  return formRequest({
    url: `/cloud-auth/cas/token`,
    method: "get",
    params
  });
}
