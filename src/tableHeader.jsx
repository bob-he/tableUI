import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import ReactDOM from 'react-dom'
import Icon from 'iconui'
import classNames from 'classnames'
import {getLevels, getFlatten} from './utils.js'
import _ from 'lodash'

export default createClass({
  propTypes: {
    onDrag: PropTypes.func,
    columns: PropTypes.array,
    heights: PropTypes.array,
    sumheight: PropTypes.number,
    onSort: PropTypes.any,
    ordered: PropTypes.object
  },

  handleSort(key, func) {
    const {ordered} = this.props
    if (typeof this.props.onSort === 'function') {
      this.props.onSort({
        [key]: ordered[key] === 'asc' ? 'desc' : 'asc'
      }, func)
    }
  },

  getCell(columns, rows, index, type) {
    const {ordered, heights, sumheight} = this.props
    const levels = getLevels(columns, 'children')
    let height = sumheight
    if (type) {
      height = heights[index] && heights[index].height
    }
    const thColumns = columns.map((col, i) => {
      let sortIcon = <Icon type="sort" />
      if (ordered[col.key] === 'asc') {
        sortIcon = <Icon type="sortasc" />
      }
      if (ordered[col.key] === 'desc') {
        sortIcon = <Icon type="sortdesc" />
      }
      const sort = (
        <span
          className="table-sort"
          onClick={this.handleSort.bind(this, col.key, col.sort)}
        >
          {sortIcon}
        </span>
      )
      let rowSpan = levels
      let colSpan = col.colSpan
      if (col.children) {
        rowSpan = null
        colSpan = getFlatten(col.children, 'children', 1).length
        this.getCell(col.children, rows, (index + 1), type)
      }
      const style = {
        display: col.colSpan === 0 ? 'none' : ''
      }
      return (
        <th key={i} rowSpan={rowSpan > 1 ? rowSpan : null} colSpan={colSpan > 1 ? colSpan : null} style={style}>
          {col.title}
          {col.sort && sort}
        </th>
      )
    })
    rows.unshift(<tr key={index} style={{height: height}}>{thColumns}</tr>)
    return rows
  },

  render() {
    const {columns, heights} = this.props
    const levels = getLevels(columns, 'children')
    return (
      <thead>
        {this.getCell(columns, [], 0, levels > 1)}
      </thead>
    )
  }
})
