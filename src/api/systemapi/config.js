import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/system/config/page',
    method: 'post',
    data
  })
}

export function getDetail(id) {
  return request({
    url: `/system/config/get/${id}`,
    method: 'get'
  })
}

export function getType() {
  return request({
    url: '/system/config/type',
    method: 'get'
  })
}

export function save(data) {
  return request({
    url: '/system/config/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: `/system/config/delete/${id}`,
    method: 'post'
  })
}

