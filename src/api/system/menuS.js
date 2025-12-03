import request from "@/utils/request";
import formRequest from "@/utils/requestformdata";

const BASE_URL = "cloud-user";

export function GetMenu(data) {
  return formRequest({
    url: `${BASE_URL}/menu/tree`,
    method: "get",
    params: data
  });
}

export function BindResource(data) {
  return formRequest({
    url: `${BASE_URL}/menu/bindResource`,
    method: "put",
    data
  });
}

export function add(data) {
  return formRequest({
    url: `${BASE_URL}/menu`,
    method: "POST",
    data
  });
}

export function edit(data) {
  return formRequest({
    url: `${BASE_URL}/menu`,
    method: "PUT",
    data
  });
}

export function del(data) {
  return formRequest({
    url: `${BASE_URL}/menu/delMore`,
    method: "delete",
    params: data
  });
}

export function GetResource(data) {
  return formRequest({
    url: `${BASE_URL}/resource/tree`,
    method: "get",
    params: data
  });
}

export function GetMenuTree(data) {
  return formRequest({
    url: `${BASE_URL}/menu/build`,
    method: "GET",
    params: {
      index: process.env.VUE_APP_SYSTEMID
    }
  });
}

export function getSystem() {
  return formRequest({
    url: `${BASE_URL}/menu/system`,
    method: "GET"
  });
}

export function getParentTree() {
  return formRequest({
    url: `${BASE_URL}/menu/getNewTree`,
    method: "GET"
  });
}
