import {
  etfHoldingHeader,
  etfDetailsBasicSettings,
  etfDetailsHoldingSettings
} from '@/config/etf'
import { chartDataSet, dateRangeByNoOfYears } from '@/config/price'
import { getYahooBalanceSheet } from '@/lib/yahoo/getYahooBalanceSheet'
import { getYahooCashflowStatement } from '@/lib/yahoo/getYahooCashflowStatement'
import { getYahooEarnings } from '@/lib/yahoo/getYahooEarnings'
import Holidays from 'date-holidays'
import { debounce } from 'debounce'
import moment from 'moment-business-days'
import numeral from 'numeral'
import Papa from 'papaparse'
import percent from 'percent'
import stringHash from 'string-hash'

const axios = require('axios').default
const randomColor = require('randomcolor')

const DATE_FORMAT = 'DD-MM-YYYY'

export function getRedColor(darkMode) {
  return darkMode ? '#ff2121' : 'red'
}

export function getGreenColor(darkMode) {
  return darkMode ? '#34eb55' : 'green'
}

export function getDefaultColor(darkMode) {
  return darkMode ? 'white' : 'black'
}

const getTotalPcnt = item => {
  return percent.calc(item.endPrice - item.startPrice, item.startPrice, 2, true)
}

export const getAnnualizedPcnt = item => {
  const totalPcnt = item
    .filter(x => x !== 'N/A')
    .reduce((acc, data) => {
      acc = acc * (parseFloat(data) / 100 + 1)
      return acc
    }, 1)

  const multiplier = Math.abs(totalPcnt) !== totalPcnt ? -1 : 1
  const annualized =
    multiplier *
      Math.pow(Math.abs(totalPcnt), 1 / item.filter(x => x !== 'N/A').length) -
    1

  const diffPcnt = {
    raw: annualized,
    fmt: convertToPercentage(annualized)
  }
  return diffPcnt
}

export const handleAxiosError = err => {
  if (err) {
    console.error(err)
  }
}

export const getRevenueIndicator = annualizedPcnt => {
  const indicator =
    annualizedPcnt > 0.2
      ? 'High Growth'
      : annualizedPcnt > 0.1 && annualizedPcnt <= 0.2
      ? 'Growth'
      : annualizedPcnt > 0 && annualizedPcnt <= 0.1
      ? 'Stable'
      : annualizedPcnt < 0
      ? 'Careful'
      : 'N/A'
  return indicator
}

export const getCSVContent = (tableHeader, tableData) => {
  const nowDate = new Date()
  const tableArr = Papa.unparse([
    [
      'Date',
      `${nowDate.getDate()}-${nowDate.getMonth() + 1}-${nowDate.getFullYear()}`
    ],
    [''],
    ...[tableHeader],
    ...tableData.map(itemArr =>
      itemArr.map(item => (item && item.data ? item.data : item))
    )
  ])

  return tableArr
}

export const getStockEarningCapacity = async ticker => {
  const earnings = await getYahooEarnings(ticker)
  const cashflow = await getYahooCashflowStatement(ticker)
  const balanceSheet = await getYahooBalanceSheet(ticker)

  const earningsExtract = earnings.map(item => {
    return {
      revenue: item.revenue.raw,
      netIncome: item.earnings.raw
    }
  })

  const incomeStmtDefault = {
    revenueArr: [],
    netIncomeArr: []
  }

  const incomeStmt = earningsExtract
    .filter((_item, idx) => idx > 0)
    .reduce(
      (acc, cur, index) => {
        const revenuePcnt = percent.calc(
          cur.revenue - earningsExtract[index].revenue,
          Math.abs(earningsExtract[index].revenue),
          2
        )
        const netIncomePcnt = percent.calc(
          cur.netIncome - earningsExtract[index].netIncome,
          Math.abs(earningsExtract[index].netIncome),
          2
        )

        const newAcc = {
          revenueArr: [...acc.revenueArr, revenuePcnt],
          netIncomeArr: [...acc.netIncomeArr, netIncomePcnt]
        }

        return newAcc
      },
      { ...incomeStmtDefault }
    )

  const { totalCashFromOperatingActivities } = cashflow.find(x => x) || {}
  const { totalLiab } = balanceSheet.find(x => x) || {}

  const debtClearance =
    totalCashFromOperatingActivities?.raw && totalLiab?.raw
      ? roundTo(totalCashFromOperatingActivities?.raw / totalLiab?.raw)
      : 'N/A'

  incomeStmt.revenueArr.reverse()
  incomeStmt.netIncomeArr.reverse()

  const revenueArr = [...Array(3)].map((_item, idx) => {
    const revenueItem = incomeStmt.revenueArr[idx]
    return revenueItem ? revenueItem : 'N/A'
  })

  const revenueAnnualized = getAnnualizedPcnt(revenueArr)
  const revenueIndicator = getRevenueIndicator(revenueAnnualized.raw)

  const netIncomeArr = [...Array(3)].map((_item, idx) => {
    const netIncomeItem = incomeStmt.netIncomeArr[idx]
    return netIncomeItem ? netIncomeItem : 'N/A'
  })

  const incomeAnnualized = getAnnualizedPcnt(netIncomeArr)
  const incomeIndicator = getRevenueIndicator(incomeAnnualized.raw)

  return Object.assign(
    {
      revenueAnnualized: revenueAnnualized.raw * 100,
      revenueIndicator,
      incomeAnnualized: incomeAnnualized.raw * 100,
      incomeIndicator,
      debtClearance
    },
    ...revenueArr.map((item, idx) => {
      return {
        [`revenue-${idx + 1}`]: item
      }
    }),
    ...netIncomeArr.map((item, idx) => {
      return {
        [`netIncome-${idx + 1}`]: item
      }
    })
  )
}

export const randBackgroundColor = () => {
  return randomColor({
    luminosity: 'dark'
  })
}

export const randVariant = (value, exclude) => {
  const hash = stringHash(value)
  const variants = [
    'dark',
    'light',
    'primary',
    'secondary',
    'warning',
    'info',
    'danger',
    'success'
  ]

  const newVariants = exclude
    ? variants.reduce((acc, item) => {
        return exclude.includes(item) ? [...acc] : [...acc, item]
      }, [])
    : variants

  return newVariants[hash % newVariants.length]
}

export const indicatorVariant = value => {
  const pairs = [
    { value: 'Careful', variant: 'danger' },
    { value: 'Stable', variant: 'secondary' },
    { value: 'Growth', variant: 'info' },
    { value: 'High Growth', variant: 'success' }
  ]

  const target = pairs.find(x => x.value === value)
  const variant = target ? target.variant : 'light'

  return variant
}

export const sortTableItem = async (tableItemArr, checkIndex, ascSort) => {
  return [...tableItemArr].sort(function (a, b) {
    const bf = (
      typeof a[checkIndex] === 'object' && a[checkIndex].data
        ? a[checkIndex].data
        : a[checkIndex] || ''
    )
      .toString()
      .replace(/\+|%/gi, '')
    const af = (
      typeof b[checkIndex] === 'object' && b[checkIndex].data
        ? b[checkIndex].data
        : b[checkIndex] || ''
    )
      .toString()
      .replace(/\+|%/gi, '')

    if (isNaN(bf)) return ascSort ? af.localeCompare(bf) : bf.localeCompare(af)
    else return ascSort ? bf - af : af - bf
  })
}

export const concatCommaLists = strArr => {
  return strArr
    .reduce((acc, item) => {
      const newAcc = [...acc, ...(item || '').toUpperCase().split(',')]
      return newAcc
    }, [])
    .filter((value, idx, self) => value !== '' && self.indexOf(value) === idx)
    .join(',')
}

export const getETFDetailBasics = async inputTicker => {
  const dataSchema = { ...etfDetailsBasicSettings }

  if (!inputTicker) return dataSchema

  const etf = await axios(`/api/etfdb/getETFDB?ticker=${inputTicker}`)
  const etfData = {
    ...etf.data.basicInfo
  }
  return {
    ...dataSchema,
    tableData: Object.keys(etfData).map((item, idx) => [
      item,
      Object.values(etfData)[idx]
    ])
  }
}

export const handleSpecialTicker = ticker => {
  return ticker === 'BRK.B' ? 'BRK-B' : ticker
}

export const getETFDetailHoldings = async inputTicker => {
  const dataSchema = { ...etfDetailsHoldingSettings }

  if (!inputTicker) return dataSchema

  const etf = await axios(`/api/etfdb/getETFDB?ticker=${inputTicker}`)
  const holdingInfoData = [...etf.data.holdingInfo]

  const responses = await Promise.all(
    [...holdingInfoData].map(async item => {
      return axios
        .get(
          `/api/yahoo/getYahooHistoryPrice?ticker=${item.find(x => x)}&year=3`
        )
        .catch(err => console.error(err))
    })
  ).catch(error => console.error(error))

  const holdingInfo = [...holdingInfoData].map((item, index) => {
    return item.concat(
      (responses.filter(x => x) || [])[index]?.data?.data.map(item => {
        return {
          style: 'green-red',
          data: item
        }
      })
    )
  })

  const pieColors = holdingInfo.map(_item => {
    const [r, g, b] = randRGBColor()

    const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.2)`
    const borderColor = `rgba(${r}, ${g}, ${b}, 1)`
    return {
      backgroundColor,
      borderColor
    }
  })

  const pieData = {
    labels: [...holdingInfo.map(item => item.find(x => x))],
    datasets: [
      {
        label: '# of Holdings',
        data: [
          ...holdingInfo.map(item => parseFloat(item[2].replace(/%/gi, '')))
        ],
        backgroundColor: [
          ...pieColors.map(item => {
            return item['backgroundColor']
          })
        ],
        borderColor: [
          ...pieColors.map(item => {
            return item['borderColor']
          })
        ],
        borderWidth: 1
      }
    ]
  }

  const href = holdingInfo
    .filter(x => x.find(x => x).length > 0 && x.find(x => x) !== 'Others')
    .reduce((acc, cur) => {
      return `${acc},${cur.find(x => x)}`
    }, '')
    .replace(/(^,)|(,$)/g, '')

  const newSettings = {
    tableHeader: [...etfHoldingHeader],
    tableData: [...holdingInfo],
    noOfHoldings: etf?.data?.noOfHoldings,
    pieData: pieData,
    selectedStockTicker: '',
    priceHref: `/compare/price?query=${href}`,
    forecastHref: `/compare/forecast?query=${href}`,
    watchlistHref: `/watchlist?query=${href}`
  }

  return newSettings
}

export const randRGBColor = () => {
  //return [...Array(3)].map(_item => Math.floor(Math.random() * 255) + 1)
  return randomColor({
    luminosity: 'dark',
    format: 'rgb'
  })
    .match(/\(([^)]+)\)/)[1]
    .split(',')
    .map(x => x.trim())
}

export const showHighlightQuoteDetail = (router, inputQuery) => {
  if (inputQuery?.ticker) {
    const params = {
      ...router.query,
      // ticker: input?.symbol || null,
      // type
      ...inputQuery
    }

    router.push(
      {
        query: params
      },
      undefined,
      { shallow: true }
    )
  }
}

export const handleDebounceChange = (e, formValue, setFormValue) => {
  const form = {
    ...formValue,
    [e.target.name]: e.target.value
  }
  const formChange = setFormValue(form)
  debounce(formChange, 300)
}

export const convertToPercentage = (input, noSign) => {
  return numeral(input).format(`${noSign ? '' : '+'}0.00%`)
}

export const convertToPriceChange = input => {
  return numeral(input).format('+0,0.00')
}

export const convertToPrice = input => {
  return numeral(input).format('0,0.00')
}

export const convertFromPriceToNumber = input => {
  return numeral(input).format('0.00')
}

export const convertToNumber = inputArr => {
  const newArr = inputArr.map(curArr => {
    return curArr.map(cur => {
      return `${numeral(`${cur}`.toLowerCase()).value()}`
    })
  })

  return newArr
}

export const getPriceInfo = async (
  inputTickers,
  noOfYears,
  { tickers, quote, yearlyPcnt, chartData }
) => {
  const newTickers = inputTickers.filter(
    x => !tickers.includes(x?.toUpperCase())
  )
  const newDateRange = await dateRangeByNoOfYears(noOfYears)
  const newChartData = { datasets: [], ...chartData }

  const outputItem = await Promise.all(
    newTickers.map(async ticker => {
      const response = await axios(
        `/api/yahoo/getYahooHistoryPrice?ticker=${ticker}&year=${noOfYears}`
      )
      const { data } = response
      return data
    })
  )

  const temp = outputItem.map(item => {
    const newTemp = {
      annualized: getAnnualizedPcnt(item.data.slice(1)).fmt,
      total: getTotalPcnt(item),
      ...item
    }
    return newTemp
  })

  const priceInfo = {
    tickers: [...tickers, ...temp.map(item => item.ticker)],
    quote: [...quote, ...temp.map(item => item.quote)],
    tableHeader: [
      'Ticker',
      'End Price',
      'Start Price',
      'Annualized',
      'Total',
      ...newDateRange.map(ii => ii.fromDate.substring(0, 4))
    ],
    yearlyPcnt: [
      ...yearlyPcnt,
      ...temp.map(item => {
        const newItem = [
          item.ticker,
          temp.map(item => item.quote).find(x => x.ticker === item.ticker)[
            'Current Price'
          ] || 'N/A',
          roundTo(item.startPrice || 0),
          item.annualized
            ? { style: 'green-red', data: item.annualized }
            : 'N/A',
          item.total ? { style: 'green-red', data: item.total } : 'N/A',
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
      labels: [
        ...newDateRange.map(item => item.fromDate.substring(0, 4))
      ].reverse(),
      datasets: [
        ...newChartData.datasets,
        ...temp.map(item => {
          const [r, g, b] = randRGBColor()

          const backgroundColor = `rgba(${r}, ${g}, ${b}, 0.4)`
          const borderColor = `rgba(${r}, ${g}, ${b}, 1)`

          const newItem = {
            ...chartDataSet,
            label: item.ticker,
            data: item.data
              .map(item => {
                return convertFromPriceToNumber(item) * 100
              })
              .reverse(),
            backgroundColor,
            borderColor,
            pointBorderColor: borderColor,
            pointHoverBackgroundColor: borderColor
          }
          return newItem
        })
      ]
    }
  }

  return priceInfo
}

export const handleFormSubmit = (
  event,
  formValue,
  { query, year },
  router,
  setValidated
) => {
  event.preventDefault()
  const form = event.currentTarget

  if (form.checkValidity() === false) {
    event.stopPropagation()
  } else {
    const { formTicker, formYear } = formValue
    const list = concatCommaLists([query, formTicker])
    const queryYear = year
      ? `&year=${year}`
      : formYear
      ? `&year=${formYear}`
      : ''
    router.push(`${router.pathname}?query=${list}${queryYear}`)
  }

  setValidated(true)
}

export const millify = number => {
  return numeral(number).format('0.00a').toUpperCase()
}

export const roundTo = number => {
  return numeral(number).format('0,0.00')
}

export const toInteger = number => {
  return numeral(number).format('0')
}

export const trim = input => {
  return input.replace(/[^a-zA-Z ]/g, '')
}

export const getShareUrl = () => {
  return 'https://stockisfun.vercel.app'
}

export const getHost = () => {
  return process.env.ENV
}

export const getHostForETFDb = () => {
  return process.env.ETFDBENV
}

export const priceSettingSchema = {
  tickers: [],
  quote: [],
  tableHeader: [],
  yearlyPcnt: [],
  chartData: {},
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

export const getFormattedFromToDate = async (days, isBus) => {
  const options = { days, isBus }
  const { from, to } = getFromToDay(options)

  return {
    formattedFromDate: parseInt(from.valueOf() / 1000),
    formattedToDate: parseInt(to.valueOf() / 1000)
  }
}

export const parseBoolean = boo => {
  try {
    return JSON.parse(boo)
  } catch {
    return false
  }
}

const subtractDays = (isBus, refDate, days) => {
  const newDate = moment(refDate, DATE_FORMAT)
  if (isBus) return newDate.businessSubtract(days)
  newDate.subtract(days, 'days')
  return newDate
}

const getFromToDay = options => {
  const { loc, year, date, days, isBus } = {
    loc: 'US',
    year: moment().year(),
    date: moment().format(DATE_FORMAT),
    days: 15,
    ...options
  }

  if (isBus) {
    const hd = new Holidays(loc)
    const holidays = [
      ...hd.getHolidays(year - 1),
      ...hd.getHolidays(year),
      ...hd.getHolidays(year + 1)
    ].map(x => moment(x.date).format(DATE_FORMAT))

    moment.updateLocale('en', {
      workingWeekdays: [1, 2, 3, 4, 5],
      holidays,
      holidayFormat: DATE_FORMAT
    })
  }

  //const toDate = moment(date, DATE_FORMAT).nextBusinessDay().prevBusinessDay()
  // use today is ok, yahoo will return last available date
  const toDate = moment(date, DATE_FORMAT)
  const fromDate = subtractDays(isBus, date, days)

  return {
    from: fromDate,
    to: toDate
  }
}
