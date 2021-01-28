import request from '@/utils/request'

export function queryCode(params) {
  return request({
    url: '/code/query',
    method: 'get',
    params
  })
}

export function clearCode(data) {
  return request({
    url: '/code/clear',
    method: 'post',
    data
  })
}

export function addNewCode(data) {
  return request({
    url: '/code/add',
    method: 'post',
    data
  })
}
