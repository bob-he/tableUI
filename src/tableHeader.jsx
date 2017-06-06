import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import {setHeaderOffset} from './utils.js'
import _ from 'lodash'
import './style.css'

export default createClass({
  propTypes: {
    isfixed: PropTypes.bool,
    columns: PropTypes.array,
    offsets: PropTypes.array,
    isFixedCloumn: PropTypes.bool
  },

  getInitialState() {
    return {
      sorted: {}
    }
  },

  handleSort(key) {
    const {sorted} = this.state
    this.setState({
      sorted: {
        [key]: sorted[key] === 'asc' ? 'desc' : 'asc'
      }
    })
  },

  render() {
    const {sorted} = this.state
    let {isfixed, columns, isFixedCloumn, offsets} = this.props
    columns = isfixed ? columns.slice(0, 1) : columns
    const thColumns = columns.map((col, i) => {
      let sortIcon = '◆'
      if (sorted[col.key] === 'asc') {
        sortIcon = '↑'
      }
      if (sorted[col.key] === 'desc') {
        sortIcon = '↓'
      }
      const sort = (
        <span className="table-sort" onClick={this.handleSort.bind(this, col.key)}>
        {sortIcon}
        </span>
      )
      return (!isFixedCloumn || col.fixed || isfixed) ? (
        <th key={col.key}
          style={{height: offsets[i] && offsets[i].height}}
        >
          <div style={{width: offsets[i] && offsets[i].width}}>
            {col.title}
            {col.sort && sort}
          </div>
        </th>
      ) : null
    })
    return (
      <thead>
        <tr>{thColumns}</tr>
      </thead>
    )
  }
})
