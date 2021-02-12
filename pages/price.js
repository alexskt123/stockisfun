
import { Fragment, useState, useEffect } from 'react'

import { dateRange } from '../config/price'
import TickerInput from '../components/TickerInput'
import TickerBullet from '../components/TickerBullet'
import { getPriceInfo, sortTableItem, priceSettingSchema } from '../lib/commonFunction'
import CustomContainer from '../components/CustomContainer'
import LoadingSpinner from '../components/Loading/LoadingSpinner';

import { useRouter } from 'next/router'
import PriceInfo from '../components/PriceInfo';

const axios = require('axios').default

export default function Home() {

  const [settings, setSettings] = useState(priceSettingSchema)

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
      yearlyPcnt: [],
      quote: [],
      chartData: { 'labels': [...dateRange.map(item => item.fromDate.substring(0, 4))].reverse(), 'datasets': [] }
    })
  }

  const removeItem = async (value) => {
    if (clicked) return

    setSettings(
      {
        ...settings,
        tickers: [...settings.tickers.filter(x => x !== value)],
        yearlyPcnt: [...settings.yearlyPcnt.filter(x => x.find(x => x) !== value)],
        chartData: {
          'labels': [...dateRange.map(item => item.fromDate.substring(0, 4))].reverse(),
          'datasets': [...settings.chartData.datasets.filter(x => x.label !== value)]
        }
      }
    )
  }

  async function handleTickers(inputTickers) {

    setClicked(true)

    const priceInfo = await getPriceInfo(inputTickers, settings)
    setSettings(priceInfo)

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
            placeholderText={"Single:  aapl /  Mulitple:  tsm,0700.hk,voo"}
            handleChange={handleChange}
            clicked={clicked}
            clearItems={clearItems}
            tableHeader={settings.tableHeader}
            tableData={settings.yearlyPcnt}
            exportFileName={'Stock_price.csv'}
          />
          <TickerBullet tickers={settings.tickers} overlayItem={settings.quote} removeItem={removeItem} />
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <PriceInfo inputSettings={settings} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
