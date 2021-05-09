
import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'

import CustomContainer from '../../components/Layout/CustomContainer'
import TickerInput from '../../components/Page/TickerInput'
import LoadingSpinner from '../../components/Loading/LoadingSpinner'
import { forecastSettingSchema, handleDebounceChange, handleFormSubmit } from '../../lib/commonFunction'
import { useQuery } from '../../lib/hooks/useQuery'
import BirdMouth from '../../components/Parts/BirdMouth'

export default function CompareBirdMouth() {
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
      tickers: []
    })
    router.push(router.pathname)
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
            handleTickers={handleTickers}
          />
          {clicked ?
            <LoadingSpinner /> : null
          }
          <BirdMouth inputTickers={settings.tickers} />
        </Fragment >
      </CustomContainer>
    </Fragment >
  )
}
