import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/fwBrand/list',
    data: params,
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
