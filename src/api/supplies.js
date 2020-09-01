import request from '@/utils/request.js'

export function batchSuppliesInsert(data) {
  return request({
    url: '/suppliesItem/import',
    method: 'post',
    data
  })
}
export function suppliesList(params) {
  return request({
    url: '/suppliesItem/list',
    method: 'get',
    params
  })
}

export function suppliesListByPagination(params) {
  return request({
    url: '/suppliesItem/listByQuery',
    method: 'get',
    params
  })
}

export function recordList(params) {
  return request({
    url: '/suppliesItem/recordList',
    method: 'get',
    params
  })
}

export function deleteSupplies(suppliesId) {
  return request({
    url: '/suppliesItem/delete',
    method: 'post',
    params: {
      suppliesId
    }
  })
}
