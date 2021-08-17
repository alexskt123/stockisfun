import { quoteResponse } from '@/config/yahooChart'
import { toAxios } from '@/lib/request'

const handleSpecialTicker = ticker => {
  return ticker === 'BRK.B' ? 'BRK-B' : ticker
}

async function getResponse(ticker) {
  const response = await toAxios(
    'https://query1.finance.yahoo.com/v7/finance/quote',
    {
      symbols: `${handleSpecialTicker(ticker) || 'let_it_go'}`
    }
  )

  const resData = response?.data

  return {
    ...quoteResponse,
    ...(resData || {})
  }
}

export const getQuote = async ticker => {
  const response = await getResponse(ticker)
  return response.quoteResponse.result || {}
}
