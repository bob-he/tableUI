import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import ReactDOM from 'react-dom'
import Icon from 'iconui'
import Drag from 'dragui'
import classNames from 'classnames'
import TableHeader from './tableHeader.jsx'
import TableRow from './tableRow.jsx'
import {getObject, getNodeWidth, getNodeHeight} from './utils.js'
import _ from 'lodash'
import './style.css'

export default createClass({
  propTypes: {
    columns: PropTypes.array,
    width: PropTypes.string,
    data: PropTypes.array,
    rowKey: PropTypes.func,
    className: PropTypes.string,
    fixedHeader: PropTypes.bool,
    allowDragTable: PropTypes.bool,
    allowDragColumn: PropTypes.bool,
    defaultOrdered: PropTypes.object,
    expandIcon: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element])
  },

  getInitialState() {
    return {
      data: this.getInitialData(),
      ordered: this.props.defaultOrdered || {},
      fixedHeaderPosition: 'absolute',
      tableScrollShadow: false,
      columnsHeights: [],
      columnWidths: [],
      rowHeights: [],
      rowStyles: {},
      expandRows: {},
      fixedRowKey: '',
      axisX: 0
    }
  },

  componentDidUpdate(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        data: this.getInitialData()
      })
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

  getInitialData() {
    let {data, columns, defaultOrdered} = this.props
    if (defaultOrdered) {
      const key = getObject(defaultOrdered).key
      const col = _.find(columns, {key: key})
      const sortFunc = col && col.sort
      data = this.orderBy(data, defaultOrdered, sortFunc)
    }
    return data
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
      isFixed: thWidths > tableOffset.width,
      tableScrollShadow: thWidths > tableOffset.width
    }, () => {
      this.setTableOffset()
    })
  },

  setTableOffset() {
    const {columns} = this.props
    const tableOffset = this.refs.table.getBoundingClientRect()
    const tableTbody = ReactDOM.findDOMNode(this.refs.tableTbody)
    const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader)
    const columnWidths = getNodeWidth(tableHeader.querySelectorAll('th')).map((item, i) => {
      let width = item.width
      if (columns[i].width && columns[i].width > item.width) {
        width = columns[i].width
      }
      return {
        width: width
      }
    })
    this.setState({
      tableLayout: true,
      rowHeights: getNodeHeight(tableTbody.querySelectorAll('tr')),
      columnWidths: columnWidths,
      columnWidthsSource: columnWidths,
      tableWidth: tableOffset.width,
      tableHeight: tableOffset.height
    }, () => {
      this.setState({
        columnsHeights: getNodeHeight(tableHeader.querySelectorAll('th'))
      })
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
    // this.refs.dragFlag.scrollLeft = scrollLeft
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

  handleDrag(axisX) {
    this.refs.scroll.scrollLeft = this.refs.scroll.scrollLeft - axisX
  },

  handleHeaderDrag(index, axisX) {
    let {columnWidths, columnWidthsSource, tableWidth} = this.state
    let thWidths = 0
    columnWidths = columnWidths.map((item, i) => {
      let width = item.width
      if (i === index) {
        width = width + axisX
      }
      if (width < columnWidthsSource[i].width) {
        width = columnWidthsSource[i].width
      }
      thWidths = thWidths + width
      return {
        ...item,
        width: width
      }
    })
    this.setState({
      mouseDownDragIndex: null,
      columnWidths: columnWidths,
      isFixed: thWidths > tableWidth
    })
  },

  handleHeaderDragMouseDown(index) {
    const tableOffset = this.refs.table.getBoundingClientRect()
    this.setState({
      mouseDownDragIndex: index
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
      const {columnWidths, tableWidth} = this.state
      const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader)
      const nodes = getNodeWidth(tableHeader.querySelectorAll('th'))
      let thWidths = 0
      let widths = []
      for (let i = 0; i < nodes.length; i ++) {
        let width = nodes[i].width
        if (width < columnWidths[i].width) {
          width = columnWidths[i].width
        }
        widths.push({
          width: width
        })
        thWidths = thWidths + width
      }
      this.setState({
        tableLayout: true,
        columnWidths: widths,
        isFixed: thWidths > tableWidth
      }, () => {
        this.refs.scroll.scrollLeft = this.scrollLeft
      })
    })
  },

  orderBy(data, ordered, func) {
    const orders = getObject(ordered).value
    let sortby = getObject(ordered).key
    if (typeof func === 'function') {
      sortby = func
    }
    return _.orderBy(data, [sortby], [orders])
  },

  handleSort(ordered, func) {
    const {data} = this.state
    this.setState({
      ordered: ordered,
      data: this.orderBy(data, ordered, func)
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

  getRows(isFixedHeader, isFixedColumn, data, indentIndex, parentKey) {
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
          isFixedColumn={isFixedColumn}
          expandIcon={children && expandIcon}
          expandIndent={expandIndent}
          onExpand={this.handleExpand.bind(this, key)}
          onMouseout={this.handleRowMouseout}
          onMouseover={this.handleRowMouseover.bind(this, key)} />
      )
      if (!isFixedHeader && children && expandRows[key]) {
        indentIndex += 1
        rows = rows.concat(
          this.getRows(isFixedHeader, isFixedColumn, children, indentIndex, key)
        )
        indentIndex -= 1
      }
    }
    return rows
  },

  // 表格boody
  renderBody(isFixedHeader, isFixedColumn) {
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
    const rows = this.getRows(isFixedHeader, isFixedColumn, data, 0)
    return (
      <tbody ref={isFixedColumn ? '' : 'tableTbody'}>{rows}</tbody>
    )
  },

  renderColGroup(isFixedColumn) {
    const {columns} = this.props
    const {isFixed, columnWidths} = this.state
    let leftCloumns = columns
    if (isFixedColumn && isFixed) {
      leftCloumns = columns.filter((col, i) => {return col.fixed})
    }
    if (leftCloumns.length === 0) {
      leftCloumns = columns[0]
    }
    const colgroup = leftCloumns.map((col, i) => {
      const width = columnWidths[i] && columnWidths[i].width
      return (!isFixedColumn || col.fixed || isFixed) ? (
        <col style={{width: width, minWidth: width}} key={col.key} />
      ) : null
    })
    return <colgroup>{colgroup}</colgroup>
  },

  getTableDragFlag() {
    const {tableFixedColumnShadow, tableScrollShadow} = this.state
    return (
      <Drag
        axis='x'
        className="table-drag-flag"
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
  },

  // 表格
  renderTable(isFixedHeader) {
    const {width, columns, allowDragTable} = this.props
    const {
      ordered,
      isFixed,
      tableLayout,
      tableFixedColumnShadow,
      tableScrollShadow,
      columnsHeights,
      columnWidths
    } = this.state
    const index = _.findIndex(columns, 'fixed')
    if (index > 0) {
      // TODO 正确配置columns的判断方法
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
        <table className="table" style={tableStyle} width={fixedColumnWidths}>
          {this.renderColGroup(true)}
          <TableHeader
            ordered={ordered}
            onSort={this.handleSort}
            columns={leftCloumns}
            onDrag={this.handleHeaderDrag}
            heights={columnsHeights} />
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
        {allowDragTable && !isFixedHeader && isFixed && this.getTableDragFlag()}
        <div ref={headerRef} className={tableScrollStyle}>
          <table className="table" width={width} style={tableStyle}>
            {this.renderColGroup()}
            <TableHeader
              ref={isFixedHeader ? '' : 'tableHeader'}
              columns={columns}
              heights={columnsHeights}
              ordered={ordered}
              onSort={!isFixedHeader && this.handleSort}
              onDrag={this.handleHeaderDrag} />
            {this.renderBody(isFixedHeader)}
          </table>
        </div>
      </div>
    )
  },

  getColumnDragFlag() {
    const {columns} = this.props
    const {isFixed, columnWidths, columnsHeights, mouseDownDragIndex} = this.state
    let fixedWidth = 0
    let width = this.scrollLeft ? -this.scrollLeft : 0
    return columns.map((item, i) => {
      width = columnWidths[i] && (width + columnWidths[i].width)
      if (isFixed && item.fixed) {
        fixedWidth = columnWidths[i] && (fixedWidth + columnWidths[i].width)
      }
      const left = isFixed && item.fixed ? fixedWidth : width
      const height = columnsHeights[i] && columnsHeights[i].height
      const dragClass = classNames(
        'header-drag-flag',
        {'header-drag-flag-selected': mouseDownDragIndex === i}
      )
      return (
        <Drag
          key={i}
          axis='x'
          leftWay
          rightWay
          style={{left: left, minHeight: height}}
          className={dragClass}
          range={[100, 400, 100, 400]}
          onDrag={this.handleHeaderDrag.bind(this, i)}
          onMouseDown={this.handleHeaderDragMouseDown.bind(this, i)}
        >
          <div className="header-drag-flag-inner"></div>
        </Drag>
      )
    })
  },

  render() {
    const {fixedHeader, allowDragColumn} = this.props
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
        {allowDragColumn && this.getColumnDragFlag()}
        {fixedHeader && header}
        <div className="table-container">
          {this.renderTable()}
        </div>
      </div>
    )
  }
})
