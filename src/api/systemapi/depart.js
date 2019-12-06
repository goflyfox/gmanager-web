import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/system/department/page',
    method: 'post',
    data
  })
}

export function getTree() {
  return request({
    url: '/system/department/list',
    method: 'post'
  })
}

export function getDetail(id) {
  return request({
    url: `/system/department/get/${id}`,
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: '/system/department/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: `/system/department/delete/${id}`,
    method: 'post'
  })
}

