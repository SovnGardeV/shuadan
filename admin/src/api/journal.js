import request from '@/utils/request'

export function getJournalList(params) { // 获取日志列表
  return request({
    url: '/scalp/systemLog/list',
    method: 'GET',
    params
    // 'Content-Type': 'multipart/form-data'
  })
}

export function getMessageList(params) { // 获取消息列表
  return request({
    url: '/scalp/message/list',
    method: 'GET',
    params
  })
}

