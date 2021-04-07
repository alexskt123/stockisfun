
import { Fragment, useState, useEffect } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { Bar } from 'react-chartjs-2'
import percent from 'percent'

import { getBasics, getETFList, getYahooEarnings } from '../lib/stockDetailsFunction'
import { stockDetailsSettings } from '../config/stock'
import Price from './Tab/StockDetail/Price'
import LoadingSpinner from './Loading/LoadingSpinner'
import StockInfoTable from '../components/Page/StockInfoTable'
import PriceChange from '../components/Parts/PriceChange'
import ForecastInfo from '../components/Parts/ForecastInfo'
import FinancialsInfo from '../components/Parts/FinancialsInfo'
import ETFList from './Tab/StockDetail/ETFList'
import ValidTickerAlert from './Parts/ValidTickerAlert'
import { fireToast } from '../lib/toast'
import { peersHeader } from '../config/peers'

const axios = require('axios').default

function StockDetails({ inputTicker }) {

  const [settings, setSettings] = useState({ ...stockDetailsSettings })
  const [clicked, setClicked] = useState(false)

  async function handleTicker() {
    if (!inputTicker) return

    setClicked(true)

    const ticker = (inputTicker || '').toUpperCase()
    let newSettings = { ...stockDetailsSettings, inputTickers: [ticker] }

    setSettings(newSettings)

    Promise.all([
      axios
        .get(`/api/yahoo/getYahooAssetProfile?ticker=${ticker}`)
        .then((response) => {
          const { basics, officers, balanceSheet } = getBasics(response)
          newSettings = { ...newSettings, basics, officers, balanceSheet }

          if (!basics.tableData.filter(x => x.find(x => x) == 'Price').find(x => x))
            fireToast({
              icon: 'error',
              title: 'Invalid Ticker'
            })

          setSettings({
            ...settings, ...newSettings
          })
        }),
      axios
        .get(`/api/etfdb/getETFListByTicker?ticker=${ticker}`)
        .then((response) => {
          const { etfList } = getETFList(response)
          newSettings = { ...newSettings, etfList }

          setSettings({
            ...settings, ...newSettings
          })
        }),
      axios
        .get(`/api/etfdb/getStockETFCount?ticker=${ticker}`)
        .then((response) => {
          const etfCount = response.data
          newSettings = { ...newSettings, etfCount }

          setSettings({
            ...settings, ...newSettings
          })
        }),
      axios
        .get(`/api/yahoo/getYahooKeyStatistics?ticker=${ticker}`)
        .then((response) => {

          const keyRatio = response.data
          const floatingShareRatio = keyRatio && keyRatio.floatShares ? percent.calc(keyRatio.floatShares.raw, keyRatio.sharesOutstanding.raw, 2, true) : 'N/A'
          newSettings = { ...newSettings, floatingShareRatio }

          setSettings({
            ...settings, ...newSettings
          })
        }),
      axios
        .get(`/api/yahoo/getYahooEarnings?ticker=${ticker}`)
        .then((response) => {
          const { earnings } = getYahooEarnings(response)
          newSettings = { ...newSettings, earnings }

          setSettings({
            ...settings, ...newSettings
          })
        }),
      axios
        .get(`/api/moneycnn/getPeers?ticker=${ticker}`)
        .then((response) => {
          const data = response.data
          const peers = data.reduce((acc, cur) => {
            acc.peers.tableHeader = [...peersHeader]
            acc.peers.tableData.push([...peersHeader.map(item => cur[item])])
            return acc
          }, { peers: { tableHeader: [], tableData: [] } })
          newSettings = { ...newSettings, ...peers }

          setSettings({
            ...settings, ...newSettings
          })
        })
    ])
      .finally(() => {
        setClicked(false)
      })

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
          {
            settings.basics.tableData.filter(x => x.find(x => x) == 'Price').find(x => x)
              ? <Fragment>
                {clicked ?
                  <LoadingSpinner /> : null
                }
                <Price inputSettings={settings} />
              </Fragment>
              : <ValidTickerAlert />
          }
        </Tab>
        <Tab eventKey="Basics" title="Basics">
          {clicked ?
            <LoadingSpinner /> : null
          }
          <StockInfoTable tableSize="sm" tableHeader={settings.basics.tableHeader} tableData={settings.basics.tableData} />
          <StockInfoTable tableSize="sm" className='mt-2' tableHeader={settings.officers.tableHeader} tableData={settings.officers.tableData} />
        </Tab>
        <Tab eventKey="ETFList" title="ETF List">
          {clicked ?
            <LoadingSpinner /> : null
          }
          <ETFList inputSettings={{ etfList: settings.etfList, etfCount: settings.etfCount }} />
        </Tab>
        <Tab eventKey="Price%" title="Price%">
          {clicked ?
            <LoadingSpinner /> : null
          }
          <PriceChange inputTickers={settings.inputTickers} />
        </Tab>
        <Tab eventKey="BalanceSheet" title="Bal. Sheet">
          {clicked ?
            <LoadingSpinner /> : null
          }
          <StockInfoTable tableSize="sm" tableHeader={settings.balanceSheet.tableHeader} tableData={settings.balanceSheet.tableData} tableDataSkipRow={settings.balanceSheet.tableDataSkipRow} />
          <Bar data={settings.balanceSheet.chartData} options={settings.balanceSheet.chartOptions} />
        </Tab>
        <Tab eventKey="Earnings" title="Earnings">
          {clicked ?
            <LoadingSpinner /> : null
          }
          <StockInfoTable tableSize="sm" tableHeader={settings.earnings.tableHeader} tableData={settings.earnings.tableData} />
          <Bar data={settings.earnings.chartData} options={settings.earnings.chartOptions} />
        </Tab>
        <Tab eventKey="Forecast" title="Forecast">
          {clicked ?
            <LoadingSpinner /> : null
          }
          <ForecastInfo inputTickers={settings.inputTickers} />
        </Tab>
        <Tab eventKey="Financials" title="Financials">
          {clicked ?
            <LoadingSpinner /> : null
          }
          <FinancialsInfo inputTickers={settings.inputTickers} />
        </Tab>
        <Tab eventKey="Peers" title="Peers">
          {clicked ?
            <LoadingSpinner /> : null
          }
          <StockInfoTable tableSize="sm" tableHeader={settings.peers.tableHeader} tableData={settings.peers.tableData} />
        </Tab>
      </Tabs>
    </Fragment>
  )
}

export default StockDetails
