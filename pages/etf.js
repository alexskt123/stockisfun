
import { Fragment, useState } from 'react'
import CustomContainer from '../components/Layout/CustomContainer'

import { selectedHeadersArr } from '../config/etf'
import StockInfoTable from '../components/Page/StockInfoTable'
import TickerInput from '../components/Page/TickerInput'
import TickerBullet from '../components/Page/TickerBullet'
import { sortTableItem, handleDebounceChange } from '../lib/commonFunction'
import LoadingSpinner from '../components/Loading/LoadingSpinner'

const axios = require('axios').default

export default function Home() {

  const [tickers, setTickers] = useState([])
  const [tableHeader, setTableHeader] = useState([])
  const [etfInfo, setEtfInfo] = useState([])


  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)
  const [ascSort, setAscSort] = useState(false)


  const handleChange = (e) => {
    handleDebounceChange(e, formValue, setFormValue)
  }


  const sortItem = async (index) => {
    setAscSort(!ascSort)
    setEtfInfo(
      await sortTableItem(etfInfo, index, ascSort)
    )
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

    const newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))

    let outputItem
    let outputPerformance
    const temp = []

    for (const ticker of newTickers) {
      outputItem = await axios(`/api/getETFDB?ticker=${ticker}`)
      outputPerformance = await axios(`/api/getETFPerformance?ticker=${ticker}`)
      const etf = {}
      etf['ticker'] = ticker.toUpperCase()
      etf['info'] = { ...outputItem.data.basicInfo, ...outputPerformance.data }
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
        'Price',
        ...selectedHeadersArr,
        '4 Week Return',
        'Year to Date Return',
        '1 Year Return',
        '3 Year Return'
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
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <TickerInput
            validated={validated}
            handleSubmit={handleSubmit}
            placeholderText={'Single:  voo /  Mulitple:  voo,arkk,smh'}
            handleChange={handleChange}
            clicked={clicked}
            clearItems={clearItems}
            tableHeader={tableHeader}
            tableData={etfInfo}
            exportFileName={'Stock_etf.csv'}
          />
          <TickerBullet tickers={tickers} overlayItem={[]} removeItem={removeItem} />
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <StockInfoTable tableHeader={tableHeader} tableData={etfInfo} sortItem={sortItem} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
