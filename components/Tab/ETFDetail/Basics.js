import { Fragment, useState, useEffect } from 'react'

import LoadingSpinner from '../../../components/Loading/LoadingSpinner'
import StockInfoTable from '../../../components/Page/StockInfoTable'
import { etfDetailsBasicSettings } from '../../../config/etf'
import { getETFDetailBasics } from '../../../lib/commonFunction'
import { fireToast } from '../../../lib/toast'
import ValidTickerAlert from '../../Parts/ValidTickerAlert'

export default function Basics({ inputETFTicker }) {
  const [settings, setSettings] = useState({ ...etfDetailsBasicSettings })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    ;(async () => {
      inputETFTicker ? await handleTicker(inputETFTicker) : clearItems()
    })()
    return () => clearItems()
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputETFTicker])

  const handleTicker = async inputETFTicker => {
    setLoading(true)
    clearItems()

    const newSettings = await getETFDetailBasics(inputETFTicker)
    setSettings({
      ...settings,
      ...newSettings
    })

    inputETFTicker &&
    !newSettings.tableData.filter(x => x.find(x => x) === 'Price').find(x => x)
      ? fireToast({
          icon: 'error',
          title: 'Invalid Ticker'
        })
      : null

    setLoading(false)
  }

  const clearItems = () => {
    setSettings({ ...etfDetailsBasicSettings })
  }

  return (
    <Fragment>
      {loading ? (
        <LoadingSpinner />
      ) : settings.tableData
          .filter(x => x.find(x => x) === 'Price')
          .find(x => x) ? (
        <Fragment>
          <StockInfoTable
            tableSize="sm"
            tableHeader={settings.tableHeader}
            tableData={settings.tableData}
          />
        </Fragment>
      ) : (
        <ValidTickerAlert />
      )}
    </Fragment>
  )
}
