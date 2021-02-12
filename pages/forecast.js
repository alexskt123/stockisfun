
import { Fragment, useState, useEffect } from 'react'
import CustomContainer from '../components/CustomContainer'

import StockInfoTable from '../components/StockInfoTable'
import TickerInput from '../components/TickerInput'
import TickerBullet from '../components/TickerBullet'
import { sortTableItem } from '../lib/commonFunction'
import LoadingSpinner from '../components/Loading/LoadingSpinner'

import { useRouter } from 'next/router'

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

    setClicked(true)

    let newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))
    const selectedHeaders = "Price,1 Yr Forecast,5 Yr Forecast,1 Yr %,5 Yr %,Score(>50 Buy <50 Sell),1 Yr Median,1 Yr High,1 Yr Low,Average %,Strong Buy,Buy,Hold,Sell,Strong Sell"
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

    setClicked(false)

  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {

      const { formTicker } = formValue

      const inputTickers = formTicker.split(',')

      await handleTickers(inputTickers)

    }
    setValidated(true)
  }

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    if (query) {
      handleTickers(query.split(','))
    }
  }, [query])

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
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
          {clicked ?
            <LoadingSpinner/> : ''
          }
          <StockInfoTable tableFirstHeader={['', 'WalletInvestor', '', '', '', '', 'Financhill', 'MoneyCnn', '', '', '', 'Yahoo']} tableHeader={tableHeader} tableData={stockInfo} sortItem={sortItem} />
        </Fragment >
      </CustomContainer>
    </Fragment >
  )
}
