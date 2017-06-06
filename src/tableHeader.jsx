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
    isfixed: PropTypes.bool,
    columns: PropTypes.array,
    offsets: PropTypes.array,
    onSort: PropTypes.func,
    isFixedCloumn: PropTypes.bool
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
      if (this.props.onSort) {
        this.props.onSort(key, sort)
      }
    })
  },

  render() {
    const {sorted} = this.state
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
      return (!isFixedCloumn || col.fixed || isfixed) ? (
        <th key={col.key}
          style={{height: offsets[i] && offsets[i].height}}
        >
          <div className={col.className} style={{width: offsets[i] && offsets[i].width}}>
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
