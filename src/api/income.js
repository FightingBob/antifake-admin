import request from '@/utils/request'

export function listAllIncome(params) {
  return request({
    url: '/income/listAll',
    method: 'get',
    params
  })
}

export function listIncome(params) {
  return request({
    url: '/income/list',
    method: 'get',
    params
  })
}
