import axios from 'axios'

import { earningsResponse } from '../../config/yahooChart'
import Quote from '../../lib/quote'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid
  const tickerType = quote.type
  const response =
    validTicker && tickerType === 'EQUITY'
      ? await axios(
          `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${quote.ticker}?modules=earnings`
        ).catch(console.error)
      : {}

  const resData = response?.data

  return {
    ...earningsResponse,
    ...(resData || {})
  }
}

export const getYahooEarnings = async ticker => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).earnings.financialsChart
    .yearly
}
