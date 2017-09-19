import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'iconui'
import {getLevels, getFlatten} from './utils.js'

export default class TableHeader extends React.Component {
  static propTypes = {
    columns: PropTypes.array,
    heights: PropTypes.array,
    sumheight: PropTypes.number,
    onSort: PropTypes.any,
    ordered: PropTypes.object
  }

  handleSort = (key, func) => {
    const {ordered} = this.props
    if (typeof this.props.onSort === 'function') {
      this.props.onSort({
        [key]: ordered[key] === 'asc' ? 'desc' : 'asc'
      }, func)
    }
  }

  getCell = (columns, rows, index, type) => {
    let {ordered, heights, sumheight} = this.props
    let levels = getLevels(columns, 'children')
    let height = sumheight
    if (type) {
      height = heights[index] && heights[index].height
    }
    let thColumns = columns.map((col, i) => {
      let sortIcon = <Icon type="sort" />
      if (ordered[col.key] === 'asc') {
        sortIcon = <Icon type="sortasc" />
      }
      if (ordered[col.key] === 'desc') {
        sortIcon = <Icon type="sortdesc" />
      }
      let sort = (
        <span className="table-sort">{sortIcon}</span>
      )
      let rowSpan = levels
      let colSpan = col.colSpan
      if (col.children) {
        rowSpan = null
        colSpan = getFlatten(col.children, 'children', 1).length
        this.getCell(col.children, rows, (index + 1), type)
      }
      let style = {
        display: col.colSpan === 0 ? 'none' : ''
      }
      let sortEvent = {}
      if (col.sort) {
        sortEvent = {
          onClick: this.handleSort.bind(this, col.key, col.sort)
        }
      }
      return (
        <th
          key={i}
          style={style}
          rowSpan={rowSpan > 1 ? rowSpan : null}
          colSpan={colSpan > 1 ? colSpan : null}
          {...sortEvent}
        >
          {col.title}
          {col.sort && sort}
        </th>
      )
    })
    rows.unshift(<tr key={index} style={{height: height}}>{thColumns}</tr>)
    return rows
  }

  render () {
    const {columns} = this.props
    const levels = getLevels(columns, 'children')
    return (
      <thead>
        {this.getCell(columns, [], 0, levels > 1)}
      </thead>
    )
  }
}
