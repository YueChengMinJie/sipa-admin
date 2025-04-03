/*
 * @Author: caszhou
 * @Date: 2021-05-11 14:44:35
 * @Description: 入口文件
 */

import Vue from 'vue'
import App from './App.vue'
import Store from './store'
import Router from './router'
import ElementUI from 'element-ui'
import 'nprogress/nprogress.css'
import 'normalize.css'
import './styles/index.scss'
import './assets/icons'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import dayjs from 'dayjs'
import { mqttSetup } from '@/utils/mqtt'
import SipaUI from 'sipa-ui'
import 'sipa-ui/dist/style/index.css'

Vue.use(SipaUI)

dayjs.extend(duration)
dayjs.extend(utc)
dayjs.extend(weekday)

// import { getLocationRoutes } from '@/utils/routeTools'
// console.log(JSON.stringify(getLocationRoutes(true)))

mqttSetup()

ElementUI.Input.props.showWordLimit.default = true
Vue.use(ElementUI, { size: 'small' })
Vue.config.productionTip = false

const vue = new Vue({
  render: h => h(App),
  store: Store,
  router: Router
}).$mount('#app')

export default vue
