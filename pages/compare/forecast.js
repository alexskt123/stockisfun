import { Fragment, useState } from 'react'

import CustomContainer from '@/components/Layout/CustomContainer'
import TickerBullet from '@/components/Page/TickerBullet'
import TickerInput from '@/components/Page/TickerInput'
import ForecastInfo from '@/components/Parts/ForecastInfo'
import {
  forecastSettingSchema,
  handleDebounceChange,
  handleFormSubmit
} from '@/lib/commonFunction'
import { useQuery } from '@/lib/hooks/useQuery'
import { useRouter } from 'next/router'

export default function CompareForecast() {
  const router = useRouter()
  const { query } = router.query

  const [settings, setSettings] = useState(forecastSettingSchema)
  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})

  const handleChange = e => {
    handleDebounceChange(e, formValue, setFormValue)
  }

  const clearItems = () => {
    setSettings({
      ...settings,
      tickers: []
    })
    router.push(router.pathname)
  }

  const removeItem = value => {
    const removed = [...settings.tickers.filter(x => x !== value)]
    setSettings({
      ...settings,
      tickers: removed
    })
    router.push(`${router.pathname}?query=${removed.join(',')}`)
  }

  const handleTickers = inputTickers => {
    setSettings({
      ...settings,
      tickers: inputTickers
    })
  }

  const handleSubmit = event => {
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
            placeholderText={'Single:  aapl /  Multiple:  aapl,tdoc,fb,gh'}
            handleChange={handleChange}
            clearItems={clearItems}
            handleTickers={handleTickers}
          />
          <TickerBullet tickers={settings.tickers} removeItem={removeItem} />
          <ForecastInfo
            inputTickers={settings.tickers}
            exportFileName={'Stock_forecast.csv'}
          />
        </Fragment>
      </CustomContainer>
    </Fragment>
  )
}
