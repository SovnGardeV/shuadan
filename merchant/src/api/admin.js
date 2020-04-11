import request from '@/utils/request'

// 商户邀请码
export function batchCreateCode() { // 批量创建邀请码
  return request({
    url: '/scalp/merchant/createBatchCode',
    method: 'POST',
    'Content-Type': 'multipart/form-data'
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

// 管理员列表
export function getAdminList(params) { // 条件查询管理员列表
  return request({
    url: '/scalp/system/list',
    method: 'GET',
    params
  })
}

export function updatePassword(data) { // 更改码商商户密码
  return request({
    url: '/scalp/merchant/updatePwd',
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}

export function editBalance(data) { // 更改码商商户密码
  return request({
    url: '/scalp/merchant/editBalance',
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}

export function getGroup() { // 获取用户组信息
  return request({
    url: '/scalp/group/list',
    method: 'POST'
  })
}

export function saveGroup(data) { // 获取用户组信息
  return request({
    url: '/scalp/group/editBatch',
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}

export function editOpenStatus(data) { // 修改码商可开业状态
  return request({
    url: '/scalp/user/editOpenStatus',
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}

export function openOrDraw(data) { // 一键开业\打烊
  return request({
    url: '/scalp/user/OneOpenOrDraw',
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}
