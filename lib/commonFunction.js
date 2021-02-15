import { chartDataSet, dateRange, dateRangeByNoOfYears } from '../config/price'
import { chartResponse } from '../config/yahooChart'
import percent from 'percent'
const axios = require('axios').default

export const sortTableItem = async (tableItemArr, checkIndex, ascSort) => {
    return [...tableItemArr].sort(function (a, b) {

        const bf = (a[checkIndex] || '').toString().replace(/\+|\%/gi, '')
        const af = (b[checkIndex] || '').toString().replace(/\+|\%/gi, '')

        if (isNaN(bf))
            return ascSort ? af.localeCompare(bf) : bf.localeCompare(af)
        else
            return ascSort ? bf - af : af - bf

    })
}

const getTotalPcnt = (item) => {
    return percent.calc((item.endPrice - item.startPrice), item.startPrice, 2, true)
}

const getAnnualizedPcnt = (item) => {

    let totalPcnt = 1

    //exclude 2021
    item.data.slice(1).forEach(data => {
        if (data != 'N/A') {
            totalPcnt = totalPcnt * (parseFloat(data) / 100 + 1)
        }
    })

    const diffPcnt = `${((Math.pow(totalPcnt, 1 / (item.yearCnt - 1)) - 1) * 100).toFixed(2)}%`

    return diffPcnt
}

export const getFinancialsInfo = async (inputTickers, { tickers, stockInfo }) => {

    let newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))
    const selectedHeaders = "Last Revenue,Past 2 Yrs Revenue,Past 3 Yrs Revenue,Last Income,Past 2 Yrs Income,Past 3 Yrs Income,Trailing PE,Return On Equity,Gross Margin,Return On Assets"
    const selectedHeadersArr = selectedHeaders.split(',')

    let financials
    let temp = []

    for (const ticker of newTickers) {
        financials = await axios(`/api/getYahooEarnings?ticker=${ticker}`)

        let etf = {}
        etf['ticker'] = ticker.toUpperCase()
        etf['info'] = financials.data

        temp.push(
            etf
        )

    }

    const financialsInfo = {
        tickers: [
            ...tickers,
            ...temp.map(item => item.ticker)
        ],
        tableHeader: [
            'Ticker',
            ...selectedHeadersArr
        ],
        stockInfo: [
            ...stockInfo,
            ...temp.map(item => {
                const newItem = [
                    item.ticker,
                    ...Object.values(item.info)
                ]
                return newItem
            })
        ]
    }

    return financialsInfo
}

export const getForecastInfo = async (inputTickers, { tickers, stockInfo }) => {

    let newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))
    const selectedHeaders = "Price,1 Yr Forecast,5 Yr Forecast,1 Yr %,5 Yr %,Score(>50 Buy <50 Sell),No. of Analyst,1 Yr Median,1 Yr High,1 Yr Low,Average %,Strong Buy,Buy,Hold,Sell,Strong Sell"
    const selectedHeadersArr = selectedHeaders.split(',')

    let forecastResponse
    let temp = []

    for (const ticker of newTickers) {
        forecastResponse = await axios(`/api/getStockFairValue?ticker=${ticker}`)
        let forecast = {}
        forecast['ticker'] = ticker.toUpperCase()
        forecast['info'] = forecastResponse.data

        temp.push(
            forecast
        )

    }

    const forecastInfo = {
        tickers: [
            ...tickers,
            ...temp.map(item => item.ticker)
        ],
        tableHeader: [
            'Ticker',
            ...selectedHeadersArr
        ],
        stockInfo: [
            ...stockInfo,
            ...temp.map(item => {
                const newItem = [
                    item.ticker,
                    ...Object.values(item.info)
                ]
                return newItem
            })
        ]
    }

    return forecastInfo
}


export const getPriceInfo = async (inputTickers, noOfYears, { tickers, quote, yearlyPcnt, chartData }) => {

    let newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))

    let inputItems = []

    const newDateRange = await (dateRangeByNoOfYears(noOfYears))

    newDateRange.forEach(item => {
        inputItems.push(
            newTickers.map(tickerItem => {
                const newItem = {
                    'ticker': tickerItem.toUpperCase(),
                    ...item
                }

                return newItem
            })
        )
    })


    let outputItem = { ...chartResponse }
    let temp = []
    let tempQuote = []

    for (const ticker of newTickers) {

        outputItem = await axios(`/api/getYahooHistoryPrice?ticker=${ticker}&year=${noOfYears}`)

        temp.push(outputItem.data)

        tempQuote.push(
            outputItem.data.quote
        )
    }


    temp = temp.map(item => {
        const newTemp = {
            'annualized': getAnnualizedPcnt(item),
            'total': getTotalPcnt(item),
            ...item
        }
        return newTemp
    })

    const priceInfo = {
        tickers: [
            ...tickers,
            ...temp.map(item => item.ticker)
        ],
        quote: [
            ...quote,
            ...tempQuote
        ],
        tableHeader: [
            'Ticker',
            'End Price',
            'Start Price',
            'Annualized',
            'Total',
            ...newDateRange.map(ii => ii.fromDate.substring(0, 4))
        ],
        yearlyPcnt: [...yearlyPcnt,
        ...temp.map(item => {
            const newItem = [
                item.ticker,
                tempQuote.find(x => x.ticker == item.ticker)['Current Price'],
                (item.startPrice || 0).toFixed(2),
                item.annualized,
                item.total,
                ...item.data
            ]
            return newItem
        })

        ],
        chartData: {

            datasets: [...chartData.datasets,
            ...temp.map(item => {
                const r = Math.floor(Math.random() * 255) + 1
                const g = Math.floor(Math.random() * 255) + 1
                const b = Math.floor(Math.random() * 255) + 1

                let backgroundColor = (`rgba(${r}, ${g}, ${b}, 0.4)`)
                let borderColor = (`rgba(${r}, ${g}, ${b}, 1)`)

                const newItem = {
                    ...chartDataSet,
                    'label': item.ticker,
                    'data': item.data.map(item=>{
                        return item.replace('%', '')
                    }).reverse(),
                    backgroundColor,
                    borderColor,
                    'pointBorderColor': borderColor,
                    'pointHoverBackgroundColor': borderColor
                }
                return newItem
            })
            ]
        }
    }

    return priceInfo
}

export const priceSettingSchema = {
    tickers: [],
    quote: [],
    tableHeader: [],
    yearlyPcnt: [],
    chartData: {
        'labels': [...dateRange.map(item => item.fromDate.substring(0, 4))].reverse(),
        'datasets': []
    },
    ascSort: false
}

export const forecastSettingSchema = {
    tickers: [],
    tableHeader: [],
    stockInfo: [],
    ascSort: false
}

export const financialsSettingSchema = {
    tickers: [],
    tableHeader: [],
    stockInfo: [],
    ascSort: false
}
