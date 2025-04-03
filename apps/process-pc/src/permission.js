import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import SipaJs from 'sipa-boot-sdk-js';
import router from './router';
import store from './store';
import Config from './config';

NProgress.configure({ showSpinner: false });

function removeToken(fromSso, next, to, other) {
  if (fromSso) {
    next({
      path: to.path,
      query: { ...other },
      replace: true
    });
  } else {
    next();
  }
}

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = '流程中台';

  if (Config.openRoutePermission) {
    try {
      const { token, ifFree, ...other } = to.query;
      const fromSso = !!token;
      if (fromSso) {
        localStorage.setItem(SipaJs.STORAGE_TOKEN_KEY, token);
        localStorage.setItem(SipaJs.STORAGE_IF_FREE_KEY, ifFree || 'false');
      }

      const isLogin = localStorage.getItem(SipaJs.STORAGE_TOKEN_KEY);
      if (to.path.startsWith('/4') || to.path.startsWith('/5')) {
        removeToken(fromSso, next, to, other);
      } else if (!isLogin) {
        window.toSso();
      } else {
        if (
          !(
            store.state &&
            store.state.user &&
            store.state.user.accountInfo &&
            store.state.user.accountInfo.loginCompanyId
          )
        ) {
          await store.dispatch('user/getInfo');
        }
        removeToken(fromSso, next, to, other);
      }
    } catch (e) {
      console.log(e);
    }
  } else {
    next();
  }

  NProgress.done();
});

router.afterEach(() => {
  NProgress.done();
});
