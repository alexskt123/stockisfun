import { financialDataResponse } from '@/config/yahooChart'
import Quote from '@/lib/class/quote'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.requestModule('financialData')
  const resData = quote.moduleData

  return {
    ...financialDataResponse,
    ...(resData || {})
  }
}

export const getFinancialData = async ticker => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).financialData
}
