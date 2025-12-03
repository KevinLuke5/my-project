const getters = {
  size: state => state.app.size,
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  roles: state => state.user.roles,
  codes: state => state.user.codes,
  user: state => state.user.user,
  name: state => state.user.name,
  userId: state => state.user.userId,
  loadMenus: state => state.user.loadMenus,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  baseApi: state => state.api.baseApi,
  updateAvatarApi: state => state.api.updateAvatarApi,
  companies: state => state.user.companies,
  companyId: state => state.user.companyId,
  company: state => state.user.company,
  currentSystemId: state => state.user.currentSystemId,
  isHideMenu: state => state.user.isHideMenu
  // facList: state => state.factory.facList
}
export default getters
