import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/scalp/login/userLogin',
    method: 'POST',
    // 'Content-Type': 'multipart/form-data',
    'Content-Type': 'application/json',
    data
  })
}

export function getPublicKey() {
  return request({
    url: '/scalp/login/getPublicKey',
    method: 'POST'
  })
}

export function logout() {
  return request({
    url: '/scalp/login/logout',
    method: 'POST'
  })
}

export function getUserInfo() {
  return request({
    url: '/scalp/merchant/queryBasicInfo',
    method: 'GET'
    // 'Content-Type': 'multipart/form-data',
  })
}

export function updateLoginPassword(data) {
  return request({
    url: '/scalp/login/updUserPwd',
    method: 'POST',
    data,
    'Content-Type': 'multipart/form-data'
  })
}

export function updateSafePassword(data) {
  return request({
    url: '/scalp/login/updSafetyPwd',
    method: 'POST',
    data,
    'Content-Type': 'multipart/form-data'
  })
}

export function getBankList(params) {
  return request({
    url: '/scalp/bank/list',
    method: 'GET',
    params
  })
}

export function bank(type, data) {
  return request({
    url: `/scalp/bank/${type}`,
    method: 'POST',
    'Content-Type': type === 'add' ? 'multipart/form-data' : 'application/json',
    data
  })
}

export function withBalance(data) {
  return request({
    url: `/scalp/merchant/withBalance`,
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}
