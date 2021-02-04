
import { Fragment, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import { chartResponse, quoteResponse } from '../config/yahooChart'
import { chartDataSet, dateRange, quoteFilterList } from '../config/price'
import Table from 'react-bootstrap/Table'
import { BsFillXCircleFill } from "react-icons/bs";
import { Line } from 'react-chartjs-2';
const axios = require('axios').default

export default function Home() {

  const [tickers, setTickers] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [yearlyPcnt, setYearlyPcnt] = useState([])
  const [chartData, setChartData] = useState({ 'labels': [...dateRange.map(item => item.fromDate.substring(0, 4))].reverse(), 'datasets': [] })
  const [quote, setQuote] = useState([])
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
    setYearlyPcnt(
      []
    )
    setChartData(
      { 'labels': [...dateRange.map(item => item.fromDate.substring(0, 4))].reverse(), 'datasets': [] }
    )
  }

  const removeItem = async (value) => {
    if (clicked) return

    setTickers(
      [...tickers.filter(x => x !== value)]
    )
    setYearlyPcnt(
      [
        ...yearlyPcnt.filter(x => x.finx(x => x) !== value)
      ]
    )
    setChartData(
      {
        'labels': [...dateRange.map(item => item.fromDate.substring(0, 4))].reverse(),
        'datasets': [...chartData.datasets.filter(x => x.label !== value)]
      }
    )
  }

  async function handleTickers(inputTickers) {

    let newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))

    let inputItems = []

    dateRange.forEach(item => {
      inputItems.push(
        newTickers.map(tickerItem => {
          const newItem = {
            'ticker': tickerItem.toUpperCase(),
            ...item
          }

          return newItem
        })
      )
    })


    let outputItem = { ...chartResponse }
    let outputQuote = { ...quoteResponse }
    let temp = newTickers.map(tickerItem => {
      return {
        'ticker': tickerItem.toUpperCase(),
        'startPrice': null,
        'endPrice': null,
        'yearCnt': 0,
        'data': []
      }
    })
    let query = ''
    let tempQuote = []

    inputItems = inputItems.filter(x => !tickers.includes(x.ticker))

    for (const tickerItems of inputItems) {

      for (const item of tickerItems) {
        query = `ticker=${item.ticker}&fromdate=${item.fromDate}&todate=${item.toDate}`
        outputItem = await axios(`/api/getYahooHistoryPrice?${query}`)

        // outputItem = await getYahooHistoryPrice(item.ticker, item.fromDate, item.toDate)
        const allData = outputItem.data.indicators.quote.find(x => x).close

        if (allData && allData.length > 0) {
          const opening = allData.find(x => x)
          const closing = allData[allData.length - 1]
          temp.filter(x => x.ticker == item.ticker).find(x => x).data.push(((closing - opening) / opening * 100).toFixed(2))

          if (!temp.filter(x => x.ticker == item.ticker).find(x => x).endPrice) temp.filter(x => x.ticker == item.ticker).find(x => x).endPrice = opening
          temp.filter(x => x.ticker == item.ticker).find(x => x).startPrice = closing
          temp.filter(x => x.ticker == item.ticker).find(x => x).yearCnt += 1
        }
        else temp.filter(x => x.ticker == item.ticker).find(x => x).data.push("N/A")
      }
    }


    for (const ticker of newTickers) {
      outputQuote = await axios(`/api/getYahooQuote?ticker=${ticker}`)
      let newQuote = {}
      newQuote['ticker'] = ticker.toUpperCase()

      quoteFilterList.forEach(item => {
        newQuote[item.label] = outputQuote.data[item.column]
      })

      tempQuote.push(
        newQuote
      )
    }

    temp = temp.filter(x => !tickers.includes(x.ticker))

    temp = temp.map(item => {
      const newTemp = {
        'annualized': getAnnualizedPcnt(item),
        'total': getTotalPcnt(item),
        ...item
      }
      return newTemp
    })

    setTickers([
      ...tickers,
      ...temp.map(item => item.ticker)
    ])

    setQuote([
      ...quote,
      ...tempQuote
    ])

    setTableHeader(
      [
        'Ticker',
        'Annualized',
        'Total',
        ...dateRange.map(ii => ii.fromDate.substring(0, 4))
      ]
    )

    setYearlyPcnt(
      [
        ...yearlyPcnt,
        ...temp.map(item => {
          const newItem = [
            item.ticker,
            item.annualized,
            item.total,
            ...item.data
          ]
          return newItem
        })
      ]
    )

    setChartData(
      {
        label: [...dateRange.map(ii => ii.fromDate.substring(0, 4))].reverse(),
        datasets: [...chartData.datasets,
        ...temp.map(item => {
          const r = Math.floor(Math.random() * 255) + 1
          const g = Math.floor(Math.random() * 255) + 1
          const b = Math.floor(Math.random() * 255) + 1

          let backgroundColor = (`rgba(${r}, ${g}, ${b}, 0.4)`)
          let borderColor = (`rgba(${r}, ${g}, ${b}, 1)`)

          const newItem = {
            ...chartDataSet,
            'label': item.ticker,
            'data': item.data.reverse(),
            backgroundColor,
            borderColor,
            'pointBorderColor': borderColor,
            'pointHoverBackgroundColor': borderColor
          }
          return newItem
        })
        ]
      }
    )


  }

  const getTotalPcnt = (item) => {
    return ((item.endPrice - item.startPrice) / item.startPrice * 100).toFixed(2)
  }

  const getAnnualizedPcnt = (item) => {

    let totalPcnt = 1

    //exclude 2021
    item.data.slice(1).forEach(data => {
      if (data != 'N/A') {
        totalPcnt = totalPcnt * (parseFloat(data) / 100 + 1)
      }
    })

    const diffPcnt = ((Math.pow(totalPcnt, 1 / (item.yearCnt - 1)) - 1) * 100).toFixed(2)

    return diffPcnt
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

  const getQuote = (ticker) => {
    const currentQuote = quote.filter(x => x.ticker == ticker).find(x => x) || {}
    return (
      <Fragment key={ticker}>
        <div>
          {Object.keys(currentQuote).map((item, index) => {
            return (
              <p key={index}>
                {item} : {currentQuote[item]}
              </p>
            )
          })}
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        <Fragment>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Control required type="formTicker" name="formTicker" placeholder="Single:  aapl /  Mulitple:  tsm,0700.hk,voo" onKeyUp={(e) => handleChange(e)} />
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
                <OverlayTrigger
                  placement="bottom"
                  key={index}
                  overlay={<Tooltip key={`button-tooltip-${item}`}>{getQuote(item)}</Tooltip>}
                >
                  <h5 key={index}>
                    <Badge pill variant="success" key={index} className="ml-1">

                      {item}

                      <BsFillXCircleFill onClick={() => { removeItem(item) }} className="ml-1 mb-1" />
                    </Badge>
                  </h5>
                </OverlayTrigger>
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

            {yearlyPcnt.map((item, index) => (
              <tr key={index}>
                {item.map((xx, yy) => <td key={`${index}${yy}`}><span style={getCellColor(item[yy])}>{item[yy]}</span></td>)}
              </tr>
            ))}

          </tbody>
        </Table>
        <Line data={chartData} />
      </Container>
    </Fragment >
  )
}
