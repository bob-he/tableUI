import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import classNames from 'classnames'
import TableCell from './tableCell.jsx'
import _ from 'lodash'

export default createClass({
  propTypes: {
    expandStatus: PropTypes.bool,
    className: PropTypes.string,
    onMouseover: PropTypes.func,
    onMouseout: PropTypes.func,
    onExpand: PropTypes.func,
    expandIndent: PropTypes.any,
    expandIcon: PropTypes.any,
    columns: PropTypes.array,
    height: PropTypes.number,
    index: PropTypes.number,
    row: PropTypes.object
  },

  handleExpand() {
    const {expandStatus} = this.props
    if (this.props.onExpand) {
      this.props.onExpand()
    }
  },

  handleRowMouseover() {
    if (this.props.onMouseover) {
      this.props.onMouseover()
    }
  },

  handleRowMouseout() {
    if (this.props.onMouseout) {
      this.props.onMouseout()
    }
  },

  renderTableTell() {
    let {columns, row, index, expandIcon, expandIndent} = this.props
    return columns.map((col, i) => {
      let children = {}
      children.value = row[col.key]
      if (col.render) {
        const result = col.render(row[col.key], row, index)
        children.value = result.children || result
        children.props = result.children ? result.props : {}
      }
      return (
        <TableCell
          {...children.props}
          key={col.key}
          expandIndent={i === 0 && expandIndent}
          expandIcon={i === 0 && expandIcon}
        >
          {children.value}
        </TableCell>
      )
    })
  },

  render() {
    const {height, className, row} = this.props
    return (
      <tr className={className}
        style={{height: height}}
        onClick={this.handleExpand}
        onMouseOut={this.handleRowMouseout}
        onMouseOver={this.handleRowMouseover}
      >
        {this.renderTableTell()}
      </tr>
    )
  }
})
