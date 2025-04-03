/*
 * @Author: caszhou
 * @Date: 2021-03-26 15:00:28
 * @Description: 数据中心
 */

export default {
  path: '/print',
  name: 'print',
  component: '/layout',
  meta: { title: '打印中心', icon: 'print-index' },
  redirect: { name: 'printPrinterIndex' },
  sort: 95,
  children: [
    {
      path: 'printer',
      name: 'printPrinter',
      meta: { title: '机器管理' },
      component: '/layout/children',
      redirect: { name: 'printPrinterIndex' },
      children: [
        {
          path: 'index',
          name: 'printPrinterIndex',
          meta: { title: '打印机列表', highlightName: 'printPrinter', keepAlive: true },
          component: '/print/printer/index'
        },
        {
          path: 'operate',
          name: 'printPrinterOperate',
          meta: { title: '打印机操作', highlightName: 'printPrinter' },
          component: '/print/printer/operate',
          hidden: true
        }
      ]
    },
    {
      path: 'record',
      name: 'printRecord',
      meta: { title: '记录管理' },
      component: '/layout/children',
      redirect: { name: 'printRecordIndex' },
      children: [
        {
          path: 'index',
          name: 'printRecordIndex',
          meta: { title: '记录列表', highlightName: 'printRecord', keepAlive: true },
          component: '/print/record/index'
        },
        {
          path: 'operate',
          name: 'printRecordOperate',
          meta: { title: '记录操作', highlightName: 'printRecord' },
          component: '/print/record/operate',
          hidden: true
        }
      ]
    },
    {
      path: 'template',
      name: 'printTemplate',
      meta: { title: '模版管理' },
      component: '/layout/children',
      redirect: { name: 'printTemplateIndex' },
      children: [
        {
          path: 'index',
          name: 'printTemplateIndex',
          meta: { title: '模型列表', highlightName: 'printTemplate', keepAlive: true },
          component: '/print/template/index'
        },
        {
          path: 'operate',
          name: 'printTemplateOperate',
          meta: { title: '模型操作', highlightName: 'printTemplate' },
          component: '/print/template/operate',
          hidden: true
        }
      ]
    }
  ]
}
