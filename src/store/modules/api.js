const baseUrl = process.env.VUE_APP_BASE_API;
const api = {
  state: {
    // 修改头像
    updateAvatarApi: baseUrl + "/api/users/updateAvatar",
    // baseUrl，
    baseApi: baseUrl
  }
};

export default api;
