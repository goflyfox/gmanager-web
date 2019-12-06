import request from '@/utils/request'

export function getMenuList(data) {
  return request({
    url: '/system/menu/page',
    method: 'post',
    data
  })
}

export function getMenuTree() {
  return request({
    url: '/system/menu/tree',
    method: 'post'
  })
}

export function getMenuDetail(id) {
  return request({
    url: `/system/menu/get/${id}`,
    method: 'get'
  })
}

export function saveMenu(data) {
  return request({
    url: '/system/menu/save',
    method: 'post',
    data
  })
}

export function delMenu(id) {
  return request({
    url: `/system/menu/delete/${id}`,
    method: 'post'
  })
}

export function getRoleList(data) {
  return request({
    url: '/login/submit',
    method: 'post',
    data
  })
}

export function getUserList(data) {
  return request({
    url: '/login/submit',
    method: 'post',
    data
  })
}

