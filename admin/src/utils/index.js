/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
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
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * @param {Object} filter
 * @returns {String}
 */
export function bulidStr(obj) {
  var str = ''
  for (var key in obj) {
    str += key + '=' + obj[key] + '&'
  }
  str = str.substr(0, str.lastIndexOf('&'))
  return str
}

/**
 * @param {Array} // 将获取目录的一维数组转换为二维数组
 * @returns {Array}
 */
export function handleIntoChildren(arr) {
  const rootDirectory = []; const subdirectory = []
  arr.forEach(item => {
    if (item.parentId === 'root') {
      item.children = []
      rootDirectory.push(item)
    } else {
      subdirectory.push(item)
    }
  })

  subdirectory.forEach(sub_item => {
    rootDirectory.some(root_item => {
      if (root_item.menuId === sub_item.parentId) {
        sub_item.parentName = root_item.menuName
        root_item.children.push(sub_item)
        return true
      }

      return false
    })
  })

  return rootDirectory
}

/**
 * @param {obj1, obj2} // 将获取目录的一维数组转换为二维数组
 * @returns {Object}
 */
export function handleCopyObject(obj1, obj2) {
  const _key = Object.keys(obj2)

  _key.forEach(item => {
    if (obj1.hasOwnProperty(item)) {
      obj1[item] = obj2[item]
    }
  })

  return obj1
}

/**
 * @param {int} 随机生成密码
 * @returns {String}
 */
export function randomPassword(size) {
  const seed = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'Q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '2', '3', '4', '5', '6', '7', '8', '9'
  ] // 数组
  const seedlength = seed.length// 数组长度
  var createPassword = ''
  for (let i = 0; i < size; i++) {
    const j = Math.floor(Math.random() * seedlength)
    createPassword += seed[j]
  }
  return createPassword
}
