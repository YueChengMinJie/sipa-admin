/*
 * @Author: caszhou
 * @Date: 2022-10-24 13:19:54
 * @Description: 路由入口文件
 */
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 * 重写路由的push方法
 */
const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error => error)
}

/**
 * @param hidden 是否隐藏当前菜单
 * @param highlightName 当前要高亮的name
 */
export const routes = [
  {
    path: '/',
    name: 'loginLink',
    component: () => import('@/views/login.vue'),
    hidden: true
  },
  {
    path: '/platform',
    name: 'platformLink',
    component: () => import('@/views/platform.vue'),
    hidden: true
  },
  {
    path: '*',
    name: 'errorLink',
    component: () => import('@/views/404'),
    hidden: true
  }
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes
  })
const router = createRouter()

export default router
