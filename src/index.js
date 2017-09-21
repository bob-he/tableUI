import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import Icon from 'iconui'
import Drag from 'dragui'
import classNames from 'classnames'
import TableColGroup from './tableColGroup.js'
import TableHeader from './tableHeader.js'
import TableRow from './tableRow.js'
import {getStyleNumber, getFlatten, isSequential, getObject} from './utils.js'
import _ from 'lodash'

const tableName = 'de-table'
export default class Table extends React.Component {
  static propTypes = {
    columns: PropTypes.array,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.number,
    data: PropTypes.array,
    rowKey: PropTypes.func,
    className: PropTypes.string,
    rowClassName: PropTypes.func,
    // allowDragTable: PropTypes.bool,
    allowDragColumn: PropTypes.bool,
    defaultOrdered: PropTypes.object,
    onExpand: PropTypes.func,
    expandIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  }

  getInitialData = () => {
    let {data, columns, defaultOrdered} = this.props
    if (defaultOrdered) {
      const key = getObject(defaultOrdered).key
      const col = _.find(columns, {key: key})
      const sortFunc = col && col.sort
      data = this.orderBy(data, defaultOrdered, sortFunc)
    }
    return data
  }

  state = {
    ordered: {},
    rowStyles: {},
    expandRows: {},
    rowHeights: [],
    headerHeights: [],
    columnsWidths: [],
    data: this.getInitialData()
  }

  componentDidMount = () => {
    this.setTable()
  }

  componentDidUpdate = (nextProps) => {
    let self = this
    if (nextProps.data.toString() !== this.props.data.toString()) {
      self.setState({
        isFixedHeader: false,
        data: this.getInitialData()
      }, () => {
        self.setTable()
      })
    }
  }

  componentWillUnmount = () => {
    if (this.refs['body-scroll']) {
      this.refs['body-scroll'].onscroll = null
    }
    if (this.refs['body-fixed-left']) {
      this.refs['body-fixed-left'].onscroll = null
    }
    if (this.refs['body-fixed-right']) {
      this.refs['body-fixed-right'].onscroll = null
    }
  }

  reflow = () => {
    this.setState({
      tableLayout: false,
      isFixedHeader: false,
      headerHeights: [],
      columnsWidths: [],
      rowHeights: [],
      tableWidth: null
    }, () => {
      this.setTable()
    })
  }

  setTable = () => {
    let {height, columns} = this.props
    let table = this.refs.wrapper.getBoundingClientRect()
    let scrollTable = ReactDOM.findDOMNode(this.refs['body-scroll'])
    let tableHeader = scrollTable.querySelector('thead')
    let tableBody = scrollTable.querySelector('tbody')
    let tableHeaderRow = tableHeader.querySelectorAll('tr')
    let tableBodyRow = tableBody.querySelectorAll('tr')
    let thWidths = this.getWidths(tableHeaderRow, columns, [], 0)
    let tdWidths = this.getWidths(tableBodyRow, [], [], 0)
    let columnsWidths = thWidths.map((item, i) => {
      let width = item.offsetWidth
      if (tdWidths[i].offsetWidth > item.offsetWidth) {
        width = tdWidths[i].offsetWidth
      }
      if (item.customWidth) {
        width = item.customWidth
      }
      return width
    })
    let nodes = tableHeaderRow[0].querySelectorAll('th')
    let {borderLeftWidth} = getStyleNumber(nodes[0])
    let tableWidth = _.sum(columnsWidths) + borderLeftWidth
    let {scrollLeft, scrollWidth} = this.refs['body-scroll']
    let headerHeights = _.toArray(tableHeaderRow).map(node => {
      const offset = node.getBoundingClientRect()
      return offset.height
    })
    let rowHeights = _.toArray(tableBodyRow).map(node => {
      const offset = node.getBoundingClientRect()
      return offset.height
    })
    this.setState({
      tableLayout: true,
      tableWidth: tableWidth,
      wrapperWidth: table.width,
      borderWidth: borderLeftWidth,
      isFixed: tableWidth > table.width,
      fixedRight: (table.width + scrollLeft) !== scrollWidth,
      columnsWidths: columnsWidths,
      columnsWidthsBySource: columnsWidths,
      headerHeights: headerHeights,
      rowHeights: rowHeights
    }, () => {
      this.setState({
        isFixedHeader: height < _.sum(rowHeights)
      }, () => {
        if (this.refs['body-scroll']) {
          this.refs['body-scroll'].onscroll = _.throttle(this.handleScroll, 100)
          this.refs['body-scroll'].scrollLeft = this.scrollLeft
        }
        if (this.refs['body-fixed-left']) {
          this.refs['body-fixed-left'].onscroll = _.throttle(this.handleLeftScroll, 300)
        }
        if (this.refs['body-fixed-right']) {
          this.refs['body-fixed-right'].onscroll = _.throttle(this.handleRightScroll, 300)
        }
      })
    })
  }

  handleScroll = () => {
    let {wrapperWidth} = this.state
    let {scrollTop, scrollLeft, scrollWidth} = this.refs['body-scroll']
    this.setState({
      fixedLeft: scrollLeft > 0,
      fixedRight: (wrapperWidth + scrollLeft) !== scrollWidth
    }, () => {
      this.scrollLeft = scrollLeft
      this.scrollTop = scrollTop
      if (this.refs['header-scroll']) {
        this.refs['header-scroll'].scrollLeft = scrollLeft
      }
      if (this.refs['body-fixed-left']) {
        this.refs['body-fixed-left'].scrollTop = scrollTop
      }
      if (this.refs['body-fixed-right']) {
        this.refs['body-fixed-right'].scrollTop = scrollTop
      }
    })
  }

  handleLeftScroll = () => {
    const {scrollTop} = this.refs['body-fixed-left'] || {}
    if (this.refs['body-scroll']) {
      this.refs['body-scroll'].scrollTop = scrollTop
    }
    if (this.refs['body-fixed-right']) {
      this.refs['body-fixed-right'].scrollTop = scrollTop
    }
  }

  handleRightScroll = () => {
    const {scrollTop} = this.refs['body-fixed-right'] || {}
    if (this.refs['body-scroll']) {
      this.refs['body-scroll'].scrollTop = scrollTop
    }
    if (this.refs['body-fixed-left']) {
      this.refs['body-fixed-left'].scrollTop = scrollTop
    }
  }

  getWidths = (nodes, columns, widths, index) => {
    let nodeIndex = index
    let key = columns.length > 0 ? 'th' : 'td'
    let node = nodes[index].querySelectorAll(key)
    for (let i = 0; i < node.length; i++) {
      const offset = node[i].getBoundingClientRect()
      const colSpan = node[i].getAttribute('colSpan')
      if (colSpan) {
        nodeIndex += 1
        this.getWidths(nodes, columns[i].children, widths, nodeIndex)
      } else {
        let userAgent = window.navigator.userAgent.toLowerCase()
        let width = Math.round(offset.width)
        if (userAgent.indexOf('firefox') > -1) {
          width = offset.width
        }
        widths.push({
          offsetWidth: width,
          customWidth: columns[i] && columns[i].width
        })
      }
    }
    return widths
  }

  // 拖动表格(模向滚动)
  handleDrag = (axisX) => {
    this.setState({
      axisX: 0,
      handGrab: false
    })
    if (axisX === 0) {
      return
    }
    let body = this.refs['body-scroll']
    body.scrollLeft = body.scrollLeft - axisX
  }
  handleDragMouseDown = () => {
    this.setState({
      handGrab: true,
      stopMove: false,
      isMove: false,
      axisX: 0
    })
  }
  handleDragMouseMove = (axisX) => {
    let {wrapperWidth, tableWidth} = this.state
    let body = this.refs['body-scroll']
    let stopMove = false
    if (body.scrollLeft - axisX < 0) {
      stopMove = true
    }
    if (body.scrollLeft - axisX >= tableWidth - wrapperWidth) {
      stopMove = true
    }
    this.setState({
      stopMove: stopMove,
      axisX: axisX,
      isMove: true
    })
  }

  // 拖动表格列
  handleHeaderDrag = (index) => (axisX) => {
    this.setState({
      isFixedHeader: false
    }, () => {
      let {height} = this.props
      let {columnsWidths, columnsWidthsBySource, wrapperWidth, borderWidth} = this.state
      let tableWidth = 0
      let widths = columnsWidths.map((item, i) => {
        let width = item
        if (i === index) {
          width = width + axisX
        }
        if (width < columnsWidthsBySource[i]) {
          width = columnsWidthsBySource[i]
        }
        tableWidth += width
        return width
      })
      let {scrollLeft, scrollWidth} = this.refs['body-scroll']
      let scrollTable = ReactDOM.findDOMNode(this.refs['body-scroll'])
      let tableHeader = scrollTable.querySelector('thead')
      let tableBody = scrollTable.querySelector('tbody')
      let tableHeaderRow = tableHeader.querySelectorAll('tr')
      let tableBodyRow = tableBody.querySelectorAll('tr')
      let headerHeights = _.toArray(tableHeaderRow).map(node => {
        let offset = node.getBoundingClientRect()
        return offset.height
      })
      let rowHeights = _.toArray(tableBodyRow).map(node => {
        let offset = node.getBoundingClientRect()
        return offset.height
      })
      this.setState({
        isFixedHeader: height < _.sum(rowHeights),
        mouseDownDragIndex: null,
        columnsWidths: widths,
        headerHeights: headerHeights,
        rowHeights: rowHeights,
        tableWidth: tableWidth + borderWidth,
        isFixed: tableWidth > wrapperWidth,
        fixedRight: (wrapperWidth + scrollLeft) !== scrollWidth
      }, () => {
        if (this.refs['header-scroll']) {
          this.refs['header-scroll'].scrollLeft = this.scrollLeft
        }
      })
    })
  }
  handleHeaderDragMouseDown = (index) => () => {
    this.setState({
      mouseDownDragIndex: index
    })
  }

  // 排序
  orderBy = (data, ordered, func) => {
    let obj = getObject(ordered)
    let orders = obj.value
    let sortby = obj.key
    if (typeof func === 'function') {
      sortby = func
    }
    return _.orderBy(data, [sortby], [orders])
  }

  handleSort = (ordered, func) => {
    let {data} = this.state
    this.setState({
      ordered: ordered,
      data: this.orderBy(data, ordered, func)
    })
  }

  handleExpand = (row, key) => () => {
    let {onExpand} = this.props
    let {expandRows, columnsWidths, wrapperWidth, borderWidth} = this.state
    if (typeof onExpand === 'function') {
      onExpand(!expandRows[key], row)
    }
    this.setState({
      tableLayout: !row.children,
      expandRows: _.assign({}, expandRows, {
        [key]: !expandRows[key]
      })
    }, () => {
      if (!row.children) {
        return
      }
      this.setState({
        isFixedHeader: false
      }, () => {
        let scrollTable = ReactDOM.findDOMNode(this.refs['body-scroll'])
        let tableBody = scrollTable.querySelector('tbody')
        let tableBodyRow = tableBody.querySelectorAll('tr')
        let tdWidths = this.getWidths(tableBodyRow, [], [], 0)
        let widths = tdWidths.map((item, i) => {
          let width = item.offsetWidth
          if (columnsWidths[i] > width) {
            width = columnsWidths[i]
          }
          return width
        })
        let tableWidth = _.sum(widths) + borderWidth
        let {scrollLeft, scrollWidth} = this.refs['body-scroll']
        this.setState({
          isFixedHeader: true,
          tableLayout: true,
          tableWidth: tableWidth,
          columnsWidths: widths,
          columnsWidthsBySource: widths,
          isFixed: tableWidth > wrapperWidth,
          fixedRight: (wrapperWidth + scrollLeft) !== scrollWidth
        }, () => {
          if (this.refs['body-fixed-left']) {
            this.refs['body-fixed-left'].scrollTop = this.scrollTop
          }
          if (this.refs['body-scroll']) {
            this.refs['body-scroll'].scrollLeft = this.scrollLeft
          }
          if (this.refs['header-scroll']) {
            this.refs['header-scroll'].scrollLeft = this.scrollLeft
          }
        })
      })
    })
  }

  handleRowMouseover = (key) => () => {
    this.setState({
      rowStyles: {
        [key]: 'table-row-hover'
      }
    })
  }

  handleRowMouseout = () => {
    this.setState({
      rowStyles: {}
    })
  }

  getRows = (columns, data, indentIndex) => {
    let index = indentIndex
    let {rowKey, rowClassName} = this.props
    let {rowStyles, rowHeights, expandRows} = this.state
    let rows = []
    for (let i = 0; i < data.length; i++) {
      let key = rowKey(data[i])
      let children = data[i].children
      let rowClass = classNames(
        rowStyles[key],
        (typeof rowClassName === 'function') && rowClassName(data[i], i),
        {'table-row-selected': expandRows[key]}
      )
      let expandInner = expandRows[key] ? (
        <Icon type="caretdown" />
      ) : (<Icon type="caretright" />)
      if (this.props.expandIcon) {
        expandInner = this.props.expandIcon
      }
      let expandIcon = (
        <span className="table-row-expand-icon"
          onClick={this.handleExpand(data[i], key)}>
          {expandInner}
        </span>
      )
      let expandIndentStyle = {paddingLeft: 25 * index}
      let expandIndent = <span style={expandIndentStyle} />
      let height = rowHeights[i] && rowHeights[i]
      let clickEvent = {
        onExpand: this.handleExpand(data[i], key)
      }
      if (this.state.isMove) {
        clickEvent = {}
      }
      rows.push(
        <TableRow
          key={key}
          index={i}
          row={data[i]}
          prevRow={data[(i - 1)]}
          nextRow={data[(i + 1)]}
          height={height}
          columns={columns}
          className={rowClass}
          expandIcon={children && expandIcon}
          expandIndent={expandIndent}
          {...clickEvent}
          onMouseout={this.handleRowMouseout}
          onMouseover={this.handleRowMouseover(key)} />
      )
      if (children && expandRows[key]) {
        index += 1
        rows = rows.concat(
          this.getRows(columns, children, index)
        )
        index -= 1
      }
    }
    return rows
  }

  renderTable = (type, width, columns, columnsWidths) => {
    let {data, ordered, tableLayout, isFixedHeader, headerHeights} = this.state
    let tableStyle = {
      width: width,
      tableLayout: tableLayout ? 'fixed' : ''
    }
    return (
      <table className={tableName} style={tableStyle}>
        <TableColGroup
          columns={getFlatten(columns, 'children')}
          widths={columnsWidths}
        />
        {
          (type === 'header' || !isFixedHeader) && (
            <TableHeader
              columns={columns}
              heights={headerHeights}
              sumheight={_.sum(headerHeights)}
              ordered={ordered}
              onSort={this.handleSort}
            />
          )
        }
        {
          (type === 'tbody' || type === 'table') && (
            <tbody>
              {this.getRows(getFlatten(columns, 'children'), data, 0)}
            </tbody>
          )
        }
      </table>
    )
  }

  getTableConfig = (type) => {
    let {columns} = this.props
    let {columnsWidths, borderWidth, tableWidth} = this.state
    let sideColumns = _.filter(columns, {fixed: type})
    if (type === 'left' && sideColumns.length === 0) {
      sideColumns = columns.slice(0, 1)
    }
    if (type === 'right') {
      sideColumns = columns.slice(columns.length - sideColumns.length, columns.length)
    }
    let columnsLength = getFlatten(sideColumns, 'children').length
    let sideColumnsWidths = columnsWidths.slice(0, columnsLength)
    if (type === 'right') {
      sideColumnsWidths = columnsWidths.slice(columnsWidths.length - sideColumns.length, columnsWidths.length)
    }
    let sideWidth = _.sum(sideColumnsWidths) + borderWidth
    return {
      width: type ? sideWidth : tableWidth,
      columns: type ? sideColumns : columns,
      columnsWidths: type ? sideColumnsWidths : columnsWidths
    }
  }

  renderContent = (type) => {
    let {height} = this.props
    let {
      axisX,
      isFixed,
      stopMove,
      handGrab,
      fixedLeft,
      fixedRight,
      hiddenScroll,
      isFixedHeader,
      headerHeights,
      rowHeights
    } = this.state
    let params = {
      'scroll': '',
      'fixed-left': 'left',
      'fixed-right': 'right'
    }
    let {width, columns, columnsWidths} = this.getTableConfig(params[type])
    let shadows = {
      'scroll': columns.length > 0 && fixedRight,
      'fixed-left': columns.length > 0 && fixedLeft,
      'fixed-right': columns.length > 0 && fixedRight
    }
    let className = classNames(
      `${tableName}-${type}`,
      {[`${tableName}-margin-right`]: type === 'left'},
      {[`${tableName}-${type}-shadow`]: shadows[type]}
    )
    let scrollHeight = height
    if (isFixedHeader) {
      scrollHeight = height || _.sum(rowHeights)
    } else {
      scrollHeight = (height || _.sum(rowHeights)) + _.sum(headerHeights)
      if (type !== 'scroll') {
        scrollHeight = null
      }
    }
    let bodyClass = classNames(
      `${tableName}-body`,
      {[`${tableName}-hand-grab`]: type === 'scroll' && handGrab},
      {[`${tableName}-hand-paper`]: isFixed && type === 'scroll' && !handGrab},
      {[`${tableName}-margin-right`]: isFixedHeader && params[type] === 'left'}
    )
    let scrollStyle = {
      cursor: type === 'scroll' && this.state.cursor,
      height: scrollHeight,
      overflowX: (!hiddenScroll && isFixedHeader) ? 'auto' : '',
      overflowY: (!hiddenScroll && isFixedHeader) ? 'scroll' : 'hidden'
    }
    let ref = height ? 'tbody' : 'table'
    let content = this.renderTable(ref, width, columns, columnsWidths)
    let header = this.renderTable('header', width, columns, columnsWidths)
    if (type === 'scroll' && isFixed) {
      let rightWay = !!this.scrollLeft
      content = (
        <Drag axis="x"
          leftWay rightWay={rightWay}
          range={[100, 400, 100, 400]}
          style={{width: width || '100%', height: '100%'}}
          dragType="direction"
          stopMove={stopMove}
          onDrag={this.handleDrag}
          onMouseMove={this.handleDragMouseMove}
          onMouseDown={this.handleDragMouseDown}
        >
          {content}
        </Drag>
      )
      let headerStyle = {
        width: width,
        transform: `translate(${axisX || 0}px, 0px)`
      }
      header = <div style={headerStyle}>{header}</div>
    }
    return (
      <div className={className}>
        {
          isFixedHeader && (
            <div ref={`header-${type}`} className={`${tableName}-header`}>
              {header}
            </div>
          )
        }
        <div
          ref={`body-${type}`}
          style={scrollStyle}
          className={bodyClass}
        >
          {content}
        </div>
        {
          type === 'scroll' && shadows[type] && (
            <div
              style={{height: _.sum(rowHeights) + _.sum(headerHeights)}}
              className={`${tableName}-${type}-shadow`}
            />
          )
        }
      </div>
    )
  }

  getColumnDragFlag = () => {
    let {columns} = this.props
    let {headerHeights} = this.state
    let {isFixed, columnsWidths, mouseDownDragIndex} = this.state
    let leftColumnsWidth = 0
    let scrollLeft = this.scrollLeft ? -this.scrollLeft : 0
    return getFlatten(columns, 'children').map((item, i) => {
      scrollLeft = columnsWidths[i] && (scrollLeft + columnsWidths[i])
      if (isFixed && item.fixed) {
        leftColumnsWidth = columnsWidths[i] && (leftColumnsWidth + columnsWidths[i])
      }
      const left = isFixed && item.fixed ? leftColumnsWidth : scrollLeft
      const dragClass = classNames(
        'de-table-header-drag-flag',
        {'de-table-header-drag-flag-selected': mouseDownDragIndex === i}
      )
      return (
        <Drag
          key={i}
          axis="x"
          leftWay
          rightWay
          dragType="transform"
          style={{left: left, minHeight: _.sum(headerHeights)}}
          className={dragClass}
          range={[100, 400, 100, 400]}
          onDrag={this.handleHeaderDrag(i)}
          onMouseDown={this.handleHeaderDragMouseDown(i)}
        >
          <div className="de-table-header-drag-flag-inner" />
        </Drag>
      )
    })
  }

  render () {
    let {isFixed} = this.state
    let {width, columns, className, allowDragColumn} = this.props
    let rightColumns = _.filter(columns, {fixed: 'right'})
    if (!isSequential(columns, {fixed: 'left'})) {
      return console.error(`columns配置中{fixed: 'left'}错误`)
    }
    if (!isSequential(columns, {fixed: 'right'})) {
      return console.error(`columns配置中{fixed: 'right'}错误`)
    }
    let tableClass = classNames(`${tableName}-wrapper`, className)
    return (
      <div style={{width: width}} ref="wrapper" className={tableClass}>
        {allowDragColumn && this.getColumnDragFlag()}
        <div className={`${tableName}-container`}>
          {this.renderContent('scroll')}
          {isFixed && this.renderContent('fixed-left')}
          {isFixed && rightColumns.length > 0 && this.renderContent('fixed-right')}
        </div>
      </div>
    )
  }
}
