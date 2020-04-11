import request from '@/utils/request'

export function getProductList(params) { // 获取产品列表
  return request({
    url: '/scalp/manghe/list',
    method: 'GET',
    params
    // 'Content-Type': 'multipart/form-data'
  })
}

export function changeStatus(data) { // 管理员上下架商品
  return request({
    url: '/scalp/manghe/lowerShop',
    method: 'POST',
    data,
    'Content-Type': 'multipart/form-data'
  })
}

export function addProduct(data) { // 新增产品
  return request({
    url: '/scalp/manghe/add',
    method: 'POST',
    data,
    'Content-Type': 'application/json'
  })
}

export function editProduct(data) { // 修改产品
  return request({
    url: '/scalp/manghe/edit',
    method: 'POST',
    data,
    'Content-Type': 'application/json'
  })
}

export function deleteProduct(data) { // 删除产品
  return request({
    url: '/scalp/manghe/delete',
    method: 'POST',
    data,
    'Content-Type': 'multipart/form-data'
  })
}
