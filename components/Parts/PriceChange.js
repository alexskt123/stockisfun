
import { Fragment, useState, useEffect } from 'react'

import { getPriceInfo, sortTableItem, priceSettingSchema } from '../../lib/commonFunction'
import StockInfoTable from '../Page/StockInfoTable'
import { Line } from 'react-chartjs-2'
import LoadingSpinner from '../Loading/LoadingSpinner'
import QuoteCard from './QuoteCard'

function PriceChange({ inputTickers, inputYear }) {

  const [settings, setSettings] = useState(priceSettingSchema)
  const [loading, setLoading] = useState(false)

  async function handleTickers() {
    setLoading(true)

    const noOfYears = inputYear ? inputYear : 15

    clearItems()
    const priceInfo = await getPriceInfo(inputTickers, noOfYears, priceSettingSchema)
    setSettings(priceInfo)

    setLoading(false)
  }

  const sortItem = async (index) => {
    setSettings({
      ...settings,
      yearlyPcnt: await sortTableItem(settings.yearlyPcnt, index, settings.ascSort),
      ascSort: !settings.ascSort
    })
  }

  useEffect(async () => {
    await handleTickers()
    return () => setSettings(null)
  }, [inputTickers])

  const clearItems = () => {
    setSettings({
      ...settings,
      tickers: [],
      yearlyPcnt: [],
      quote: [],
      chartData: {}
    })
  }

  return (
    <Fragment>
      {loading ?
        <LoadingSpinner /> : null
      }
      {
        inputTickers.length > 0 && !loading ? <Fragment>
          <StockInfoTable tableSize="sm" tableHeader={settings.tableHeader} tableData={settings.yearlyPcnt} sortItem={sortItem} />
          <QuoteCard inputTicker={inputTickers} isShow={true} minWidth={'20rem'} noClose={true}>
            <Line data={settings.chartData} />
          </QuoteCard>
        </Fragment>
          : null
      }
    </Fragment>
  )
}

export default PriceChange
