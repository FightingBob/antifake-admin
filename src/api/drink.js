import request from '@/utils/request'

export function addDrink(data) {
  return request({
    url: '/drink/create',
    method: 'post',
    data
  })
}

export function listDrink(params) {
  return request({
    url: '/drink/list',
    method: 'get',
    params
  })
}

export function updateDrink(id, data) {
  return request({
    url: '/drink/update/' + id,
    method: 'post',
    data
  })
}

export function deleteDrink(id) {
  return request({
    url: '/drink/delete',
    method: 'post',
    params: {
      drinkId: id
    }
  })
}
