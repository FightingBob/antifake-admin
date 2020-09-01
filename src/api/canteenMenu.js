import request from '@/utils/request'

export function create(data) {
  return request({
    url: '/foodMenu/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/foodMenu/update',
    method: 'post',
    data
  })
}

export function addFood(data) {
  return request({
    url: '/foodMenu/addFood',
    method: 'post',
    data
  })
}

export function deleteFood(id) {
  return request({
    url: '/foodMenu/deleteFood/' + id,
    method: 'post'
  })
}

export function updateFood(id, data) {
  return request({
    url: '/foodMenu/updateFood/' + id,
    method: 'post',
    data
  })
}

export function deleteMenu(id) {
  return request({
    url: '/foodMenu/delete',
    method: 'post',
    params: {
      menuId: id
    }
  })
}

export function todayMenu() {
  return request({
    url: '/foodMenu/today',
    method: 'get'
  })
}

export function createOrder(data) {
  return request({
    url: '/foodMenu/addOrder',
    method: 'post',
    data
  })
}

export function orderDetail(menuId) {
  return request({
    url: '/foodMenu/orderDetail',
    method: 'get',
    params: {
      menuId
    }
  })
}

export function endOrder(menuId) {
  return request({
    url: '/foodMenu/endOrder',
    method: 'post',
    params: {
      menuId
    }
  })
}

export function finishOrder(menuId) {
  return request({
    url: '/foodMenu/finishOrder',
    method: 'post',
    params: {
      menuId
    }
  })
}

export function orderData(menuId) {
  return request({
    url: '/foodMenu/orderData',
    method: 'get',
    params: {
      menuId
    }
  })
}

export function changeOrder(data) {
  return request({
    url: '/foodMenu/changeOrder',
    method: 'post',
    data
  })
}

export function helpOrder(data) {
  return request({
    url: '/foodMenu/helpOrder',
    method: 'post',
    data
  })
}

