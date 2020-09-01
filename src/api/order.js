import request from '@/utils/request'

export function createOrder(data) {
  return request({
    url: '/order/create',
    method: 'post',
    data
  })
}

export function today() {
  return request({
    url: '/order/today',
    method: 'get'
  })
}

