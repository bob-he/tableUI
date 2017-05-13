import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import {setHeaderOffset} from './utils.js'
import _ from 'lodash'
import './style.css'

export default React.createClass({
  propTypes: {
    columns: PropTypes.array,
    offsets: PropTypes.array,
    isFixedCloumn: PropTypes.bool
  },

  getInitialState() {
    return {
      offsets: []
    }
  },

  render() {
    const {columns, isFixedCloumn, offsets} = this.props
    const thColumns = columns.map((col, i) => {
      return (!isFixedCloumn || col.fixed) ? (
        <th key={col.key}
          style={{height: offsets[i] && offsets[i].height}}
        >
          <div style={{width: offsets[i] && offsets[i].width}}>
            {col.title}
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
