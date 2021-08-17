import { balanceSheetResponse } from '@/config/yahooChart'
import ModuleQuote from '@/lib/class/moduleQuote'

async function getResponse(ticker) {
  const quote = new ModuleQuote(ticker)
  await quote.requestModule('BalanceSheet')
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
