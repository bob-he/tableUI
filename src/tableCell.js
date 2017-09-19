import React from 'react'
import PropTypes from 'prop-types'

export default class TableCell extends React.Component {
  static propTypes = {
    rowSpan: PropTypes.number,
    children: PropTypes.any,
    expandIcon: PropTypes.any,
    expandIndent: PropTypes.any
  }

  render () {
    const {children, rowSpan, expandIcon, expandIndent} = this.props
    return rowSpan !== 0 && (
      <td rowSpan={rowSpan > 1 ? rowSpan : null}>
        {expandIndent}
        {expandIcon}
        {children}
      </td>
    )
  }
}
