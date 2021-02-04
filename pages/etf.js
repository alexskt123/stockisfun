
import { Fragment, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'

import Table from 'react-bootstrap/Table'
import { BsFillXCircleFill } from "react-icons/bs";
const axios = require('axios').default

export default function Home() {

  const [tickers, setTickers] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [etfInfo, setEtfInfo] = useState([])


  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)

  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    })
  }

  const clearItems = async () => {
    setTickers(
      []
    )
    setEtfInfo(
      []
    )
  }

  const removeItem = async (value) => {
    if (clicked) return

    setTickers(
      [...tickers.filter(x => x !== value)]
    )
    setEtfInfo(
      [
        ...etfInfo.filter(x => x[0] !== value)
      ]
    )
  }

  async function handleTickers(inputTickers) {

    let newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))
    const selectedHeaders = "Issuer,Structure,Expense Ratio,Inception,Index Tracked,Category,Asset Class,52 Week Lo,52 Week Hi,AUM,1 Month Avg. Volume,3 Month Avg. Volume"
    const selectedHeadersArr = selectedHeaders.split(',')

    let outputItem
    let temp = []

    for (const ticker of newTickers) {      
      outputItem = await axios(`/api/getETFDB?ticker=${ticker}`)
      let etf = {}
      etf['ticker'] = ticker.toUpperCase()
      etf['info'] = outputItem.data
      temp.push(
        etf
      )

    }

    setTickers([
      ...tickers,
      ...temp.map(item => item.ticker)
    ])

    setTableHeader(
      [
        'Ticker',
        ...selectedHeadersArr
      ]
    )

    setEtfInfo(
      [
        ...etfInfo,
        ...temp.map(item => {
          const newItem = [
            item.ticker,
            ...Object.values(item.info)
          ]
          return newItem
        })
      ]
    )

  }


  const getCellColor = (cellValue) => {
    if (cellValue < 0) return { color: 'red' }
    else return { color: 'black' }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    setClicked(true)

    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {

      const { formTicker } = formValue

      const inputTickers = formTicker.split(',')

      await handleTickers(inputTickers)

    }
    setValidated(true)
    setClicked(false)
  }

  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        <Fragment>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Control required type="formTicker" name="formTicker" placeholder="Single:  voo /  Mulitple:  voo,arkk,smh" onKeyUp={(e) => handleChange(e)} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={clicked}>
              {'Go'}
            </Button>
            <Button className="ml-3" variant="danger" onClick={() => { clearItems() }} disabled={clicked}>
              {'Clear All'}
            </Button>
          </Form>
        </Fragment>
        <Row className="pl-3 pt-3">
          {
            tickers.map((item, index) => (
              <Fragment>
                <h5 key={index}>
                  <Badge pill variant="success" key={index} className="ml-1">

                    {item}

                    <BsFillXCircleFill key={index} onClick={() => { removeItem(item) }} className="ml-1 mb-1" />
                  </Badge>
                </h5>
              </Fragment>
            ))
          }
        </Row>
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

            {etfInfo.map((item, index) => (
              <tr key={index}>
                {item.map((xx, yy) => <td key={`${index}${yy}`}><span style={getCellColor(item[yy])}>{item[yy]}</span></td>)}
              </tr>
            ))}

          </tbody>
        </Table>
      </Container>
    </Fragment >
  )
}
