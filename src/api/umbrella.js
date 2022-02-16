import { get, post_json, myAxios } from "../utils/axios";
/**
 * 查询用户借伞实时列表
 * @param {*} params 封装的对象，其中pageNo 页号，大于1，pageSize 每页多少数据，默认20条
 * @returns 200 OK other false
 */
export function selectBorrowList(params) {
  return get("umbrella/selectBorrowList", params);
}

/**
 * 查询超时借伞用户信息列表
 * @param {*} params 封装的对象，其中pageNo 页号，大于1，pageSize 每页多少数据，默认20条
 * @returns 200 OK other false
 */
export function selectOverTimeList(params) {
  return get("umbrella/selectOverTimeList", params);
}

/**
 * 从数据库中查询历史用户借伞信息
 * @param {*} params 封装的对象，其中pageNo 页号，大于1，pageSize 每页多少数据，默认20条
 * @returns 200 OK other false
 */
export function selectHistoryBorrow(params) {
  return get("umbrella/selectHistoryBorrow", params);
}

/**
 * 给超时用户发送提示邮件
 * @param {mailTo subject content} params 封装的对象，mailTo收件人邮箱、subject邮件主题、邮件内容
 * @returns
 */
export function sendAlarmEmail(params) {
  return get("umbrella/sendAlarmEmail", params);
}
/**
 * 删除一条超时用户的数据
 * @param {key} params 用户信息对应在redis中的key
 * @returns 200 OK other false
 */
export function deleteOvertime(params) {
  return get("umbrella/deleteOvertime", params);
}

/**
 * 手动上传微信小程序轮播图和活动介绍图片以及图片的信息
 * @param {*} params
 * @returns
 */
export function upLoadImage(params) {
  return post_json("miniProgram/upLoadImage", params);
}

/**
 * 获得服务器里存储的图片
 * @param {storePath} storePath是图片存在oss中的相对路径 <br/>ex：qxImages/categoryImages0/
 * @returns 返回图片对象集合，对应后端MiniProgramSwiperVo封装的属性
 */
export function getImageList(params) {
  return get("miniProgram/getImageList", params);
}

/**
 * 删除轮播图里面的图片，注意，并没有真正删除oss中存储的数据，只是让外界访问不到。作者觉得这些图片应该还是蛮珍贵的，不删！
 * @param {*} params 图片对应在redis中的key，由storePath+英文冒号+图片url组成
 * @returns 200ok
 */
export function deleteImage(params) {
  return get("miniProgram/deleteImage", params);
}
