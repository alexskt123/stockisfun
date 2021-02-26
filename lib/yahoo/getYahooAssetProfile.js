import axios from 'axios'
import {assetProfileResponse} from '../../config/yahooChart'

async function getResponse(ticker) {
  let response = {
    ...assetProfileResponse
  }

  try {
    response = await axios(`https://query1.finance.yahoo.com/v10/finance/quoteSummary/${ticker}?modules=assetProfile`)
  }
  catch {
    console.log('Failed to execute lib/yahoo/getYahooAssetProfile')
  }

  return response.data

}

export const getYahooAssetProfile = async (ticker) => {

  let responseArr = []

  responseArr = await getResponse(ticker)


  return responseArr.quoteSummary.result.find(x => x).assetProfile
}
