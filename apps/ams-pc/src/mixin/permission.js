/*
 * @Author: caszhou
 * @Date: 2021-04-29 14:32:24
 * @Description: 权限mixin
 */

import store from '@/store'

export default {
  methods: {
    getBtnPermissions(permissionKey) {
      const { permissionList } = store.state
      if (permissionKey === true) {
        return true
      } else {
        return permissionList?.find(item => item.aliasName === permissionKey)
          ? !permissionList?.find(item => item.aliasName === permissionKey).hidden
          : true
      }
    }
  }
}
