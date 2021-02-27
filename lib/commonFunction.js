import { chartDataSet, dateRange, dateRangeByNoOfYears } from '../config/price'
import { chartResponse } from '../config/yahooChart'
import { financialsSelectedHeader } from '../config/financials'
import { forecastSelectedHeader } from '../config/forecast'
import percent from 'percent'
import moment from 'moment-business-days'
import fedHolidays from '@18f/us-federal-holidays'
import Papa from 'papaparse'
import { debounce } from 'debounce'

const axios = require('axios').default

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

export const getCSVContent = (tableHeader, tableData) => {

  const nowDate = new Date()
  const tableArr = Papa.unparse([['Date', `${nowDate.getDate()}-${nowDate.getMonth() + 1}-${nowDate.getFullYear()}`], [''], ...[tableHeader], ...tableData.map(itemArr => itemArr.map(item => item.data ? item.data : item))])

  return tableArr

}

export const sortTableItem = async (tableItemArr, checkIndex, ascSort) => {
  return [...tableItemArr].sort(function (a, b) {

    const bf = (typeof a[checkIndex] == "object" && a[checkIndex].data ? a[checkIndex].data : a[checkIndex] || '').toString().replace(/\+|%/gi, '')
    const af = (typeof b[checkIndex] == "object" && b[checkIndex].data ? b[checkIndex].data : b[checkIndex] || '').toString().replace(/\+|%/gi, '')

    if (isNaN(bf))
      return ascSort ? af.localeCompare(bf) : bf.localeCompare(af)
    else
      return ascSort ? bf - af : af - bf

  })
}

export const getFinancialsInfo = async (inputTickers, { tickers, stockInfo }) => {

  const newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))
  const selectedHeadersArr = financialsSelectedHeader.split(',')

  let financials
  const temp = []

  for (const ticker of newTickers) {
    financials = await axios(`/api/getYahooFinancials?ticker=${ticker}`)

    const etf = {}
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

  const newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))
  const selectedHeadersArr = forecastSelectedHeader.split(',')

  let forecastResponse
  const temp = []

  for (const ticker of newTickers) {
    forecastResponse = await axios(`/api/getStockFairValue?ticker=${ticker}`)
    const forecast = {}
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

export const handleDebounceChange = (e, formValue, setFormValue) => {
  const form = {
    ...formValue,
    [e.target.name]: e.target.value
  }
  const formChange = setFormValue(form)
  debounce(formChange, 300)
}

export const convertSameUnit = (inputArr) => {
  const units = ['k', 'M', 'B', 'T']

  const concatInputArr = inputArr.reduce((acc, cur) => {
    return acc.concat(cur)
  }, [])

  const unitCount = units.map(item => {
    return concatInputArr.filter(x => (x || '').split('').includes(item)).length
  })

  const targetUnit = unitCount.findIndex(x => x > 0)

  // no finding index of unit
  if (targetUnit < 0) return inputArr

  const newArr = inputArr.map(input => {
    return input.map(item => {
      if (!item) return ''
      else if (item.split('').includes(units[targetUnit]))
        return item
      else if (item.split('').includes(units[targetUnit + 1]))
        return `${(parseFloat(item.replace(units[targetUnit + 1], '')) * 1000).toString()}${units[targetUnit]}`
      else if (item.split('').includes(units[targetUnit + 2]))
        return `${(parseFloat(item.replace(units[targetUnit + 2], '')) * 1000).toString()}${units[targetUnit]}`
      else if (item.split('').includes(units[targetUnit + 3]))
        return `${(parseFloat(item.replace(units[targetUnit + 3], '')) * 1000).toString()}${units[targetUnit]}`
    })
  })

  return newArr
}


export const getPriceInfo = async (inputTickers, noOfYears, { tickers, quote, yearlyPcnt, chartData }) => {

  const newTickers = inputTickers.filter(x => !tickers.includes(x.toUpperCase()))

  const inputItems = []

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
  const tempQuote = []

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
        {style: 'green-red', data: item.annualized},
        {style: 'green-red', data: item.total},
        ...item.data.map(itemData => {
          return {
            style: 'green-red',
            data: itemData
          }
        })
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

        const backgroundColor = (`rgba(${r}, ${g}, ${b}, 0.4)`)
        const borderColor = (`rgba(${r}, ${g}, ${b}, 1)`)

        const newItem = {
          ...chartDataSet,
          'label': item.ticker,
          'data': item.data.map(item => {
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

export const getHost = () => {
  return process.env.ENV == 'PROD' ? 'https://stockisfun.vercel.app' : 'http://localhost:3000'
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

export const getFormattedFromToDate = async (days) => {

  moment.updateLocale('us', {
    workingWeekdays: [1, 2, 3, 4, 5]
  })

  const options = { shiftSaturdayHolidays: true, shiftSundayHolidays: true }
  const holidays = fedHolidays.allForYear(moment().year(), options)

  const formattedToDate = moment()
  let formattedFromDate
  let cnt = 0
  let trial = 0

  while (cnt <= parseInt(days) + 1) {

    formattedFromDate = moment().subtract(trial, 'days')

    if (formattedFromDate.isBusinessDay()
      && holidays.map(holidayItem => {
        const holiday = holidayItem.date
        return holiday.getFullYear() == formattedFromDate.year()
          && holiday.getMonth() == formattedFromDate.month()
          && holiday.getDate() == formattedFromDate.date()
      }).filter(x => x == true).length <= 0)
      cnt += 1
    trial += 1

  }

  return {
    formattedFromDate: parseInt(formattedFromDate.valueOf() / 1000),
    formattedToDate: parseInt(formattedToDate.valueOf() / 1000)
  }

}

