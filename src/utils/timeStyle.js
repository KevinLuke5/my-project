/**
 *
 * @param {*} time 选中的时间数组
 * @param {*} v1 需要绑定的第一个参数
 * @param {*} v2 需要绑定的第二个参数
 * @returns
 */
export function changeTime(time, v1, v2) {
  let obj = {
    [v1]: time[0] + ' 00:00:00',
    [v2]: time[1] + ' 23:59:59'
  }
  return obj
}
