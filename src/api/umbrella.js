import { get, post_json, myAxios } from "../utils/axios";
export function selectBorrowList(params) {
  return get("umbrella/selectBorrowList", params);
}
export function selectOverTimeList(params) {
  return get("umbrella/selectOverTimeList", params);
}
export function selectHistoryBorrow(params) {
  return get("umbrella/selectHistoryBorrow", params);
}
export function sendAlarmEmail(params) {
  return get("umbrella/sendAlarmEmail", params);
}
