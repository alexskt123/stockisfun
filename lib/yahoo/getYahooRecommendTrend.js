import axios from 'axios'
import { recommendResponse } from '../../config/yahooChart'
import Quote from '../../lib/quote'

async function getResponse(ticker) {

  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid
  const tickerType = quote.type

  const response = validTicker && tickerType !== 'ETF' ? await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=recommendationTrend`).catch(console.error)
    : {}

  const resData = response?.data

  return {
    ...recommendResponse,
    ...(resData || {})
  }
}

export const getYahooRecommendTrend = async (ticker) => {
  const response = await getResponse(ticker)
  const trend = response.quoteSummary.result.find(x => x).recommendationTrend.trend.find(x => x)
  const returnArr = Object.values(trend || {}).slice(1)
  return returnArr.find(x => x) ? returnArr : ['N/A','N/A','N/A','N/A','N/A']
}
