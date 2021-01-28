import request from '@/utils/request'

export function createConfig(data) {
  return request({
    url: '/config/add',
    method: 'post',
    data
  })
}

export function fetchList(params) {
  return request({
    url: '/config/list',
    params,
    method: 'get'
  })
}

export function deleteFwConfig(params) {
  return request({
    url: '/config/delete',
    method: 'post',
    params
  })
}

export function updateFwConfig(data) {
  return request({
    url: '/config/update',
    method: 'post',
    data
  })
}
