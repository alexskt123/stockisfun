
import { Fragment, useEffect, useState } from 'react'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import { getYahooHistoryPrice } from '../lib/getYahooHistoryPrice'
import {chartResponse} from '../config/yahooChart'
import Table from 'react-bootstrap/Table'
import { CarouselItem } from 'react-bootstrap'
import { BsFillXCircleFill } from "react-icons/bs";
import {Line} from 'react-chartjs-2';
const axios = require('axios').default

export default function Home() {

  const chartDataSet = {
    fill: false,
    lineTension: 0.1,
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBorderColor: 'rgba(220,220,220,1)',
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
  }

  const dateRange = [
    {
      'fromDate': '2020-01-01',
      'toDate': '2020-12-31'
    },
    {
      'fromDate': '2019-01-01',
      'toDate': '2019-12-31'
    },
    {
      'fromDate': '2018-01-01',
      'toDate': '2018-12-31'
    },
    {
      'fromDate': '2017-01-01',
      'toDate': '2017-12-31'
    },
    {
      'fromDate': '2016-01-01',
      'toDate': '2016-12-31'
    },
    {
      'fromDate': '2015-01-01',
      'toDate': '2015-12-31'
    },
    {
      'fromDate': '2014-01-01',
      'toDate': '2014-12-31'
    },
    {
      'fromDate': '2013-01-01',
      'toDate': '2013-12-31'
    },
    {
      'fromDate': '2012-01-01',
      'toDate': '2012-12-31'
    },
    {
      'fromDate': '2011-01-01',
      'toDate': '2011-12-31'
    },
    {
      'fromDate': '2010-01-01',
      'toDate': '2010-12-31'
    },
  ]

  const [tickers, setTickers] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [yearlyPcnt, setYearlyPcnt] = useState([])
  const [chartData, setChartData] = useState({'labels': [...dateRange.map(item=>item.fromDate.substring(0,4) )].reverse(), 'datasets': []})
  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)

  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    })
  }

  const removeItem = async (value) => {
    if (clicked) return

    setTickers(
      [...tickers.filter(x=>x!==value)]
    )
    setYearlyPcnt(
      [
        ...yearlyPcnt.filter(x=>x[0]!==value)
      ]
    )
    setChartData(
      {
        'labels': [...dateRange.map(item=>item.fromDate.substring(0,4) )].reverse(),
        'datasets': [...chartData.datasets.filter(x=>x.label!==value)]
      }
    )
  }

  const handleTickers = async (ticker) => {
    if(!tickers.find(x=>x==ticker.toUpperCase())) {
      setTickers([
        ...tickers,
        ticker.toUpperCase()
      ]) 

      setTableHeader(
        [
          'Ticker',
          ...dateRange.map(item=>item.fromDate.substring(0,4) )
        ]
      )
    }


    // if(!tickers.find(x=>x==ticker.toUpperCase())) {
    //   tickers.push(ticker.toUpperCase())
    //   setTickers(tickers)      
    // }

    let inputItems = []
    
    dateRange.forEach(item => {
      inputItems.push (
        {
          'ticker': ticker.toUpperCase(),
          ...item
        }
      )
    })

    let outputItem = {...chartResponse}
    let temp = []
    let query = ''

    for(const item of inputItems) {

      query = `ticker=${item.ticker}&fromdate=${item.fromDate}&todate=${item.toDate}`
      outputItem = await axios(`/api/getYahoo?${query}`)

      // outputItem = await getYahooHistoryPrice(item.ticker, item.fromDate, item.toDate)
      if (outputItem.data.indicators && outputItem.data.indicators.quote[0].close.length > 0) {
        const opening = outputItem.data.indicators.quote[0].close[0]
        const closing = outputItem.data.indicators.quote[0].close[outputItem.data.indicators.quote[0].close.length - 1]
        temp.push(((closing - opening) / opening * 100).toFixed(2))
      }
      else temp.push("N/A")
    }

    if(!tickers.find(x=>x==ticker.toUpperCase())) {
      setYearlyPcnt(
        [
          ...yearlyPcnt,
          [
            ticker.toUpperCase(),
            ...temp
          ]
        ]
      )

      const r = Math.floor(Math.random() * 255) + 1
      const g = Math.floor(Math.random() * 255) + 1
      const b = Math.floor(Math.random() * 255) + 1

      let backgroundColor = (`rgba(${r}, ${g}, ${b}, 0.4)`)
      let borderColor = (`rgba(${r}, ${g}, ${b}, 1)`)

      setChartData(
        {
          label: [...dateRange.map(item=>item.fromDate.substring(0,4) )].reverse(),
          datasets: [...chartData.datasets,
            {
              ...chartDataSet,
              'label': ticker.toUpperCase(),
              'data': temp.reverse(),
              backgroundColor,
              borderColor,
              'pointBorderColor': borderColor,
              'pointHoverBackgroundColor': borderColor
            }
          ]
        }
      )      
    }
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

      for(const ticker of inputTickers) {

        await handleTickers(ticker)
  
      }

    }
    setValidated(true)
    setClicked(false)
  }


  useEffect(() => {
    (async () => {

    })()

  }, [])



  return (
    <Fragment>
      <Container style={{ minHeight: '100vh' }} className="mt-5 shadow-lg p-3 mb-5 bg-white rounded">
        <Fragment>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group controlId="exampleForm.ControlInput1">
              <Form.Label>{'Ticker'}</Form.Label>
              <Form.Control required type="formTicker" name="formTicker" onKeyUp={(e) => handleChange(e)} />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={clicked}>
              {'Go'}
            </Button>
          </Form>
        </Fragment>
        <Row className="pl-3 pt-3">
          {
            tickers.map((item, index)=>(
              <Badge pill variant="success" key={index} className="ml-1">
                {item}
                <BsFillXCircleFill onClick={() => { removeItem(item) }} className="ml-1 mb-1" />
              </Badge>
            ))
          }
        </Row>
        <Table className="pl-3 mt-3" responsive>
            <thead>
              <tr>
                {tableHeader.map((item, index)=> (
                  <th key={index}>{item}</th>
                ))
                }

              </tr>
            </thead>
            <tbody>

                {yearlyPcnt.map((item, index) => (
                  <tr key={index}>
                    {item.map((xx,yy) => <td key={`${index}${yy}`}>{item[yy]}</td>)}             
                  </tr>                  
                ))}

            </tbody>
          </Table>      
          <Line data={chartData} />  
      </Container>
    </Fragment>
  )
}
