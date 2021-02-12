import { chartDataSet, dateRange } from '../config/price'
import { chartResponse } from '../config/yahooChart'
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
    return ((item.endPrice - item.startPrice) / item.startPrice * 100).toFixed(2)
}

const getAnnualizedPcnt = (item) => {

    let totalPcnt = 1

    //exclude 2021
    item.data.slice(1).forEach(data => {
        if (data != 'N/A') {
            totalPcnt = totalPcnt * (parseFloat(data) / 100 + 1)
        }
    })

    const diffPcnt = ((Math.pow(totalPcnt, 1 / (item.yearCnt - 1)) - 1) * 100).toFixed(2)

    return diffPcnt
}


export const getPriceInfo = async (inputTickers, { tickers, quote, yearlyPcnt, chartData }) => {

    let newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))

    let inputItems = []

    dateRange.forEach(item => {
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

        outputItem = await axios(`/api/getYahooHistoryPrice?ticker=${ticker}`)

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
            'Price',
            'Annualized',
            'Total',
            ...dateRange.map(ii => ii.fromDate.substring(0, 4))
        ],
        yearlyPcnt: [...yearlyPcnt,
        ...temp.map(item => {
            const newItem = [
                item.ticker,
                tempQuote.find(x => x.ticker == item.ticker)['Current Price'],
                item.annualized,
                item.total,
                ...item.data
            ]
            return newItem
        })

        ],
        chartData: {
            label: [...dateRange.map(ii => ii.fromDate.substring(0, 4))].reverse(),
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
                    'data': item.data.reverse(),
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