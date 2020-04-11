import request from '@/utils/request'

export function getMerchantList(params) { // 条件获取商户列表
  return request({
    url: '/scalp/merchant/list',
    method: 'GET',
    params
  })
}

export function batchDeleteCode(params) { // 批量删除邀请码
  return request({
    url: '/scalp/merchant/deleteBatchCode',
    method: 'DELETE',
    params
  })
}

export function getCodeList(params) { // 条件获取邀请码列表
  return request({
    url: '/scalp/merchant/codelist',
    method: 'GET',
    params
  })
}

export function getAdminList(params) { // 条件查询管理员列表
  return request({
    url: '/scalp/system/list',
    method: 'GET',
    params
  })
}

export function getCommissionList(params) { // 条件查询管理员列表
  return request({
    url: '/scalp/subCommission/list',
    method: 'GET',
    params
  })
}

export function getSubordinateList(params) { // 条件查询管理员列表
  return request({
    url: '/scalp/user/queryUserSonList',
    method: 'GET',
    params
  })
}
