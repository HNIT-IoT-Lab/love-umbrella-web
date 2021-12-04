import { get, post_json } from '../utils/axios'

export function fetchData(params) {
    return get('volunteerActivity/selectListActivity', params);
}

export function getById(params) {
    return get('volunteerActivity/selectOneActivity', params);
}

export function update(params) {
    return post_json('volunteerActivity/updateActivity', params);
}

export function deleteById(id) {
    let url = 'volunteerActivity/deleteActivity?id=' + id;
    return post_json(url);
}

export function add(params) {
    return post_json('volunteerActivity/createActivity', params);
}