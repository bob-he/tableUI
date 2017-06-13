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

export function setNodeOffset(nodes, tag) {
  const offsets = _.toArray(nodes).map(node => {
    let childNode = node
    if (tag) {
      childNode = node.querySelector('div')
    }
    const offset = node.getBoundingClientRect()
    const childOffset = childNode.getBoundingClientRect()
    const style = getStyleNumber(childNode)
    const innerWidth = childOffset.width - style.pl - style.pr - style.ml - style.mr
    return {
      key: childNode.id,
      height: offset.height,
      width: innerWidth > 50 ? innerWidth : 50,
      offsetWidth: childOffset.width
    }
  })
  return offsets
}
