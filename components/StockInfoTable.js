
import { Fragment } from 'react'
import Table from 'react-bootstrap/Table'

const getCellColor = (cellValue) => {
  if ((cellValue || '').toString().replace(/\%/, '') < 0) return { color: 'red' }
  else return { color: 'black' }
}

const getCellItem = (item) => {
  if ((item || '').toString().match(/http:/gi))
    return <a href={item} target='_blank'>{item}</a>
  else return item
}

const sticky = { backgroundColor: '#ddd', left: 0, position: 'sticky', zIndex: '997' }

function StockInfoTable({ tableHeader, tableData, sortItem }) {

  return (
    <Fragment>
      <Table className="pl-3 mt-3" responsive>
        <thead>
          <tr>
            {tableHeader.map((item, index) => (
              <th style={(index == 0 ? sticky : {})} onClick={() => { sortItem(index) }} key={index} >{item}</th>
            ))
            }

          </tr>
        </thead>
        <tbody>

          {tableData.map((item, index) => (
            <tr key={index}>
              {item.map((xx, yy) => <td style={(yy == 0 ? sticky : {})} key={`${index}${yy}`}><span style={getCellColor(xx)}>{getCellItem(xx)}</span></td>)}
            </tr>
          ))}

        </tbody>
      </Table>
    </Fragment>
  )
}

export default StockInfoTable
