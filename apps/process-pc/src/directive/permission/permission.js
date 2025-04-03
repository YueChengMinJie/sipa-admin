import store from '@/store';
import { message } from 'ant-design-vue';

const rolePermissionCallback = (el, value, modifiers) => {
  const rolePermission = store.getters ? store.getters.permissionMap : [];
  const permissionCodeArr = value;
  let hasPermission;
  if (Array.isArray(permissionCodeArr)) {
    hasPermission = permissionCodeArr.some(permissionCode => rolePermission.includes(permissionCode));
  } else if (typeof permissionCodeArr == 'string') {
    hasPermission = rolePermission.includes(permissionCodeArr);
  } else {
    new Error('v-permission绑定的value应为字符串或数组！');
  }
  if (!hasPermission) {
    if (modifiers.disable || modifiers.disabled) {
      if (!el.getAttribute('class').includes('link')) {
        el.style.cssText += 'cursor:not-allowed';
      } else {
        el.style.cssText = 'color:#606266;cursor:not-allowed';
      }
      el.setAttribute('disabled', true);
      el.setAttribute('title', '无操作权限');
    } else if (modifiers.msg) {
      el.onclick = function() {
        message.error({
          content: '当前用户无此权限'
        });
      };
    } else {
      el.parentNode && el.parentNode.removeChild(el);
    }
  }
};

export default {
  inserted(el, binding, vnode) {
    const { value, modifiers } = binding;
    if (toString.call(value) === '[object Array]' && value.length > 0) {
      rolePermissionCallback(el, value, modifiers);
    } else if (toString.call(value) === '[object Object]') {
      if (value.status) {
        el.parentNode && el.parentNode.removeChild(el);
      } else {
        rolePermissionCallback(el, value.role, modifiers);
      }
    } else {
      console.error("need roles! Like v-permission=\"['admin','editor']\"");
    }
  },
  componentUpdated(el, binding, vnode) {
    const { value, modifiers } = binding;
    if (toString.call(value) === '[object Array]' && value.length > 0) {
      rolePermissionCallback(el, value, modifiers);
    } else if (toString.call(value) === '[object Object]') {
      if (value.status) {
        el.parentNode && el.parentNode.removeChild(el);
      } else {
        rolePermissionCallback(el, value.role, modifiers);
      }
    } else {
      console.error("need roles! Like v-permission=\"['admin','editor']\"");
    }
  }
};
