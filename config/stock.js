import {
  convertToPercentage,
  convertFromPriceToNumber,
  millify,
  roundTo
} from '@/lib/commonFunction'

export const etfListSettings = {
  etfList: {
    tableHeader: [],
    tableData: []
  },
  etfCount: ''
}

export const stockDetailsSettings = {
  basics: {
    tableHeader: [],
    tableData: []
  },
  officers: {
    tableHeader: [],
    tableData: []
  },
  balanceSheet: {
    tableHeader: [],
    tableData: [],
    tableDataSkipRow: [],
    chartData: {},
    chartOptions: {}
  },
  earnings: {
    tableHeader: [],
    tableData: [],
    chartData: {},
    chartOptions: {}
  },
  inputTickers: [],
  ...etfListSettings
}

export const officersTableHeader = ['Officers Name', 'Title', 'Age', 'Pay']

export const equityBasicData = (assetProfile, quote, get52WeekLowHigh) => {
  return {
    basics: {
      Symbol: quote.symbol,
      Name: quote.longName,
      Price: quote.regularMarketPrice,
      'Price%':
        quote.regularMarketChangePercent &&
        convertToPercentage(quote.regularMarketChangePercent / 100),
      '52W-L-H': get52WeekLowHigh(quote),
      Website: assetProfile.website,
      Industry: assetProfile.industry,
      Sector: assetProfile.sector,
      'Market Cap.': quote.marketCap && millify(quote.marketCap),
      'Price To Book': convertFromPriceToNumber(quote.priceToBook),
      'Current EPS': quote.epsCurrentYear,
      'Trailing PE': quote.trailingPE && roundTo(quote.trailingPE),
      'Forward PE': quote.forwardPE && roundTo(quote.forwardPE),
      Dividend:
        quote.trailingAnnualDividendRate &&
        convertToPercentage(quote.trailingAnnualDividendRate / 100, true),
      'Full Time Employees':
        assetProfile.fullTimeEmployees &&
        millify(assetProfile.fullTimeEmployees),
      'Business Summary': assetProfile.longBusinessSummary
    },
    'Company Officers': assetProfile.companyOfficers
  }
}

export const equityBalanceSheetData = item => {
  return {
    Date: item.endDate?.fmt,
    'Total Current Assets': item.totalCurrentAssets?.fmt,
    'Total Current Liability': item.totalCurrentLiabilities?.fmt,
    'Total Non-Current Assets': millify(
      item.totalAssets?.raw - item.totalCurrentAssets?.raw
    ),
    'Total Non-Current Liability': millify(
      item.totalLiab?.raw - item.totalCurrentLiabilities?.raw
    ),
    'Total Assets': item.totalAssets?.fmt,
    'Total Liability': item.totalLiab?.fmt,
    'Total Stock Holder Equity': item.totalStockholderEquity?.fmt,
    'Current Ratio':
      item.totalCurrentAssets &&
      item.totalCurrentLiabilities &&
      roundTo(item.totalCurrentAssets?.raw / item.totalCurrentLiabilities?.raw),
    'Quick Ratio':
      item.totalCurrentLiabilities &&
      roundTo(
        (item.cash
          ? item.cash.raw
          : 0 + item.shortTermInvestments
          ? item.shortTermInvestments?.raw
          : 0 + item.netReceivables
          ? item.netReceivables?.raw
          : 0) / item.totalCurrentLiabilities?.raw
      ),
    'Total Debt/Equity':
      item.totalLiab &&
      item.totalStockholderEquity &&
      roundTo(item.totalLiab?.raw / item.totalStockholderEquity?.raw)
  }
}

export const equityBalanceSheetChartOptions = {
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

export const equityBalanceSheetSkipRows = [
  'Total Current Liability',
  'Total Non-Current Liability',
  'Total Liability',
  'Total Stock Holder Equity'
]

export const equityEarningsSchema = {
  tableHeader: [],
  tableData: [],
  chartData: {
    labels: [],
    datasets: []
  },
  chartOptions: {}
}

export const equityEarningsChartOptions = {
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
