
import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'

import TickerInput from '../../components/Page/TickerInput'
import TickerBullet from '../../components/Page/TickerBullet'
import CustomContainer from '../../components/Layout/CustomContainer'
import PriceChange from '../../components/Parts/PriceChange'

import { handleDebounceChange, handleFormSubmit } from '../../lib/commonFunction'
import { useQuery } from '../../lib/hooks/useQuery'

export default function ComparePrice() {
  const router = useRouter()
  const { query, year } = router.query

  const [settings, setSettings] = useState({tickers: [], years: 15})
  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})  

  const handleChange = async (e) => {
    if (e.target.name == 'formYear') {
      setSettings({
        ...settings,
        years: e.target.value
      })

      handleFormSubmit(e, formValue, { query, year: e.target.value}, router, setValidated)
    }
    handleDebounceChange(e, formValue, setFormValue)
  }

  const clearItems = () => {
    setSettings({
      ...settings,
      tickers: [],
      years: 15
    })
    router.push(router.pathname)
  }

  const removeItem = (value) => {
    setSettings(
      {
        ...settings,
        tickers: [...settings.tickers.filter(x => x !== value)]
      }
    )
  }

  async function handleTickers(inputTickers, inputYear) {

    setSettings({
      ...settings,
      tickers: inputTickers,
      years: inputYear
    })
  }

  const handleSubmit = async (event) => {
    handleFormSubmit(event, formValue, { query }, router, setValidated)
  }

  useQuery(handleTickers, { query , year})

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh' }}>
        <Fragment>
          <TickerInput
            validated={validated}
            handleSubmit={handleSubmit}
            placeholderText={'Single:  aapl /  Mulitple:  tsm,0700.hk,voo'}
            handleChange={handleChange}
            clearItems={clearItems}
            exportFileName={'Stock_price.csv'}
            yearControl={true}
          />
          <TickerBullet tickers={settings.tickers} overlayItem={settings.quote} removeItem={removeItem} />
          <PriceChange inputTickers={settings.tickers} inputYear={settings.years} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
