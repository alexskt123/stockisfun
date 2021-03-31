
import { Fragment, useState } from 'react'
import { useRouter } from 'next/router'

import { dateRange, dateRangeByNoOfYears } from '../../config/price'
import TickerInput from '../../components/Page/TickerInput'
import TickerBullet from '../../components/Page/TickerBullet'
import CustomContainer from '../../components/Layout/CustomContainer'
import LoadingSpinner from '../../components/Loading/LoadingSpinner'
import PriceChange from '../../components/Parts/PriceChange'

import { getPriceInfo, priceSettingSchema, handleDebounceChange, handleFormSubmit } from '../../lib/commonFunction'
import { useQuery } from '../../lib/hooks/useQuery'

export default function ComparePrice() {
  const router = useRouter()
  const { query, year } = router.query

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
    }
    handleDebounceChange(e, formValue, setFormValue)
  }

  const clearItems = () => {
    setSettings({
      ...settings,
      tickers: [],
      yearlyPcnt: [],
      quote: [],
      chartData: { 'labels': [...newDateRange.map(item => item.fromDate.substring(0, 4))].reverse(), 'datasets': [] }
    })
    router.push(router.pathname)
  }

  const removeItem = (value) => {
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
            clicked={clicked}
            clearItems={clearItems}
            tableHeader={settings.tableHeader}
            tableData={settings.yearlyPcnt}
            exportFileName={'Stock_price.csv'}
            yearControl={true}
          />
          <TickerBullet tickers={settings.tickers} overlayItem={settings.quote} removeItem={removeItem} />
          {clicked ?
            <LoadingSpinner /> : null
          }
          <PriceChange inputSettings={settings} />
        </Fragment>
      </CustomContainer>
    </Fragment >
  )
}
