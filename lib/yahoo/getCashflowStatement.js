import { cashflowResponse } from '@/config/yahooChart'
import Quote from '@/lib/class/quote'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.requestModule('cashflowStatementHistory')
  const resData = quote.moduleData

  return {
    ...cashflowResponse,
    ...(resData || {})
  }
}

export const getCashflowStatement = async ticker => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).cashflowStatementHistory
    .cashflowStatements
}
