
import { Fragment, useState, useEffect } from 'react'

import { dateRange, dateRangeByNoOfYears } from '../config/price'
import TickerInput from '../components/Page/TickerInput'
import TickerBullet from '../components/Page/TickerBullet'
import { getPriceInfo, priceSettingSchema } from '../lib/commonFunction'
import CustomContainer from '../components/Layout/CustomContainer'
import LoadingSpinner from '../components/Loading/LoadingSpinner';

import { useRouter } from 'next/router'
import PriceChange from '../components/PriceChange';

export default function Home() {

  const [settings, setSettings] = useState(priceSettingSchema)
  const [newDateRange, setNewDateRange] = useState(dateRange)

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
  const [clicked, setClicked] = useState(false)

  const handleChange = async (e) => {
    if (e.target.name == 'formYear') {

      const newDateArr = await dateRangeByNoOfYears(e.target.value)
      
      setNewDateRange(newDateArr)
      setSettings({...priceSettingSchema, chartData: { 'labels': [...newDateArr.map(item => item.fromDate.substring(0, 4))].reverse(), 'datasets': [] }})

      // setSettings({
      //   ...settings,
      //   chartData: { 'labels': [...newDateArr.map(item => item.fromDate.substring(0, 4))].reverse(), 'datasets': [...settings.chartData.datasets] }
      // })
    }

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
      chartData: { 'labels': [...newDateRange.map(item => item.fromDate.substring(0, 4))].reverse(), 'datasets': [] }
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
          'labels': [...newDateRange.map(item => item.fromDate.substring(0, 4))].reverse(),
          'datasets': [...settings.chartData.datasets.filter(x => x.label !== value)]
        }
      }
    )
  }

  async function handleTickers(inputTickers, inputYear) {

    setClicked(true)

    const priceInfo = await getPriceInfo(inputTickers, inputYear ? inputYear : 15, settings)
    setSettings(priceInfo)

    setClicked(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {

      const { formTicker, formYear} = formValue
      const inputTickers = formTicker.split(',')

      await handleTickers(inputTickers, formYear)

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
            yearControl={true}
          />
          <TickerBullet tickers={settings.tickers} overlayItem={settings.quote} removeItem={removeItem} />
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <PriceChange inputSettings={settings} inputDateRange={formValue.formYear} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
