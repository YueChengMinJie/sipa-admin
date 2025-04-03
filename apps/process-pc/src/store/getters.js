const getters = {
  token: state => state.user.token,
  roles: state => state.user.accountInfo.username,
  baseRoute: state => state.permission.routes,
  permissionMap: state => state.user.permissionMap,
  isFullScreen: state => state.setting.isFullScreen
};

export default getters;
