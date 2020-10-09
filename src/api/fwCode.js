import request from '@/utils/request'

export function queryCode(params) {
  return request({
    url: '/fwCode/query',
    method: 'get',
    params
  })
}

export function list() {
  return request({
    url: '/fwCode/list',
    method: 'get'

  })
}

export function deleteCode(params) {
  return request({
    url: '/fwCode/delete',
    method: 'post',
    params
  })
}

export function addNewCode(params) {
  return request({
    url: '/fwCode/add',
    method: 'post',
    params
  })
}
