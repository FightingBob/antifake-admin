import request from '@/utils/request'

export function getVisitNumber() {
  return request({
    url: '/visit/visitNumber',
    method: 'get'
  })
}
