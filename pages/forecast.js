
import { Fragment, useState } from 'react'
import Container from 'react-bootstrap/Container'

import StockInfoTable from '../components/StockInfoTable'
import TickerInput from '../components/TickerInput'
import TickerBullet from '../components/TickerBullet'
import { sortTableItem } from '../lib/commonFunction'
const axios = require('axios').default

export default function Home() {

  const [tickers, setTickers] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [stockInfo, setstockInfo] = useState([])


  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)
  const [ascSort, setAscSort] = useState(false)


  const handleChange = (e) => {
    setFormValue({
      ...formValue,
      [e.target.name]: e.target.value
    })
  }


  const sortItem = async (index) => {
    setAscSort(!ascSort)
    setstockInfo(
      await sortTableItem(stockInfo, index, ascSort)
    )
  }

  const clearItems = async () => {
    setTickers([])
    setstockInfo([])
  }

  const removeItem = async (value) => {
    if (clicked) return

    setTickers(
      [...tickers.filter(x => x !== value)]
    )
    setstockInfo(
      [
        ...stockInfo.filter(x => x.find(x => x) !== value)
      ]
    )
  }

  async function handleTickers(inputTickers) {

    let newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))
    const selectedHeaders = "Price,1 Yr Forecast,5 Yr Forecast,Median,High,Low,Average %,Strong Buy,Buy,Hold,Sell,Strong Sell"
    const selectedHeadersArr = selectedHeaders.split(',')

    let etfCount
    let forecast
    let recommend
    let temp = []

    for (const ticker of newTickers) {
      //etfCount = await axios(`/api/getStockETFCount?ticker=${ticker}`)
      forecast = await axios(`/api/getStockFairValue?ticker=${ticker}`)
      //recommend = await axios(`/api/getYahooRecommendTrend?ticker=${ticker}`)
      let etf = {}
      etf['ticker'] = ticker.toUpperCase()
      etf['info'] = forecast.data

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

    setstockInfo(
      [
        ...stockInfo,
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
        <TickerInput
          validated={validated}
          handleSubmit={handleSubmit}
          placeholderText={"Single:  aapl /  Mulitple:  aapl,tdoc,fb,gh"}
          handleChange={handleChange}
          clicked={clicked}
          clearItems={clearItems}
          tableHeader={tableHeader}
          tableData={stockInfo}
          exportFileName={'Stock_forecast.csv'}
        />
        <TickerBullet tickers={tickers} overlayItem={[]} removeItem={removeItem} />
        <StockInfoTable tableFirstHeader = {['','Walletinvestor','','','MoneyCnn','','','','Yahoo']} tableHeader={tableHeader} tableData={stockInfo} sortItem={sortItem} />
      </Container>
    </Fragment >
  )
}
