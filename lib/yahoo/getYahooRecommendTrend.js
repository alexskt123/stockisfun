import axios from 'axios'
import { recommendResponse } from '../../config/yahooChart'
import Quote from '../../lib/quote'
import { yahooTrendHeader } from '../../config/forecast'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid
  const tickerType = quote.type

  const response =
    validTicker && tickerType !== 'ETF'
      ? await axios(
          `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${quote.ticker}?modules=recommendationTrend`
        ).catch(console.error)
      : {}

  const resData = response?.data

  return {
    ...recommendResponse,
    ...(resData || {})
  }
}

export const getYahooRecommendTrend = async ticker => {
  const response = await getResponse(ticker)
  const trend = response.quoteSummary.result
    .find(x => x)
    .recommendationTrend.trend.find(x => x)
  const returnArr = Object.values(trend || {}).slice(1)

  const dataArr = [...Array(5)].map((_item, idx) => {
    return returnArr[idx] ? returnArr[idx] : 'N/A'
  })

  const data = {
    ...yahooTrendHeader.reduce((acc, item, idx) => {
      return { ...acc, [item.item]: dataArr[idx] }
    }, {})
  }

  return data
}
