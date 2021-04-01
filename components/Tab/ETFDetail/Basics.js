
import { Fragment, useState, useEffect } from 'react'
import Badge from 'react-bootstrap/Badge'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import Price from '../../../components/Parts/Price'
import StockInfoTable from '../../../components/Page/StockInfoTable'
import ValidTickerAlert from '../../Parts/ValidTickerAlert'
import LoadingSpinner from '../../../components/Loading/LoadingSpinner'
import AddDelStock from '../../../components/Fire/AddDelStock'

import { etfDetailsBasicSettings } from '../../../config/etf'
import { getETFDetailBasics } from '../../../lib/commonFunction'
import { fireToast } from '../../../lib/toast'
import HappyShare from '../../Parts/HappyShare'

export default function Basics({ inputETFTicker }) {
  const [settings, setSettings] = useState({ ...etfDetailsBasicSettings })
  const [loading, setLoading] = useState(false)
  const [ticker, setTicker] = useState(null)

  useEffect(async () => {
    await handleTicker(inputETFTicker)
  }, [inputETFTicker])


  const handleTicker = async (inputETFTicker) => {
    setLoading(true)
    clearItems()

    const newSettings = await getETFDetailBasics(inputETFTicker)
    setSettings({
      ...settings,
      ...newSettings
    })

    setTicker(inputETFTicker)

    if (inputETFTicker && !newSettings.tableData.filter(x => x.find(x => x) == 'Price').find(x => x))
      fireToast({
        icon: 'error',
        title: 'Invalid Ticker'
      })

    setLoading(false)
  }

  const clearItems = () => {
    setSettings({ ...etfDetailsBasicSettings })
  }

  return (
    <Fragment>
      {loading ? <LoadingSpinner /> : null}
      {
        settings.tableData.filter(x => x.find(x => x) == 'Price').find(x => x)
          ? <Fragment>
            <Row>
              <Col>
                <Badge className="ml-3" variant={'success'}>{ticker}</Badge>
                <AddDelStock inputTicker={ticker} handleList='etf' />
                <HappyShare/>
                <Price inputTicker={ticker} inputMA={'ma'} />
              </Col>
              <Col>
                <StockInfoTable tableSize="sm" tableHeader={settings.tableHeader} tableData={settings.tableData} />
              </Col>
            </Row>
          </Fragment>
          : <ValidTickerAlert />
      }
    </Fragment >
  )
}
