import Layout from '@/layouts';
import Vue from 'vue';
import VueRouter from 'vue-router';
import ProcessRouter from './modules/process';

Vue.use(VueRouter);

//基础路由
export const baseRoute = [
  {
    path: '/',
    component: Layout,
    redirect: '/process',
    hidden: true,
    children: [...ProcessRouter]
  },
  {
    path: '/403',
    component: () => import('@/views/error/403'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    path: '/500',
    component: () => import('@/views/error/500'),
    hidden: true
  },
  { path: '*', redirect: '/404', hidden: true }
];

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    hidden: true,
    children: []
  },
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () => {
  return new VueRouter({
    routes: baseRoute,
    mode: 'history',
    scrollBehavior: () => ({ y: 0 })
  });
};

const router = createRouter();

export function resetRouter() {
  router.matcher = createRouter().matcher;
}

// 重定向时报错，用这个不让他报错
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch(err => err);
};

export default router;
