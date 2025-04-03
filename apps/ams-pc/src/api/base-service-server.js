/*
 * @Author: caszhou
 * @Date: 2023-06-21 10:12:41
 * @Description: 基础中台
 */

import Config from '@/config'
import Http from '@/utils/http'

const baseHttp = new Http(Config.associationServices[2].url)

// 省市区
/**
 * 树
 */
export function pccTree(params) {
  return baseHttp.POST('/province/tree/children/three', params)
}

// classify
/**
 * 树
 */
export function classifyTree(params) {
  return baseHttp.POST('/dictionary/tree/classify/deep/with/self', params)
}

/**
 * 列表
 */
export function classifyList(params) {
  return baseHttp.POST('/dictionary/list/classify/by/pid', params)
}

/**
 * 新增
 */
export function classifyAdd(params) {
  return baseHttp.POST('/dictionary/add/dic/classify', params)
}

/**
 * 编辑
 */
export function classifyUpdate(params) {
  return baseHttp.POST('/dictionary/update/classify', params)
}

/**
 * 删除
 */
export function classifyDelete(params) {
  return baseHttp.POST('/dictionary/delete/classify', params)
}

// base
/**
 * 树
 */
export function baseTree(params) {
  return baseHttp.POST('/dictionary/tree/base/by/classify', params)
}

/**
 * 列表
 */
export function baseList(params) {
  return baseHttp.POST('/dictionary/list/base/by/classify', params)
}

/**
 * 新增
 */
export function baseAdd(params) {
  return baseHttp.POST('/dictionary/add/dic/base', params)
}

/**
 * 编辑
 */
export function baseUpdate(params) {
  return baseHttp.POST('/dictionary/update/base', params)
}

/**
 * 删除
 */
export function baseDelete(params) {
  return baseHttp.POST('/dictionary/delete/base', params)
}

// dict
/**
 * 列表
 */
export function dictList(params) {
  return baseHttp.POST('/dictionary/list/dic/by/base', params)
}

/**
 * 删除
 */
export function dictDelete(params) {
  return baseHttp.POST('/dictionary/delete', params)
}

/**
 * 新增
 */
export function dictAdd(params) {
  return baseHttp.POST('/dictionary/add/dic', params)
}

/**
 * 更新
 */
export function dictUpdate(params) {
  return baseHttp.POST('/dictionary/update', params)
}
