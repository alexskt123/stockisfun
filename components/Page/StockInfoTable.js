
import { Fragment } from 'react'
import Table from 'react-bootstrap/Table'

const getCellColor = (cellValue) => {
  if ((cellValue || '').toString().replace(/%/, '') < 0) return { color: 'red' }
  else return { color: 'black' }
}

const getCellItem = (item) => {
  if ((item || '').toString().match(/http:/gi))
    return <a href={item} target='_blank' rel="noopener noreferrer">{item}</a>
  else return item
}

const checkCanClick = (item, cellClick) => {
  if (cellClick) {
    cellClick(item)
  }
}

const sticky = { backgroundColor: '#ddd', left: 0, position: 'sticky', zIndex: '997' }

function StockInfoTable({ tableFirstHeader, tableHeader, tableData, sortItem, cellClick, tableSize }) {

  return (
    <Fragment>
      <Table striped bordered hover size={tableSize ? tableSize : "md"} className="pl-3 mt-3" responsive>
        <thead>
          <tr key={'tableFirstHeader'}>
            {tableFirstHeader ?
              tableFirstHeader.map((item, index) => (
                <th style={(index == 0 ? sticky : {})} key={index} >{item}</th>
              ))
              : ''}
          </tr>
          <tr key={'tableHeader'}>
            {tableHeader ?
              tableHeader.map((item, index) => (
                <th style={(index == 0 ? sticky : {})} onClick={() => { sortItem(index) }} key={index} >{item}</th>
              ))
              : ''}
          </tr>
        </thead>
        <tbody>
          {tableData ?
            tableData.map((item, index) => (
              <tr key={index}>
                {item.map((xx, yy) => <td onClick={() => { checkCanClick(item, cellClick) }} style={(yy == 0 ? sticky : {})} key={`${index}${yy}`}><span style={getCellColor(xx)}>{getCellItem(xx)}</span></td>)}
              </tr>
            ))
            : ''}
        </tbody>
      </Table>
    </Fragment>
  )
}

export default StockInfoTable
