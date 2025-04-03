import request from '@/utils/request';

/**
 * @description 获得主体列表
 */
export function getCompanyList() {
  return request.get('/sso-idp-server/company/all');
}

/**
 * @description 获得组织树
 */
export function getOrganizationTree(data) {
  return request.post('/sso-idp-server/org/get', data);
}

/**
 * @description 获得角色列表
 */
export function getRolesList(data) {
  return request.get('/sso-idp-server/roles', data);
}

/**
 * @description 获得标签树
 */
export function getOrgConfLabelTree(data) {
  return request.post('/sso-idp-server/application/by/company', data);
}

/**
 * @description 获取某公司下所有人员信息列表
 */
export function getCompanyUsers(data) {
  return request.post('/sso-idp-server/account/select/by/company', data);
}

/**
 * @description 获得某层级下所有用户
 */
export function getUsersByOrgLevel(data) {
  return request.post('/sso-idp-server/account/byOrg/get', data);
}

/**
 * @description 根据code查询标签
 */
export function getLabelByCodes(data) {
  return request.post('/sso-idp-server/role/select', data);
}
