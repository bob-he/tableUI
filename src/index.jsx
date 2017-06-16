import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import ReactDOM from 'react-dom'
import Icon from 'iconui'
import Drag from 'dragui'
import classNames from 'classnames'
import TableHeader from './tableHeader.jsx'
import TableRow from './tableRow.jsx'
import {getNodeWidth, getNodeHeight} from './utils.js'
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
      columnsHeights: [],
      columnWidths: [],
      rowHeights: [],
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
    const nodes = getNodeWidth(tableHeader.querySelectorAll('th'))
    let thWidths = 0
    for (let i = 0; i < nodes.length; i ++) {
      thWidths = thWidths + (columns[i].width || nodes[i].width)
    }
    this.setState({
      isFixed: thWidths > tableOffset.width
    }, () => {
      this.setTableOffset()
    })
  },

  setTableOffset() {
    const tableOffset = this.refs.table.getBoundingClientRect()
    const tableTbody = ReactDOM.findDOMNode(this.refs.tableTbody)
    const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader)
    this.setState({
      tableLayout: true,
      rowHeights: getNodeHeight(tableTbody.querySelectorAll('tr')),
      columnWidths: getNodeWidth(tableHeader.querySelectorAll('th')),
      tableWidth: tableOffset.width
    }, () => {
      this.refs.scroll.scrollLeft = this.scrollLeft
      this.setState({
        columnsHeights: getNodeHeight(tableHeader.querySelectorAll('th'))
      })
    })
  },

  handleDrag(x, y) {
    setTimeout(() => {
      this.refs.scroll.scrollLeft = this.refs.scroll.scrollLeft - x
    }, 500)
  },

  handleHeaderDrag() {
    const {isFixed} = this.state
    if (!isFixed) {
      this.setFixedColumn()
    }
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
      tableLayout: false,
      expandRows: {
        ...expandRows,
        [key]: !expandRows[key]
      }
    }, () => {
      this.setFixedColumn()
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
    let {scrollLeft, scrollWidth} = this.refs.scroll
    if (fixedHeader) {
      this.refs.headerScroll.scrollLeft = scrollLeft
    }
    this.setState({
      'tableFixedColumnShadow': scrollLeft > 0,
      'tableScrollShadow': (tableWidth + scrollLeft) !== scrollWidth
    }, () => {
      this.scrollLeft = scrollLeft
    })
  },

  getRows(isFixedHeader, isFixedCloumn, data, indentIndex, parentKey) {
    const {columns, rowKey} = this.props
    const {isFixed, rowStyles, rowHeights, expandRows} = this.state
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
      const rowHeight = rowHeights[key] && rowHeights[key].height
      rows.push(
        <TableRow
          key={key}
          ref={rowRef}
          row={data[i]}
          isFixed={isFixed}
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
    const {columns} = this.props
    const {isFixed, columnWidths} = this.state
    let leftCloumns = columns
    if (isFixedCloumn && isFixed) {
      leftCloumns = columns.filter((col, i) => {return col.fixed})
    }
    if (leftCloumns.length === 0) {
      leftCloumns = columns[0]
    }
    const colgroup = leftCloumns.map((col, i) => {
      let width = columnWidths[i] && columnWidths[i].width
      if (width < col.width) {
        width = col.width
      }
      return (!isFixedCloumn || col.fixed || isFixed) ? (
        <col style={{width: width, minWidth: width}} key={col.key} />
      ) : null
    })
    return <colgroup>{colgroup}</colgroup>
  },

  // 表格
  renderTable(isFixedHeader) {
    const {width, columns} = this.props
    const {tableLayout, isDrag, isFixed, tableFixedColumnShadow, tableScrollShadow, columnsHeights, columnWidths} = this.state
    const index = _.findIndex(columns, 'fixed')
    if (index > 0) {
      return console.error('请正确配置columns')
    }
    const fixedColumnStyle = classNames(
      'table-fixed-column',
      {'table-fixed-column-shadow': tableFixedColumnShadow}
    )
    let leftCloumns = columns.filter((col, i) => {
      return col.fixed
    })
    if (leftCloumns.length === 0) {
      leftCloumns = [columns[0]]
    }
    let fixedColumnWidths = 0
    for (let i = 0; i < leftCloumns.length; i++) {
      fixedColumnWidths += columnWidths[i]
    }
    const tableStyle = tableLayout ? {tableLayout: 'fixed'} : {}
    const fixedColumn = (
      <div className={fixedColumnStyle}>
        <table className="table" width={fixedColumnWidths} style={tableStyle}>
          {this.renderColGroup(true)}
          <TableHeader
            heights={columnsHeights}
            columns={leftCloumns} />
          {this.renderBody(isFixedHeader, true)}
        </table>
      </div>
    )
    const headerRef = isFixedHeader ? `headerScroll` : `scroll`
    const tableScrollStyle = classNames(
      {'table-scroll': isFixed},
      {'table-scroll-shadow': tableScrollShadow}
    )
    return (
      <div style={{position: 'relative'}}>
        {isFixed && fixedColumn}
        {
          !isFixedHeader && isFixed && (
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
          <table className="table" width={width} style={tableStyle}>
            {this.renderColGroup()}
            <TableHeader
              onDrag={this.handleHeaderDrag}
              columns={columns}
              heights={columnsHeights}
              ref={isFixedHeader ? '' : 'tableHeader'}
              onSort={this.handleSort} />
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
