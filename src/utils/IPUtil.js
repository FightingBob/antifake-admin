import request from '@/utils/request'
export function getIp() {
  return request({
    url: '/fwBatch/ip',
    method: 'get'
  })
}
