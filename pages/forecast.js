
import { Fragment, useState, useEffect } from 'react'
import CustomContainer from '../components/CustomContainer'

import ForecastInfo from '../components/ForecastInfo'
import TickerInput from '../components/TickerInput'
import TickerBullet from '../components/TickerBullet'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import { getForecastInfo, forecastSettingSchema } from '../lib/commonFunction'

import { useRouter } from 'next/router'

const axios = require('axios').default

export default function Home() {

  const [settings, setSettings] = useState(forecastSettingSchema)

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
    
    const forecastInfo = await getForecastInfo(inputTickers, settings)
    setSettings(forecastInfo)

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
            tableHeader={settings.tableHeader}
            tableData={settings.stockInfo}
            exportFileName={'Stock_forecast.csv'}
          />
          <TickerBullet tickers={settings.tickers} overlayItem={[]} removeItem={removeItem} />
          {clicked ?
            <LoadingSpinner/> : ''
          }
          <ForecastInfo inputSettings={settings} />
        </Fragment >
      </CustomContainer>
    </Fragment >
  )
}
