import request from "@/utils/request";
const modelCode = 'meta'

export function getMetaCodes () {
  return request({
    url: `/${modelCode}/codes`,
    method: 'get'
  })
}

export function getCollection (data) {
  return request({
    url: `/${modelCode}`,
    method: 'get'
  })
}

export function handleDelete (id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: 'delete'
  })
}

export function getDetail (id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: 'get'
  })
}

export function addData (data) {
  return request({
    url: `/${modelCode}`,
    method: 'post',
    data: data
  })
}

export function saveData (data, id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: 'put',
    data: data
  })
}

