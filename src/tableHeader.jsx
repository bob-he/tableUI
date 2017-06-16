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
      moveDistance: {},
      thWidths: {},
      sorted: {},
      axisX: {}
    }
  },

  componentDidMount() {
    window.addEventListener('mouseup', this.handleMouseup)
  },

  handleMousedown(key, e) {
    if (e.button === 2 || e.button === 3) {
      return
    }
    this.isMouseDown = true
    const {axisX, moveDistance} = this.state
    this.setState({
      cursor: 'move',
      currentKey: key,
      pageX: e.pageX,
      axisX: {
        ...axisX,
        [key]: 0
      },
      moveDistance: {
        ...moveDistance,
        [key]: 0
      },
    }, () => {
      if (!this.moveHandler) {
        this.moveHandler = true
        window.addEventListener('mousemove', this.handleOnMousemove)
      }
    })
  },

  handleMouseup() {
    if (!this.isMouseDown) {
      return
    }
    this.isMouseDown = false
    const {moveDistance, thWidths, currentKey, thWidthsSource} = this.state
    const width = thWidths[currentKey] + moveDistance[currentKey]
    this.setState({
      'cursor': 'default',
      'thWidths': {
        ...thWidths,
        [currentKey]: width > thWidthsSource[currentKey] ? width : thWidthsSource[currentKey]
      }
    }, () => {
      window.removeEventListener('mousemove', this.handleOnMousemove)
      this.moveHandler = false
      if (typeof this.props.onDrag === 'function') {
        this.props.onDrag()
      }
    })
  },

  handleOnMousemove(e) {
    const {moveDistance, pageX, currentKey} = this.state
    const axisX = e.pageX - pageX
    this.setState({
      moveDistance: {
        ...moveDistance,
        [currentKey]: axisX
      }
    })
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
    const {cursor, axisX, sorted, thWidths} = this.state
    let {isfixed, columns, isFixedCloumn, heights} = this.props
    columns = isfixed ? columns.slice(0, 1) : columns
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
      const thClass = classNames('table-title', col.className)
      const dragFlag = (
        <span
          style={{cursor: cursor}}
          className="table-drag-flag"
          onMouseUp={this.handleMouseup}
          onMouseDown={this.handleMousedown.bind(this, col.key)}>
        </span>
      )
      return (
        <th key={col.key} style={{height: heights[i] && heights[i].height}}>
          {col.title}
          {col.sort && sort}
          {i !== 0 && i !== (columns.length - 1) && dragFlag}
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
