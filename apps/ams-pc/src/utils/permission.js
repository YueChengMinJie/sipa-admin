/*
 * @Author: tianjingyuan 2297526156@qq.com
 * @Date: 2024-04-19 11:04:56
 * @LastEditors: tianjingyuan 2297526156@qq.com
 * @LastEditTime: 2024-04-24 21:35:29
 * @FilePath: /ams-pc/src/utils/permission.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import store from '@/store'
import { findFieldName } from '@/utils/commonTools'

export async function getApplicationPermissions(data) {
  // 在对象数组中查找 type 属性值为 'endpoint' 的对象
  store.commit('savePermissions', findFieldName(data, 'type', 'endpoint'))
}
