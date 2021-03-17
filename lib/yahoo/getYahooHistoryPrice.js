import axios from 'axios'
import { chartResponse } from '../../config/yahooChart'
import { isValidTicker } from '../../lib/commonFunction'

async function getResponse(ticker, fromdate, todate) {
  const validTicker = await isValidTicker(ticker)
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
