import { ModuleQuote } from '@/lib/quote'

const moduleMapping = {
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
  }
}

const getModules = m => {
  return []
    .concat(m)
    .map(x => moduleMapping[x])
    .filter(x => x)
}

export default async (req, res) => {
  const { ticker, name } = req.query

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

  res.statusCode = 200
  res.json(response)
}

const getQuoteModules = async (ticker, modules) => {
  const quote = new ModuleQuote(ticker)
  await quote.request()

  const request = async m => await quote.requestModule(m)
  await Promise.all(modules.map(request))

  return quote.moduleData
}
