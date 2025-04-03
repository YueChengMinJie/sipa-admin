const state = {
  tagList: [
    {
      path: '/dashboard',
      meta: {
        title: '概览信息'
      }
    }
  ],
  cacheTagList: [] // 缓存tagList
};

const mutations = {
  ADD_TAGS(state, route) {
    const index = state.tagList.findIndex(item => item.path === route.path);
    if (index === -1) {
      state.tagList.push({
        ...route
      });
    }
  },
  REMOVE_TAGS(state, path) {
    const index = state.tagList.findIndex(item => item.path === path);
    state.tagList.splice(index, 1);
  },
  CLEAR_TAGS(state) {
    state.tagList = [
      {
        path: '/dashboard',
        meta: {
          title: '概览信息'
        }
      }
    ];
    state.cacheTagList = [];
  },
  ADD_CACHE_TAGS(state, route) {
    const index = state.cacheTagList.findIndex(item => item.path === route.path);
    if (index === -1) {
      state.cacheTagList.push({
        ...route
      });
    }
  },
  REMOVE_CACHE_TAGS(state, path) {
    const index = state.cacheTagList.findIndex(item => item.path === path);
    state.cacheTagList.splice(index, 1);
  }
};

const actions = {
  addTag({ commit }, route) {
    commit('ADD_TAGS', route);
  },
  removeTag({ state, commit }, path) {
    return new Promise((resolve, reject) => {
      commit('REMOVE_TAGS', path);
      resolve(state.tagList);
    });
  },
  clearTag({ commit }) {
    commit('CLEAR_TAGS');
  },
  addCacheTag({ commit }, route) {
    commit('ADD_CACHE_TAGS', route);
  },
  removeCacheTag({ state, commit }, path) {
    return new Promise((resolve, reject) => {
      commit('REMOVE_CACHE_TAGS', path);
      resolve(state.cacheTagList);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
