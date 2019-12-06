import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/submit',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: 'system/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function changePwd(data) {
  return request({
    url: '/system/user/password',
    method: 'post',
    data
  })
}

export function getUserMenu() {
  return request({
    url: '/system/user/menu',
    method: 'post'
  })
}
