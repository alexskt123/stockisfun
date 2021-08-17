import { keyStatResponse } from '@/config/yahooChart'
import ModuleQuote from '@/lib/class/moduleQuote'

async function getResponse(ticker) {
  const quote = new ModuleQuote(ticker)
  await quote.requestModule('defaultKeyStatistics')
  const resData = quote.moduleData

  return {
    ...keyStatResponse,
    ...(resData || {})
  }
}

export const getYahooStatistics = async ticker => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).defaultKeyStatistics
}
