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
    className: React.PropTypes.string,
    fixedHeader: React.PropTypes.bool
  },

  getInitialState() {
    return {
      fixedHeaderPosition: 'absolute',
      tableScrollShadow: true,
      rowOffsets: [],
      columnOffsets: [],
      rowClass: {}
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

  handleRowMouseover(i) {
    this.setState({
      rowClass: {
        [i]: 'table-row-hover'
      }
    })
  },

  handleRowMouseout() {
    this.setState({
      rowClass: {}
    })
  },

  handleScroll() {
    const tableOffset = this.refs.table.getBoundingClientRect()
    const position = tableOffset.top > 0 ? 'absolute' : 'fixed'
    this.setState({
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

  // 表格boody
  renderBody(isFixedCloumn) {
    const {rowClass, rowOffsets} = this.state
    const {data, columns} = this.props
    const newData = formatterData(data)
    const rows = newData.map((row, i) => {
      return (
        <TableRow key={i}
          data={row}
          columns={columns}
          className={rowClass[i]}
          isFixedCloumn={isFixedCloumn}
          onMouseout={this.handleRowMouseout}
          onMouseover={this.handleRowMouseover.bind(this, i)}
          height={rowOffsets[i] && rowOffsets[i].height} />
      )
    })
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
