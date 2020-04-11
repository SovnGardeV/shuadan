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

export function getUserList(params) {
  return request({
    url: '/scalp/user/list',
    method: 'GET',
    // 'Content-Type': 'multipart/form-data',
    params
  })
}
