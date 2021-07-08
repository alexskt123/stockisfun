import {
  etfHoldingHeader,
  etfDetailsBasicSettings,
  etfDetailsHoldingSettings
} from '@/config/etf'
import { chartDataSet, dateRangeByNoOfYears } from '@/config/price'
import {
  calPcnt,
  roundTo,
  convertToPercentage,
  randRGBColor,
  convertFromPriceToNumber
} from '@/lib/commonFunction'
import { getYahooBalanceSheet } from '@/lib/yahoo/getYahooBalanceSheet'
import { getYahooCashflowStatement } from '@/lib/yahoo/getYahooCashflowStatement'
import { getYahooEarnings } from '@/lib/yahoo/getYahooEarnings'

const axios = require('axios').default

const getTotalPcnt = item => {
  return calPcnt(item.endPrice - item.startPrice, item.startPrice, 2, true)
}

const getAnnualizedPcnt = item => {
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

const getRevenueIndicator = annualizedPcnt => {
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

const getStockEarningCapacity = async ticker => {
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
        const revenuePcnt = calPcnt(
          cur.revenue - earningsExtract[index].revenue,
          Math.abs(earningsExtract[index].revenue),
          2
        )
        const netIncomePcnt = calPcnt(
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

const getETFDetailHoldings = async inputTicker => {
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

const getETFDetailBasics = async inputTicker => {
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

const getPriceInfo = async (
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

const handleSpecialTicker = ticker => {
  return ticker === 'BRK.B' ? 'BRK-B' : ticker
}

const showHighlightQuoteDetail = (router, inputQuery) => {
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

module.exports = {
  getStockEarningCapacity,
  getETFDetailHoldings,
  getETFDetailBasics,
  getPriceInfo,
  showHighlightQuoteDetail,
  handleSpecialTicker
}
