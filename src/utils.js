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
