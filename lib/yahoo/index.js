import { yahooTrendHeader } from '@/config/forecast'
import ModuleQuote from '@/lib/class/moduleQuote'

export async function getModuleResponse(ticker, moduleName) {
  const module = moduleMapping[moduleName]

  const quote = new ModuleQuote(ticker)
  await quote.request()
  await quote.requestModule({
    name: module.name,
    handleData: module.handleData
  })
  const resData = quote.moduleData?.modules?.find(
    x => x.name === module.name
  )?.data

  return resData
}

const getQuoteModules = async (ticker, modules) => {
  const quote = new ModuleQuote(ticker)

  await quote.request()
  const request = async m => await quote.requestModule(m)
  await Promise.all(modules.map(request))

  const quoteData = {
    name: 'quote',
    data: quote.valid ? { ...quote.quoteData } : undefined
  }

  return {
    ...quote.moduleData,
    modules: [...quote.moduleData.modules, quoteData]
  }
}

export const getModulesData = async (ticker, name) => {
  const response = {
    result: null
  }

  const modules = getModules(name)

  try {
    const tickers = [...new Set([].concat(ticker))]

    response.result = await Promise.all(
      tickers.map(async t => await getQuoteModules(t, modules))
    )

    response.message = 'OK'
  } catch (error) {
    console.error(error)
    response.message = error.message
  }

  return response
}

export const getModules = m => {
  return []
    .concat(m)
    .map(x => moduleMapping[x])
    .filter(x => x)
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
