import { incomeResponse } from '@/config/yahooChart'
import { ModuleQuote } from '@/lib/quote'

async function getResponse(ticker) {
  const quote = new ModuleQuote(ticker)
  await quote.requestModule('incomeStatementHistory')
  const resData = quote.moduleData

  return {
    ...incomeResponse,
    ...(resData || {})
  }
}

export const getIncomeStatement = async ticker => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).incomeStatementHistory
    .incomeStatementHistory
}
