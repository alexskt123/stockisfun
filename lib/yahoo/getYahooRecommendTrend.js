import axios from 'axios'
import {recommendResponse} from '../../config/yahooChart'

async function getResponse(ticker) {
  let response = {
    ...recommendResponse
  }

  try {
    response = await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=recommendationTrend`)
  }
  catch {
    console.log('Failed to execute lib/yahoo/getYahooRecommendTrend')
  }

  return response.data

}

export const getYahooRecommendTrend = async (ticker) => {

  let responseArr = []

  responseArr = await getResponse(ticker)

  return responseArr.quoteSummary.result.find(x => x).recommendationTrend.trend
}
