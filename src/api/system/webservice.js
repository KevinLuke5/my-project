import request from '@/utils/request'
import formRequest from '@/utils/requestformdata'

const BASE_URL = 'cloud-wsdl'

export function getList(params) {
  return formRequest({
    url: `${BASE_URL}/webService`,
    method: "get",
    params
  })
}


export function add(data) {
  return formRequest({
    url: `${BASE_URL}/webService`,
    method: "post",
    data
  })
}

export function edit(data) {
  return formRequest({
    url: `${BASE_URL}/webService`,
    method: "put",
    data
  })
}

export function del(data) {
  return formRequest({
    url: `${BASE_URL}/webService/${data}`,
    method: "delete"
  })
}

export function GetOneData(id) {
  return formRequest({
    url: `${BASE_URL}/webService/${id}`,
    method: 'get'
  })
}


export function appidGet(params) {
  return formRequest({
    url: `cloud-app/app`,
    method: "get",
    params
  })
}

export function appidPut(data) {
  return formRequest({
    url: `${BASE_URL}/webServiceAccount/appid`,
    method: 'put',
    data
  })
}

// --------------------------------------------
export function getJudgedUser(params) {
  return formRequest({
    url: `${BASE_URL}/webServiceAccount/page`,
    method: 'get',
    params
  })
}

export function addAccount(data) {
  return formRequest({
    url: `${BASE_URL}/webServiceAccount/add`,
    method: 'post',
    data
  })
}

export function editAccount(data) {
  return formRequest({
    url: `${BASE_URL}/webServiceAccount/edit`,
    method: "put",
    data
  })
}

export function delAccount(id) {
  return formRequest({
    url: `${BASE_URL}/webServiceAccount/${id}`,
    method: "delete"
  })
}

export function appidAssignment() {

}
