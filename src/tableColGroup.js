import React from 'react'
import PropTypes from 'prop-types'

export default class TableColGroup extends React.Component {
  static propTypes = {
    columns: PropTypes.array,
    widths: PropTypes.array
  }

  render () {
    const {columns, widths} = this.props
    const colgroup = columns.map((col, i) => {
      const width = widths[i] || col.width
      return (
        <col key={col.key} style={{width: width, minWidth: width}} />
      )
    })
    return <colgroup>{colgroup}</colgroup>
  }
}
