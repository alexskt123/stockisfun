import { Fragment, useState, useEffect } from 'react'

import FinancialsInfo from '@/components/Parts/FinancialsInfo'
import ForecastInfo from '@/components/Parts/ForecastInfo'
import PriceChange from '@/components/Parts/PriceChange'
import BalanceSheet from '@/components/Tab/StockDetail/BalanceSheet'
import Basics from '@/components/Tab/StockDetail/Basics'
import Earnings from '@/components/Tab/StockDetail/Earnings'
import ETFList from '@/components/Tab/StockDetail/ETFList'
import Peers from '@/components/Tab/StockDetail/Peers'
import Price from '@/components/Tab/StockDetail/Price'
import { stockDetailsSettings } from '@/config/stock'
import { useTab } from '@/lib/hooks/useTab'
import { useRouter } from 'next/router'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

function StockDetails({ inputTicker }) {
  const router = useRouter()
  const tab = useTab(router)

  const changeTab = key => {
    router.push({ query: { ...router.query, tab: key } }, undefined, {
      shallow: true
    })
  }

  const [settings, setSettings] = useState({ ...stockDetailsSettings })

  async function handleTicker() {
    if (!inputTicker) return

    const ticker = (inputTicker || '').toUpperCase()
    const newSettings = { inputTickers: [ticker] }

    setSettings(newSettings)
  }

  useEffect(() => {
    inputTicker !== '' ? handleTicker() : clearItems()
    //todo: fix custom hooks
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputTicker])

  const clearItems = () => {
    setSettings({ ...stockDetailsSettings })
  }

  return (
    <Fragment>
      <Tabs
        style={{ fontSize: '11px' }}
        className="mt-1"
        activeKey={tab}
        onSelect={k => changeTab(k)}
      >
        <Tab eventKey="Price" title="Price">
          <Price inputTicker={settings.inputTickers.find(x => x)} />
        </Tab>
        <Tab eventKey="Basics" title="Basics">
          <Basics inputTicker={settings.inputTickers.find(x => x)} />
        </Tab>
        <Tab eventKey="ETFList" title="ETF List">
          <ETFList inputTicker={settings.inputTickers.find(x => x)} />
        </Tab>
        <Tab eventKey="Price%" title="Price%">
          <PriceChange inputTickers={settings.inputTickers} />
        </Tab>
        <Tab eventKey="BalanceSheet" title="Bal. Sheet">
          <BalanceSheet inputTicker={settings.inputTickers.find(x => x)} />
        </Tab>
        <Tab eventKey="Earnings" title="Earnings">
          <Earnings inputTicker={settings.inputTickers.find(x => x)} />
        </Tab>
        <Tab eventKey="Forecast" title="Forecast">
          <ForecastInfo inputTickers={settings.inputTickers} />
        </Tab>
        <Tab eventKey="Financials" title="Financials">
          <FinancialsInfo inputTickers={settings.inputTickers} />
        </Tab>
        <Tab eventKey="Peers" title="Peers">
          <Peers inputTicker={settings.inputTickers.find(x => x)} />
        </Tab>
      </Tabs>
    </Fragment>
  )
}

export default StockDetails
