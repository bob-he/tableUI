import _ from 'lodash'

function getSplice(array, obj) {
  if (array.length === 1) {
    return true
  }
  let newArray = _.clone(array, true)
  newArray.splice(0, 1)
  const index = _.findIndex(newArray, obj)
  if (index > 0) {
    return false
  }
  return getSplice(newArray, obj)
}

function getRightSplice(array, obj) {
  if (array.length === 1) {
    return true
  }
  let newArray = _.clone(array, true)
  newArray.pop()
  const index = _.findLastIndex(newArray, obj)
  if (index > 0) {
    return false
  }
  return getRightSplice(newArray, obj)
}

function level(array, key, childCounts) {
  let counts = childCounts
  for (let i = 0; i < array.length; i++) {
    const children = array[i][key]
    if (children && children.length > 1) {
      counts += level(children, key, counts)
    }
  }
  return counts
}

function flatten(array, key, newArray) {
  for (let i = 0; i < array.length; i++) {
    const children = array[i][key]
    if (children && children.length > 1) {
      flatten(children, key, newArray)
    } else {
      newArray.push(array[i])
    }
  }
  return newArray
}

export function getStyleNumber(node) {
  const style = window.getComputedStyle(node, null)
  return {
    paddingLeft: parseFloat(style.paddingLeft) || 0,
    paddingRight: parseFloat(style.paddingRight) || 0,
    marginLeft: parseFloat(style.marginLeft) || 0,
    marginRight: parseFloat(style.marginRight) || 0,
    borderWidth: parseFloat(style.borderWidth) || 0,
    borderLeftWidth: parseFloat(style.borderLeftWidth) || 0,
    borderRightWidth: parseFloat(style.borderRightWidth) || 0
  }
}

export function getObject(obj) {
  if (!obj) {
    return obj
  }
  const keys = _.keys(obj)
  return {
    key: keys[0],
    value: obj[keys[0]]
  }
}

// 判断columns配置是否正确
export function isSequential(array, obj) {
  let index = _.findIndex(array, obj)
  let lastIndex = _.findLastIndex(array, obj)
  if (index === -1) {
    return true
  }
  if (index === 0) {
    return getSplice(array, obj)
  }
  if (lastIndex === (array.length - 1)) {
    return getRightSplice(array, obj)
  }
  return false
}

// 将嵌套数组的维数减少
export function getFlatten(array, key) {
  return flatten(array, key, [])
}

// 获取层级
export function getLevels(array, key) {
  return level(array, key, 1)
}
