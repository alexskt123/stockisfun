
import { Fragment, useState, useEffect } from 'react'

import LoadingSpinner from './Loading/LoadingSpinner'
import StockInfoTable from '../components/Page/StockInfoTable'
import { stockDetailsSettings, officersTableHeader } from '../config/stock'
import { convertSameUnit } from '../lib/commonFunction'

import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'

import PriceChange from '../components/PriceChange'
import ForecastInfo from '../components/ForecastInfo'
import FinancialsInfo from '../components/FinancialsInfo'
import { Badge, Row } from 'react-bootstrap'
import { Bar } from 'react-chartjs-2';

import percent from 'percent'
import PriceTab from './Page/PriceTab'
import { Alert } from 'react-bootstrap'
import millify from 'millify'

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
        let balanceSheetChartData = { labels: [], datasets: [] }
        let etfItem = []
        let etfItemHeader = []
        let etfList = []
        let etfCount = 0
        let floatingShareRatio = 'N/A'
        let earnings = { tableHeader: [], tableData: [], chartData: { labels: [], datasets: [] } }

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

                    const balanceChartLabel = 'Total Assets,Total Liability,Total Stock Holder Equity'.split(',')
                    const balanceChartData = Object.keys((balanceSheetData.find(x => x) || {}))
                        .filter(x => balanceChartLabel.includes(x))
                        .map(item => {
                            return [...balanceSheetData.map(data => data[item])]
                        })

                    const balanceChart = convertSameUnit(balanceChartData).map((data, index) => {
                        return {
                            label: balanceChartLabel[index],
                            data: data.map(item => (item || '').replace(/K|k|M|B|T/, ''))
                        }
                    })
                    balanceChart.forEach(item => {
                        const r = Math.floor(Math.random() * 255) + 1
                        const g = Math.floor(Math.random() * 255) + 1
                        const b = Math.floor(Math.random() * 255) + 1

                        balanceSheetChartData.datasets.push(item.label == "Total Stock Holder Equity" ?
                            {
                                type: 'line',
                                label: item.label,
                                borderColor: `rgba(${r}, ${g}, ${b})`,
                                borderWidth: 2,
                                fill: false,
                                data: item.data
                            } : {
                                type: 'bar',
                                label: item.label,
                                backgroundColor: `rgba(${r}, ${g}, ${b})`,
                                data: item.data
                            }
                        )
                    })


                    balanceSheetChartData.labels.reverse()
                    balanceSheetChartData.datasets.reverse()

                    balanceSheetHeader.push('')
                    balanceSheetData.forEach(item => {
                        balanceSheetHeader.push(item['Date'])
                        balanceSheetChartData.labels.push(item['Date'])
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
                            tableData: [...balanceSheetItem],
                            chartData: { ...balanceSheetChartData }
                        }
                    }

                    setSettings({
                        ...settings,
                        ...basics,
                        earnings: { ...earnings },
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
                            earnings: { ...earnings },
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
                        earnings: { ...earnings },
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
                        earnings: { ...earnings },
                        ...etfList,
                        etfCount,
                        floatingShareRatio,
                        inputTickers: [ticker]
                    })

                }),
            axios
                .get(`/api/getYahooEarnings?ticker=${ticker}`)
                .then((response) => {
                    if (response && response.data) {
                        earnings.tableHeader = ['', ...response.data.map(item => item.date)]

                        Object.keys([...response.data].find(x => x) || []).reverse().forEach(item => {
                            if (item == 'date') {
                                earnings.chartData.labels = [...response.data.map(data => data[item])]
                            } else {
                                earnings.tableData.push([item, ...response.data.map(data => millify(data[item] || 0))])

                                const r = Math.floor(Math.random() * 255) + 1
                                const g = Math.floor(Math.random() * 255) + 1
                                const b = Math.floor(Math.random() * 255) + 1

                                earnings.chartData.datasets.push(
                                    item == 'Net Income' ? {
                                        type: 'line',
                                        label: item,
                                        borderColor: `rgba(${r}, ${g}, ${b})`,
                                        borderWidth: 2,
                                        fill: false,
                                        data: response.data.map(data => data[item])
                                    } : {
                                        type: 'bar',
                                        label: item,
                                        backgroundColor: `rgba(${r}, ${g}, ${b})`,
                                        data: response.data.map(data => data[item])
                                    }
                                )
                            }
                        })

                        earnings.tableData.reverse()

                    }

                    setSettings({
                        ...settings,
                        ...basics,
                        earnings: { ...earnings },
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
                    <StockInfoTable tableHeader={settings.balanceSheet.tableHeader} tableData={settings.balanceSheet.tableData} sortItem={sortItem} />
                    <Bar data={settings.balanceSheet.chartData} />
                </Tab>
                <Tab eventKey="Earnings" title="Earnings">
                    {clicked ?
                        <LoadingSpinner /> : ''
                    }
                    <StockInfoTable tableHeader={settings.earnings.tableHeader} tableData={settings.earnings.tableData} sortItem={sortItem} />
                    <Bar data={settings.earnings.chartData} />
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
