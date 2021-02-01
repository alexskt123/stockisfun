
import { Fragment } from 'react'
import Container from 'react-bootstrap/Container'
import { getMorning } from '../lib/getMorningStar'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'


export default function Soup({ items, itemHeaders }) {

  const handleClick = async () => {
    await setWords(items)
  }

  if (items.length <= 0) return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        {'Loading'}
      </Container>
    </Fragment>
  )

  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              {itemHeaders.map((item, idx) => {
                return <th key={idx}>{item}</th>
              })}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              return (
                <tr key={idx}>
                  {itemHeaders.map((hdrItem, hdrIdx) => {
                    return <td key={hdrIdx}>{item[hdrItem]}</td>
                  })}
                </tr>
              )
            })}

          </tbody>
        </Table>
        <Button onClick={() => { handleClick() }} variant='dark'>{'Add'}</Button>
      </Container>

    </Fragment>
  )
}
