import axios from 'axios'
import { chartResponse } from '../../config/yahooChart'
import Quote from '../../lib/quote'

async function getResponse(ticker, fromdate, todate) {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid
  const response = validTicker ? await axios(`https://query1.finance.yahoo.com/v8/finance/chart/${ticker}?period1=${fromdate}&period2=${todate}&interval=1d&events=history&=hP2rOschxO0`).catch(console.error)
    : {}

  const resData = response?.data

  return {
    ...chartResponse,
    ...(resData || {})
  }
}

export const getYahooHistoryPrice = async (ticker, fromdate, todate) => {
  const response = await getResponse(ticker, fromdate, todate)
  return response.chart.result.find(x => x) || []
}
