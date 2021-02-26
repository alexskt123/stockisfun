import axios from 'axios'
import {quoteResponse} from '../../config/yahooChart'

async function getResponse(ticker) {
  let response = {
    ...quoteResponse
  }

  try {
    response = await axios(`https://query1.finance.yahoo.com/v7/finance/quote?symbols=${ticker}`)
  }
  catch {
    console.log('Failed to execute lib/yahoo/getYahooQuote')
  }

  return response.data

}

export const getYahooQuote = async (ticker) => {

  let responseArr = []

  responseArr = await getResponse(ticker)

  return responseArr.quoteResponse.result.find(x=>x) || []
}
