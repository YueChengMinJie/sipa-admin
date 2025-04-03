/*
 * @Author: caszhou
 * @Date: 2021-03-26 15:00:28
 * @Description: 数据中心
 */

export default {
  path: '/dashboard',
  name: 'dashboard',
  component: '/layout',
  meta: { title: '仪表盘', icon: 'dashboard-index' },
  redirect: { name: 'dashboardProcessIndex' },
  sort: 1,
  children: [
    {
      path: 'process',
      name: 'dashboardProcess',
      meta: { title: '首页' },
      component: '/layout/children',
      redirect: { name: 'dashboardProcessIndex' },
      children: [
        {
          path: 'index',
          name: 'dashboardProcessIndex',
          meta: { title: '流程列表', highlightName: 'dashboard', keepAlive: true },
          component: '/dashboard/process/index'
        },
        {
          path: 'operate',
          name: 'dashboardProcessOperate',
          meta: { title: '流程操作', highlightName: 'dashboard' },
          component: '/dashboard/process/operate',
          hidden: true
        }
      ]
    }
  ]
}
