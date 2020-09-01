import request from '@/utils/request'

export function listExpend(params) {
  return request({
    url: '/expend/list',
    method: 'get',
    params
  })
}

export function listExpendAll(params) {
  return request({
    url: '/expend/listAll',
    method: 'get',
    params
  })
}

export function listBySelf(params) {
  return request({
    url: '/expend/listBySelf',
    method: 'get',
    params
  })
}

export function listBySelfAll(params) {
  return request({
    url: '/expend/listBySelfAll',
    method: 'get',
    params
  })
}

export function getTotalExpend() {
  return request({
    url: '/expend/totalExpenses',
    method: 'get'
  })
}

export function addExpend(data) {
  return request({
    url: '/expend/create',
    method: 'post',
    data
  })
}

export function importExpend(data) {
  return request({
    url: '/expend/import',
    method: 'post',
    data
  })
}

export function deleteExpend(id) {
  return request({
    url: '/expend/delete/' + id,
    method: 'post'
  })
}
