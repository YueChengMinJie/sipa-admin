```
{
  name: 'permission',
  path: '/permission',
  component: () => import('@/views/permission/index'),
  hidden: true, // 表示当前页面不在左侧菜单上显示 默认是显示
  meta: {
    title: '权限测试页',
    icon: 'permission',
    permission: ['permission'] // 是否需要权限才能才看，默认都可以查看
  }
}
```