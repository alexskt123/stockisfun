
import { Fragment, useState, useEffect } from 'react'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'

import Price from '../../../components/Parts/Price'
import StockInfoTable from '../../../components/Page/StockInfoTable'
import ValidTickerAlert from '../../Parts/ValidTickerAlert'
import LoadingSpinner from '../../../components/Loading/LoadingSpinner'
import AddDelStock from '../../../components/Fire/AddDelStock'

import { etfDetailsBasicSettings } from '../../../config/etf'
import { getETFDetailBasics } from '../../../lib/commonFunction'
import { fireToast } from '../../../lib/toast'

export default function Stat({ inputETFTicker }) {
  const [settings, setSettings] = useState({ ...etfDetailsBasicSettings })
  const [clicked, setClicked] = useState(false)

  useEffect(async () => {
    clearItems()

    if (inputETFTicker) setClicked(true)
    const newSettings = await getETFDetailBasics(inputETFTicker)
    setSettings({
      ...settings,
      ...newSettings
    })

    if (inputETFTicker && !newSettings.tableData.filter(x => x.find(x => x) == 'Price').find(x => x))
      fireToast({
        icon: 'error',
        title: 'Invalid Ticker'
      })

    setClicked(false)

  }, [inputETFTicker])

  const clearItems = () => {
    setSettings({ ...etfDetailsBasicSettings })
  }

  return (
    <Fragment>
      {clicked ? <LoadingSpinner /> : null}
      {
        settings.tableData.filter(x => x.find(x => x) == 'Price').find(x => x)
          ? <Fragment>
            <Row className="ml-2 mt-3">
              <Badge variant={'success'}>{inputETFTicker}</Badge>
              <AddDelStock inputTicker={inputETFTicker} handleList='etf' />
            </Row>
            <StockInfoTable tableSize="sm" tableHeader={settings.tableHeader} tableData={settings.tableData} />
            <Price inputTicker={inputETFTicker} inputDays={90} />
          </Fragment>
          : <ValidTickerAlert />
      }
    </Fragment >
  )
}
