import request from "@/utils/request";
const modelCode = 'report'

export function getCollection () {
  return request({
    url: `/${modelCode}/collection`,
    method: 'post',
  })
}

export function checkIn () {
  return request({
    url: `/${modelCode}/checkin`,
    method: 'post',
  })
}

export function checkOut () {
  return request({
    url: `/${modelCode}/checkout`,
    method: 'post',
  })
}
