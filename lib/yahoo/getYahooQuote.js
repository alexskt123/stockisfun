import { quoteResponse } from '@/config/yahooChart'
import { handleAxiosError, fixSpecialTicker } from '@/lib/commonFunction'
import to from 'await-to-js'
import axios from 'axios'

async function getResponse(ticker) {
  const [err, response] = await to(
    axios.get('https://query1.finance.yahoo.com/v7/finance/quote', {
      params: {
        symbols: `${fixSpecialTicker(ticker) || 'let_it_go'}`
      }
    })
  )

  handleAxiosError(err)

  const resData = response?.data

  return {
    ...quoteResponse,
    ...(resData || {})
  }
}

export const getYahooMultiQuote = async ticker => {
  const response = await getResponse(ticker)
  return response.quoteResponse.result || {}
}

export const getYahooQuote = async ticker => {
  const response = await getResponse(ticker)
  return response.quoteResponse.result.find(x => x) || {}
}
