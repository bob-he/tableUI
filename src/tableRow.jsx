import React, {PropTypes} from 'react'
import classNames from 'classnames'
import TableCell from './tableCell.jsx'
import _ from 'lodash'
import './style.css'

export default React.createClass({
  propTypes: {
    isFixedCloumn: PropTypes.bool,
    expandStatus: PropTypes.bool,
    className: PropTypes.string,
    onMouseover: PropTypes.func,
    onMouseout: PropTypes.func,
    expandIndent: PropTypes.any,
    expandIcon: PropTypes.any,
    columns: PropTypes.array,
    height: PropTypes.number,
    row: PropTypes.object
  },

  handleExpand(data, index) {
    const {expandStatus} = this.props
    if (this.props.onExpand) {
      this.props.onExpand(data, expandStatus, index)
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
    const {isFixedCloumn, columns, row, expandIcon, expandIndent} = this.props
    return columns.map((col, i) => {
      let value = row[col.key]
      if (col.render) {
        value = col.render(row[col.key], row)
      }
      return (!isFixedCloumn || col.fixed) && (
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
        onMouseOut={this.handleRowMouseout}
        onMouseOver={this.handleRowMouseover}
      >
        {this.renderTableTell()}
      </tr>
    )
  }
})
