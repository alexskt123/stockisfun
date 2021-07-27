import { stockDetailsSettings, officersTableHeader } from '@/config/stock'
import {
  calPcnt,
  convertToNumber,
  convertToPercentage,
  convertFromPriceToNumber,
  millify,
  randRGBColor,
  roundTo,
  getAnnualizedPcnt,
  getRevenueIndicator
} from '@/lib/commonFunction'
import { getBalanceSheet } from '@/lib/yahoo/getBalanceSheet'
import { getCashflowStatement } from '@/lib/yahoo/getCashflowStatement'
import { getEarnings } from '@/lib/yahoo/getEarnings'

const getStockEarningCapacity = async ticker => {
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

const getBasics = data => {
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

const getBalanceSheetTableData = data => {
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

const getETFList = data => {
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

const getEarningsData = inputData => {
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

const getYahooBasicsData = (assetProfile, quote) => {
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

const getBalanceSheetData = balanceSheet => {
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

export {
  getStockEarningCapacity,
  getBasics,
  getBalanceSheetTableData,
  getEarningsData,
  getETFList,
  getYahooBasicsData,
  getBalanceSheetData
}
