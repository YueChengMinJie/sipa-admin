/*
 * @Author: caszhou
 * @Date: 2021-05-11 14:44:35
 * @Description: 入口文件
 */

import Vue from 'vue'
import App from './App.vue'
import Router from './router'
import ElementUI from 'element-ui'
import 'normalize.css'
import './styles/index.scss'

ElementUI.Input.props.showWordLimit.default = true
Vue.use(ElementUI, { size: 'small' })
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router: Router
}).$mount('#app')
