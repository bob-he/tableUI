import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import classNames from 'classnames'
import _ from 'lodash'

export default createClass({
  propTypes: {
    rowSpan: PropTypes.number,
    children: PropTypes.any,
    expandIcon: PropTypes.any,
    expandIndent: PropTypes.any
  },

  render() {
    const {children, rowSpan, expandIcon, expandIndent} = this.props
    return rowSpan !== 0 && (
      <td rowSpan={rowSpan}>
        {expandIndent}
        {expandIcon}
        {children}
      </td>
    )
  }
})
