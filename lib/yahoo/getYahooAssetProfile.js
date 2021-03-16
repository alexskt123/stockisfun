import axios from 'axios'
import { assetProfileResponse } from '../../config/yahooChart'
import { isValidTicker } from '../../lib/commonFunction'

async function getResponse(ticker) {
  const validTicker = await isValidTicker(ticker)
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
