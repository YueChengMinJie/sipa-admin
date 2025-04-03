/*
 * @Author: caszhou
 * @Date: 2023-06-21 10:12:41
 * @Description: 流程中台
 */

import Config from '@/config'
import Http from '@/utils/http'

const messageHttp = new Http(Config.associationServices[3].url)

/**
 * 消息分页
 */
export function messagePage(data) {
  return messageHttp.POST('/message/page', data)
}

/**
 * 已读
 */
export function updateMessage(data) {
  return messageHttp.PUT('/message', data)
}
