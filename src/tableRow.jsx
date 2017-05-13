import React, {PropTypes} from 'react'
import classNames from 'classnames'
import TableCell from './tableCell.jsx'
import _ from 'lodash'
import './style.css'

export default React.createClass({
  propTypes: {
    isFixedCloumn: PropTypes.bool,
    className: PropTypes.string,
    onMouseover: PropTypes.func,
    onMouseout: PropTypes.func,
    columns: PropTypes.array,
    height: PropTypes.number,
    data: PropTypes.object
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
    const {isFixedCloumn, columns, data} = this.props
    return columns.map((col, i) => {
      let value = data[col.key]
      if (col.render) {
        value = col.render(data[col.key], data, i)
      }
      const expandIcon = <span className="table-row-expand-icon">＋</span>
      const expandIndent = <span className="table-row-indent"></span>
      return (!isFixedCloumn || col.fixed) && (
        <TableCell key={i} value={value}
          expandIcon={i === 0 && (data.isChild ? expandIndent : expandIcon)} />
      )
    })
  },

  render() {
    const {height, className, data} = this.props
    return (
      <tr className={className}
        style={{height: height, display: data.isChild ? 'none' : ''}}
        onMouseOut={this.handleRowMouseout}
        onMouseOver={this.handleRowMouseover}
      >
        {this.renderTableTell()}
      </tr>
    )
  }
})
