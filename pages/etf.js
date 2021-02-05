
import { Fragment, useState } from 'react'
import Container from 'react-bootstrap/Container'

import { selectedHeadersArr } from '../config/etf'
import StockInfoTable from '../components/StockInfoTable'
import TickerInput from '../components/TickerInput'
import TickerBullet from '../components/TickerBullet'
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
        ...etfInfo.filter(x => x.find(x => x) !== value)
      ]
    )
  }

  async function handleTickers(inputTickers) {

    let newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))

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
          placeholderText={"Single:  voo /  Mulitple:  voo,arkk,smh"}
          handleChange={handleChange}
          clicked={clicked}
          clearItems={clearItems}
        />
        <TickerBullet tickers={tickers} overlayItem={[]} removeItem={removeItem} />
        <StockInfoTable tableHeader={tableHeader} tableData={etfInfo} />
      </Container>
    </Fragment >
  )
}
