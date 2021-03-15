
import { Fragment, useState, useEffect } from 'react'

import { getFinancialsInfo, sortTableItem, financialsSettingSchema } from '../../lib/commonFunction'
import LoadingSpinner from '../Loading/LoadingSpinner'
import StockInfoTable from '../Page/StockInfoTable'

function FinancialsInfo({ inputTickers }) {

  const [settings, setSettings] = useState(financialsSettingSchema)
  const [loading, setLoading] = useState(false)

  async function handleTickers() {
    setLoading(true)
    clearItems()
    const financialsInfo = await getFinancialsInfo(inputTickers, financialsSettingSchema)
    setSettings(financialsInfo)
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

  useEffect(() => {
    handleTickers()
  }, [inputTickers])

  return (
    <Fragment>
      {loading ?
        <LoadingSpinner /> : null
      }
      <StockInfoTable tableSize="sm" tableHeader={settings.tableHeader} tableData={settings.stockInfo} sortItem={sortItem} />
    </Fragment>
  )
}

export default FinancialsInfo
