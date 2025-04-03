import { baseRoute } from '@/router';

const state = {
  routes: []
};

const mutations = {
  SET_ROUTE(state, route) {
    state.routes = baseRoute.concat(route);
  }
};

const actions = {
  getRoute({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes = [];
      commit('SET_ROUTE', accessedRoutes);
      resolve(accessedRoutes);
    });
  }
};

export function filterAsyncRoutes(routes, roles) {
  let arr = [];
  routes.forEach(item => {
    const temp = { ...item };
    if (hasPermission(roles, temp)) {
      if (temp.children) {
        temp.children = filterAsyncRoutes(temp.children, roles);
      }
      arr.push(temp);
    }
  });
  return arr;
}

// 判断是否有权限
export const hasPermission = (roles, route) => {
  if (route.meta && route.meta.permission) {
    // 判断当前用户是否具有该页面的permission
    if (Array.isArray(route.meta.permission)) {
      return route.meta.permission.some(permission => {
        return roles.includes(permission);
      });
    } else if (typeof route.meta.permission == 'string') {
      return roles.includes(route.meta.permission);
    } else {
      new Error(`path：${route.path}权限配置未生效，[err]：permission因为Array或String类型`);
      return true;
    }
  } else {
    return true;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
