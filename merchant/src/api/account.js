import request from '@/utils/request'

export function getAccountList(params) { // 获取日志列表
  return request({
    url: '/scalp/account/list',
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

export function getAccountLogList(params) { // 获取消息列表
  return request({
    url: '/scalp/accountLog/list',
    method: 'GET',
    params
  })
}

export function auditAccount(data) { // 审核账目（提现，充值）
  return request({
    url: '/scalp/account/audit',
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}

export function auditWith(data) { // 商户提现审核
  return request({
    url: '/scalp/order/auditWith',
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}

export function getWithdraw(params) { // 商户提现审核
  return request({
    url: '/scalp/account/queryWithdraw',
    method: 'GET',
    // 'Content-Type': 'multipart/form-data',
    params
  })
}
