import { balanceSheetResponse } from '@/config/yahooChart'
import Quote from '@/lib/quote'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.requestModule('balanceSheetHistory')
  const resData = quote.moduleData

  return {
    ...balanceSheetResponse,
    ...(resData || {})
  }
}

export const getBalanceSheet = async ticker => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).balanceSheetHistory
    .balanceSheetStatements
}
