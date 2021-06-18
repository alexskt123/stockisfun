
import { Fragment, useState, useEffect } from 'react'
import Badge from 'react-bootstrap/Badge'
import CardDeck from 'react-bootstrap/CardDeck'

import Price from '../../../components/Parts/Price'
import QuoteCard from '../../../components/Parts/QuoteCard'
import StockInfoTable from '../../../components/Page/StockInfoTable'
import ValidTickerAlert from '../../Parts/ValidTickerAlert'
import LoadingSpinner from '../../../components/Loading/LoadingSpinner'
import AddDelStock from '../../../components/Fire/AddDelStock'

import { etfDetailsBasicSettings, etfTools } from '../../../config/etf'
import { getETFDetailBasics } from '../../../lib/commonFunction'
import { fireToast } from '../../../lib/toast'
import HappyShare from '../../Parts/HappyShare'

export default function Basics({ inputETFTicker }) {
  const [settings, setSettings] = useState({ ...etfDetailsBasicSettings })
  const [loading, setLoading] = useState(false)
  const [ticker, setTicker] = useState(null)

  useEffect(() => {
    (async () => {
      await handleTicker(inputETFTicker)
    })()
  }, [inputETFTicker])


  const handleTicker = async (inputETFTicker) => {
    setLoading(true)
    clearItems()

    const newSettings = await getETFDetailBasics(inputETFTicker)
    setSettings({
      ...settings,
      ...newSettings
    })

    inputETFTicker && !newSettings.tableData.filter(x => x.find(x => x) == 'Price').find(x => x)
      ? fireToast({
        icon: 'error',
        title: 'Invalid Ticker'
      })
      : setTicker(inputETFTicker)

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
            <CardDeck>
              <QuoteCard tools={etfTools} header={ticker} inputTicker={ticker} isShow={true} noClose={true}>
                <div className="mt-2" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Badge className="ml-1" variant={'light'}>{'Add/Remove:'}</Badge>
                  <AddDelStock inputTicker={ticker} handleList='etf' />
                </div>
                <div className="mt-1" style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <Badge className="ml-1" variant={'light'}>{'Share to your friends!'}</Badge>
                  <HappyShare />
                </div>
                <Price inputTicker={ticker} inputMA={'ma'} />
              </QuoteCard>
              <QuoteCard header={'Details'} inputTicker={ticker} isShow={true} noClose={true}>
                <StockInfoTable tableSize="sm" tableHeader={settings.tableHeader} tableData={settings.tableData} />
              </QuoteCard>
            </CardDeck>
          </Fragment>
          : <ValidTickerAlert />
      }
    </Fragment >
  )
}
