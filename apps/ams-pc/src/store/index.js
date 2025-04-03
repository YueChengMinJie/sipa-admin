/*
 * @Author: caszhou
 * @Date: 2022-02-11 16:56:30
 * @Description: vuex主文件
 */
import Vue from 'vue'
import Vuex from 'vuex'
import Config from '@/config'
import Cookies from 'js-cookie'
import Router, { routes } from '@/router'
import { getApplicationPermissions } from '@/utils/permission'
import { composeRoutes, getLocationRoutes, menuFilter } from '@/utils/routeTools'
import {
  accountAccessHaveMore,
  accountByAccess,
  functionCodeAccessListByAccount,
  listAllCompany
} from '@/api/sso-idp-server'
import dashboard from '@/store/dashboard'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    token: '',
    routes: [],
    userInfo: null,
    keepAliveValues: [],
    permissionList: [],
    keepAliveCurrent: '',
    companies: [],
    companyId: null,
    applicationId: null
  },
  getters: {
    getToken(state) {
      if (state.token) {
        return state.token
      } else {
        const params = new URLSearchParams(window.location.search)
        const key = params.get(Config.identityId)
        if (key) {
          const jsonData = Cookies.get(key)
          const tokenData = JSON.parse(jsonData)
          return tokenData.token
        } else {
          return ''
        }
      }
    }
  },
  mutations: {
    setToken(state, data) {
      state.token = data.token
      // 设置7天过期
      if (data.ifFree) {
        Cookies.set(data.key, JSON.stringify(data), { expires: 7 })
      } else {
        Cookies.set(data.key, JSON.stringify(data), { expires: 4 })
      }
    },
    setCompanies(state, data) {
      data.forEach(item => {
        item.id = item.id + ''
      })
      state.companies = data
    },
    setCompanyId(state, data) {
      state.companyId = data + ''
    },
    setApplicationId(state, data) {
      state.applicationId = data
    },
    removeToken(state) {
      const params = new URLSearchParams(window.location.search)
      const key = params.get(Config.identityId)
      state.token = ''
      Cookies.remove(key)
    },
    setRoutes(state, data) {
      state.routes = data
    },
    setUserInfo(state, data) {
      state.userInfo = data
    },
    savePermissions(state, data) {
      state.permissionList = data
    },
    setKeepAlive(state, { to, from }) {
      if (from.path !== '/') {
        const toPath = to.path.includes('/index') ? to.path.substring(0, to.path.length - 6) : to.path
        const formPath = from.path.includes('/index') ? from.path.substring(0, from.path.length - 6) : from.path
        if (!to.path.includes(formPath) && !from.path.includes(toPath)) {
          state.keepAliveValues = []
        }
        if (from.path.includes(toPath)) {
          const index = state.keepAliveValues.indexOf(to.name)
          if (index !== -1) {
            state.keepAliveValues = state.keepAliveValues.slice(0, index)
          }
        }
      }
      if (to.meta.keepAlive) {
        const index = state.keepAliveValues.indexOf(to.name)
        if (index === -1) {
          state.keepAliveValues.push(to.name)
          state.keepAliveCurrent = to.name
        }
      }
    }
  },
  actions: {
    async initProjectData({ commit }, ssoData) {
      let logoData = ssoData
      if (!logoData) {
        try {
          const params = new URLSearchParams(window.location.search)
          const key = params.get(Config.identityId)
          logoData = JSON.parse(Cookies.get(key))
        } catch (error) {
          throw '数据获取异常: ' + error
        }
      }
      const response = await Promise.all([
        accountByAccess({ token: logoData.token }),
        accountAccessHaveMore({ token: logoData.token }),
        listAllCompany({ token: logoData.token })
      ])
      const data = response[0].data
      const ifMultiTenant = response[1].data
      const companies = response[2].data
      commit('setToken', {
        key: data.loginCompanyId + data.loginApplicationId,
        token: logoData.token,
        ifFree: logoData.ifFree
      })
      commit('setCompanies', companies)
      commit('setCompanyId', data.loginCompanyId)
      commit('setApplicationId', data.loginApplicationId)
      if (!Config.permissionsEnable) {
        const localRoutes = getLocationRoutes()
        Router.addRoutes(localRoutes)
        Router.options.routes = routes.concat(localRoutes)
        const menuRoutes = menuFilter(localRoutes)
        commit('setRoutes', menuRoutes)
      } else {
        const { data: ad } = await functionCodeAccessListByAccount()
        const accessData = ad.filter(d => d.type !== 'page')
        // 获取route和userInfo的同时过滤应用模块，创建permission集合
        getApplicationPermissions(accessData)
        const remoteRoutes = composeRoutes(accessData)
        Router.addRoutes(remoteRoutes)
        Router.options.routes = routes.concat(remoteRoutes)
        const menuRoutes = menuFilter(remoteRoutes)
        commit('setRoutes', menuRoutes)
      }
      commit('setUserInfo', { ...data, ifMultiTenant })
      return data
    },
    async updateUserInfo({ commit }) {
      const response = await Promise.all([accountByAccess(), accountAccessHaveMore()])
      const data = response[0].data
      const ifMultiTenant = response[1].data
      commit('setUserInfo', { ...data, ifMultiTenant })
    }
  },
  modules: {
    dashboard
  }
})

export default store
