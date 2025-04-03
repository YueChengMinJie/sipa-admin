/*
 * @Author: caszhou
 * @Date: 2021-03-26 15:00:28
 * @Description: 数据中心
 */

export default {
  path: '/company',
  name: 'company',
  component: '/layout',
  meta: { title: '主体中心', icon: 'company-index' },
  redirect: { name: 'companyMerchantIndex' },
  sort: 5,
  children: [
    {
      path: 'merchant',
      name: 'companyMerchant',
      meta: { title: '商户管理' },
      component: '/layout/children',
      redirect: { name: 'companyMerchantIndex' },
      children: [
        {
          path: 'index',
          name: 'companyMerchantIndex',
          meta: { title: '商户列表', highlightName: 'company', keepAlive: true },
          component: '/company/merchant/index'
        },
        {
          path: 'operate',
          name: 'companyMerchantOperate',
          meta: { title: '商户操作', highlightName: 'company' },
          component: '/company/merchant/operate',
          hidden: true
        },
        {
          path: 'detail',
          name: 'companyMerchantDetail',
          meta: { title: '商户详情', highlightName: 'company' },
          component: '/company/merchant/detail',
          hidden: true
        }
      ]
    }
  ]
}
