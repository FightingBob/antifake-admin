import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/fwBrand/list',
    params,
    method: 'get'
  })
}

export function createFwBrand(data) {
  return request({
    url: '/fwBrand/add',
    method: 'post',
    data
  })
}

export function deleteFwBrand(params) {
  return request({
    url: '/fwBrand/delete',
    method: 'post',
    params
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/fwBrand/updateStatus/' + id,
    method: 'post',
    params
  })
}

export function updateFwBrand(id, data) {
  return request({
    url: '/fwBrand/update/' + id,
    method: 'post',
    data
  })
}
