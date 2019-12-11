import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/system/log/page',
    method: 'post',
    data
  })
}

export function getDetail(id) {
  return request({
    url: `/system/log/get/${id}`,
    method: 'get'
  })
}

