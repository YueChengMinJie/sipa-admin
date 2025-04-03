/*
 * @Author: caszhou
 * @Date: 2021-04-01 14:02:59
 * @Description: 用户中台
 */

import Config from '@/config'
import Http from '@/utils/http'

// sso-idp-server
const idpHttp = new Http(Config.associationServices[0].url)

/**
 * 发送验证码
 */
export function getPhoneCode(params) {
  return idpHttp.POST('/login/phone/verification/code/get', params)
}

/**
 * 账号密码登陆
 */
export function loginPassword(params) {
  return idpHttp.POST('/login/password', params)
}

/**
 * 手机号验证码登陆
 */
export function loginPhoneCode(params) {
  return idpHttp.POST('/login/phone/code', params)
}

/** 查询所有租户 */
export function companySelectByLogin(params) {
  return idpHttp.POST('/company/selectByLogin', params)
}

/** 登陆主体 */
export function switchSubject(params) {
  return idpHttp.POST('/switch/subject', params)
}

/** 退出登陆 */
export function logout(params) {
  return idpHttp.POST('/logout', params)
}

/** 忘记密码 - 修改密码 */
export function passwordReset(params) {
  return idpHttp.POST('/login/password/update/by/code', params)
}
