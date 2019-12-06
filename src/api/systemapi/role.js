import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/system/role/page',
    method: 'post',
    data
  })
}

export function getDetail(id) {
  return request({
    url: `/system/role/get/${id}`,
    method: 'get'
  })
}

export function getInfo(data) {
  return request({
    url: `/system/role/info`,
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: '/system/role/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: `/system/role/delete/${id}`,
    method: 'post'
  })
}

