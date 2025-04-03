/*
 * @Author: caszhou
 * @Date: 2023-06-21 10:12:41
 * @Description: 流程中台
 */

import Config from '@/config'
import Http from '@/utils/http'

const processHttp = new Http(Config.associationServices[1].url)

// instance
/**
 * 查询我的待办/已办/我发起的/我收到的
 */
export function getInstances(data) {
  return processHttp.POST('/instance/getInstancesByKeywords', data)
}

/**
 * 查询流程状态
 */
export function getStatusByBusinessKey(params) {
  return processHttp.GET('/instance/getStatusByBusinessKey', params)
}

// define
/**
 * 查询流程状态
 */
export function processInstancePreview(processInstanceId) {
  return processHttp.POST(`/instance/processInstancePreview?processInstanceId=${processInstanceId}`)
}

// task
/**
 * 完成任务
 */
export function completeTask(data) {
  return processHttp.POST('/task/completeTask', data)
}

// history
/**
 * 完成任务
 */
export function taskHistory(processInstanceId) {
  return processHttp.POST(`/history/getApprovalHistoricByProInstanceId?processInstanceId=${processInstanceId}`)
}
