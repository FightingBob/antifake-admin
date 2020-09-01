import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/vue-element-admin/roles',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/vue-element-admin/role',
    method: 'post',
    data
  })
}

// 修改角色
export function updateRole(id, data) {
  return request({
    url: `/role/update/${id}`,
    method: 'post',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: '/role/delete',
    method: 'post',
    data: {
      id
    }
  })
}

// 查询角色列表
export function fetchList(params) {
  return request({
    url: '/role/list',
    method: 'get',
    params
  })
}

// 添加角色
export function createRole(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data: data
  })
}

// 修改角色状态
export function updateStatus(id, params) {
  return request({
    url: `/role/updateStatus/${id}`,
    method: 'post',
    params
  })
}

// 获取所有角色
export function fetchAllRoleList() {
  return request({
    url: '/role/listAll',
    method: 'get'
  })
}

// 获取角色资源
export function listResourceByRole(roleId) {
  return request({
    url: '/role/listResource/' + roleId,
    method: 'get'
  })
}

// 给角色分配资源
export function allocResource(data) {
  return request({
    url: '/role/allocResource',
    method: 'post',
    data
  })
}

// 角色菜单列表
export function listMenuByRole(roleId) {
  return request({
    url: '/role/listMenu/' + roleId,
    method: 'get'
  })
}

// 给角色分配菜单
export function allocMenu(data) {
  return request({
    url: '/role/allocMenu',
    method: 'post',
    data: data
  })
}
