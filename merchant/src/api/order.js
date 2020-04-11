import request from '@/utils/request'

export function getOrderList(data) {
  return request({
    url: '/scalp/order/list',
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}

export function staticOrder(data) {
  return request({
    url: '/scalp/order/queryOrderInfo',
    method: 'GET',
    // 'Content-Type': 'multipart/form-data',
    data
  })
}

export function affirmOrder(data) {
  return request({
    url: '/scalp/order/audit',
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}

export function callBackByHand(data) {
  return request({
    url: '/instead-pay-web/orderInfo/callBackByHand',
    method: 'post',
    'Content-Type': 'multipart/form-data',
    data
  })
}
