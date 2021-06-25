import { stockDetailsSettings, officersTableHeader } from '../config/stock'
import {
  convertToNumber,
  convertToPercentage,
  convertFromPriceToNumber,
  millify,
  randRGBColor,
  roundTo
} from '../lib/commonFunction'

export const getBasics = data => {
  const basicsData = data || {}

  const basicItem = Object.keys(basicsData)
    .filter(x => x !== 'Company Officers')
    .map(item => {
      return [item, basicsData[item]]
    })

  const offiersArr = basicsData['Company Officers'] || []
  const officers = offiersArr.map(item => {
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
      item.label == 'Total Stock Holder Equity'
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
        return idx == 0
          ? { link: `/etfdetail?query=${item}`, data: item }
          : item
      })
    )
  ]

  return etfList
}

export const getYahooEarnings = inputData => {
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
          item == 'Net Income'
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

export const getYahooBasicsData = (data, quote) => {
  const newData = {
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
    Website: data.website,
    Industry: data.industry,
    Sector: data.sector,
    'Market Cap.': quote.marketCap ? millify(quote.marketCap) : undefined,
    'Price To Book': convertFromPriceToNumber(quote.priceToBook),
    'Current EPS': quote.epsCurrentYear,
    'Trailing PE': quote.trailingPE ? roundTo(quote.trailingPE) : undefined,
    'Forward PE': quote.forwardPE ? roundTo(quote.forwardPE) : undefined,
    Dividend: quote.trailingAnnualDividendRate
      ? convertToPercentage(quote.trailingAnnualDividendRate / 100, true)
      : undefined,
    'Full Time Employees': data.fullTimeEmployees
      ? millify(data.fullTimeEmployees)
      : undefined,
    Address: quote.ticker
      ? `${data.address1 || ''}, ${data.address2 || ''}, ${data.city || ''}, ${
          data.state || ''
        }, ${data.zip || ''}, ${data.country || ''}`.replace(', ,', '')
      : undefined,
    'Business Summary': data.longBusinessSummary,
    'Company Officers': data.companyOfficers
  }
  return newData
}

export const getYahooBalanceSheetData = balanceSheet => {
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
