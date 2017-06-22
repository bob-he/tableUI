import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import ReactDOM from 'react-dom'
import Icon from 'iconui'
import classNames from 'classnames'
import {setHeaderOffset} from './utils.js'
import _ from 'lodash'

export default createClass({
  propTypes: {
    onDrag: PropTypes.func,
    columns: PropTypes.array,
    heights: PropTypes.array,
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

  render() {
    const {ordered, columns, heights} = this.props
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
      const height = heights[i] && heights[i].height
      return (
        <th key={col.key} style={{height: height}}>
          {col.title}
          {col.sort && sort}
        </th>
      )
    })
    return (
      <thead>
        <tr>{thColumns}</tr>
      </thead>
    )
  }
})
