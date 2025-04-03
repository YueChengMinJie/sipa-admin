import loading from '@/components/loading/loading';
import scrollBar from '@/components/scrollBar';
import '@/components/scrollBar/index.scss';
import permission from '@/directive/permission/index';
import '@/styles/index.scss';
import '@/styles/widget.scss';
import { fmtToFilters } from '@/utils/func.js';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'normalize.css/normalize.css';
import Vue from 'vue';
import VueCookies from 'vue-cookies';
import VueDraggableResizable from 'vue-draggable-resizable';
import 'vue-draggable-resizable/dist/VueDraggableResizable.css';
import SipaJs from 'sipa-boot-sdk-js';
import SipaUI from 'sipa-ui';
import 'sipa-ui/dist/style/index.css';
import App from './App.vue';
import './flex-lib.js';
import './icons';
import './permission';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(SipaUI);
Vue.use(permission);
Vue.use(Antd);
Vue.use(loading);
Vue.use(VueCookies, { expires: '7d' });

Vue.component('scroll-bar', scrollBar);
Vue.component('vue-draggable-resizable', VueDraggableResizable);

fmtToFilters(Vue);
window.toSso = () => {
  setTimeout(() => {
    window.localStorage.removeItem(SipaJs.STORAGE_TOKEN_KEY);
    window.localStorage.removeItem(SipaJs.STORAGE_IF_FREE_KEY);
    window.location.href = process.env.VUE_APP_LOGIN_URL;
  }, 1500);
};
window.toSsoPlatform = () => {
  window.location.href = `${process.env.VUE_APP_PLATFORM_URL}?token=${localStorage.getItem(
    SipaJs.STORAGE_TOKEN_KEY
  )}&ifFree=${localStorage.getItem(SipaJs.STORAGE_IF_FREE_KEY)}`;
};

// SipaJs.Logan.then(Logan => {
//   Logan.initConfig({
//     reportUrl: SipaJs.BASE_DEV_URL,
//     publicKey: SipaJs.SIPA_PUBLIC_KEY,
//     logTryTimes: SipaJs.LOGAN_LOG_TRY_TIMES,
//     dbName: SipaJs.getDbName(SipaJs.REQUEST_FROM_PROCESS),
//     errorHandler: e => {
//       console.log('logan success = ' + JSON.stringify(e));
//     },
//     successHandler: log => {
//       console.log('logan success = ' + JSON.stringify(log));
//     }
//   });
//   window.Logan = Logan;
// });

// setInterval(async () => {
//   console.log('logan upload start');
//   const deviceId = await SipaJs.getDeviceId();
//   const date = new Date();
//   const today = window.Logan.LoganUtil.dateFormat2Day(date);
//   const yesterday = window.Logan.LoganUtil.dateFormat2Day(new Date(+date - window.Logan.LoganUtil.ONE_DAY_TIME_SPAN));
//   const reportResult = await window.Logan.report({
//     fromDayString: yesterday,
//     toDayString: today,
//     deviceId: deviceId,
//     webSource: SipaJs.SOURCE_PC,
//     environment: SipaJs.ENV_DEV,
//     customInfo: {
//       appId: SipaJs.APPLICATION_ID_CP_PROCESS,
//       unionId: SipaJs.REQUEST_FROM_PROCESS
//     }
//   });
//   console.log('logan report result = ' + JSON.stringify(reportResult));
// }, 2 * 60 * 1000);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
