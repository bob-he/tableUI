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
      width: innerWidth,
      offsetWidth: offset.width
    }
  })
  return offsets
}
