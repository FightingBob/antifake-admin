import request from '@/utils/request'

export function createOrder(data) {
  return request({
    url: '/drinkOrder/create',
    method: 'post',
    data
  })
}
