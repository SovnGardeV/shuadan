import request from '@/utils/request'

export function uploadPicture(data) {
  return request({
    url: '/scalp/qrCode/upload',
    method: 'POST',
    data
  })
}

export function addQR(data) {
  return request({
    url: '/scalp/qrCode/add',
    method: 'POST',
    'Content-Type': 'application/json',
    data
  })
}

export function editQR(data) {
  return request({
    url: '/scalp/qrCode/edit',
    method: 'POST',
    'Content-Type': 'application/json',
    data
  })
}

export function queryQrAll(params) {
  return request({
    url: '/scalp/qrCode/list',
    method: 'GET',
    // 'Content-Type': 'multipart/form-data',
    params
  })
}

export function updateEnableStatus(data) {
  return request({
    url: '/scalp/qrCode/editStatusByadmin',
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}

export function updatePollStatus(data) {
  return request({
    url: '/scalp/qrCode/editPollStatus',
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}
