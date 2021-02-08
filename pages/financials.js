
import { Fragment, useState } from 'react'
import Container from 'react-bootstrap/Container'

import StockInfoTable from '../components/StockInfoTable'
import TickerInput from '../components/TickerInput'
import TickerBullet from '../components/TickerBullet'
const axios = require('axios').default

export default function Home() {

  const [tickers, setTickers] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [stockInfo, setstockInfo] = useState([])


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
          exportFileName={'Stock_financial.csv'}            
        />        
        <TickerBullet tickers={tickers} overlayItem={[]} removeItem={removeItem}/>
        <StockInfoTable tableHeader={tableHeader} tableData={stockInfo} />
      </Container>
    </Fragment >
  )
}