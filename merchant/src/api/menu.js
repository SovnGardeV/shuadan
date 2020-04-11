import request from '@/utils/request'

export function addMenu(data) {
  return request({
    url: '/scalp/menu/add',
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}

export function getMenu() {
  return request({
    url: '/scalp/role/queryTreeList',
    method: 'GET'
  })
}

export function deleteMenu(data) {
  return request({
    url: '/scalp/menu/deleteBatch',
    method: 'POST',
    'Content-Type': 'multipart/form-data',
    data
  })
}

export function getRoleList(params) { // 获取角色列表
  return request({
    url: '/scalp/role/list',
    method: 'GET',
    // 'Content-Type': 'multipart/form-data',
    params
  })
}

export function getSelfRoleList(params) { // 获取角色列表
  return request({
    url: '/scalp/roleMenu/queryRolePermission',
    method: 'GET',
    // 'Content-Type': 'multipart/form-data',
    params
  })
}

export function addRoleMenu(data) { // 获取角色列表
  return request({
    url: '/scalp/roleMenu/saveRolePermission',
    method: 'POST',
    'Content-Type': 'application/json',
    data
  })
}
