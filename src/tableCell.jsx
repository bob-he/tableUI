import React, {PropTypes} from 'react'
import classNames from 'classnames'
import _ from 'lodash'
import './style.css'

export default React.createClass({
  propTypes: {
    value: PropTypes.any,
    expandIcon: PropTypes.any
  },

  render() {
    const {value, expandIcon} = this.props
    return (
      <td>
        {expandIcon}
        {value}
      </td>
    )
  }
})
