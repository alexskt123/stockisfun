
import { Fragment } from 'react'
import Table from 'react-bootstrap/Table'

const getCellColor = (cellValue) => {
    if ((cellValue || '').toString().replace(/\%/, '') < 0) return { color: 'red' }
    else return { color: 'black' }
  }

function StockInfoTable({ tableHeader, tableData }) {
  return (
    <Fragment>     
        <Table className="pl-3 mt-3" responsive>
          <thead>
            <tr>
              {tableHeader.map((item, index) => (
                <th key={index}>{item}</th>
              ))
              }

            </tr>
          </thead>
          <tbody>

            {tableData.map((item, index) => (
              <tr key={index}>
                {item.map((xx, yy) => <td key={`${index}${yy}`}><span style={getCellColor(xx)}>{xx}</span></td>)}
              </tr>
            ))}

          </tbody>
        </Table>
    </Fragment>
  )
}

export default StockInfoTable