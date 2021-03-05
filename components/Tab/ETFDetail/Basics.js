
import { Fragment, useState, useEffect } from 'react'

import { etfDetailsSettings } from '../../../config/etf'
import Price from '../../../components/Parts/Price'
import StockInfoTable from '../../../components/Page/StockInfoTable'
import ValidTickerAlert from '../../Parts/ValidTickerAlert'

export default function Stat({ inputSettings }) {

  const [settings, setSettings] = useState({ ...etfDetailsSettings })

  useEffect(() => {
    setSettings(inputSettings)
  }, [inputSettings])

  return (
    <Fragment>
      {
        settings.basics.tableData.filter(x => x.find(x => x) == 'Price').find(x => x)
          ? <Fragment>
            <StockInfoTable tableSize="sm" tableHeader={settings.basics.tableHeader} tableData={settings.basics.tableData} />
            <Price inputTicker={settings.inputETFTicker.find(x => x)} inputDays={90} />
          </Fragment>
          : <ValidTickerAlert/>
      }
    </Fragment >
  )
}
