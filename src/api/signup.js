import {get, post_json, myAxios } from '../utils/axios'

// 获取报名列表
export function fetchData(params) {
    return get('signUpRecord/getList', params);
}

export function getById(params) {
    return get('volunteerActivity/getActivityInfo', params);
}

export function update(params) {
    return post_json('volunteerActivity/updateActivity', params);
}

// 删除报名记录
export function deleteById(id) {
    return myAxios({
        url: 'signUpRecord/deleteById/' + id,
        method: 'delete'
    })
}

export function add(params) {
    return post_json('volunteerActivity/createActivity', params);
}