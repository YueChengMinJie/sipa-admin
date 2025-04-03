import request from '@/utils/request';

/**
 * @description 获得应用列表
 */
export function getApplicationList() {
  return request.get('/sso-idp-server/application/all/bcp');
}
