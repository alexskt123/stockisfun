
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import CustomContainer from '../components/Layout/CustomContainer'
import StockDetails from '../components/StockDetails'
import Holdings from '../components/Tab/ETFDetail/Holdings'
import Stat from '../components/Tab/ETFDetail/Stat'
import Basics from '../components/Tab/ETFDetail/Basics'
import SearchAccordion from '../components/Page/SearchAccordion'
import TypeAhead from '../components/Page/TypeAhead'

import { etfDetailsSettings } from '../config/etf'

export default function ETFDetail() {
  const [settings, setSettings] = useState({ ...etfDetailsSettings })

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    handleTicker(query || '')
  }, [query])

  const handleChange = (e) => {
    const input = e.find(x => x)
    input ? router.push(`/etfdetail?query=${input.symbol}`) : null
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

  const clearItems = () => {
    router.push('/etfdetail')
  }


  const handleTicker = (inputTicker) => {
    const newSettings = {
      ...etfDetailsSettings,
      inputETFTicker: inputTicker.toUpperCase()
    }

    setSettings(newSettings)
  }

  const handleSelect = (key) => {
    setSettings({
      ...settings,
      selectedTab: key
    })
  }

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          <SearchAccordion inputTicker={settings.inputETFTicker}>
            <TypeAhead
              placeholderText={'i.e. ARKK'}
              handleChange={handleChange}
              clearItems={clearItems}
              filter={'ETF'}
            />
          </SearchAccordion>
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
      </CustomContainer>
    </Fragment >
  )
}
