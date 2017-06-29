import React from 'react'
import PropTypes from 'prop-types'
import createClass from 'create-react-class'
import ReactDOM from 'react-dom'
import Icon from 'iconui'
import Drag from 'dragui'
import classNames from 'classnames'
import TableColGroup from './tableColGroup.jsx'
import TableHeader from './tableHeader.jsx'
import TableRow from './tableRow.jsx'
import {getSum, getArray, getObject, getFilter, getFlatten, getNodeHeight, isSequential} from './utils.js'
import _ from 'lodash'
import './style.css'

export default createClass({
  propTypes: {
    columns: PropTypes.array,
    width: PropTypes.string,
    data: PropTypes.array,
    rowKey: PropTypes.func,
    className: PropTypes.string,
    rowClassName: PropTypes.func,
    fixedHeader: PropTypes.bool,
    allowDragTable: PropTypes.bool,
    allowDragColumn: PropTypes.bool,
    defaultOrdered: PropTypes.object,
    onExpand: PropTypes.func,
    expandIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  },

  getInitialState() {
    return {
      data: this.getInitialData(),
      ordered: this.props.defaultOrdered || {},
      fixedHeaderPosition: 'absolute',
      tableScrollShadow: false,
      headerHeights: [],
      columnWidths: [],
      rowHeights: [],
      rowStyles: {},
      expandRows: {},
      fixedRowKey: '',
      axisX: 0
    }
  },

  componentDidUpdate(nextProps) {
    const self = this
    if (nextProps.data !== this.props.data) {
      self.setState({
        data: this.getInitialData()
      })
    }
  },

  componentDidMount() {
    const {fixedHeader} = this.props
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

  setSumByWidth(rowNodes, index, columns, width) {
    let nodeIndex = index
    let sumByWidth = width
    const nodes = rowNodes[index].querySelectorAll('th')
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const offset = node.getBoundingClientRect()
      const colSpan = node.getAttribute('colSpan')
      if (colSpan) {
        nodeIndex += 1
        this.setSumByWidth(rowNodes, nodeIndex, columns[i].children, sumByWidth)
      } else {
        sumByWidth += (columns[i].width || offset.width)
      }
    }
    return sumByWidth
  },

  setFixedColumn() {
    const {columns} = this.props
    const tableOffset = this.refs.table.getBoundingClientRect()
    const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader)
    const rowNodes = tableHeader.querySelectorAll('tr')
    const sumByWidth = this.setSumByWidth(rowNodes, 0, columns, 0)
    this.setState({
      isFixed: sumByWidth > tableOffset.width,
      tableScrollShadow: sumByWidth > tableOffset.width
    }, () => {
      this.setTableOffset()
    })
  },

  setWidths(rowNodes, index, columns, widths) {
    let nodeIndex = index
    const nodes = rowNodes[index].querySelectorAll('th')
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i]
      const offset = node.getBoundingClientRect()
      const colSpan = node.getAttribute('colSpan')
      if (colSpan) {
        nodeIndex += 1
        this.setWidths(rowNodes, nodeIndex, columns[i].children, widths)
      } else {
        widths.push({
          width: columns[i].width || offset.width
        })
      }
    }
    return widths
  },

  setTableOffset() {
    const {columns} = this.props
    const tableOffset = this.refs.table.getBoundingClientRect()
    const tableTbody = ReactDOM.findDOMNode(this.refs.tableTbody)
    const rowHeights = getNodeHeight(tableTbody.querySelectorAll('tr'))

    const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader)
    const rowNodes = tableHeader.querySelectorAll('tr')
    const columnWidths = this.setWidths(rowNodes, 0, columns, [])

    this.setState({
      tableLayout: true,
      rowHeights: rowHeights,
      columnWidths: columnWidths,
      columnWidthsSource: columnWidths,
      tableWidth: tableOffset.width,
      tableHeight: tableOffset.height
    }, () => {
      this.setState({
        headerHeights: getNodeHeight(tableHeader.querySelectorAll('tr')),
        sumheight: getSum('height', getNodeHeight(tableHeader.querySelectorAll('tr')))
      })
    })
  },

  handleScroll() {
    let {expandRows, fixedRowKey} = this.state
    const tableOffset = this.refs.table.getBoundingClientRect()
    const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader)
    const tableHeaderOffset = tableHeader.getBoundingClientRect()
    fixedRowKey = {}
    for (let key in expandRows) {
      if (expandRows[key]) {
        const node = ReactDOM.findDOMNode(this.refs[`tr_${key}`])
        const nodeOffset = node.getBoundingClientRect()
        const refKeys = _.keys(this.refs).filter(item => {
          return item.indexOf(`tr_${key}_`) > -1
        })
        let childsHeight = 0
        for (let i = 0; i < refKeys.length; i++) {
          const childNode = ReactDOM.findDOMNode(this.refs[refKeys[i]])
          const childNodeOffset = childNode.getBoundingClientRect()
          childsHeight += childNodeOffset.height
        }
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
    const {columnWidths, columnWidthsSource, tableWidth} = this.state
    let sumByWidth = 0
    const widths = columnWidths.map((item, i) => {
      let width = item.width
      if (i === index) {
        width = width + axisX
      }
      if (width < columnWidthsSource[i].width) {
        width = columnWidthsSource[i].width
      }
      sumByWidth += width
      return {...item, width: width}
    })
    const {scrollLeft, scrollWidth} = this.refs.scroll
    this.setState({
      mouseDownDragIndex: null,
      columnWidths: widths,
      isFixed: sumByWidth > tableWidth,
      tableScrollShadow: (tableWidth + scrollLeft) !== scrollWidth
    })
  },

  handleHeaderDragMouseDown(index) {
    this.setState({
      mouseDownDragIndex: index
    })
  },

  handleExpand(row, key) {
    const {onExpand, columns} = this.props
    const {expandRows, columnWidths, tableWidth} = this.state
    if (typeof onExpand === 'function') {
      onExpand(!expandRows[key], row)
    }
    this.setState({
      tableLayout: !row.children,
      expandRows: {
        ...expandRows,
        [key]: !expandRows[key]
      }
    }, () => {
      if (!row.children) {
        return
      }
      const tableHeader = ReactDOM.findDOMNode(this.refs.tableHeader)
      const rowNodes = tableHeader.querySelectorAll('tr')
      const sumByWidth = getSum('width', this.setWidths(rowNodes, 0, columns, []), columnWidths)
      this.setState({
        tableLayout: true,
        tableScrollShadow: sumByWidth > tableWidth,
        columnWidths: getArray('width', this.setWidths(rowNodes, 0, columns, []), columnWidths),
        isFixed: sumByWidth > tableWidth
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

  getRows(isFixedHeader, columns, data, indentIndex, parentKey) {
    let index = indentIndex
    const {rowKey, rowClassName} = this.props
    const {rowStyles, rowHeights, expandRows} = this.state
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
        (typeof rowClassName === 'function') && rowClassName(data[i], i),
        {'table-row-selected': expandRows[key]}
      )
      let expandInner = expandRows[key] ? <Icon type="caretdown" /> : <Icon type="caretright" />
      if (this.props.expandIcon) {
        expandInner = this.props.expandIcon
      }
      const expandIcon = (
        <span className="table-row-expand-icon"
          onClick={this.handleExpand.bind(this, data[i], key)}>
          {expandInner}
        </span>
      )
      const expandIndentStyle = {paddingLeft: 25 * index}
      const expandIndent = <span style={expandIndentStyle}></span>
      const height = rowHeights[i] && rowHeights[i].height
      rows.push(
        <TableRow
          key={key}
          ref={rowRef}
          index={i}
          row={data[i]}
          prevRow={data[(i - 1)]}
          nextRow={data[(i + 1)]}
          columns={columns}
          height={height}
          className={rowClass}
          expandIcon={children && expandIcon}
          expandIndent={expandIndent}
          onExpand={this.handleExpand.bind(this, data[i], key)}
          onMouseout={this.handleRowMouseout}
          onMouseover={this.handleRowMouseover.bind(this, key)} />
      )
      if (!isFixedHeader && children && expandRows[key]) {
        index += 1
        rows = rows.concat(
          this.getRows(isFixedHeader, columns, children, index, key)
        )
        index -= 1
      }
    }
    return rows
  },

  // 表格boody
  renderBody(columns, isFixedHeader, isFixedColumn) {
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
    const rows = this.getRows(isFixedHeader, columns, data, 0)
    return (
      <tbody ref={isFixedColumn ? '' : 'tableTbody'}>{rows}</tbody>
    )
  },

  getColumnDragFlag() {
    let {columns} = this.props
    let {sumheight} = this.state
    columns = getFlatten(columns, 'children')
    const {isFixed, columnWidths, mouseDownDragIndex} = this.state
    let leftColumnsWidth = 0
    let columnsWidth = this.scrollLeft ? -this.scrollLeft : 0
    return columns.map((item, i) => {
      columnsWidth = columnWidths[i] && (columnsWidth + columnWidths[i].width)
      if (isFixed && item.fixed) {
        leftColumnsWidth = columnWidths[i] && (leftColumnsWidth + columnWidths[i].width)
      }
      const left = isFixed && item.fixed ? leftColumnsWidth : columnsWidth
      const dragClass = classNames(
        'header-drag-flag',
        {'header-drag-flag-selected': mouseDownDragIndex === i}
      )
      return (
        <Drag
          key={i}
          axis="x"
          leftWay
          rightWay
          style={{left: left, minHeight: sumheight}}
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

  getTableDragFlag() {
    const {tableFixedColumnShadow, tableScrollShadow} = this.state
    return (
      <Drag
        axis="x"
        className="table-drag-flag"
        leftWay={tableScrollShadow}
        rightWay={tableFixedColumnShadow}
        range={[100, 400, 100, 400]}
        onDrag={this.handleDrag}
      >
        {tableScrollShadow && <Icon type="caretleft" />}
        {tableFixedColumnShadow && <Icon type="caretright" />}
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
      headerHeights,
      columnWidths,
      sumheight
    } = this.state
    if (!isSequential(columns, {fixed: 'left'})) {
      return console.error('请正确配置columns')
    }
    const fixedColumnStyle = classNames(
      'table-fixed-column',
      {'table-fixed-column-shadow': tableFixedColumnShadow}
    )
    let leftCloumns = getFilter({fixed: 'left'}, columns)
    let leftColumnWidths = []
    let leftColumnsWidth = 0
    if (columnWidths.length > 0) {
      leftColumnWidths = getFilter({fixed: 'left'}, getFlatten(columns, 'children'), columnWidths)
      leftColumnsWidth = getSum('width', leftColumnWidths)
    }
    const tableStyle = tableLayout ? {tableLayout: 'fixed'} : {}
    const fixedColumn = (
      <div className={fixedColumnStyle}>
        <table className="table" style={tableStyle} width={leftColumnsWidth}>
          <TableColGroup
            columns={leftCloumns}
            widths={leftColumnWidths} />
          <TableHeader
            ordered={ordered}
            onSort={this.handleSort}
            columns={leftCloumns}
            onDrag={this.handleHeaderDrag}
            sumheight={sumheight}
            heights={headerHeights} />
          {this.renderBody(leftCloumns, isFixedHeader, true)}
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
            <TableColGroup
              columns={getFlatten(columns, 'children')}
              widths={columnWidths} />
            <TableHeader
              ref={isFixedHeader ? '' : 'tableHeader'}
              columns={columns}
              heights={headerHeights}
              sumheight={sumheight}
              ordered={ordered}
              onSort={!isFixedHeader && this.handleSort}
              onDrag={this.handleHeaderDrag} />
            {this.renderBody(getFlatten(columns, 'children'), isFixedHeader)}
          </table>
        </div>
      </div>
    )
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
