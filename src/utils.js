import _ from 'lodash'

function getStyleNumber(node) {
  const style = window.getComputedStyle(node, null)
  return {
    pl: parseFloat(style.paddingLeft),
    pr: parseFloat(style.paddingRight),
    ml: parseFloat(style.marginLeft),
    mr: parseFloat(style.marginRight),
    bl: parseFloat(style.borderLeftWidth),
    br: parseFloat(style.borderRightWidth)
  }
}

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

function level(array, key, childCounts) {
  for (let i = 0; i < array.length; i++) {
    const children = array[i][key]
    if (children && children.length > 1) {
      childCounts += level(children, key, childCounts)
    }
  }
  return childCounts
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

export function getObjects(obj) {
  const keys = _.keys(obj)
  return keys.map(key => {
    return {
      key: key,
      value: obj[key]
    }
  })
}

export function getNodeWidth(nodes) {
  return _.toArray(nodes).map(node => {
    const offset = node.getBoundingClientRect()
    const style = getStyleNumber(node)
    const innerWidth = offset.width - style.pl - style.pr - style.ml - style.mr
    return {
      width: offset.width,
      innerWidth: innerWidth
    }
  })
}

export function getNodeHeight(nodes) {
  return _.toArray(nodes).map(node => {
    const offset = node.getBoundingClientRect()
    return {
      height: offset.height
    }
  })
}

export function getArray(key, array1, array2) {
  if (array1.length !== array2.length) {
    return console.error('参数错误')
  }
  if (!_.isPlainObject(array1[0])) {
    return console.error('参数错误')
  }
  if (!_.isPlainObject(array2[0])) {
    return console.error('参数错误')
  }
  let array = []
  for (let i = 0; i < array1.length; i++) {
    let value = array1[i][key]
    if (array2[i][key] && value < array2[i][key]) {
      value = array2[i][key]
    }
    array.push({
      [key]: value
    })
  }
  return array
}

export function getSum(key, array1, array2) {
  if (!_.isPlainObject(array1[0])) {
    return console.error('参数错误')
  }
  if (array2 && array1.length !== array2.length) {
    return console.error('参数错误')
  }
  if (array2 && !_.isPlainObject(array2[0])) {
    return console.error('参数错误')
  }
  let sum = 0
  for (let i = 0; i < array1.length; i++) {
    let value = array1[i][key]
    if (array2 && array2[i][key] && value < array2[i][key]) {
      value = array2[i][key]
    }
    sum += value
  }
  return sum
}

export function getFilter(obj, array1, array2) {
  if (!_.isPlainObject(array1[0])) {
    return console.error('参数错误')
  }
  if (array2 && array1.length !== array2.length) {
    return console.error('参数错误')
  }
  if (array2 && !_.isPlainObject(array2[0])) {
    return console.error('参数错误')
  }
  let newArray = []
  let counts = 0
  for (let key in obj) {
    for (let i = 0; i < array1.length; i++) {
      if (array1[i][key] === obj[key]) {
        if (array2) {
          newArray.push(array2[i])
        } else {
          newArray.push(array1[i])
        }
      } else {
        counts += 1
      }
    }
  }
  if (counts === array1.length) {
    newArray = [array1[0]]
    if (array2) {
      newArray = [array2[0]]
    }
  } 
  return newArray
}

export function isSequential(array, obj) {
  let index = _.findIndex(array, obj)
  if (index === -1) {
    return true
  }
  if (index === 0) {
    return getSplice(array, obj)
  }
  return false
}

export function getFlatten(array, key) {
  return flatten(array, key, [])
}

export function getLevels(array, key) {
  return level(array, key, 1)
}
