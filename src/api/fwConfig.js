import request from '@/utils/request'

export function createConfig(data) {
  return request({
    url: '/fwConfig/add',
    method: 'post',
    data
  })
}

export function fetchList(params) {
  return request({
    url: '/fwConfig/list',
    params,
    method: 'get'
  })
}

export function deleteFwConfig(params) {
  return request({
    url: '/fwConfig/delete',
    method: 'post',
    params
  })
}

export function updateFwConfig(data) {
  return request({
    url: '/fwConfig/update',
    method: 'post',
    data
  })
}
