/* eslint-disable */
import store from '@/store';
import { message } from 'ant-design-vue';
import axios from 'axios';
import Vue from 'vue';
import SipaJs from 'sipa-boot-sdk-js';

const service = axios.create({
  timeout: 30000 // 请求超时时间
});

let fail = false;

//请求
service.interceptors.request.use(config => {
  const token = localStorage.getItem(SipaJs.STORAGE_TOKEN_KEY);
  if (token) {
    config.headers[SipaJs.HEADER_TOKEN_KEY] = SipaJs.HEADER_TOKEN_VALUE_PREFIX + token;
  }
  config.headers[SipaJs.REQUEST_ID] = SipaJs.getRequestId();
  config.headers[SipaJs.REQUEST_FROM] = SipaJs.REQUEST_FROM_PROCESS;

  const loginCompanyId = store.state.user.accountInfo.loginCompanyId;
  if (loginCompanyId) {
    config.headers[SipaJs.MERCHANT_ID] = loginCompanyId;
  }

  config.headers['Content-Type'] = 'application/json;charset=utf-8';
  return config;
});
// 测试，暂时忽略End

function toSso(data) {
  if (!fail) {
    message.error(data.msg || '鉴权失败');
    window.toSso();
    fail = true;
  }
}

//响应
service.interceptors.response.use(
  response => {
    const data = response.data;
    if (data.errorCode !== SipaJs.SUCCESS_CODE) {
      message.error(data.msg || '请求错误，请稍后重试');
    }
    return Promise.resolve(response);
  },
  error => {
    const response = error.response;
    if (response) {
      const { data } = response;
      if (SipaJs.LOGIN_VERIFICATION_FAILED.includes(data.errorCode)) {
        toSso(data);
      } else if (SipaJs.PERMISSION_VERIFICATION_FAILED.includes(data.errorCode)) {
        message.error(data.msg || '鉴权失败');
      } else {
        message.error(data.msg || '请求错误，请稍后重试');
      }
      return Promise.reject(response);
    }
    return Promise.reject(error);
  }
);

const http = {};

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Boolean} loading [请求时是否显示loading] 默认是不显示loading
 */
http.get = function (url, params = null, loading = false) {
  if (loading) {
    Vue.prototype.$loading.show();
  }
  return new Promise((resolve, reject) => {
    service
      .get(url, {
        params
      })
      .then(res => {
        if (loading) {
          Vue.prototype.$loading.hide();
        }
        resolve(res.data);
      })
      .catch(e => {
        if (loading) {
          Vue.prototype.$loading.hide();
        }
        reject(e);
      });
  });
};

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 * @param {Boolean} loading [请求时是否显示loading] 默认是不显示loading
 */
http.post = function (url, params = {}, loading = false) {
  if (loading) {
    Vue.prototype.$loading.show();
  }
  return new Promise((resolve, reject) => {
    service
      .post(url, params)
      .then(res => {
        if (loading) {
          Vue.prototype.$loading.hide();
        }
        resolve(res.data);
      })
      .catch(e => {
        if (loading) {
          Vue.prototype.$loading.hide();
        }
        reject(e);
      });
  });
};

export default http;
