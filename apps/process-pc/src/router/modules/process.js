const ProcessRouter = [
  {
    name: 'process',
    path: '/process',
    component: () => import('@/views/process'),
    meta: {
      title: '流程管理',
      icon: '',
      parentPath: 'process'
    }
  },
  {
    name: 'processSetting',
    path: '/process/setting',
    component: () => import('@/views/process/setting/setting.vue'),
    hidden: true,
    meta: {
      title: '流程设置',
      parentPath: 'process',
      isDetail: true
    }
  },
  {
    name: 'processView',
    path: '/process/view',
    component: () => import('@/views/process/flowView.vue'),
    hidden: true,
    meta: {
      title: '流程查看'
    }
  }
];

export default ProcessRouter;
