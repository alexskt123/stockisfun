import { yahooTrendHeader } from '@/config/forecast'
import { recommendResponse } from '@/config/yahooChart'
import Quote from '@/lib/quote'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.requestModule('recommendationTrend')
  const resData = quote.moduleData

  return {
    ...recommendResponse,
    ...(resData || {})
  }
}

export const getRecommendTrend = async ticker => {
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
