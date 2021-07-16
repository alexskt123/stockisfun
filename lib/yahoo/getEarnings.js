import { earningsResponse } from '@/config/yahooChart'
import Quote from '@/lib/class/quote'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.requestModule('earnings')
  const resData = quote.moduleData

  return {
    ...earningsResponse,
    ...(resData || {})
  }
}

export const getEarnings = async ticker => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).earnings.financialsChart
    .yearly
}
