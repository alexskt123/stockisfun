
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import CustomContainer from '../components/Layout/CustomContainer'
import TickerInput from '../components/Page/TickerInput'
import StockDetails from '../components/StockDetails'
import Holdings from '../components/Tab/ETFDetail/Holdings'
import Stat from '../components/Tab/ETFDetail/Stat'
import Basics from '../components/Tab/ETFDetail/Basics'
import SearchAccordion from '../components/Page/SearchAccordion'

import { etfDetailsSettings } from '../config/etf'
import { handleDebounceChange } from '../lib/commonFunction'

export default function ETFDetail() {

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({ formTicker: '' })
  const [clicked, setClicked] = useState(false)

  const [settings, setSettings] = useState({ ...etfDetailsSettings })

  const handleChange = (e) => {
    handleDebounceChange(e, formValue, setFormValue)
  }

  const cellClick = async (item) => {
    setSettings({
      ...settings,
      selectedTab: 'StockDetails',
      selectedStockTicker: item.find(x => x),
      disableSelectedStockTab: false,
      selectedStockTitle: item.find(x => x)
    })
  }

  const clearItems = async () => {
    setSettings({ ...etfDetailsSettings })
    setFormValue({ formTicker: '' })
    router.replace('/etfdetail')
  }

  async function handleTicker(inputTicker) {
    if (!inputTicker) return
    setClicked(true)

    const newSettings = {
      ...settings,
      inputETFTicker: inputTicker.toUpperCase()
    }

    setSettings(newSettings)
    setClicked(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget

    if (form.checkValidity() === false) {
      event.stopPropagation()
    } else {
      const { formTicker } = formValue
      await handleTicker(formTicker)
      router.replace('/etfdetail', `/etfdetail?query=${formTicker.toUpperCase()}`)
    }
    setValidated(true)
  }

  const handleSelect = (key) => {
    setSettings({
      ...settings,
      selectedTab: key
    })
  }

  const router = useRouter()
  const { query } = router.query

  useEffect(() => {
    if (query) {
      handleTicker(query)
    }
  }, [query])

  return (
    <Fragment>
      <CustomContainer style={{ minHeight: '100vh', fontSize: '14px' }}>
        <Fragment>
          <SearchAccordion inputTicker={settings.inputETFTicker}>
            <TickerInput
              validated={validated}
              handleSubmit={handleSubmit}
              placeholderText={'i.e. arkk'}
              handleChange={handleChange}
              formTicker={formValue.formTicker}
              clicked={clicked}
              clearItems={clearItems}
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
