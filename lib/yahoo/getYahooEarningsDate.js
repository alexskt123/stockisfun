import axios from 'axios'

import { earningsDateResponse } from '../../config/yahooChart'
import Quote from '../../lib/quote'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid
  const tickerType = quote.type
  const response =
    validTicker && tickerType === 'EQUITY'
      ? await axios(
          `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${quote.ticker}?modules=calendarEvents`
        ).catch(console.error)
      : {}

  const resData = response?.data

  return {
    ...earningsDateResponse,
    ...(resData || {})
  }
}

export const getYahooEarningsDate = async ticker => {
  const response = await getResponse(ticker)
  const earningsDate = response.quoteSummary.result
    .find(x => x)
    .calendarEvents.earnings.earningsDate.find(x => x)
  return earningsDate
    ? earningsDate
    : {
        raw: 'N/A',
        fmt: 'N/A'
      }
}
