import { Message } from '@base/jy-ui-plus'
import { getUserInfo } from '@/api/system/user'
import _ from 'lodash'
/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime (time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'undefined' || time === null || time === 'null') {
    return ''
  } else if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }

    // 判断时间格式是否是时间戳，非时间戳将'-'转成'/'，用来兼容老版safari
    date = new Date(typeof time === 'number' ? time : time.replace(/-/g, '/'))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// 下载文件
export function downloadFile (obj, name, suffix) {
  const url = window.URL.createObjectURL(new Blob([obj]))
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  const fileName = parseTime(new Date()) + '-' + name + '.' + suffix
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// 把日期区间的开始和结束拆分出来
export function departTime (timeRange, sTimeName, eTimeName) {
  const params = {}
  if (timeRange && timeRange.length !== 0) {
    params[sTimeName] = timeRange[0]
    params[eTimeName] = timeRange[1]
  } else {
    params[sTimeName] = ''
    params[eTimeName] = ''
  }
  return params
}

// 删除Object中的空值属性
export function clearNullProperty (obj) {
  const res = JSON.parse(JSON.stringify(obj))
  for (const [key, value] of Object.entries(res)) {
    if (value === '' || value === null || value === undefined) {
      delete res[key]
    }
  }
  return res
}

// 新增、修改、启禁用等操作类请求返回提示
export function handleMessage (res, successText) {
  return new Promise((resolve, reject) => {
    if (res) {
      if (res.code === '0') {
        Message.success({
          message: successText || '操作成功'
        })
        resolve(res)
      } else {
        Message.warning({
          message: res.message
        })
        reject(res)
      }
    } else {
      Message.warning({
        message: '接口异常！'
      })
    }
  })
}

// 查询类请求返回提示
export function handleSearchRes (res) {
  return new Promise((resolve, reject) => {
    if (res) {
      if (res.code === '0') {
        resolve(res)
      } else {
        Message.warning({
          message: res.message
        })
        reject(res)
      }
    } else {
      Message.warning({
        message: '接口异常！'
      })
    }
  })
}


// 取出object特定字段组成新的object
export function getPartObj (obj, keysList = []) {
  if (keysList.length === 0) {
    return obj
  } else {
    const result = {}
    keysList.forEach(keyname => {
      Object.keys(obj).forEach(key => {
        if (key === keyname) {
          result[key] = obj[key]
        }
      })
    })
    return result
  }
}

// 将数据处理为id数组
export const returnIds = (list) => {
  if (!list.length) {
    Message.warning({
      message: '请至少选择表格中的一项！'
    })
  }
  return list.map(item => item.id)
}

// 将列表数据处理为逗号分割
export const arrayJoin = (list, str = ',') => list.length
  ? list.join(str)
  : null

// 给多选下拉框删除数据打标签
export const tagDeltData = (oldData, newData, key) => {
  const oldList = JSON.parse(JSON.stringify(oldData))
  const newList = JSON.parse(JSON.stringify(newData))
  // console.log('params', oldList)
  // console.log('params', newList)
  // 自己实现获取被删除的数据
  // const delList = []
  // oldList.forEach((item) => {
  //   if (newList.filter((v) => v[key] === item[key]).length === 0) {
  //     item.delFlag = 1
  //     delList.push(item)
  //   }
  // })
  // 获取被删除的数据，使用lodash会更改oldList所以深拷贝一下
  const delList = _.pullAllBy(JSON.parse(JSON.stringify(oldList)), newList, key)
  delList.forEach(item => item.delFlag = 1)
  console.log('delList', delList)
  // 获取相同的数据，oldList优先
  const sameList = _.intersectionBy(JSON.parse(JSON.stringify(oldList)), newList, key)
  sameList.forEach(item => item.delFlag = 0)
  console.log('sameList', sameList)
  // 获取新增的数据，newList优先
  const addList = _.differenceBy(JSON.parse(JSON.stringify(newList)), oldList, key)
  addList.forEach(item => item.delFlag = 0)
  console.log('addList', addList)
  // 合并结果
  const res = [...delList, ...sameList, ...addList]
  console.log(res)
  return res
}

// 给多选下拉框删除数据打标签
export const tagDeltDataOld = (oldData, newData, key) => {
  // console.log(oldData)
  // console.log(newData)
  const oldList = JSON.parse(JSON.stringify(oldData))
  const newList = JSON.parse(JSON.stringify(newData))
  // 使用lodash获取被删除的数据
  const delList = _.pullAllBy(oldList, newList, key)
  delList.forEach(item => item.delFlag = 1)
  // console.log('delList', delList)
  // 自己实现获取被删除的数据
  // const delList = []
  // oldList.forEach((item) => {
  //   if (newList.filter((v) => v[key] === item[key]).length === 0) {
  //     item.delFlag = 1
  //     delList.push(item)
  //   }
  // })
  newList.forEach(item => item.delFlag = 0)
  // console.log('newList', newList)
  // 合并结果
  const res = [...newList, ...delList]
  // console.log(res)
  return res
}

// 日期处理
export const timeRangeFormat = (timeRange) => {
  if (timeRange && timeRange.length) {
    return [timeRange[0] + ' 00:00:00', timeRange[1] + ' 23:59:59']
  }
  return [null, null]
}