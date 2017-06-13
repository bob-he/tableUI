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
    offsets: PropTypes.array,
    onSort: PropTypes.func
  },

  getInitialState() {
    return {
      thWidths: {},
      sorted: {},
      axisX: {}
    }
  },

  componentWillUpdate(nextProps) {
    if (this.props.offsets !== nextProps.offsets) {
      const {columns, offsets} = nextProps
      const thWidths = {}
      columns.forEach((col, i) => {
        thWidths[col.key] = col.width || offsets[i] && offsets[i].width
      })
      this.setState({
        thWidths: thWidths
      })
    }
  },

  handleMousedown(key, e) {
    if (e.button === 2 || e.button === 3) {
      return
    }
    const node = e.target.parentNode
    const width = node.querySelector('.table-title').offsetWidth
    this.setState({
      cursor: 'crosshair',
      currentKey: key,
      pageX: e.pageX,
      axisX: {
        ...this.state.axisX,
        [key]: 0
      },
      downWidths: {
        ...this.state.thWidths,
        [key]: width
      }
    }, () => {
      if (!this.moveHandler) {
        this.moveHandler = true
        window.addEventListener('mousemove', this.handleOnMousemove)
      }
    })
  },

  handleMouseup() {
    this.setState({
      'cursor': 'default'
    }, () => {
      window.removeEventListener('mousemove', this.handleOnMousemove)
      this.moveHandler = false
    })
  },

  handleOnMousemove(e) {
    const {thWidths, downWidths, pageX, currentKey} = this.state
    const axisX = e.pageX - pageX
    this.setState({
      thWidths: {
        ...thWidths,
        [currentKey]: downWidths[currentKey] + axisX
      }
    }, () => {
      if (typeof this.props.onDrag === 'function') {
        this.props.onDrag()
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
    let {isfixed, columns, isFixedCloumn, offsets} = this.props
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
      const offset = _.find(offsets, {key: col.key})
      const width = thWidths[col.key] || (col.width || offset && offset.width)
      return (
        <th key={col.key}
          style={{height: offset && offset.height}}
        >
          <div id={col.key} className={thClass} style={{width: width}}>
            {col.title}
            {col.sort && sort}
          </div>
          <span style={{cursor: cursor}} onMouseUp={this.handleMouseup} onMouseDown={this.handleMousedown.bind(this, col.key)} className="table-drag-flag"></span>
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
