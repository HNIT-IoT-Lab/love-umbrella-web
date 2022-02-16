import { get, post_json } from "../utils/axios";

export function fetchData(params) {
  return get("volunteer/selectList", params);
}

export function getById(params) {
  return get("volunteer/selectOne", params);
}

export function update(params) {
  return post_json("volunteer/update", params);
}

export function deleteById(id) {
  let url = "volunteer/deleteOne?id=" + id;
  return post_json(url);
}

export function add(params) {
  return post_json("volunteer/register", params);
}
