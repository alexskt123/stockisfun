import {
  etfHoldingHeader,
  etfDetailsBasicSettings,
  etfDetailsHoldingSettings
} from '@/config/etf'
import { chartDataSet, dateRangeByNoOfYears } from '@/config/price'
import { stockDetailsSettings, officersTableHeader } from '@/config/stock'
import {
  calPcnt,
  convertToNumber,
  convertToPercentage,
  convertFromPriceToNumber,
  millify,
  randRGBColor,
  roundTo
} from '@/lib/commonFunction'
import { toAxios } from '@/lib/request'
import { getBalanceSheet } from '@/lib/yahoo/getBalanceSheet'
import { getCashflowStatement } from '@/lib/yahoo/getCashflowStatement'
import { getEarnings } from '@/lib/yahoo/getEarnings'

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

export const getStockEarningCapacity = async ticker => {
  const earnings = await getEarnings(ticker)
  const cashflow = await getCashflowStatement(ticker)
  const balanceSheet = await getBalanceSheet(ticker)

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

export const getETFDetailHoldings = async inputTicker => {
  const dataSchema = { ...etfDetailsHoldingSettings }

  if (!inputTicker) return dataSchema

  const etf = await toAxios('/api/etfdb/getETFDB', { ticker: inputTicker })
  const holdingInfoData = [...etf.data.holdingInfo]

  const responses = await Promise.all(
    [...holdingInfoData].map(async item => {
      return await toAxios('/api/yahoo/getHistoryYrlyPcnt', {
        ticker: item.find(x => x),
        year: 3
      })
    })
  ).catch(error => console.error(error))

  const holdingInfo = [...holdingInfoData].map((item, index) => {
    return item.concat(
      (responses.filter(x => x) || [])[index]?.data?.data.map(item => {
        return {
          style: 'green-red',
          data: item.price
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

export const getETFDetailBasics = async inputTicker => {
  const dataSchema = { ...etfDetailsBasicSettings }

  if (!inputTicker) return dataSchema

  const etf = await toAxios('/api/etfdb/getETFDB', { ticker: inputTicker })
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

export const getPriceInfo = async (
  inputTickers,
  noOfYears,
  { tickers, yearlyPcnt, chartData }
) => {
  const newTickers = inputTickers.filter(
    x => !tickers.includes(x?.toUpperCase())
  )
  const newDateRange = await dateRangeByNoOfYears(noOfYears)
  const newChartData = { datasets: [], ...chartData }

  const outputItem = await Promise.all(
    newTickers.map(async ticker => {
      const response = await toAxios('/api/yahoo/getHistoryYrlyPcnt', {
        ticker: ticker,
        year: noOfYears
      })
      const { data } = response
      return data
    })
  )

  const temp = outputItem.map(item => {
    const newTemp = {
      annualized: getAnnualizedPcnt(item.data.map(item => item.price).slice(1))
        .fmt,
      total: getTotalPcnt(item),
      ...item
    }
    return newTemp
  })

  const priceInfo = {
    tickers: [...tickers, ...temp.map(item => item.ticker)],
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
          temp.find(x => x.ticker === item.ticker)['Current Price'] || 'N/A',
          roundTo(item.startPrice || 0),
          item.annualized
            ? { style: 'green-red', data: item.annualized }
            : 'N/A',
          item.total ? { style: 'green-red', data: item.total } : 'N/A',
          ...item.data.map(itemData => {
            return {
              style: 'green-red',
              data: itemData.price
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
              .map(item => item.price)
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

export const handleSpecialTicker = ticker => {
  return ticker === 'BRK.B' ? 'BRK-B' : ticker
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

export const getBasics = data => {
  const basics = data?.basics || {}
  const officersArr = (data || {})['Company Officers'] || []

  const basicItem = Object.keys(basics).map(item => {
    return [item, basics[item]]
  })

  const officers = officersArr.map(item => {
    const itemArr = [
      item.name,
      item.title,
      item.age || 'N/A',
      (item.totalPay || { longFmt: 'N/A' }).longFmt
    ]
    return itemArr
  })

  return {
    basics: {
      tableHeader: [],
      tableData: [...basicItem]
    },
    officers: {
      tableHeader: [...officersTableHeader],
      tableData: [...officers]
    }
  }
}

export const getBalanceSheetTableData = data => {
  const balanceSheetData = data || []
  const balanceSheetItem = []
  const balanceSheetHeader = []
  const balanceSheetChartData = { labels: [], datasets: [] }

  // reverse - from left small to big
  balanceSheetData.reverse()

  Object.keys(balanceSheetData.find(x => x) || {})
    .filter(x => x !== 'Date')
    .forEach(item => {
      const curItem = []
      balanceSheetData.forEach(data => {
        curItem.push(data[item])
      })

      balanceSheetItem.push([item, ...curItem])
    })

  const balanceChartLabel =
    'Total Assets,Total Liability,Total Stock Holder Equity'.split(',')
  const balanceChartData = Object.keys(balanceSheetData.find(x => x) || {})
    .filter(x => balanceChartLabel.includes(x))
    .map(item => {
      return [...balanceSheetData.map(data => data[item])]
    })

  const balanceChart = convertToNumber(balanceChartData).map((data, index) => {
    return {
      label: balanceChartLabel[index],
      data: data.map(item => (item || '').replace(/K|k|M|B|T/, ''))
    }
  })
  balanceChart.forEach(item => {
    const [r, g, b] = randRGBColor()
    balanceSheetChartData.datasets.push(
      item.label === 'Total Stock Holder Equity'
        ? {
            type: 'line',
            label: item.label,
            borderColor: `rgba(${r}, ${g}, ${b})`,
            borderWidth: 2,
            fill: false,
            data: item.data
          }
        : {
            type: 'bar',
            label: item.label,
            backgroundColor: `rgba(${r}, ${g}, ${b})`,
            data: item.data
          }
    )
  })

  balanceSheetChartData.labels.reverse()
  balanceSheetChartData.datasets.reverse()

  const balanceSheetChartOptions = {
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return millify(value)
          }
        }
      }
    }
  }

  balanceSheetHeader.push('')
  balanceSheetData.forEach(item => {
    balanceSheetHeader.push(item['Date'])
    balanceSheetChartData.labels.push(item['Date'])
  })

  return {
    tableHeader: [...balanceSheetHeader],
    tableData: [...balanceSheetItem],
    tableDataSkipRow: [
      'Total Current Liability',
      'Total Non-Current Liability',
      'Total Liability',
      'Total Stock Holder Equity'
    ],
    chartData: { ...balanceSheetChartData },
    chartOptions: { ...balanceSheetChartOptions }
  }
}

export const getETFList = data => {
  const etfList = { ...stockDetailsSettings.etfList }
  const dataArr = data || []

  const etfItemHeader = Object.keys(dataArr.find(x => x) || {})
  const etfItem = []

  etfItem.push(
    ...dataArr.map(data => {
      const newArr = []
      etfItemHeader.forEach(item => {
        newArr.push(data[item])
      })
      return newArr
    })
  )

  etfList.tableHeader = [...etfItemHeader]
  etfList.tableData = [
    ...etfItem.map(itemArr =>
      itemArr.map((item, idx) => {
        return idx === 0
          ? { link: `/etfdetail?query=${item}`, data: item }
          : item
      })
    )
  ]

  return etfList
}

export const getEarningsData = inputData => {
  const earnings = {
    tableHeader: [],
    tableData: [],
    chartData: {
      labels: [],
      datasets: []
    },
    chartOptions: {}
  }

  if (inputData) {
    // reverse - from left small to big
    inputData.reverse()

    earnings.tableHeader = ['', ...inputData.map(item => item.date)]
    earnings.chartOptions = {
      scales: {
        y: {
          ticks: {
            callback: function (value) {
              return millify(value)
            }
          }
        }
      }
    }

    earnings.chartData.labels = [...inputData.map(data => data['date'])]

    Object.keys([...inputData].find(x => x) || [])
      .filter(x => x !== 'date')
      .reverse()
      .forEach(item => {
        earnings.tableData.push([
          item,
          ...inputData.map(data => millify(data[item]))
        ])

        const [r, g, b] = randRGBColor()

        earnings.chartData.datasets.push(
          item === 'Net Income'
            ? {
                type: 'line',
                label: item,
                borderColor: `rgba(${r}, ${g}, ${b})`,
                borderWidth: 2,
                fill: false,
                data: inputData.map(data => data[item])
              }
            : {
                type: 'bar',
                label: item,
                backgroundColor: `rgba(${r}, ${g}, ${b})`,
                data: inputData.map(data => data[item])
              }
        )
      })

    earnings.tableData.reverse()
  }

  return { earnings }
}

export const getYahooBasicsData = (assetProfile, quote) => {
  const newData = {
    basics: {
      Symbol: quote.symbol,
      Name: quote.longName,
      Price: quote.regularMarketPrice,
      'Price%': quote.regularMarketChangePercent,
      '52W-L-H':
        quote.fiftyTwoWeekLow && quote.fiftyTwoWeekHigh
          ? `${roundTo(parseFloat(quote.fiftyTwoWeekLow), 2)} - ${roundTo(
              parseFloat(quote.fiftyTwoWeekHigh),
              2
            )}`
          : undefined,
      Website: assetProfile.website,
      Industry: assetProfile.industry,
      Sector: assetProfile.sector,
      'Market Cap.': quote.marketCap ? millify(quote.marketCap) : undefined,
      'Price To Book': convertFromPriceToNumber(quote.priceToBook),
      'Current EPS': quote.epsCurrentYear,
      'Trailing PE': quote.trailingPE ? roundTo(quote.trailingPE) : undefined,
      'Forward PE': quote.forwardPE ? roundTo(quote.forwardPE) : undefined,
      Dividend: quote.trailingAnnualDividendRate
        ? convertToPercentage(quote.trailingAnnualDividendRate / 100, true)
        : undefined,
      'Full Time Employees': assetProfile.fullTimeEmployees
        ? millify(assetProfile.fullTimeEmployees)
        : undefined,
      Address: quote.ticker
        ? `${assetProfile.address1 || ''}, ${assetProfile.address2 || ''}, ${
            assetProfile.city || ''
          }, ${assetProfile.state || ''}, ${assetProfile.zip || ''}, ${
            assetProfile.country || ''
          }`.replace(', ,', '')
        : undefined,
      'Business Summary': assetProfile.longBusinessSummary
    },
    'Company Officers': assetProfile.companyOfficers
  }
  return newData
}

export const getBalanceSheetData = balanceSheet => {
  const balanceSheetExtract = balanceSheet.map(item => {
    const newItem = {}
    newItem['Date'] = item.endDate?.fmt

    newItem['Total Current Assets'] = item.totalCurrentAssets?.fmt
    newItem['Total Current Liability'] = item.totalCurrentLiabilities?.fmt
    newItem['Total Non-Current Assets'] = millify(
      item.totalAssets?.raw - item.totalCurrentAssets?.raw
    )
    newItem['Total Non-Current Liability'] = millify(
      item.totalLiab?.raw - item.totalCurrentLiabilities?.raw
    )
    newItem['Total Assets'] = item.totalAssets?.fmt
    newItem['Total Liability'] = item.totalLiab?.fmt
    newItem['Total Stock Holder Equity'] = item.totalStockholderEquity?.fmt

    if (item.totalCurrentAssets && item.totalCurrentLiabilities)
      newItem['Current Ratio'] = roundTo(
        item.totalCurrentAssets?.raw / item.totalCurrentLiabilities?.raw
      )

    if (item.totalCurrentLiabilities)
      newItem['Quick Ratio'] = roundTo(
        (item.cash
          ? item.cash.raw
          : 0 + item.shortTermInvestments
          ? item.shortTermInvestments?.raw
          : 0 + item.netReceivables
          ? item.netReceivables?.raw
          : 0) / item.totalCurrentLiabilities?.raw
      )

    if (item.totalLiab && item.totalStockholderEquity)
      newItem['Total Debt/Equity'] = roundTo(
        item.totalLiab?.raw / item.totalStockholderEquity?.raw
      )
    return newItem
  })
  return [...balanceSheetExtract]
}

export const getUserBoughtList = async userData => {
  const { boughtList, cash } = userData || { boughtList: [], cash: 0 }
  const boughtTickers = boughtList.map(x => x.ticker)
  const response = await toAxios('/api/yahoo/getQuote', {
    ticker: boughtTickers.join(',')
  })
  const { data: quotes } = response || { data: [] }
  const boughtListWithInfo = boughtList.map(boughtListItem => {
    const quote = quotes.find(x => x.symbol === boughtListItem.ticker)
    const net = quote?.regularMarketChange * boughtListItem.total
    const sum = quote?.regularMarketPrice * boughtListItem.total
    const prevSum = quote?.regularMarketPreviousClose * boughtListItem.total
    const type = quote?.quoteType
    return {
      ...boughtListItem,
      name: quote?.shortName,
      net,
      sum,
      prevSum,
      type
    }
  })

  return { boughtList: boughtListWithInfo, cash: cash || 0 }
}

export const getUserBoughtListDetails = async userData => {
  const { boughtList, cash } = await getUserBoughtList(userData)
  const ticker = [...boughtList].map(item => item.ticker)

  const profile = await toAxios('/api/yahoo/getAssetProfile', {
    ticker
  })

  const boughtListDetails = boughtList.map((item, idx) => {
    return {
      ...item,
      sector: profile?.data[idx]?.sector
    }
  })
  return { boughtList: boughtListDetails, cash }
}
