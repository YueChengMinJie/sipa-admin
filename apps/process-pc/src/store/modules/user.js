import { getInfo, getMenuPermission, loginByPassword, loginByValidateCode, logout } from '@/api/user';
import { resetRouter } from '@/router';
import { transferPermissionData } from '@/utils';
import { getCache, setCache } from '@/utils/session';
import Vue from 'vue';
import SipaJs from 'sipa-boot-sdk-js';

const state = {
  accountInfo: {},
  token: localStorage.getItem(SipaJs.STORAGE_TOKEN_KEY) || '',
  loginInfo: '',
  roles: [],
  // 权限结合
  permissionMap: {},
  // 默认大屏
  currentModule: getCache('CURRENT_MODULE') ? getCache('CURRENT_MODULE').id : '/screen'
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_USERINFO(state, userInfo) {
    state.accountInfo = userInfo;
  },
  SET_LOGIN_INFO(state, loginInfo) {
    state.loginInfo = loginInfo;
  },
  SET_ROLES(state, roles) {
    state.roles = roles;
  },
  SET_PERMISSION_BUTTON(state, permissionMap) {
    state.permissionMap = permissionMap;
  },
  SET_CURRENT_MODULE(state, currentModule) {
    state.currentModule = currentModule;
  }
};

const actions = {
  // 手机号 + 密码登录
  loginByPassword({ commit, dispatch }, userInfo) {
    return new Promise((resolve, reject) => {
      loginByPassword(userInfo)
        .then(res => {
          const { data } = res;
          if (data) {
            commit('SET_TOKEN', data.accessToken);
            localStorage.setItem(SipaJs.STORAGE_TOKEN_KEY, data.accessToken);

            commit('SET_LOGIN_INFO', data);
            localStorage.setItem(SipaJs.STORAGE_LOGIN_INFO_KEY, data);
          }
          resolve(res);
        })
        .catch(err => {
          dispatch('feLogout');
          reject(err);
        });
    });
  },

  // 手机号 + 验证码登录
  loginByValidateCode({ commit, dispatch }, userInfo) {
    return new Promise((resolve, reject) => {
      loginByValidateCode(userInfo)
        .then(res => {
          const { data } = res;
          if (data) {
            commit('SET_TOKEN', data.accessToken);
            localStorage.setItem(SipaJs.STORAGE_TOKEN_KEY, data.accessToken);

            commit('SET_LOGIN_INFO', data);
            localStorage.setItem(SipaJs.STORAGE_LOGIN_INFO_KEY, data);
          }
          resolve(res);
        })
        .catch(err => {
          dispatch('feLogout');
          reject(err);
        });
    });
  },

  logout({ dispatch }) {
    return new Promise((resolve, reject) => {
      logout()
        .then(() => {
          dispatch('feLogout');
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  feLogout({ commit }) {
    commit('SET_TOKEN', '');
    localStorage.removeItem(SipaJs.STORAGE_TOKEN_KEY);
    localStorage.removeItem(SipaJs.STORAGE_IF_FREE_KEY);

    commit('SET_LOGIN_INFO', '');
    localStorage.removeItem(SipaJs.STORAGE_LOGIN_INFO_KEY);

    commit('SET_USERINFO', '');
    localStorage.removeItem(SipaJs.STORAGE_USER_INFO_KEY);

    setCache('CURRENT_MODULE', null);

    resetRouter();
  },

  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then(res => {
          const { data } = res;
          if (data) {
            commit('SET_USERINFO', data);

            const loginCompanyId = data.loginCompanyId;
            Vue.$cookies.set(SipaJs.MERCHANT_ID, loginCompanyId);
          }
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  updateInfo({ commit }, userInfo) {
    return new Promise(resolve => {
      commit('SET_USERINFO', userInfo);
      localStorage.setItem(SipaJs.STORAGE_USER_INFO_KEY, userInfo);
      resolve();
    });
  },

  getMenuPermission({ commit }) {
    return new Promise((resolve, reject) => {
      getMenuPermission()
        .then(res => {
          let permissionData = transferPermissionData(res.data || [], state.currentModule);
          const permissionMap =
            JSON.stringify(permissionData.permissionMap) !== '{}' ? permissionData.permissionMap : { '/404': [] };
          // 防止后端返回的数据为空，导致登录不上
          const data = { roles: permissionData.roles, permissionMap: permissionMap };
          commit('SET_ROLES', permissionData.roles);
          commit('SET_PERMISSION_BUTTON', permissionMap);
          resolve(data);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
