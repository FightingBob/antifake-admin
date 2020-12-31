import request from '@/utils/request'

export function batchList(params) {
  return request({
    url: '/batch/list',
    method: 'get',
    params
  })
}

export function exportBatch() {
  return request({
    url: '/batch/org',
    method: 'get',
    responseType: 'blob'
  })
}

export function createFile(params) {
  return request({
    url: '/batch/createFile',
    method: 'post',
    params
  })
}

export function createFwBatch(data) {
  return request({
    url: '/batch/add',
    method: 'post',
    data
  })
}

export function deleteFwBatch(params) {
  return request({
    url: '/batch/delete',
    method: 'post',
    params
  })
}

export function deleteTxtFile(params) {
  return request({
    url: '/batch/deleteFile',
    method: 'post',
    params
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/batch/updateStatus/' + id,
    method: 'post',
    params
  })
}
