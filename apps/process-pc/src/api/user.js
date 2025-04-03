import request from '@/utils/request';

/**
 * @description 极验行为验
 */
export function geetest() {
  return request.get('/sso-idp-server/login/geetest');
}

/**
 * @description 手机号密码登录
 */
export function loginByPassword(data) {
  return request.post('/sso-idp-server/login/phone/password', data);
}

/**
 * @description 手机号验证码登录
 */
export function loginByValidateCode(data) {
  return request.post('/sso-idp-server/login/phone/code', data);
}

/**
 * @description 获取用户信息
 */
export function getInfo() {
  return request.get('/sso-idp-server/account/by/access');
}

/**
 * 获取用户所拥有的菜单权限
 */
export function getMenuPermission(data) {
  return request.post('/sso-idp-server/role/getFunctionCodeList', data);
}

/**
 * @description 用户退出登录
 */
export function logout(data) {
  return request.post('/sso-idp-server/logout', data);
}

/**
 * @description 获取验证码
 * @param {number} data 手机号
 */
export function getPhoneCode(data) {
  return request.post('/sso-idp-server/phone/verification/code/get', data);
}

/**
 * @description 修改密码
 */
export function updatePassword(data) {
  return request.post('/sso-idp-server/account/password/update', data);
}
