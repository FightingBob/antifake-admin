import request from '@/utils/request'

export function addDepartment(data) {
  return request({
    url: '/department/create',
    method: 'post',
    data
  })
}

export function listDepartment(params) {
  return request({
    url: '/department/list',
    method: 'get',
    params
  })
}

export function updateDepartment(id, data) {
  return request({
    url: '/department/update/' + id,
    method: 'post',
    data
  })
}

export function deleteDepartment(id) {
  return request({
    url: '/department/delete',
    method: 'post',
    params: {
      departmentId: id
    }
  })
}

export function listAllDepartment() {
  return request({
    url: '/department/listAll',
    method: 'get'
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/department/updateStatus/' + id,
    method: 'post',
    params: params
  })
}

export function getDepartmentId(id) {
  return request({
    url: '/department/getDepartment/' + id,
    method: 'get'
  })
}
