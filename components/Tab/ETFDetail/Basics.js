
import { Fragment, useState, useEffect } from 'react'
import Alert from 'react-bootstrap/Alert'

import { etfDetailsSettings } from '../../../config/etf'
import Price from '../../../components/Parts/Price'
import StockInfoTable from '../../../components/Page/StockInfoTable'

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
          : <Alert className="mt-2" key={'Alert-No-Stock-Info'} variant={'success'}>
            {'Please enter a valid sticker!'}
          </Alert>
      }
    </Fragment >
  )
}
