import axios from 'axios'
import {keyStatResponse} from '../../config/yahooChart'

async function getResponse(ticker) {
  let response = {
    ...keyStatResponse
  }

  try {
    response = await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=defaultKeyStatistics`)
  }
  catch {
    console.log('Failed to execute lib/yahoo/getYahooKeyStatistics')
  }

  return response.data

}

export const getYahooKeyStatistics = async (ticker) => {

  let responseArr = []

  responseArr = await getResponse(ticker)

  return responseArr.quoteSummary.result[0].defaultKeyStatistics
}
