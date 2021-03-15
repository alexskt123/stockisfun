
import { Fragment, useState, useEffect } from 'react'

import { getForecastInfo, sortTableItem, forecastSettingSchema } from '../../lib/commonFunction'
import LoadingSpinner from '../Loading/LoadingSpinner'
import StockInfoTable from '../../components/Page/StockInfoTable'
import {forecastTableFirstHeader} from '../../config/forecast'

function ForecastInfo({ inputSettings, inputTickers }) {

  const [settings, setSettings] = useState(forecastSettingSchema)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    handleTickers()
  }, [inputSettings, inputTickers])

  async function handleTickers() {
    setLoading(true)

    if (inputSettings) {
      setSettings(inputSettings)
    } else if (inputTickers) {
      clearItems()
      const forecastInfo = await getForecastInfo(inputTickers, forecastSettingSchema)
      setSettings(forecastInfo)
    } else if (inputTickers.length <= 0) {
      clearItems()
    }

    setLoading(false)
  }

  const sortItem = async (index) => {
    setSettings({
      ...settings,
      stockInfo: await sortTableItem(settings.stockInfo, index, settings.ascSort),
      ascSort: !settings.ascSort
    })
  }

  const clearItems = () => {
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
        <LoadingSpinner /> : null
      }
      <StockInfoTable tableSize="sm" tableFirstHeader={[...forecastTableFirstHeader]} tableHeader={settings.tableHeader} tableData={settings.stockInfo} sortItem={sortItem} />
    </Fragment>
  )
}

export default ForecastInfo
