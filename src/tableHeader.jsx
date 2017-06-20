import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import ReactDOM from 'react-dom'
import Icon from 'iconui'
import classNames from 'classnames'
import {setHeaderOffset} from './utils.js'
import _ from 'lodash'
import './style.css'

export default createClass({
  propTypes: {
    onDrag: PropTypes.func,
    columns: PropTypes.array,
    heights: PropTypes.array,
    onSort: PropTypes.func
  },

  getInitialState() {
    return {
      sorted: {}
    }
  },

  handleSort(key) {
    const {sorted} = this.state
    const sort = sorted[key] === 'asc' ? 'desc' : 'asc'
    this.setState({
      sorted: {
        [key]: sort
      }
    }, () => {
      if (typeof this.props.onSort === 'function') {
        this.props.onSort(key, sort)
      }
    })
  },

  render() {
    const {sorted} = this.state
    let {columns, heights} = this.props
    const thColumns = columns.map((col, i) => {
      let sortIcon = <Icon type="sort" />
      if (sorted[col.key] === 'asc') {
        sortIcon = <Icon type="sortasc" />
      }
      if (sorted[col.key] === 'desc') {
        sortIcon = <Icon type="sortdesc" />
      }
      const sort = (
        <span className="table-sort" onClick={this.handleSort.bind(this, col.key)}>
        {sortIcon}
        </span>
      )
      return (
        <th key={col.key} style={{height: heights[i] && heights[i].height}}>
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
