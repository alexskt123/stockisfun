import { yahooTrendHeader } from '@/config/forecast'

export const chartResponse = {
  chart: {
    result: [
      {
        timestamp: [],
        indicators: {
          quote: [
            {
              close: []
            }
          ]
        }
      }
    ]
  }
}

export const quoteResponse = {
  quoteResponse: {
    result: [],
    error: null
  }
}

export const moduleMapping = {
  AssetProfile: {
    name: 'assetProfile',
    handleData: data => {
      return data?.quoteSummary?.result.find(x => x)?.assetProfile
    }
  },
  BalanceSheet: {
    name: 'balanceSheetHistory',
    handleData: data => {
      return data?.quoteSummary?.result.find(x => x)?.balanceSheetHistory
        ?.balanceSheetStatements
    }
  },
  RecommendTrend: {
    name: 'recommendationTrend',
    handleData: data => {
      const trend = data?.quoteSummary.result
        .find(x => x)
        .recommendationTrend.trend.find(x => x)
      const returnArr = Object.values(trend || {}).slice(1)

      const dataArr = [...Array(5)].map((_item, idx) => {
        return returnArr[idx] ? returnArr[idx] : 'N/A'
      })

      const newData = {
        ...yahooTrendHeader.reduce((acc, item, idx) => {
          return { ...acc, [item.item]: dataArr[idx] }
        }, {})
      }
      return newData
    }
  },
  KeyStatistics: {
    name: 'defaultKeyStatistics',
    handleData: data => {
      return data?.quoteSummary.result.find(x => x).defaultKeyStatistics
    }
  },
  IncomeStatement: {
    name: 'incomeStatementHistory',
    handleData: data => {
      return data?.quoteSummary.result.find(x => x).incomeStatementHistory
        .incomeStatementHistory
    }
  },
  FinancialData: {
    name: 'financialData',
    handleData: data => {
      return data?.quoteSummary.result.find(x => x).financialData
    }
  },
  EarningsData: {
    name: 'calendarEvents',
    handleData: data => {
      const earningsDate = data?.quoteSummary.result
        .find(x => x)
        .calendarEvents.earnings.earningsDate.find(x => x)
      return earningsDate
        ? earningsDate
        : {
            raw: 'N/A',
            fmt: 'N/A'
          }
    }
  },
  Earnings: {
    name: 'earnings',
    handleData: data => {
      return data?.quoteSummary.result.find(x => x).earnings.financialsChart
        .yearly
    }
  },
  CashflowStatement: {
    name: 'cashflowStatementHistory',
    handleData: data => {
      return data?.quoteSummary.result.find(x => x).cashflowStatementHistory
        .cashflowStatements
    }
  }
}
