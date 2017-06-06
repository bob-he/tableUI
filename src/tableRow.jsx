import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import classNames from 'classnames'
import TableCell from './tableCell.jsx'
import _ from 'lodash'
import './style.css'

export default createClass({
  propTypes: {
    isFixedCloumn: PropTypes.bool,
    expandStatus: PropTypes.bool,
    className: PropTypes.string,
    onMouseover: PropTypes.func,
    onMouseout: PropTypes.func,
    onExpand: PropTypes.func,
    expandIndent: PropTypes.any,
    expandIcon: PropTypes.any,
    columns: PropTypes.array,
    isfixed: PropTypes.bool,
    height: PropTypes.number,
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
    let {isfixed, isFixedCloumn, columns, row, expandIcon, expandIndent} = this.props
    columns = (isFixedCloumn && isfixed) ? columns.slice(0, 1) : columns
    return columns.map((col, i) => {
      let value = row[col.key]
      if (col.render) {
        value = col.render(row[col.key], row)
      }
      return (!isFixedCloumn || col.fixed || isfixed) && (
        <TableCell
          key={col.key}
          value={value}
          expandIndent={i === 0 && expandIndent}
          expandIcon={i === 0 && expandIcon} />
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
