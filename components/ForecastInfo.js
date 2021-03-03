
import { Fragment, useState, useEffect } from 'react'

import { getForecastInfo, sortTableItem, forecastSettingSchema } from '../lib/commonFunction'
import LoadingSpinner from './Loading/LoadingSpinner'
import StockInfoTable from '../components/Page/StockInfoTable'
import {forecastTableFirstHeader} from '../config/forecast'

function ForecastInfo({ inputSettings, inputTickers }) {

  const [settings, setSettings] = useState(forecastSettingSchema)
  const [loading, setLoading] = useState(false)

  async function handleTickers() {

    setLoading(true)

    if (inputSettings) {
      setSettings(inputSettings)
    } else if (inputTickers) {
      await clearItems()
      const forecastInfo = await getForecastInfo(inputTickers, forecastSettingSchema)
      setSettings(forecastInfo)
    } else if (inputTickers.length <= 0) {
      await clearItems()
    }

    setLoading(false)
  }

  useEffect(() => {
    handleTickers()
  }, [inputSettings, inputTickers])

  const sortItem = async (index) => {
    setSettings({
      ...settings,
      stockInfo: await sortTableItem(settings.stockInfo, index, settings.ascSort),
      ascSort: !settings.ascSort
    })
  }

  const clearItems = async () => {
    setSettings({
      ...settings,
      tickers: [],
      tableHeader: [],
      stocInfo: []
    })
  }

  return (
    <Fragment>
      {loading ?
        <LoadingSpinner /> : ''
      }
      <StockInfoTable tableSize="sm" tableFirstHeader={[...forecastTableFirstHeader]} tableHeader={settings.tableHeader} tableData={settings.stockInfo} sortItem={sortItem} />
    </Fragment>
  )
}

export default ForecastInfo
