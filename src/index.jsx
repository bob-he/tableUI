import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import ReactDOM from 'react-dom'
import Icon from 'iconui'
import Drag from 'dragui'
import classNames from 'classnames'
import TableHeader from './tableHeader.jsx'
import TableRow from './tableRow.jsx'
import {setNodeOffset} from './utils.js'
import _ from 'lodash'
import './style.css'

export default createClass({
  propTypes: {
    columns: PropTypes.array,
    width: PropTypes.string,
    data: PropTypes.array,
    rowKey: PropTypes.func,
    className: PropTypes.string,
    fixedHeader: PropTypes.bool
  },

  getInitialState() {
    return {
      data: this.props.data,
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
    this.setFixedColumn()
    if (this.refs.scroll) {
      this.refs.scroll.onscroll = this.handleHorizontalScroll
    }
  },

  componentWillUnmount() {
    window.onscroll = null
    this.refs.scroll.onscroll = null
  },

  setFixedColumn() {
    const {fixedHeader, columns} = this.props
    const tableOffset = this.refs.table.getBoundingClientRect()
    const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader)
    const nodes = setNodeOffset(tableHeader.querySelectorAll('th'))
    let thWidths = 0
    for (let i = 0; i < nodes.length; i ++) {
      thWidths = thWidths + (columns[i].width || nodes[i].offsetWidth)
    }
    this.setState({
      isfixed: thWidths > tableOffset.width
    }, () => {
      if (fixedHeader || thWidths > tableOffset.width) {
        this.setTableOffset()
      }
    })
  },

  setTableOffset() {
    const tableOffset = this.refs.table.getBoundingClientRect()
    const tableTbody = ReactDOM.findDOMNode(this.refs.tableTbody)
    const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader)
    this.setState({
      rowOffsets: setNodeOffset(tableTbody.querySelectorAll('tr')),
      columnOffsets: setNodeOffset(tableHeader.querySelectorAll('th'), 'div'),
      tableWidth: tableOffset.width
    })
  },

  handleDrag(x, y) {
    setTimeout(() => {
      this.refs.scroll.scrollLeft = this.refs.scroll.scrollLeft - x
    }, 500)
  },

  handleHeaderDrag() {
  },

  handleSort(key, sort) {
    const {data} = this.props
    const newData = data
    newData.sort((a, b) => {
      let reult = 0
      if (sort === 'desc') {
        reult = b[key] - a[key]
      }
      if (sort === 'asc') {
        reult = a[key] - b[key]
      }
      return reult
    })
    this.setState({
      data: newData
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
      this.setFixedColumn()
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
    const keys = _.keys(expandRows)
    fixedRowKey = {}
    for(let key in expandRows) {
      if (expandRows[key]) {
        const node = ReactDOM.findDOMNode(this.refs[`tr_${key}`])
        const nodeOffset = node.getBoundingClientRect()
        const refKeys = _.keys(this.refs).filter(item => {
          return item.indexOf(`tr_${key}_`) > -1
        })
        const childsHeight = _.sumBy(refKeys, item => {
          const childNode = ReactDOM.findDOMNode(this.refs[item])
          const childNodeOffset = childNode.getBoundingClientRect()
          return childNodeOffset.height
        })
        if (nodeOffset.top < tableHeaderOffset.height) {
          if (nodeOffset.top - nodeOffset.height > -childsHeight) {
            fixedRowKey = {...fixedRowKey, [key]: key}
            continue
          }
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

  getRows(isFixedHeader, isFixedCloumn, data, indentIndex, parentKey) {
    const {columns, rowKey} = this.props
    const {isfixed, rowStyles, rowOffsets, expandRows} = this.state
    let rows = []
    for (let i = 0; i < data.length; i++) {
      let key = rowKey(data[i])
      let rowRef = (!isFixedHeader && expandRows[key]) ? `tr_${rowKey(data[i])}` : ''
      if (parentKey) {
        key = `${parentKey}_${rowKey(data[i])}`
        if (!isFixedHeader && expandRows[parentKey]) {
          rowRef = `tr_${parentKey}_${rowKey(data[i])}`
        } else {
          rowRef = ''
        }
      }
      const children = data[i].children
      const rowClass = classNames(
        rowStyles[key],
        {'table-row-selected': expandRows[key]}
      )
      const expandInner = expandRows[key] ? <Icon type="caretdown" /> : <Icon type="caretright" />
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
          isfixed={isfixed}
          columns={columns}
          height={rowHeight}
          className={rowClass}
          isFixedCloumn={isFixedCloumn}
          expandIcon={children && expandIcon}
          expandIndent={expandIndent}
          onExpand={this.handleExpand.bind(this, key)}
          onMouseout={this.handleRowMouseout}
          onMouseover={this.handleRowMouseover.bind(this, key)} />
      )
      if (!isFixedHeader && children && expandRows[key]) {
        indentIndex += 1
        rows = rows.concat(
          this.getRows(isFixedHeader, isFixedCloumn, children, indentIndex, key)
        )
        indentIndex -= 1
      }
    }
    return rows
  },

  // 表格boody
  renderBody(isFixedHeader, isFixedCloumn) {
    let {rowKey} = this.props
    let {data, fixedRowKey} = this.state
    const fixedRow = _.filter(data, (row) => {
      return fixedRowKey[rowKey(row)]
    })
    if (isFixedHeader) {
      if (fixedRow.length > 0) {
        data = fixedRow
      } else {
        data = []
      }
    }
    const rows = this.getRows(isFixedHeader, isFixedCloumn, data, 0)
    return (
      <tbody ref={isFixedCloumn ? '' : 'tableTbody'}>{rows}</tbody>
    )
  },

  renderColGroup(isFixedCloumn) {
    let {columns} = this.props
    const {isfixed, columnOffsets} = this.state
    columns = (isFixedCloumn && isfixed) ? columns.slice(0, 1) : columns
    const colgroup = columns.map((col, i) => {
      const offset = _.find(columnOffsets, {key: col.key})
      return (!isFixedCloumn || col.fixed || isfixed) ? (
        <col style={{width: offset && offset.width}} key={col.key} />
      ) : null
    })
    return <colgroup>{colgroup}</colgroup>
  },

  // 表格
  renderTable(isFixedHeader) {
    const {width, columns} = this.props
    const {isDrag, isfixed, tableFixedColumnShadow, tableScrollShadow, columnOffsets} = this.state
    const index = _.findIndex(columns, 'fixed')
    if (index > 0) {
      return console.error('请正确配置columns')
    }
    const fixedColumnStyle = classNames(
      'table-fixed-column',
      {'table-fixed-column-shadow': tableFixedColumnShadow}
    )
    let leftCloumns = columns.filter((col, i) => {return col.fixed})
    let leftOffsets = columnOffsets.filter(item => {
      return _.findIndex(leftCloumns, {key: item.key}) > -1
    })
    if (leftCloumns.length === 0) {
      leftCloumns = [columns[0]]
      leftOffsets = [columnOffsets[0]]
    }
    const fixedColumn = (
      <div className={fixedColumnStyle}>
        <table className="table" width={width}>
          {this.renderColGroup(true)}
          <TableHeader
            columns={leftCloumns}
            offsets={leftOffsets} />
          {this.renderBody(isFixedHeader, true)}
        </table>
      </div>
    )
    const headerRef = isFixedHeader ? `headerScroll` : `scroll`
    const tableScrollStyle = classNames(
      {'table-scroll': isfixed},
      {'table-scroll-shadow': tableScrollShadow}
    )
    return (
      <div style={{position: 'relative'}}>
        {isfixed && fixedColumn}
        {
          !isFixedHeader && isfixed && (
            <Drag
              axis='x'
              className="table-drag"
              leftWay={tableScrollShadow}
              rightWay={tableFixedColumnShadow}
              range={[100, 400, 100, 400]}
              onDrag={this.handleDrag}
            >
              {
                tableScrollShadow && <Icon type="caretleft" />
              }
              {
                tableFixedColumnShadow && <Icon type="caretright" />
              }
            </Drag>
          )
        }
        <div ref={headerRef} className={tableScrollStyle}>
          <table className="table" width={width}>
            {this.renderColGroup()}
            <TableHeader
              onDrag={this.handleHeaderDrag}
              columns={columns}
              ref={isFixedHeader ? '' : 'tableHeader'}
              onSort={this.handleSort}
              offsets={columnOffsets} />
            {this.renderBody(isFixedHeader)}
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
        <div className="table-header-inner">
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
