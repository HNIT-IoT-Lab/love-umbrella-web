import { uploadFile } from '../utils/axios'

export function uploadImg(data) {
    return uploadFile('oss/uploadImg', data)
}