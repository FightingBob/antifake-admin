import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/fwBatch/list',
    method: 'get',
    params
  })
}

export function exportBatch() {
  return request({
    url: '/fwBatch/org',
    method: 'get',
    responseType: 'blob'
  })
}

export function createFile(params) {
  return request({
    url: '/fwBatch/createFile',
    method: 'post',
    params
  })
}

export function createFwBatch(data) {
  return request({
    url: '/fwBatch/add',
    method: 'post',
    data
  })
}

export function deleteFwBatch(params) {
  return request({
    url: '/fwBatch/delete',
    method: 'post',
    params
  })
}

export function deleteTxtFile(params) {
  return request({
    url: '/fwBatch/deleteFile',
    method: 'post',
    params
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/fwBatch/updateStatus/' + id,
    method: 'post',
    params
  })
}
