import request from "@/utils/request";
const modelCode = 'order'

export function getCollection (data) {
  return request({
    url: `/${modelCode}/collection`,
    method: 'post',
    data
  })
}

export function getDetail (id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: 'get'
  })
}

export function saveData (data, id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: 'put',
    data: data
  })
}

