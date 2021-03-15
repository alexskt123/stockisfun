
import { Fragment, useState } from 'react'
import CustomContainer from '../../components/Layout/CustomContainer'

import { selectedHeadersArr } from '../../config/etf'
import StockInfoTable from '../../components/Page/StockInfoTable'
import TickerInput from '../../components/Page/TickerInput'
import TickerBullet from '../../components/Page/TickerBullet'
import { sortTableItem, handleDebounceChange } from '../../lib/commonFunction'
import LoadingSpinner from '../../components/Loading/LoadingSpinner'

const axios = require('axios').default

export default function CompareETF() {

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

  const clearItems = () => {
    setTickers([])
    setEtfInfo([])
  }

  const removeItem = (value) => {
    setTickers(
      [...tickers.filter(x => x !== value)]
    )
    setEtfInfo(
      [...etfInfo.filter(x => x.find(x => x) !== value)]
    )
  }

  async function handleTickers(inputTickers) {

    const newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))
    const temp = await Promise.all(newTickers.map(async ticker => {
      const etf = await axios(`/api/etfdb/getETFDB?ticker=${ticker}`)
      const performance = await axios(`/api/etfdb/getETFPerformance?ticker=${ticker}`)
      const { data: etfData } = etf
      const { data: performanceData } = performance

      return ({
        ticker: ticker.toUpperCase(),
        info: { ...etfData.basicInfo, ...performanceData }
      })
    }))

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
            <LoadingSpinner /> : null
          }
          <StockInfoTable tableHeader={tableHeader} tableData={etfInfo} sortItem={sortItem} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
