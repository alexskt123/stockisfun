import axios from 'axios'
import { recommendResponse } from '../../config/yahooChart'
import { isValidTicker } from '../../lib/commonFunction'

async function getResponse(ticker) {
  const validTicker = await isValidTicker(ticker)
  const response = validTicker ? await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=recommendationTrend`).catch(console.error)
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
  return Object.values(trend || {}).slice(1) || ['N/A','N/A','N/A','N/A','N/A']
}
