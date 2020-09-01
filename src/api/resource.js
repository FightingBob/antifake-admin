import request from '@/utils/request'

// 查询资源列表
export function fetchList(params) {
  return request({
    url: '/resource/list',
    method: 'get',
    params
  })
}

// 创建资源
export function createResource(data) {
  return request({
    url: '/resource/create',
    method: 'post',
    data: data
  })
}

// 修改资源
export function updateResource(id, data) {
  return request({
    url: '/resource/update/' + id,
    method: 'post',
    data: data
  })
}

// 删除资源
export function deleteResource(id) {
  return request({
    url: '/resource/delete/' + id,
    method: 'post'
  })
}

// 获取所有资源
export function fetchAllResourceList() {
  return request({
    url: '/resource/listAll',
    method: 'get'
  })
}
