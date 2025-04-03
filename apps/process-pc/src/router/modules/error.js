import mainLayout from '@/layouts/mainLayout';

const errorRouter = {
  name: 'error',
  path: '/error',
  component: mainLayout,
  redirect: '/error/403',
  meta: { title: '错误页面', icon: 'error' },
  children: [
    {
      name: '403',
      path: '/error/403',
      component: () => import('@/views/error/403'),
      meta: { title: '403' }
    },
    {
      name: '404',
      path: '/error/404',
      component: mainLayout,
      meta: { title: '404' },
      children: [
        {
          name: 'test3',
          path: '/404',
          component: () => import('@/views/error/404'),
          meta: { title: '测试三级菜单', icon: 'error' }
        }
      ]
    },
    {
      name: '500',
      path: '/error/500',
      component: () => import('@/views/error/500'),
      meta: {
        title: '500',
        permission: ['error/500']
      }
    }
  ]
};

export default errorRouter;
