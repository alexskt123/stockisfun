import {
  stockDetailsSettings,
  officersTableHeader,
  equityBasicData,
  equityBalanceSheetData,
  equityBalanceSheetChartOptions,
  equityEarningsChartOptions,
  equityEarningsSchema,
  equityBalanceSheetSkipRows,
  equityBalanceChartLabels
} from '@/config/stock'
import { getBarChartBarDatasets, getBarChartLineDatasets } from '@/lib/chart'
import {
  calPcnt,
  convertToNumber,
  millify,
  randRGBColor,
  roundTo,
  getAnnualizedPcnt,
  getRevenueIndicator,
  cloneObj
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
  // reverse - from left small to big (yahoo data in descending order)
  const balanceSheetData = [...(data || [])].reverse()

  // Each Row contains Column and 4 years' data
  const columns = Object.keys(balanceSheetData.find(x => x) || {}).filter(
    x => x !== 'Date'
  )
  const tableData = columns.map(column => [
    column,
    ...balanceSheetData.map(item => item[column])
  ])

  // Extract data columns for chart data
  const balanceChartData = equityBalanceChartLabels.map(item => [
    ...balanceSheetData.map(data => data[item])
  ])

  // Use Years as table headers
  const years = balanceSheetData.map(item => item['Date'])
  const tableHeader = ['', ...years]

  // Prepare for chart data
  const balanceChart = convertToNumber(balanceChartData).map((data, index) => {
    return {
      label: equityBalanceChartLabels[index],
      data: data.map(item => item || '')
    }
  })

  const reversedBalanceChart = cloneObj(balanceChart).reverse()
  const balanceSheetChartData = {
    labels: years,
    datasets: reversedBalanceChart.map(item => {
      const color = randRGBColor()
      return item.label === 'Total Stock Holder Equity'
        ? getBarChartLineDatasets(color, item.label, item.data)
        : getBarChartBarDatasets(color, item.label, item.data)
    })
  }

  return {
    tableHeader,
    tableData,
    tableDataSkipRow: equityBalanceSheetSkipRows,
    chartData: { ...balanceSheetChartData },
    chartOptions: { ...equityBalanceSheetChartOptions }
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
  const earnings = cloneObj(equityEarningsSchema)

  if (inputData) {
    // reverse - from left small to big
    inputData.reverse()

    earnings.tableHeader = ['', ...inputData.map(item => item.date)]
    earnings.chartOptions = equityEarningsChartOptions
    earnings.chartData.labels = [...inputData.map(data => data['date'])]

    Object.keys([...inputData].find(x => x) || [])
      .filter(x => x !== 'date')
      .reverse()
      .forEach(item => {
        earnings.tableData.push([
          item,
          ...inputData.map(data => millify(data[item]))
        ])

        const color = randRGBColor()

        earnings.chartData.datasets.push(
          item === 'Net Income'
            ? getBarChartLineDatasets(
                color,
                item,
                inputData.map(data => data[item])
              )
            : getBarChartBarDatasets(
                color,
                item,
                inputData.map(data => data[item])
              )
        )
      })

    earnings.tableData.reverse()
  }

  return { earnings }
}

const get52WeekLowHigh = quote => {
  return (
    quote.fiftyTwoWeekLow &&
    quote.fiftyTwoWeekHigh &&
    `${roundTo(parseFloat(quote.fiftyTwoWeekLow), 2)} - ${roundTo(
      parseFloat(quote.fiftyTwoWeekHigh),
      2
    )}`
  )
}

const getYahooBasicsData = (assetProfile, quote) => {
  return equityBasicData(assetProfile, quote, get52WeekLowHigh)
}

const getBalanceSheetData = balanceSheet => {
  const balanceSheetExtract = balanceSheet.map(item => {
    const newItem = equityBalanceSheetData(item)
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
