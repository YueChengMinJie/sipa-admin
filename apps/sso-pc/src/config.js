/*
 * @Author: caszhou
 * @Date: 2021-04-01 14:02:59
 * @Description: 配置文件
 */
const SipaJs = require('sipa-boot-sdk-js')

const associationServices = [
  // 用户中台
  { url: '', prefix: '/sso-idp-server', target: process.env.VUE_APP_URL }
]
associationServices.forEach(item => {
  if (process.env.VUE_APP_ENV === 'local') {
    item.url = item.prefix
  } else {
    item.url = item.target + item.prefix
  }
})

module.exports = {
  applicationId: SipaJs.APPLICATION_ID_CP_SSO,
  /** 站点名称 */
  siteName: 'SIPA SSO PC',
  /** token名称 */
  tokenName: SipaJs.STORAGE_TOKEN_KEY,
  /** header请求头 前缀 */
  headerPrefix: SipaJs.HEADER_TOKEN_VALUE_PREFIX,
  /** header请求头 */
  headerKey: SipaJs.HEADER_TOKEN_KEY,
  /** header请求头的请求ID */
  headerRequestKey: SipaJs.REQUEST_ID,
  headerRequestId: SipaJs.getRequestId,
  /** header请求头的请求来源名称 */
  headerFromKey: SipaJs.REQUEST_FROM,
  headerFromId: SipaJs.REQUEST_FROM_SSO,
  merchantId: SipaJs.MERCHANT_ID,
  /** http请求超时时间 */
  httpTimeOut: 60000,
  /** api 业务成功code: "000000" */
  httpCodeSuccess: SipaJs.SUCCESS_CODE,
  /** 登陆校验失败的code: ['000030']  */
  httpCodeLoginError: SipaJs.LOGIN_VERIFICATION_FAILED,
  /** 当前项目关联的服务 */
  associationServices,
  /** 当前环境: local | dev | fat | prod */
  env: process.env.VUE_APP_ENV
}
