
import { Fragment } from 'react'
import Table from 'react-bootstrap/Table'
import Link from 'next/link'

const getCellColor = (item) => {
  const itemData = typeof item == 'object' && item && item.data ? item.data : item
  if (item && item.style) {
    if (item.style == 'green-red') {
      return (item.data || '').toString().replace(/%/, '') < 0 ? { color: 'red' } : { color: 'green' }
    }
  }
  else if ((itemData || '').toString().replace(/%/, '') < 0) return { color: 'red' }
  else return { color: 'black' }
}

const getCellItem = (item) => {
  const itemData = typeof item == 'object' && item && item.data ? item.data : item
  if ((itemData || '').toString().match(/http:/gi))
    return <a href={itemData} target='_blank' rel="noopener noreferrer">{itemData}</a>
  else if (typeof item == 'object' && item && item.data && item.link) {
    return <Link href={item.link} ><a>{itemData}</a></Link>
  }
  else return itemData
}

const checkCanClick = (item, cellClick) => {
  const itemData = typeof item == 'object' && item && item.data ? item.data : item
  if (cellClick) {
    cellClick(itemData)
  }
}

const sticky = { backgroundColor: '#f0f0f0', left: 0, position: 'sticky', zIndex: '997' }

function StockInfoTable({ tableFirstHeader, tableHeader, tableData, sortItem, cellClick, tableSize, striped }) {

  return (
    <Fragment>
      <Table
        striped={striped ? true : false}
        bordered
        hover
        size={tableSize ? tableSize : 'md'}
        className="pl-3 mt-3"
        responsive
      >
        <thead>
          <tr key={'tableFirstHeader'}>
            {tableFirstHeader ?
              tableFirstHeader.map((item, index) => (
                <th style={(index == 0 ? sticky : {})} key={index} >{item}</th>
              ))
              : null}
          </tr>
          <tr key={'tableHeader'}>
            {tableHeader ?
              tableHeader.map((item, index) => (
                <th style={(index == 0 ? sticky : {})} onClick={() => { sortItem(index) }} key={index} >{item}</th>
              ))
              : null}
          </tr>
        </thead>
        <tbody>
          {tableData ?
            tableData.map((item, index) => (
              <tr key={index}>
                {item.map((xx, yy) => <td onClick={() => { checkCanClick(item, cellClick) }} style={(yy == 0 ? sticky : {})} key={`${index}${yy}`}><span style={getCellColor(xx)}>{getCellItem(xx)}</span></td>)}
              </tr>
            ))
            : null}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default StockInfoTable
