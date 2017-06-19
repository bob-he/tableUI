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
      lineColor: {},
      lineLeft: {},
      lineTop: {},
      linePos: {},
      sorted: {},
      axisX: {},
      aaaaa: {}
    }
  },

  componentDidMount() {
    window.addEventListener('mouseup', this.handleMouseup)
  },

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleOnMousemove)
  },

  handleMousedown(index, e) {
    if (e.button === 2 || e.button === 3) {
      return
    }
    const node = e.target.getBoundingClientRect()
    this.isMouseDown = true
    const {axisX} = this.state
    this.setState({
      linePos: {
        [index]: 'fixed'
      },
      lineLeft: {
        [index]: node.left
      },
      lineTop: {
        [index]: node.top
      },
      lineColor: {
        [index]: '1px dotted #FF0000'
      },
      cursor: 'move',
      currentIndex: index,
      pageX: e.pageX
    }, () => {
      if (!this.moveHandler) {
        this.moveHandler = true
        window.addEventListener('mousemove', this.handleOnMousemove)
      }
    })
  },

  handleMouseup() {
    const {axisX, currentIndex} = this.state
    if (!this.isMouseDown) {
      return
    }
    this.isMouseDown = false
    this.setState({
      'cursor': 'default',
      linePos: {
        [currentIndex]: 'absolute'
      },
      lineLeft: {
        [currentIndex]: 'auto'
      },
      lineTop: {
        [currentIndex]: 0
      },
      lineColor: {
        [currentIndex]: 'none'
      },
      aaaaa: {
        [currentIndex]: 0
      },
      axisX: 0
    }, () => {
      window.removeEventListener('mousemove', this.handleOnMousemove)
      this.moveHandler = false
      if (typeof this.props.onDrag === 'function') {
        this.props.onDrag(currentIndex, axisX)
      }
    })
  },

  handleOnMousemove(e) {
    const {pageX, currentIndex} = this.state
    this.setState({
      axisX: e.pageX - pageX,
      aaaaa: {
        [currentIndex]: e.pageX - pageX
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
          style={{transform: `translate(${this.state.aaaaa[i]}px, 0px)`, borderRight: this.state.lineColor[i], cursor: cursor, left: this.state.lineLeft[i], top: this.state.lineTop[i], position: this.state.linePos[i]}}
          className="table-drag-flag"
          onMouseUp={this.handleMouseup}
          onMouseDown={this.handleMousedown.bind(this, i)}>
        </span>
      )
      return (
        <th key={col.key} style={{height: heights[i] && heights[i].height}}>
          {col.title}
          {col.sort && sort}
          {dragFlag}
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
