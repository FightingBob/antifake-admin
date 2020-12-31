import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/brand/list',
    params,
    method: 'get'
  })
}

export function createFwBrand(data) {
  return request({
    url: '/brand/add',
    method: 'post',
    data
  })
}

export function deleteFwBrand(params) {
  return request({
    url: '/brand/delete',
    method: 'post',
    params
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/brand/updateStatus/' + id,
    method: 'post',
    params
  })
}

export function updateFwBrand(id, data) {
  return request({
    url: '/brand/update/' + id,
    method: 'post',
    data
  })
}
