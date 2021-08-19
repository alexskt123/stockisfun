import { moduleMapping } from '@/config/yahooChart'
import ModuleQuote from '@/lib/class/moduleQuote'

/* To-DO remove this */
export async function getModuleResponse(ticker, moduleName) {
  const quote = new ModuleQuote(ticker)
  await quote.request()
  await quote.requestModule(moduleName)
  const resData = quote.dataByName(moduleName)

  return resData
}

const getQuoteModules = async (ticker, names) => {
  const quote = new ModuleQuote(ticker)

  await quote.request()
  const request = async n => await quote.requestModule(n)
  await Promise.all(names.map(request))

  const quoteData = {
    name: 'quote',
    data: quote.valid ? { ...quote.quoteData } : undefined
  }

  return {
    ...quote.moduleData,
    modules: [...quote.moduleData.modules, quoteData]
  }
}

export const extractModulesData = async ({ response, ticker, moduleName }) => {
  const resData = response || (await getModulesData([ticker], [moduleName]))
  const module = moduleMapping[moduleName]

  return resData?.result
    ?.find(x => x.ticker === ticker)
    ?.modules?.find(x => x.name === module.name)?.data
}

export const getModulesData = async (ticker, name) => {
  const response = {
    result: null
  }

  try {
    const tickers = [...new Set([].concat(ticker))]

    response.result = await Promise.all(
      tickers.map(async t => await getQuoteModules(t, name))
    )

    response.message = 'OK'
  } catch (error) {
    console.error(error)
    response.message = error.message
  }

  return response
}
