import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'

export default createClass({
  propTypes: {
    columns: PropTypes.array,
    widths: PropTypes.array
  },

  render() {
    const {columns, widths} = this.props
    const colgroup = columns.map((col, i) => {
      const width = widths[i] && widths[i].width
      return (
        <col key={col.key} style={{width: width, minWidth: width}} />
      )
    })
    return <colgroup>{colgroup}</colgroup>
  }
})
