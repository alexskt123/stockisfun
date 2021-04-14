
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

function StockDetails({ inputTicker }) {

  const [settings, setSettings] = useState({ ...stockDetailsSettings })

  async function handleTicker() {
    if (!inputTicker) return

    const ticker = (inputTicker || '').toUpperCase()
    const newSettings = { inputTickers: [ticker] }

    setSettings(newSettings)
  }

  useEffect(() => {
    inputTicker != '' ? handleTicker() : clearItems()
  }, [inputTicker])

  const clearItems = () => {
    setSettings({ ...stockDetailsSettings })
  }

  return (
    <Fragment>
      <Tabs style={{ fontSize: '11px' }} className="mt-1" defaultActiveKey="Price" id="uncontrolled-tab-example">
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
