import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/system/user/page',
    method: 'post',
    data
  })
}

export function getDetail(id) {
  return request({
    url: `/system/user/get/${id}`,
    method: 'get'
  })
}

export function getRoleInfo(data) {
  return request({
    url: `/system/user/roleinfo`,
    method: 'post',
    data
  })
}

export function saveRoleInfo(data) {
  return request({
    url: '/system/user/rolesave',
    method: 'post',
    data
  })
}

export function save(data) {
  return request({
    url: '/system/user/save',
    method: 'post',
    data
  })
}

export function del(id) {
  return request({
    url: `/system/user/delete/${id}`,
    method: 'post'
  })
}

