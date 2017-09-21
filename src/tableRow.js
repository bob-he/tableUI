import React from 'react'
import PropTypes from 'prop-types'
import TableCell from './tableCell.js'
import _ from 'lodash'

export default class TableHeader extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    onMouseover: PropTypes.func,
    onMouseout: PropTypes.func,
    onExpand: PropTypes.func,
    expandIndent: PropTypes.any,
    expandIcon: PropTypes.any,
    columns: PropTypes.array,
    height: PropTypes.number,
    index: PropTypes.number,
    row: PropTypes.object,
    nextRow: PropTypes.object,
    prevRow: PropTypes.object
  }

  handleExpand = () => {
    if (this.props.onExpand) {
      this.props.onExpand()
    }
  }

  handleRowMouseover = () => {
    if (this.props.onMouseover) {
      this.props.onMouseover()
    }
  }

  handleRowMouseout = () => {
    if (this.props.onMouseout) {
      this.props.onMouseout()
    }
  }

  renderTableTell = () => {
    let {columns, row, prevRow, nextRow, index, expandIcon, expandIndent} = this.props
    return columns.map((col, i) => {
      let value = row[col.key]
      let rowSpan = null
      if (col.render) {
        const result = col.render(row[col.key], row, index)
        value = result.children || result
        rowSpan = result.rowSpan
        if (rowSpan > 1 && nextRow) {
          const nextResult = col.render(nextRow[col.key], nextRow, index)
          if (nextResult.rowSpan !== 0 && result.key !== nextResult.key) {
            rowSpan = null
          }
        }
        if (rowSpan === 0 && prevRow) {
          const prevResult = col.render(prevRow[col.key], prevRow, index)
          if (!prevResult.rowSpan && prevResult.rowSpan !== 0 && result.key !== prevResult.key) {
            rowSpan = null
          }
        }
      }
      let obj = _.find(columns, {key: col.key})
      return (
        <TableCell
          key={col.key}
          rowSpan={rowSpan}
          expandIndent={i === 0 && obj.fixed === 'left' && expandIndent}
          expandIcon={i === 0 && obj.fixed === 'left' && expandIcon}
        >
          {value}
        </TableCell>
      )
    })
  }

  render () {
    const {height, className} = this.props
    return (
      <tr className={className}
        style={{height: height}}
        onClick={this.handleExpand}
        onMouseLeave={this.handleRowMouseout}
        onMouseEnter={this.handleRowMouseover}
      >
        {this.renderTableTell()}
      </tr>
    )
  }
}
