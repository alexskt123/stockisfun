import axios from 'axios'
import { assetProfileResponse } from '../../config/yahooChart'
import Quote from '../../lib/quote'

async function getResponse(ticker) {
  const quote = new Quote(ticker)
  await quote.request()
  const validTicker = quote.valid
  const response = validTicker ? await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=assetProfile`).catch(console.error)
    : {}

  const resData = response?.data

  return {
    ...assetProfileResponse,
    ...(resData || {})
  }
}

export const getYahooAssetProfile = async (ticker) => {
  const response = await getResponse(ticker)
  return response.quoteSummary.result.find(x => x).assetProfile
}
