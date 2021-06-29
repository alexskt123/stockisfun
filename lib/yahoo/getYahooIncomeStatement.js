import { incomeResponse } from '@/config/yahooChart'
import Quote from '@/lib/quote'
import axios from 'axios'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid
  const tickerType = quote.type
  const response =
    validTicker && tickerType === 'EQUITY'
      ? await axios(
          `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${quote.ticker}?modules=incomeStatementHistory`
        ).catch(console.error)
      : {}

  const resData = response?.data

  return {
    ...incomeResponse,
    ...(resData || {})
  }
}

export const getYahooIncomeStatement = async ticker => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).incomeStatementHistory
    .incomeStatementHistory
}
