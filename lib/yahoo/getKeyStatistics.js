import { keyStatResponse } from '@/config/yahooChart'
import Quote from '@/lib/class/quote'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.requestModule('defaultKeyStatistics', 'ETF')
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
