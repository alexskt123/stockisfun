
import { Fragment, useState } from 'react'
import CustomContainer from '../components/Layout/CustomContainer'

import TickerInput from '../components/Page/TickerInput'
import TickerBullet from '../components/Page/TickerBullet'
import { sortTableItem } from '../lib/commonFunction'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import FinancialsInfo from '../components/FinancialsInfo'
import { getFinancialsInfo, financialsSettingSchema } from '../lib/commonFunction'

const axios = require('axios').default

export default function Home() {

  const [settings, setSettings] = useState(financialsSettingSchema)

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)


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
    setSettings({
      ...settings,
      tickers: [],
      stockInfo: []
    })
  }

  const removeItem = async (value) => {
    if (clicked) return

    setSettings(
      {
        ...settings,
        tickers: [...settings.tickers.filter(x => x !== value)],
        stockInfo: [...settings.stockInfo.filter(x => x.find(x => x) !== value)]
      }
    )
  }

  async function handleTickers(inputTickers) {
    setClicked(true)
    
    const financials = await getFinancialsInfo(inputTickers, settings)
    setSettings(financials)

    setClicked(false)

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
            tableHeader={settings.tableHeader}
            tableData={settings.stockInfo}
            exportFileName={'Stock_financial.csv'}
          />
          <TickerBullet tickers={settings.tickers} overlayItem={[]} removeItem={removeItem} />
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <FinancialsInfo inputSettings={settings} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
