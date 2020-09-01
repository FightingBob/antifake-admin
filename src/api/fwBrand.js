import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/fwBrand/list',
    data: params,
    method: 'get'
  })
}
