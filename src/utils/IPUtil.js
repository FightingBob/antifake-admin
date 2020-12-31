import request from '@/utils/request'
export function getIp() {
  return request({
    url: '/batch/ip',
    method: 'get'
  })
}
