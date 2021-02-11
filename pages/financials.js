
import { Fragment, useState } from 'react'
import CustomContainer from '../components/CustomContainer'

import StockInfoTable from '../components/StockInfoTable'
import TickerInput from '../components/TickerInput'
import TickerBullet from '../components/TickerBullet'
import { sortTableItem } from '../lib/commonFunction'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
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
    const selectedHeaders = "Last Revenue,Past 2 Yrs Revenue,Past 3 Yrs Revenue,Last Income,Past 2 Yrs Income,Past 3 Yrs Income,Trailing PE,Return On Equity,Gross Margin,Return On Assets"
    const selectedHeadersArr = selectedHeaders.split(',')

    let financials
    let temp = []

    for (const ticker of newTickers) {
      financials = await axios(`/api/getYahooEarnings?ticker=${ticker}`)

      let etf = {}
      etf['ticker'] = ticker.toUpperCase()
      etf['info'] = financials.data

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
            exportFileName={'Stock_financial.csv'}
          />
          <TickerBullet tickers={tickers} overlayItem={[]} removeItem={removeItem} />
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <StockInfoTable tableHeader={tableHeader} tableData={stockInfo} sortItem={sortItem} />
          </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
