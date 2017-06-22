import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import classNames from 'classnames'
import _ from 'lodash'

export default createClass({
  propTypes: {
    value: PropTypes.any,
    expandIcon: PropTypes.any,
    expandIndent: PropTypes.any
  },

  render() {
    const {value, expandIcon, expandIndent} = this.props
    return (
      <td>
        {expandIndent}
        {expandIcon}
        {value}
      </td>
    )
  }
})
