import request from '@/utils/request'

export function addFood(data) {
  return request({
    url: '/food/create',
    method: 'post',
    data
  })
}

export function listFood(params) {
  return request({
    url: '/food/list',
    method: 'get',
    params
  })
}

export function updateFood(id, data) {
  return request({
    url: '/food/update/' + id,
    method: 'post',
    data
  })
}

export function deleteFood(id) {
  return request({
    url: '/food/delete',
    method: 'post',
    params: {
      foodId: id
    }
  })
}

export function listAllFood() {
  return request({
    url: '/food/listAll',
    method: 'get'
  })
}

export function updateFoodStatus(id, params) {
  return request({
    url: '/food//updateStatus/' + id,
    method: 'post',
    params: params
  })
}
