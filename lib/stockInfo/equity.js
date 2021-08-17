import {
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
  const [earnings, cashflow, balanceSheet] = await Promise.all([
    getEarnings(ticker),
    getCashflowStatement(ticker),
    getBalanceSheet(ticker)
  ])

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
    return revenueItem || 'N/A'
  })

  const revenueAnnualized = getAnnualizedPcnt(revenueArr)
  const revenueIndicator = getRevenueIndicator(revenueAnnualized.raw)

  const netIncomeArr = [...Array(3)].map((_item, idx) => {
    const netIncomeItem = incomeStmt.netIncomeArr[idx]
    return netIncomeItem || 'N/A'
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

  const tableData = Object.keys(basics).map(item => {
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
      tableData
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
  const dataArr = data || []

  const tableHeader = Object.keys(dataArr.find(x => x) || {})

  const etfItem = dataArr.map(data => {
    return tableHeader.map(item => {
      return data[item]
    })
  })

  const tableData = etfItem.map(itemArr =>
    itemArr.map((item, idx) => {
      return idx === 0
        ? { link: `/stockinfo?ticker=${item}&type=detail`, data: item }
        : item
    })
  )

  return {
    tableHeader,
    tableData
  }
}

const getEarningsData = data => {
  const earnings = cloneObj(equityEarningsSchema)
  const earningsData = data || []

  // reverse - from left small to big
  const inputData = cloneObj(earningsData).reverse()
  const columns = Object.keys(inputData.find(x => x) || {}).filter(
    x => x !== 'date'
  )

  const years = inputData.map(item => item.date)
  earnings.tableHeader = ['', ...years]
  earnings.tableData = columns.map(column => [
    column,
    ...inputData.map(data => millify(data[column]))
  ])

  earnings.chartOptions = equityEarningsChartOptions
  earnings.chartData.labels = years

  const reversedEarningsChart = cloneObj(columns).reverse()
  earnings.chartData.datasets = reversedEarningsChart.map(item => {
    const color = randRGBColor()
    return item === 'Net Income'
      ? getBarChartLineDatasets(
          color,
          item,
          inputData.map(earningsData => earningsData[item])
        )
      : getBarChartBarDatasets(
          color,
          item,
          inputData.map(earningsData => earningsData[item])
        )
  })

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
