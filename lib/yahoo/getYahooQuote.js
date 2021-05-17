import axios from 'axios'
import { quoteResponse } from '../../config/yahooChart'
import { handleSpecialTicker } from '../../lib/commonFunction'

async function getResponse(ticker) {

  const response = await axios.get('https://query1.finance.yahoo.com/v7/finance/quote', {
    params: {
      symbols: `${handleSpecialTicker(ticker) || 'let_it_go'}`
    }
  }).catch(console.error)

  const resData = response?.data

  return {
    ...quoteResponse,
    ...(resData || {})
  }
}

export const getYahooQuote = async (ticker) => {
  const response = await getResponse(ticker)
  return response.quoteResponse.result.find(x => x) || {}
}

export const getYahooMultiQuote = async (ticker) => {
  const response = await getResponse(ticker)
  return response.quoteResponse.result || {}
}
