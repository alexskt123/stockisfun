import { Fragment, useState, useEffect } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import { stockDetailsSettings } from '../config/stock'
import Price from './Tab/StockDetail/Price'
import PriceChange from '../components/Parts/PriceChange'
import ForecastInfo from '../components/Parts/ForecastInfo'
import FinancialsInfo from '../components/Parts/FinancialsInfo'
import ETFList from './Tab/StockDetail/ETFList'
import Earnings from './Tab/StockDetail/Earnings'
import Peers from './Tab/StockDetail/Peers'
import BalanceSheet from './Tab/StockDetail/BalanceSheet'
import Basics from './Tab/StockDetail/Basics'

import { useRouter } from 'next/router'
import { useTab } from '../lib/hooks/useTab'

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
    inputTicker != '' ? handleTicker() : clearItems()
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
