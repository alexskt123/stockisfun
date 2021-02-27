
import { Fragment, useState, useEffect } from 'react'
import { Alert, Badge, Row } from 'react-bootstrap'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { Bar } from 'react-chartjs-2'
import percent from 'percent'

import { getBasics, getETFList, getYahooEarnings } from '../lib/stockDetailsFunction'
import { stockDetailsSettings } from '../config/stock'
import PriceTab from './Page/PriceTab'
import LoadingSpinner from './Loading/LoadingSpinner'
import StockInfoTable from '../components/Page/StockInfoTable'
import PriceChange from '../components/PriceChange'
import ForecastInfo from '../components/ForecastInfo'
import FinancialsInfo from '../components/FinancialsInfo'

const axios = require('axios').default

function StockDetails({ inputTicker }) {

  const [settings, setSettings] = useState({ ...stockDetailsSettings })
  const [clicked, setClicked] = useState(false)

  const cellClick = async (_item) => {

  }

  async function handleTicker() {
    if (!inputTicker) return
    setClicked(true)

    const ticker = inputTicker.toUpperCase()
    let newSettings = { ...stockDetailsSettings, inputTickers: [ticker] }

    setSettings(newSettings)

    axios.all([
      axios
        .get(`/api/getYahooAssetProfile?ticker=${ticker}`)
        .then((response) => {
          const { basics, officers, balanceSheet } = getBasics(response)
          newSettings = { ...newSettings, basics, officers, balanceSheet }

          setSettings({
            ...settings, ...newSettings
          })
        }),
      axios
        .get(`/api/getETFListByTicker?ticker=${ticker}`)
        .then((response) => {
          const { etfList } = getETFList(response)
          newSettings = { ...newSettings, etfList }

          setSettings({
            ...settings, ...newSettings
          })
        }),
      axios
        .get(`/api/getStockETFCount?ticker=${ticker}`)
        .then((response) => {
          const etfCount = response.data
          newSettings = { ...newSettings, etfCount }

          setSettings({
            ...settings, ...newSettings
          })
        }),
      axios
        .get(`/api/getYahooKeyStatistics?ticker=${ticker}`)
        .then((response) => {

          const keyRatio = response.data
          let floatingShareRatio = 'N/A'
          if (keyRatio && keyRatio.floatShares) {
            floatingShareRatio = percent.calc(keyRatio.floatShares.raw, keyRatio.sharesOutstanding.raw, 2, true)
          }
          newSettings = { ...newSettings, floatingShareRatio }

          setSettings({
            ...settings, ...newSettings
          })
        }),
      axios
        .get(`/api/getYahooEarnings?ticker=${ticker}`)
        .then((response) => {
          const { earnings } = getYahooEarnings(response)
          newSettings = { ...newSettings, earnings }

          setSettings({
            ...settings, ...newSettings
          })
        })
    ])
      .then((_) => {
        setClicked(false)
      })

  }

  useEffect(() => {
    inputTicker != '' ? handleTicker() : clearItems()
  }, [inputTicker])

  const sortItem = async (_index) => {
    // setSettings({
    //     ...settings,
    //     stockInfo: await sortTableItem(settings.stockInfo, index, settings.ascSort),
    //     ascSort: !settings.ascSort
    // })
  }

  const clearItems = async () => {
    setSettings({ ...stockDetailsSettings })
  }

  return (
    <Fragment>
      <Tabs style={{ fontSize: '11px' }} className="mt-4" defaultActiveKey="Price" id="uncontrolled-tab-example">
        <Tab eventKey="Price" title="Price">
          {
            settings.basics.tableData.filter(x => x.find(x => x) == 'Price').find(x => x)
              ? <Fragment>
                {clicked ?
                  <LoadingSpinner /> : ''
                }
                <PriceTab inputSettings={settings} />
              </Fragment>
              : <Alert className="mt-2" key={'Alert-No-Stock-Info'} variant={'success'}>
                {'Please enter a valid sticker!'}
              </Alert>
          }
        </Tab>
        <Tab eventKey="Basics" title="Basics">
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <StockInfoTable tableHeader={settings.basics.tableHeader} tableData={settings.basics.tableData} sortItem={sortItem} />
          <StockInfoTable className='mt-2' tableHeader={settings.officers.tableHeader} tableData={settings.officers.tableData} sortItem={sortItem} />
        </Tab>
        <Tab eventKey="ETFList" title="ETF List">
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <Row className="ml-1 mt-3">
            <h5>
              <Badge variant="dark">{'No. of ETF Count: '}</Badge>
            </h5>
            <h5>
              <Badge variant="light" className="ml-2">{settings.etfCount}</Badge>
            </h5>
          </Row>
          <StockInfoTable tableSize="sm" cellClick={cellClick} striped={true} tableHeader={settings.etfList.tableHeader} tableData={settings.etfList.tableData} sortItem={sortItem} />
        </Tab>
        <Tab eventKey="Price%" title="Price%">
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <PriceChange inputTickers={settings.inputTickers} />
        </Tab>
        <Tab eventKey="BalanceSheet" title="Bal. Sheet">
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <StockInfoTable tableSize="sm" tableHeader={settings.balanceSheet.tableHeader} tableData={settings.balanceSheet.tableData} sortItem={sortItem} />
          <Bar data={settings.balanceSheet.chartData} />
        </Tab>
        <Tab eventKey="Earnings" title="Earnings">
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <StockInfoTable tableSize="sm" tableHeader={settings.earnings.tableHeader} tableData={settings.earnings.tableData} sortItem={sortItem} />
          <Bar data={settings.earnings.chartData} options={settings.earnings.chartOptions} />
        </Tab>
        <Tab eventKey="Forecast" title="Forecast">
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <ForecastInfo inputTickers={settings.inputTickers} />
        </Tab>
        <Tab eventKey="Financials" title="Financials">
          {clicked ?
            <LoadingSpinner /> : ''
          }
          <FinancialsInfo inputTickers={settings.inputTickers} />
        </Tab>
      </Tabs>
    </Fragment>
  )
}

export default StockDetails
