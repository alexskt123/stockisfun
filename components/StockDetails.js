
import { Fragment, useState, useEffect } from 'react'

import { sortTableItem } from '../lib/commonFunction'
import LoadingSpinner from './Loading/LoadingSpinner'
import StockInfoTable from './StockInfoTable'

import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import PriceInfo from '../components/PriceInfo'
import ForecastInfo from '../components/ForecastInfo'
import FinancialsInfo from '../components/FinancialsInfo'

const axios = require('axios').default

function StockDetails({ inputTicker }) {

    const [tableHeader, setTableHeader] = useState([])
    const [stockInfo, setstockInfo] = useState([])
    const [officersHeader, setOfficersHeader] = useState([])
    const [officersInfo, setOfficersInfo] = useState([])
    const [balanceHeader, setBalanceHeader] = useState([])
    const [balanceInfo, setBalanceInfo] = useState([])
    const [etfHeader, setETFHeader] = useState([])
    const [etfInfo, setETFInfo] = useState([])
    const [inputTickers, setInputTickers] = useState([])
    const [clicked, setClicked] = useState(false)

    async function handleTicker() {
        if (!inputTicker) return

        setClicked(true)

        let ticker = inputTicker.toUpperCase()

        let basics
        let officers = []
        let basicItem = []
        let balanceSheetItem = []
        let balanceSheetHeader = []
        let etfItem = []
        let etfItemHeader = []
        let etfList = []

        basics = await axios(`/api/getYahooAssetProfile?ticker=${ticker}`)
        etfList = await axios(`/api/getETFListByTicker?ticker=${ticker}`)

        if (etfList.data) {
            etfItemHeader = Object.keys(etfList.data.find(x => x))

            etfItem.push(...etfList.data.map(data => {
                const newArr = []
                etfItemHeader.forEach(item => {
                    newArr.push(data[item])
                })
                return newArr
            }))
        }

        const basicsData = basics.data.basics
        const balanceSheetData = basics.data.balanceSheet

        Object.keys(basicsData).forEach(item => {
            if (item !== 'Company Officers') {
                basicItem.push([item, basicsData[item]])
            } else {
                officers = basicsData['Company Officers'].map(item => {
                    const itemArr = [
                        item.name,
                        item.title,
                        item.age || 'N/A',
                        (item.totalPay || { 'longFmt': 'N/A' }).longFmt
                    ]
                    return itemArr
                })
            }
        })

        Object.keys((balanceSheetData.find(x => x) || {})).forEach(item => {
            if (item !== 'Date') {
                const curItem = []
                balanceSheetData.forEach(data => {
                    curItem.push(data[item])
                })

                balanceSheetItem.push([item, ...curItem])
            }
        })

        balanceSheetHeader.push('')
        balanceSheetData.forEach(item => {
            balanceSheetHeader.push(item['Date'])
        })

        setETFHeader(etfItemHeader)
        setETFInfo([
            ...etfItem
        ])


        setInputTickers([ticker])

        setTableHeader(
            []
        )

        setstockInfo(
            [
                ...basicItem
            ]
        )

        setBalanceInfo([...balanceSheetItem])
        setBalanceHeader([...balanceSheetHeader])

        setOfficersHeader(
            ["Officers Name", "Title", "Age", "Pay"]
        )

        setOfficersInfo(
            [
                ...officers
            ]
        )

        setClicked(false)
    }

    useEffect(() => {
        inputTicker != '' ? handleTicker() : clearItems()
    }, [inputTicker])

    const sortItem = async (index) => {
        setSettings({
            ...settings,
            stockInfo: await sortTableItem(settings.stockInfo, index, settings.ascSort),
            ascSort: !settings.ascSort
        })
    }

    const clearItems = async () => {
        setstockInfo([])
        setOfficersInfo([])
        setTableHeader([])
        setOfficersHeader([])
        setInputTickers([])
        setBalanceInfo([])
        setBalanceHeader([])
        setETFInfo([])
        setETFHeader([])
      }

    return (
        <Fragment>
            <Tabs className="mt-4" defaultActiveKey="Basics" id="uncontrolled-tab-example">
                <Tab eventKey="Basics" title="Basics">
                    {clicked ?
                        <LoadingSpinner /> : ''
                    }
                    <StockInfoTable tableHeader={tableHeader} tableData={stockInfo} sortItem={sortItem} />
                </Tab>
                <Tab eventKey="Officers" title="Officers">
                    {clicked ?
                        <LoadingSpinner /> : ''
                    }
                    <StockInfoTable tableHeader={officersHeader} tableData={officersInfo} sortItem={sortItem} />
                </Tab>
                <Tab eventKey="ETFList" title="ETF List">
                    {clicked ?
                        <LoadingSpinner /> : ''
                    }
                    <StockInfoTable tableHeader={etfHeader} tableData={etfInfo} sortItem={sortItem} />
                </Tab>
                <Tab eventKey="BalanceSheet" title="Balance Sheet">
                    {clicked ?
                        <LoadingSpinner /> : ''
                    }
                    <StockInfoTable tableHeader={balanceHeader} tableData={balanceInfo} sortItem={sortItem} />
                </Tab>
                <Tab eventKey="Price%" title="Price%">
                    {clicked ?
                        <LoadingSpinner /> : ''
                    }
                    <PriceInfo inputTickers={inputTickers} />
                </Tab>
                <Tab eventKey="Forecast" title="Forecast">
                    <ForecastInfo inputTickers={inputTickers} />
                </Tab>
                <Tab eventKey="Financials" title="Financials">
                    <FinancialsInfo inputTickers={inputTickers} />
                </Tab>
            </Tabs>
        </Fragment>
    )
}

export default StockDetails
