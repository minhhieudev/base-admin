import request from "@/utils/request";
const modelCode = "epic";

export function getCollection(data) {
  return request({
    url: `/${modelCode}/collection`,
    method: "post",
    data,
  });
}

export function getAll() {
  return request({
    url: `/${modelCode}`,
    method: "get",
  });
}

export function handleDelete(id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: "delete",
  });
}

export function getDetail(id) {
  return request({
    url: `/${modelCode}/${id}`,
    method: "get",
  });
}

export function saveData(data) {
  console.log('lưu đây');
  return request({
    url: `/${modelCode}`,
    method: "post",
    data,
  });
}
