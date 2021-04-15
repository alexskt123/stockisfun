
import { Fragment, useState, useEffect } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import StockDetails from '../components/StockDetails'
import Holdings from '../components/Tab/ETFDetail/Holdings'
import Stat from '../components/Tab/ETFDetail/Stat'
import Basics from '../components/Tab/ETFDetail/Basics'

import { etfDetailsSettings } from '../config/etf'

function ETFDetails({ inputTicker }) {

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

  const handleSelect = (key) => {
    setSettings({
      ...settings,
      selectedTab: key
    })
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
      <Tabs style={{ fontSize: '11px' }} className="mt-1" activeKey={settings.selectedTab} onSelect={handleSelect} id="uncontrolled-tab-example">
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
