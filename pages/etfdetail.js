
import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Alert from 'react-bootstrap/Alert'

import CustomContainer from '../components/Layout/CustomContainer'
import TickerInput from '../components/Page/TickerInput'
import LoadingSpinner from '../components/Loading/LoadingSpinner'
import AddDelStock from '../components/Fire/AddDelStock'
import StockDetails from '../components/StockDetails'
import { etfDetailsSettings } from '../config/etf'
import { handleDebounceChange, getETFDetail } from '../lib/commonFunction'
import Holdings from '../components/Tab/ETFDetail/Holdings'
import Stat from '../components/Tab/ETFDetail/Stat'
import Basics from '../components/Tab/ETFDetail/Basics'
import { fireToast } from '../lib/toast'

export default function Home() {

  const [validated, setValidated] = useState(false)
  const [formValue, setFormValue] = useState({})
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
    router.replace('/etfdetail')
  }

  async function handleTicker(inputTicker) {
    if (!inputTicker) return

    setClicked(true)

    const newSettings = await getETFDetail(inputTicker)

    if (!newSettings.basics.tableData.filter(x => x.find(x => x) == 'Price').find(x => x))
      fireToast({
        icon: 'error',
        title: 'Invalid Ticker'
      })

    router.replace('/etfdetail', `/etfdetail?query=${inputTicker.toUpperCase()}`)
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
          <TickerInput
            validated={validated}
            handleSubmit={handleSubmit}
            placeholderText={'i.e. arkk'}
            handleChange={handleChange}
            clicked={clicked}
            clearItems={clearItems}
          />
          {
            settings.basics.tableData.filter(x => x.find(x => x) == 'Price').find(x => x) > 0 ?
              <Alert variant='success' className="mt-3">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <b>{settings.inputETFTicker}</b>
                  <AddDelStock inputTicker={settings.inputETFTicker.find(x => x)} handleList='etf' />
                </div>
              </Alert>
              : null
          }
          <Tabs style={{ fontSize: '11px' }} variant="pills" className="mt-1" activeKey={settings.selectedTab} onSelect={handleSelect} id="uncontrolled-tab-example">
            <Tab eventKey="Basics" title="Basics">
              {clicked ?
                <LoadingSpinner /> : null
              }
              <Basics inputSettings={settings} />
            </Tab>
            <Tab eventKey="Holdings" title="Holdings">
              {clicked ?
                <LoadingSpinner /> : null
              }
              <Holdings inputSettings={settings} cellClick={cellClick} />
            </Tab>
            <Tab eventKey="Statistics" title="Stat.">
              {clicked ?
                <LoadingSpinner /> : null
              }
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
