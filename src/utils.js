import _ from 'lodash'

function getStyleNumber(node) {
  const style = window.getComputedStyle(node, null)
  return {
    pl: parseFloat(style.paddingLeft),
    pr: parseFloat(style.paddingRight),
    ml: parseFloat(style.marginLeft),
    mr: parseFloat(style.marginRight),
  }
}

export function setNodeOffset(nodes) {
  const offsets = _.toArray(nodes).map(node => {
    const offset = node.getBoundingClientRect()
    const style = getStyleNumber(node)
    const innerWidth = offset.width - style.pl - style.pr - style.ml - style.mr
    return {
      height: offset.height,
      width: innerWidth
    }
  })
  return offsets
}

// export function formatterData(data, child, index) {
//   let newData = []
//   data.forEach((item, i) => {
//     newData.push(item)
//     if (i === index) {
//       newData = newData.concat(child.map(child => {
//         return {
//           ...child,
//           isChild: true
//         }
//       }))
//     }
//   })
//   return newData
// }

export function formatterData(data, rowkey, row) {
  let newData = []
  data.forEach((item, i) => {
    newData.push(item)
    if (item.children) {
      newData = newData.concat(item.children.map(child => {
        return {
          ...child,
          isExpand: item.isExpand,
          isChild: true
        }
      }))
    }
  })
  return newData
}