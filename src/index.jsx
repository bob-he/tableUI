import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import TableHeader from './tableHeader.jsx'
import TableRow from './tableRow.jsx'
import {setNodeOffset, formatterData} from './utils.js'
import _ from 'lodash'
import './style.css'

export default React.createClass({
  propTypes: {
    columns: React.PropTypes.array,
    width: React.PropTypes.string,
    data: React.PropTypes.array,
    rowKey: React.PropTypes.func,
    className: React.PropTypes.string,
    fixedHeader: React.PropTypes.bool
  },

  getInitialState() {
    return {
      fixedHeaderPosition: 'absolute',
      tableScrollShadow: true,
      columnOffsets: [],
      rowOffsets: [],
      rowStyles: {},
      expandRows: {},
      fixedRowKey: ''
    }
  },

  componentDidMount() {
    const {fixedHeader, columns} = this.props
    if (fixedHeader) {
      window.onscroll = this.handleScroll
    }
    if (this.refs.scroll) {
      this.refs.scroll.onscroll = this.handleHorizontalScroll
    }
    const index = _.findIndex(columns, 'fixed')
    if (index > -1 || fixedHeader) {
      this.setTableOffset()
    }
  },

  componentWillUnmount() {
    window.onscroll = null
    this.refs.scroll.onscroll = null
  },

  setTableOffset() {
    const tableOffset = this.refs.table.getBoundingClientRect()
    const tableTbody = ReactDOM.findDOMNode(this.refs.tableTbody)
    const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader)
    this.setState({
      rowOffsets: setNodeOffset(tableTbody.querySelectorAll('tr')),
      columnOffsets: setNodeOffset(tableHeader.querySelectorAll('th')),
      tableWidth: tableOffset.width
    })
  },

  handleExpand(key) {
    const {expandRows} = this.state
    this.setState({
      expandRows: {
        ...expandRows,
        [key]: !expandRows[key]
      }
    }, () => {
      const {fixedHeader, columns} = this.props
      const index = _.findIndex(columns, 'fixed')
      if (index > -1 || fixedHeader) {
        this.setTableOffset()
      }
    })
  },

  handleRowMouseover(key) {
    this.setState({
      rowStyles: {
        [key]: 'table-row-hover'
      }
    })
  },

  handleRowMouseout() {
    this.setState({
      rowStyles: {}
    })
  },

  handleScroll() {
    let {expandRows, fixedRowKey} = this.state
    const tableOffset = this.refs.table.getBoundingClientRect()
    const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader)
    const tableHeaderOffset = tableHeader.getBoundingClientRect()
    for(let key in expandRows) {
      if (expandRows[key]) {
        const node = ReactDOM.findDOMNode(this.refs[`tr_${key}`])
        const nodeOffset = node.getBoundingClientRect()
        if (nodeOffset.top === tableHeaderOffset.height) {
          fixedRowKey = key
        }
      }
    }
    const position = tableOffset.top > 0 ? 'absolute' : 'fixed'
    this.setState({
      fixedRowKey: fixedRowKey,
      tableWidth: tableOffset.width,
      fixedHeaderPosition: position
    })
  },

  handleHorizontalScroll() {
    const {tableWidth} = this.state
    const {fixedHeader} = this.props
    const {scrollLeft, scrollWidth} = this.refs.scroll
    this.setState({
      'tableFixedColumnShadow': scrollLeft > 0,
      'tableScrollShadow': (tableWidth + scrollLeft) !== scrollWidth
    })
    if (fixedHeader) {
      this.refs.headerScroll.scrollLeft = scrollLeft
    }
  },

  getRows(isFixedCloumn, data, indentIndex) {
    const {columns, rowKey} = this.props
    const {rowStyles, rowOffsets, expandRows} = this.state
    let rows = []
    for (let i = 0; i < data.length; i++) {
      const key = rowKey(data[i])
      const rowRef = expandRows[key] ? `tr_${key}` : ''
      const children = data[i].children
      const rowClass = classNames(
        rowStyles[key],
        {'table-row-selected': expandRows[key]}
      )
      const expandInner = expandRows[key] ? '－' : '＋'
      const expandIcon = (
        <span className="table-row-expand-icon" 
          onClick={this.handleExpand.bind(this, key)}>
          {expandInner}
        </span>
      )
      const expandIndentStyle = {paddingLeft: 25 * indentIndex}
      const expandIndent = <span style={expandIndentStyle}></span>
      const rowHeight = rowOffsets[key] && rowOffsets[key].height
      rows.push(
        <TableRow
          key={key}
          ref={rowRef}
          row={data[i]}
          columns={columns}
          height={rowHeight}
          className={rowClass}
          isFixedCloumn={isFixedCloumn}
          expandIcon={children && expandIcon}
          expandIndent={expandIndent}
          onMouseout={this.handleRowMouseout}
          onMouseover={this.handleRowMouseover.bind(this, key)} />
      )
      if (children && expandRows[key]) {
        indentIndex += 1
        rows = rows.concat(this.getRows(isFixedCloumn, children, indentIndex))
        indentIndex -= 1
      }
    }
    return rows
  },

  // 表格boody
  renderBody(isFixedCloumn) {
    let {data, rowKey} = this.props
    const {fixedRowKey} = this.state
    const fixedRow = _.filter(data, (row) => {
      return rowKey(row) === fixedRowKey
    })
    if (fixedRowKey && fixedRow.length > 0) {
      data = fixedRow
    }
    const rows = this.getRows(isFixedCloumn, data, 0)
    return (
      <tbody ref={isFixedCloumn ? '' : 'tableTbody'}>{rows}</tbody>
    )
  },

  renderColGroup(isFixedCloumn) {
    const {columns} = this.props
    const {columnOffsets} = this.state
    const colgroup = columns.map((col, i) => {
      return (!isFixedCloumn || col.fixed) ? (
        <col style={{width: columnOffsets[i] && columnOffsets[i].width}} key={col.key} />
      ) : null
    })
    return <colgroup>{colgroup}</colgroup>
  },

  // 表格
  renderTable(isFixedHeader) {
    const {width, columns} = this.props
    const {tableFixedColumnShadow, tableScrollShadow, columnOffsets} = this.state
    const index = _.findIndex(columns, 'fixed')
    if (index > 0) {
      return console.error('请正确配置columns')
    }
    const fixedColumnStyle = classNames(
      'table-fixed-column',
      {'table-fixed-column-shadow': tableFixedColumnShadow}
    )
    const fixedColumn = (
      <div className={fixedColumnStyle}>
        <table className="table" width={width}>
          {this.renderColGroup(true)}
          <TableHeader isFixedCloumn
            columns={columns}
            offsets={columnOffsets}
            isFixedHeader={isFixedHeader} />
          {!isFixedHeader && this.renderBody(true)}
        </table>
      </div>
    )
    const headerRef = isFixedHeader ? `headerScroll` : `scroll`
    const tableScrollStyle = classNames(
      {'table-scroll': index > -1},
      {'table-scroll-shadow': index > -1 && tableScrollShadow}
    )
    return (
      <div style={{position: 'relative'}}>
        {index > -1 && fixedColumn}
        <div ref={headerRef} className={tableScrollStyle}>
          <table className="table" width={width}>
            {this.renderColGroup()}
            <TableHeader columns={columns}
              ref={isFixedHeader ? '' : 'tableHeader'}
              isFixedHeader={isFixedHeader}
              offsets={columnOffsets} />
            {!isFixedHeader && this.renderBody()}
          </table>
        </div>
      </div>
    )
  },

  render() {
    const {fixedHeader} = this.props
    const {tableWidth, fixedHeaderPosition} = this.state
    const headerStyle = {
      width: tableWidth
    }

    const header = (
      <div ref="header"
        style={headerStyle}
        className={`table-${fixedHeaderPosition}-header`}
      >
        <div className="table-fixed-header-inner">
          {this.renderTable(true)}
        </div>
      </div>
    )
    return (
      <div ref="table" className="table-wrapper">
        {fixedHeader && header}
        <div className="table-container">
          {this.renderTable()}
        </div>
      </div>
    )
  }
})
