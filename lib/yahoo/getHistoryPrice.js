import { chartResponse } from '@/config/yahooChart'
import Quote from '@/lib/class/quote'
import { toAxios } from '@/lib/request'

async function getResponse(ticker, fromDate, toDate) {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid
  const response = validTicker
    ? await toAxios(
        `https://query1.finance.yahoo.com/v8/finance/chart/${quote.ticker}?period1=${fromDate}&period2=${toDate}&interval=1d&events=history&=hP2rOschxO0`
      )
    : {}
  const resData = response?.data

  return {
    ...chartResponse,
    ...(resData || {})
  }
}

export const getHistoryPrice = async (ticker, fromDate, toDate) => {
  const response = await getResponse(ticker, fromDate, toDate)
  return response.chart.result.find(x => x) || []
}
