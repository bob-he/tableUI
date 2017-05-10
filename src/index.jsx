import React from 'react'
import classNames from 'classnames'
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
      rowHeights: [],
      columnHeights: {},
      columnWidths: {},
      rowMouseover: {}
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
    if (index > -1) {
      this.setTableOffset()
    }
  },

  componentWillUnmount() {
    window.onscroll = null
    this.refs.scroll.onscroll = null
  },

  setTableOffset() {
    const columns = _.keys(this.refs).filter(item => {
      return item.indexOf('column_') > -1
    })
    let columnWidths = {}
    let columnHeights = {}
    columns.forEach(col => {
      const offset = this.refs[col].getBoundingClientRect()
      const style = window.getComputedStyle(this.refs[col], null)
      columnHeights[col.split('_')[1]] = offset.height
      columnWidths[col.split('_')[1]] = offset.width - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight) - parseFloat(style.marginLeft) - parseFloat(style.marginRight)
    })
    const rows = _.keys(this.refs).filter(item => {
      return item.indexOf('row_') > -1
    })
    const rowHeights = rows.map(row => {
      const offset = this.refs[row].getBoundingClientRect()
      return offset.height
    })
    const tableOffset = this.refs.table.getBoundingClientRect()
    this.setState({
      rowHeights: rowHeights,
      columnHeights: columnHeights,
      columnWidths: columnWidths,
      tableWidth: tableOffset.width
    })
  },

  handleRowMouseover(i) {
    this.setState({
      rowMouseover: {
        [i]: 'table-row-hover'
      }
    })
  },

  handleRowMouseout() {
    this.setState({
      rowMouseover: {}
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

  // 表格header
  renderHeader() {
    const {columns} = this.props
    const {columnHeights, columnWidths} = this.state
    const thColumns = columns.map(item => {
      return (
        <th key={item.key}
          ref={`column_${item.key}`}
          style={{height: columnHeights[item.key]}}
        >
          <div style={{width: columnWidths[item.key]}}>
            {item.title}
          </div>
        </th>
      )
    })
    return (
      <thead>
        <tr>{thColumns}</tr>
      </thead>
    )
  },

  renderFixedColumnHeader() {
    const {columns} = this.props
    const {columnHeights, columnWidths} = this.state
    const thColumns = columns.map((item, i) => {
      const thStyle = {
        height: columnHeights[item.key],
        display: item.fixed ? '' : 'none'
      }
      return (
        <th key={item.key} style={thStyle}>
          <div style={{width: columnWidths[item.key]}}>{item.title}</div>
        </th>
      )
    })
    return (
      <thead>
        <tr>{thColumns}</tr>
      </thead>
    )
  },

  // 表格boody
  renderBody() {
    const {rowMouseover, rowHeights} = this.state
    const {data, columns} = this.props
    const rows = data.map((row, i) => {
      const tdColumns = columns.map(col => {
        let value = row[col.key]
        if (col.render) {
          value = col.render(row[col.key], row, i)
        }
        return (
          <td key={col.key}>{value}</td>
        )
      })
      return (
        <tr key={i}
          ref={`row_${i}`}
          className={rowMouseover[i]}
          style={{height: rowHeights[i]}}
          onMouseOut={this.handleRowMouseout}
          onMouseOver={this.handleRowMouseover.bind(this, i)}
        >
          {tdColumns}
        </tr>
      )
    })
    return (
      <tbody>{rows}</tbody>
    )
  },

  renderFixedColumnBody() {
    const {rowMouseover, rowHeights} = this.state
    const {data, columns} = this.props
    const rows = data.map((row, i) => {
      const tdColumns = columns.map(col => {
        let value = row[col.key]
        if (col.render) {
          value = col.render(row[col.key], row, i)
        }
        return (
          <td key={col.key}
            style={{display: col.fixed ? '' : 'none'}}
          >
            {value}
          </td>
        )
      })
      return (
        <tr key={i}
          className={rowMouseover[i]}
          style={{height: rowHeights[i]}}
          onMouseOut={this.handleRowMouseout}
          onMouseOver={this.handleRowMouseover.bind(this, i)}
        >
          {tdColumns}
        </tr>
      )
    })
    return (
      <tbody>{rows}</tbody>
    )
  },

  renderColGroup() {
    const {columns} = this.props
    const {columnWidths} = this.state
    const colgroup = columns.map((item, i) => {
      return (
        <col style={{width: columnWidths[item.key]}} key={item.key} />
      )
    })
    return <colgroup>{colgroup}</colgroup>
  },

  renderFixedColumnColGroup() {
    const {columns} = this.props
    const {columnWidths} = this.state
    const colgroup = columns.map((item, i) => {
      const colStyle = {
        width: columnWidths[item.key],
        display: item.fixed ? '' : 'none'
      }
      return (
        <col key={item.key} style={colStyle} />
      )
    })
    return <colgroup>{colgroup}</colgroup>
  },

  // 表格
  renderTable(isFixedHeader) {
    const {width, columns} = this.props
    const {tableFixedColumnShadow, tableScrollShadow} = this.state
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
          {this.renderFixedColumnColGroup()}
          {this.renderFixedColumnHeader()}
          {!isFixedHeader && this.renderFixedColumnBody()}
        </table>
      </div>
    )
    const headerRef = isFixedHeader ? `headerScroll` : `scroll`
    const tableScrollStyle = classNames(
      'table-scroll',
      {'table-scroll-shadow': index > -1 && tableScrollShadow}
    )
    return (
      <div style={{position: 'relative'}}>
        {index > -1 && fixedColumn}
        <div ref={headerRef} className={tableScrollStyle}>
          <table className="table" width={width}>
            {this.renderColGroup()}
            {this.renderHeader()}
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
