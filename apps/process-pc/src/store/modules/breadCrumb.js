const state = {
  cacheBreadCrumbList: [] // 缓存tagList
};

const mutations = {
  ADD_CACHE_BREAD_CRUMB(state, route) {
    const curRoute = route.cur;
    const oldRoute = route.old;
    if (oldRoute && oldRoute.meta.isDetail) {
      const index = state.cacheBreadCrumbList.findIndex(item => item.path === oldRoute.path);
      state.cacheBreadCrumbList.splice(index, 1);
    }
    const index = state.cacheBreadCrumbList.findIndex(item => item.path === curRoute.path);
    if (index === -1) {
      state.cacheBreadCrumbList.push({
        ...curRoute
      });
    }
  }
};

const actions = {
  addCacheBreadCrumb({ commit }, route) {
    commit('ADD_CACHE_BREAD_CRUMB', route);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
