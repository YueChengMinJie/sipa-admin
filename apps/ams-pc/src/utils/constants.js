/*
 * @Author: caszhou
 * @Date: 2021-04-01 14:02:59
 * @Description: 静态变量
 */

// 启用禁用
export const yesNoOptions = new Map([
  [0, '否'],
  [1, '是']
])

export const statusOptions = new Map([
  [0, '禁用'],
  [1, '启用']
])

export const processOptions = new Map([
  [1, '进行中'],
  [2, '已撤销'],
  [3, '已暂停'],
  [4, '已完成'],
  [5, '已拒绝'],
  [6, '已删除']
])

export const taskOptions = new Map([
  [1, '进行中'],
  [2, '已撤销'],
  [3, '已暂停'],
  [4, '已完成'],
  [5, '已拒绝']
])

export const pageToListParams = { pageNum: 1, pageSize: 2147483647 }

export const smallPageToListParams = { pageNum: 1, pageSize: 255 }

export const reportDateFormat = 'YY年MM月DD日'

export const reportTimeFormat = 'HH:mm:ss'

export const defaultCompanySerialNo = 'M00000000001'
