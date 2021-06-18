
import { Fragment, useState, useEffect } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import StockDetails from '../components/StockDetails'
import Holdings from '../components/Tab/ETFDetail/Holdings'
import Stat from '../components/Tab/ETFDetail/Stat'
import Basics from '../components/Tab/ETFDetail/Basics'

import { etfDetailsSettings } from '../config/etf'
import { useRouter } from 'next/router'
import { useTab } from '../lib/hooks/useTab'

function ETFDetails({ inputTicker }) {
  const router = useRouter()
  const tab = useTab(router)

  const changeTab = key => {
    router.push({ query: { ...router.query, tab: key } }, undefined, { shallow: true })
  }

  const [settings, setSettings] = useState({ ...etfDetailsSettings })

  const handleTicker = (inputTicker) => {
    const newSettings = {
      ...etfDetailsSettings,
      inputETFTicker: inputTicker.toUpperCase()
    }

    setSettings(newSettings)
  }

  useEffect(() => {
    inputTicker && inputTicker != '' ? handleTicker(inputTicker) : clearItems()
  }, [inputTicker])

  const clearItems = () => {
    setSettings({ ...etfDetailsSettings })
  }

  const cellClick = (item) => {
    setSettings({
      ...settings,
      selectedTab: 'StockDetails',
      selectedStockTicker: item.find(x => x),
      disableSelectedStockTab: false,
      selectedStockTitle: item.find(x => x)
    })
  }

  return (
    <Fragment>
      <Tabs
        style={{ fontSize: '11px' }}
        className="mt-1"
        activeKey={tab}
        onSelect={(k) => changeTab(k)}
      >
        <Tab eventKey="Basics" title="Basics">
          <Basics inputETFTicker={settings.inputETFTicker} />
        </Tab>
        <Tab eventKey="Holdings" title="Holdings">
          <Holdings inputETFTicker={settings.inputETFTicker} cellClick={cellClick} />
        </Tab>
        <Tab eventKey="Statistics" title="Stat.">
          <Stat inputETFTicker={settings.inputETFTicker} />
        </Tab>
        <Tab eventKey="StockDetails" title={settings.selectedStockTitle} disabled={settings.disableSelectedStockTab}>
          <StockDetails inputTicker={settings.selectedStockTicker} />
        </Tab>
      </Tabs>
    </Fragment>
  )
}

export default ETFDetails
