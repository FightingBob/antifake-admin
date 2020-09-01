import request from '@/utils/request'

// 查询后台菜单列表
export function fetchList(parentId, params) {
  return request({
    url: '/menu/list/' + parentId,
    method: 'get',
    params
  })
}

// 创建后台菜单
export function createMenu(data) {
  return request({
    url: '/menu/create',
    method: 'post',
    data
  })
}

// 修改后台菜单

export function updateMenu(id, data) {
  return request({
    url: `/menu/update/${id}`,
    method: 'post',
    data
  })
}

// 修改菜单显示状态
export function updateHidden(id, params) {
  return request({
    url: `/menu/updateHidden/${id}`,
    method: 'post',
    params
  })
}

// 获取菜单详情
export function getMenu(id) {
  return request({
    url: `/menu/${id}`,
    method: 'get'
  })
}

// 删除菜单
export function deleteMenu(id) {
  return request({
    url: `/menu/delete/${id}`,
    method: 'post'
  })
}

// 获取树状菜单列表
export function fetchTreeList() {
  return request({
    url: '/menu/treeList',
    method: 'get'
  })
}

export function allocMenu(data) {
  return request({
    url: '/role/allocMenu',
    method: 'post',
    data
  })
}

export function listMenuByRole(roleId) {
  return request({
    url: '/role/listMenu/' + roleId,
    method: 'get'
  })
}
