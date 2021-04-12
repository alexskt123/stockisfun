
import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'

import CustomContainer from '../../components/Layout/CustomContainer'
import ForecastInfo from '../../components/Parts/ForecastInfo'
import TickerInput from '../../components/Page/TickerInput'
import TickerBullet from '../../components/Page/TickerBullet'
import LoadingSpinner from '../../components/Loading/LoadingSpinner'
import { forecastSettingSchema, handleDebounceChange, handleFormSubmit } from '../../lib/commonFunction'
import { useQuery } from '../../lib/hooks/useQuery'

export default function CompareForecast() {
  const router = useRouter()
  const { query } = router.query

  const [settings, setSettings] = useState(forecastSettingSchema)
  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)

  const handleChange = (e) => {
    handleDebounceChange(e, formValue, setFormValue)
  }

  const clearItems = () => {
    setSettings({
      ...settings,
      tickers: [],
      stockInfo: []
    })
    router.push(router.pathname)
  }

  const removeItem = (value) => {
    setSettings(
      {
        ...settings,
        tickers: [...settings.tickers.filter(x => x !== value)],
        stockInfo: [...settings.stockInfo.filter(x => x.find(x => x) !== value)]
      }
    )
  }

  const handleTickers = (inputTickers) => {
    setClicked(true)

    setSettings({
      ...settings,
      tickers: inputTickers
    })

    setClicked(false)
  }

  const handleSubmit = (event) => {
    handleFormSubmit(event, formValue, { query }, router, setValidated)
  }

  useQuery(handleTickers, { query })

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <TickerInput
            validated={validated}
            handleSubmit={handleSubmit}
            placeholderText={'Single:  aapl /  Mulitple:  aapl,tdoc,fb,gh'}
            handleChange={handleChange}
            clicked={clicked}
            clearItems={clearItems}
          />
          <TickerBullet tickers={settings.tickers} removeItem={removeItem} />
          {clicked ?
            <LoadingSpinner /> : null
          }
          <ForecastInfo inputTickers={settings.tickers} />
        </Fragment >
      </CustomContainer>
    </Fragment >
  )
}
