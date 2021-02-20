
import { Fragment, useState, useEffect } from 'react'

import { sortTableItem } from '../lib/commonFunction'
import LoadingSpinner from './Loading/LoadingSpinner'
import StockInfoTable from '../components/Page/StockInfoTable'
import { stockDetailsSettings, officersTableHeader } from '../config/stock'

import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import PriceChange from '../components/PriceChange'
import ForecastInfo from '../components/ForecastInfo'
import FinancialsInfo from '../components/FinancialsInfo'
import Price from '../components/Price'
import { Badge, Row } from 'react-bootstrap'

import percent from 'percent'

const axios = require('axios').default

function StockDetails({ inputTicker }) {

    const [settings, setSettings] = useState({ ...stockDetailsSettings })
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
        let etfCount = 0
        let floatingShareRatio = 'N/A'

        setSettings({ ...settings, inputTickers: [ticker] })

        axios.all([
            axios
                .get(`/api/getYahooAssetProfile?ticker=${ticker}`)
                .then((response) => {
                    const basicsData = response.data.basics
                    const balanceSheetData = response.data.balanceSheet

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

                    basics = {
                        basics: {
                            tableHeader: [],
                            tableData: [...basicItem]
                        },
                        officers: {
                            tableHeader: [...officersTableHeader],
                            tableData: [...officers]
                        },
                        balanceSheet: {
                            tableHeader: [...balanceSheetHeader],
                            tableData: [...balanceSheetItem]
                        }
                    }

                    setSettings({
                        ...settings,
                        ...basics,
                        ...etfList,
                        etfCount,
                        floatingShareRatio,
                        inputTickers: [ticker]
                    })
                }),
            axios
                .get(`/api/getETFListByTicker?ticker=${ticker}`)
                .then((response) => {
                    if (response.data) {
                        etfItemHeader = Object.keys(response.data.find(x => x) || {})

                        etfItem.push(...response.data.map(data => {
                            const newArr = []
                            etfItemHeader.forEach(item => {
                                newArr.push(data[item])
                            })
                            return newArr
                        }))

                        etfList = {
                            etfList: {
                                tableHeader: [...etfItemHeader],
                                tableData: [...etfItem]
                            }
                        }

                        setSettings({
                            ...settings,
                            ...basics,
                            ...etfList,
                            etfCount,
                            floatingShareRatio,
                            inputTickers: [ticker]
                        })
                    }

                }),
            axios
                .get(`/api/getStockETFCount?ticker=${ticker}`)
                .then((response) => {

                    etfCount = response.data

                    setSettings({
                        ...settings,
                        ...basics,
                        ...etfList,
                        etfCount,
                        floatingShareRatio,
                        inputTickers: [ticker]
                    })

                }),
            axios
                .get(`/api/getYahooKeyStatistics?ticker=${ticker}`)
                .then((response) => {

                    const keyRatio = response.data
                    if (keyRatio && keyRatio.floatShares) {
                        floatingShareRatio = percent.calc(keyRatio.floatShares.raw, keyRatio.sharesOutstanding.raw, 2, true)
                    }

                    setSettings({
                        ...settings,
                        ...basics,
                        ...etfList,
                        etfCount,
                        floatingShareRatio,
                        inputTickers: [ticker]
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

    const sortItem = async (index) => {
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
            <Tabs className="mt-4" defaultActiveKey="Price" id="uncontrolled-tab-example">
                <Tab eventKey="Price" title="Price">
                    {clicked ?
                        <LoadingSpinner /> : ''
                    }
                    <Row className="ml-1 mt-1">
                        <h6>
                            <Badge variant="dark">{'Name: '}</Badge>
                        </h6>
                        <h6>
                            <Badge variant="light" className="ml-2">{({ ...settings }.basics.tableData.filter(x => x.find(x => x) == 'Name').find(x => x) || [])[1]}</Badge>
                        </h6>
                    </Row>
                    <Row className="ml-1 mt-1">
                        <h6>
                            <Badge variant="dark">{'Price: '}</Badge>
                        </h6>
                        <h6>
                            <Badge variant="light" className="ml-2">{({ ...settings }.basics.tableData.filter(x => x.find(x => x) == 'Price').find(x => x) || [])[1]}</Badge>
                        </h6>
                        <h6>
                            <Badge className="ml-3" variant="dark">{'52W-L-H: '}</Badge>
                        </h6>
                        <h6>
                            <Badge variant="light" className="ml-2">{({ ...settings }.basics.tableData.filter(x => x.find(x => x) == '52W-Low-High').find(x => x) || [])[1]}</Badge>
                        </h6>
                    </Row>
                    <Row className="ml-1 mt-1">
                        <h6>
                            <Badge variant="dark">{'Floating Shares: '}</Badge>
                        </h6>
                        <h6>
                            <Badge variant="light" className="ml-2">{settings.floatingShareRatio}</Badge>
                        </h6>
                    </Row>
                    <Price inputTicker={settings.inputTickers.find(x => x)} />
                </Tab>
                <Tab eventKey="Basics" title="Basics">
                    {clicked ?
                        <LoadingSpinner /> : ''
                    }
                    <Row className="ml-1 mt-3">
                        <h5>
                            <Badge variant="dark">{'Company Profile'}</Badge>
                        </h5>
                    </Row>
                    <StockInfoTable tableHeader={settings.basics.tableHeader} tableData={settings.basics.tableData} sortItem={sortItem} />
                    <Row className="ml-1">
                        <h5>
                            <Badge variant="dark">{'Officers'}</Badge>
                        </h5>
                    </Row>
                    <StockInfoTable tableHeader={settings.officers.tableHeader} tableData={settings.officers.tableData} sortItem={sortItem} />
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
                    <StockInfoTable tableHeader={settings.etfList.tableHeader} tableData={settings.etfList.tableData} sortItem={sortItem} />
                </Tab>
                <Tab eventKey="BalanceSheet" title="Balance Sheet">
                    {clicked ?
                        <LoadingSpinner /> : ''
                    }
                    <StockInfoTable tableHeader={settings.balanceSheet.tableHeader} tableData={settings.balanceSheet.tableData} sortItem={sortItem} />
                </Tab>
                <Tab eventKey="Price%" title="Price%">
                    {clicked ?
                        <LoadingSpinner /> : ''
                    }
                    <PriceChange inputTickers={settings.inputTickers} />
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
